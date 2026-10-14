import {createHash} from 'node:crypto';
import {open,lstat} from 'node:fs/promises';
import {constants} from 'node:fs';
import {isDeepStrictEqual} from 'node:util';
import {isAbsolute,join} from 'node:path';
import {POINT_URL,forecastAt} from './nws-forecast-pilot.mjs';

const LIMIT=300000;
export const OFFICIAL_CHECK='https://forecast.weather.gov/MapClick.php?lat=29.4241&lon=-98.4936';
const hash=b=>createHash('sha256').update(b).digest('hex');
const object=x=>x&&typeof x==='object'&&!Array.isArray(x);
const stamp=x=>{
  if(typeof x!=='string'||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/.test(x))throw Error('clock');
  const [h,m,s]=x.slice(11,19).split(':').map(Number),n=Date.parse(x);
  if(h>23||m>59||s>59||!Number.isFinite(n)||new Date(x.slice(0,10)+'T00:00:00Z').toISOString().slice(0,10)!==x.slice(0,10))throw Error('clock');return n;
};
const parse=bytes=>{
  if(!Buffer.isBuffer(bytes)||bytes.length>LIMIT)throw Error('bytes');
  return JSON.parse(bytes.toString('utf8'));
};
const base=at=>({schema_version:1,evaluated_at:at,state:'held-integrity',period_available:false,source_url:null,generated_at:null,source_updated_at:null,retrieved_at:null,expires_at:null,official_current_check:OFFICIAL_CHECK,retry_authorized:false,public_publish_authorized:false,fact_dates_renewed:false,weekly_baseline_advanced:false,source_authenticity_assessed:false});
const assert=value=>{if(!value)throw Error('join');};

export function reviewedPilotState(reportBytes,{expectedReportSha256,expectedEventSha256,events,at=new Date().toISOString()}={}){
  let output=base(null),now;
  try{now=stamp(at);output=base(new Date(now).toISOString());}catch{return {...output,state:'held-evaluation-clock'};}
  try{
    assert(/^[a-f0-9]{64}$/.test(expectedReportSha256||''));
    assert(Buffer.isBuffer(reportBytes)&&reportBytes.length<=LIMIT&&hash(reportBytes)===expectedReportSha256);
    const report=parse(reportBytes);
    assert(report.action_id==='FT-IMP-166'&&report.public_publish_authorized===false&&report.weekly_baseline_advanced===false&&report.body_archives_retained===false);
    assert([1,2].includes(report.requests)&&Array.isArray(report.packets)&&report.packets.length===report.requests&&object(events));
    const beginning=stamp(report.started_at),completion=stamp(report.completed_at);assert(completion>=beginning);
    const expectedNames=['point-started.json','point-result.json',...(report.requests===2?['forecast-started.json','forecast-result.json']:[])];
    assert(object(expectedEventSha256)&&isDeepStrictEqual(Object.keys(events).sort(),expectedNames.slice().sort())&&isDeepStrictEqual(Object.keys(expectedEventSha256).sort(),expectedNames.slice().sort()));
    for(const name of expectedNames)assert(Buffer.isBuffer(events[name])&&events[name].length<=LIMIT&&/^[a-f0-9]{64}$/.test(expectedEventSha256[name])&&hash(events[name])===expectedEventSha256[name]);
    let point=null,previous=beginning,codeReviewHash=null;
    for(let i=0;i<report.packets.length;i++){
      const name=i===0?'point':'forecast',packet=report.packets[i];
      assert(object(packet)&&packet.body_retained===false);
      const started=parse(events[name+'-started.json']),result=parse(events[name+'-result.json']);
      assert(isDeepStrictEqual(result,packet));
      const url=i===0?POINT_URL:point.forecast_url;
      assert(packet.url===url&&started.url===url&&started.review?.action_id==='FT-IMP-166'&&['PASS','PASS_WITH_P3'].includes(started.review.decision));
      assert(/^[a-f0-9]{64}$/.test(started.review.manifest_sha256||''));
      if(codeReviewHash===null)codeReviewHash=started.review.manifest_sha256;else assert(codeReviewHash===started.review.manifest_sha256);
      const intent=stamp(started.started_at),request=stamp(packet.started_at),received=stamp(packet.retrieved_at);
      assert(intent>=previous&&request>=intent&&received>=request&&received<=completion);previous=received;
      if(packet.state!=='parsed-candidate'){
        assert(i===report.requests-1&&/^held-(?:http|response-url|format-or-size|empty|json|size|fetch|normalization)$/.test(packet.state));
        assert(packet.value===null);return {...output,state:'held-source-result'};
      }
      assert(packet.http_status===200&&/^[a-f0-9]{64}$/.test(packet.body_sha256||'')&&object(packet.value));
      if(i===0){
        point=packet.value;
        assert(point.point_url===POINT_URL&&point.grid_id==='EWX'&&[point.grid_x,point.grid_y].every(n=>Number.isInteger(n)&&n>=0&&n<=9999));
        assert(point.forecast_url===`https://api.weather.gov/gridpoints/EWX/${point.grid_x},${point.grid_y}/forecast`);
        assert(point.city==='San Antonio'&&point.state==='TX'&&point.time_zone==='America/Chicago');
        assert(stamp(point.expires_at)>received);
        if(report.requests===1)return {...output,state:'held-incomplete'};
      }else{
        const record=packet.value;
        assert(record.source_url===url&&record.point_url===POINT_URL&&record.grid_id===point.grid_id&&record.grid_x===point.grid_x&&record.grid_y===point.grid_y);
        assert(record.evidence_class==='OFFICIAL_FORECAST_CANDIDATE'&&record.public_publish_authorized===false&&record.fact_dates_renewed===false&&record.safety_or_suitability_assessed===false&&record.retrieved_at===packet.retrieved_at);
        const generated=stamp(record.generated_at),updated=stamp(record.source_updated_at),expiry=stamp(record.expires_at);
        assert(updated<=generated&&generated<=received+60000&&expiry>received&&expiry<=updated+21600000&&stamp(point.expires_at)>received);
        assert(Array.isArray(record.periods)&&record.periods.length>=1&&record.periods.length<=16);
        let previousEnd=null;
        for(const [index,period] of record.periods.entries()){
          const start=stamp(period.start_time),end=stamp(period.end_time);
          assert(period.number===index+1&&typeof period.is_daytime==='boolean'&&end>start&&end-start<=46800000&&end>received&&end<=received+691200000&&(previousEnd===null||start===previousEnd));previousEnd=end;
          assert(object(period.temperature)&&['F','C'].includes(period.temperature.unit)&&(period.temperature.value===null||Number.isFinite(period.temperature.value)));
          assert(period.precipitation_probability_percent===null||(Number.isFinite(period.precipitation_probability_percent)&&period.precipitation_probability_percent>=0&&period.precipitation_probability_percent<=100));
        }
        output={...output,source_url:url,generated_at:new Date(generated).toISOString(),source_updated_at:new Date(updated).toISOString(),retrieved_at:new Date(received).toISOString(),expires_at:new Date(expiry).toISOString()};
        if(now<received)return {...output,state:'before-capture'};
        if(now>=expiry)return {...output,state:'expired-review'};
        const lookup=forecastAt(record,at);
        return {...output,state:lookup.period?'available-reviewed-candidate':'outside-returned-periods',period_available:lookup.period!==null};
      }
    }
    return {...output,state:'held-incomplete'};
  }catch{return {...base(output.evaluated_at),state:'held-integrity'};}
}

async function privateBytes(path){
  const file=await open(path,constants.O_RDONLY|constants.O_NOFOLLOW|constants.O_NONBLOCK);
  try{
    const stat=await file.stat();if(!stat.isFile()||stat.size>LIMIT||(stat.mode&0o077)!==0)throw Error('file');
    const bytes=Buffer.alloc(LIMIT+1);let size=0;
    while(size<bytes.length){const part=await file.read(bytes,size,bytes.length-size,null);if(part.bytesRead===0)break;size+=part.bytesRead;}
    if(size>LIMIT)throw Error('size');return bytes.subarray(0,size);
  }finally{await file.close();}
}
export async function readReviewedPilotState({journalDir,expectedReportSha256,expectedEventSha256,at=new Date().toISOString()}){
  let output;
  try{output=base(new Date(stamp(at)).toISOString());}catch{return {...base(null),state:'held-evaluation-clock'};}
  try{
    if(typeof journalDir!=='string'||!isAbsolute(journalDir))throw Error('directory');
    const directory=await lstat(journalDir);if(!directory.isDirectory()||directory.isSymbolicLink()||(directory.mode&0o077)!==0)throw Error('directory');
    const reportBytes=await privateBytes(join(journalDir,'report.json'));
    // Read fixed names only; never let the journal choose a path or trigger collection.
    const events={};
    for(const name of ['point-started.json','point-result.json','forecast-started.json','forecast-result.json']){
      try{events[name]=await privateBytes(join(journalDir,name));}catch(error){if(error.code!=='ENOENT')throw error;}
    }
    const after=await privateBytes(join(journalDir,'report.json'));if(!reportBytes.equals(after))throw Error('changed-report');
    return reviewedPilotState(reportBytes,{expectedReportSha256,expectedEventSha256,events,at});
  }catch{return {...output,state:'held-unavailable-or-incomplete'};}
}
