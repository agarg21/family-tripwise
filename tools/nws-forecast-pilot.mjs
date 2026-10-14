import {createHash} from 'node:crypto';
import {mkdir,writeFile} from 'node:fs/promises';
import {resolve} from 'node:path';

export const POINT_URL='https://api.weather.gov/points/29.4241,-98.4936';
export const USER_AGENT='FamilyTripwiseWeatherPilot/1.0 (+https://familytripwise.com/about.html)';
const DAY=86400000,MAX_AGE=6*3600000;
const hash=b=>createHash('sha256').update(b).digest('hex');
const fail=()=>{throw new Error('Unsupported NWS pilot data');};
const object=x=>x&&typeof x==='object'&&!Array.isArray(x);
const text=(x,max=160)=>typeof x==='string'&&x.length>0&&x.length<=max&&!/[\x00-\x1f]/.test(x)?x:fail();
const stamp=x=>{
  if(typeof x!=='string'||!/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,3})?(?:Z|[+-]\d{2}:\d{2})$/.test(x))fail();
  const [hours,minutes,seconds]=x.slice(11,19).split(':').map(Number);if(hours>23||minutes>59||seconds>59)fail();
  const n=Date.parse(x);if(!Number.isFinite(n)||new Date(x.slice(0,10)+'T00:00:00Z').toISOString().slice(0,10)!==x.slice(0,10))fail();return n;
};
export function parsePoint(data){
  if(!object(data)||data.type!=='Feature'||data.geometry?.type!=='Point')fail();
  const c=data.geometry.coordinates,p=data.properties;
  if(!Array.isArray(c)||c.length!==2||c.some(x=>!Number.isFinite(x))||Math.abs(c[0]+98.4936)>0.0001||Math.abs(c[1]-29.4241)>0.0001||!object(p))fail();
  if(p.gridId!=='EWX'||![p.gridX,p.gridY].every(x=>Number.isInteger(x)&&x>=0&&x<=9999)||p.timeZone!=='America/Chicago')fail();
  const relative=p.relativeLocation?.properties;
  if(relative?.city!=='San Antonio'||relative?.state!=='TX')fail();
  const distance=relative.distance;
  if(!object(distance)||distance.unitCode!=='wmoUnit:m'||!Number.isFinite(distance.value)||distance.value<0||distance.value>10000)fail();
  const forecast=`https://api.weather.gov/gridpoints/EWX/${p.gridX},${p.gridY}/forecast`;
  if(p.forecast!==forecast)fail();
  return {point_url:POINT_URL,forecast_url:forecast,grid_id:'EWX',grid_x:p.gridX,grid_y:p.gridY,city:'San Antonio',state:'TX',time_zone:'America/Chicago',relative_distance_m:distance.value};
}
export function cacheExpiry(headers,retrievedAt,requestedAt=retrievedAt){
  const received=stamp(retrievedAt),cc=text(headers['cache-control'],500).toLowerCase();
  const requested=stamp(requestedAt);if(requested>received)fail();
  if(/(?:^|,)\s*(?:no-cache|no-store)(?:\s*=|\s*,|\s*$)/.test(cc))fail();
  const values=[...cc.matchAll(/(?:^|,)\s*max-age\s*=\s*(\d+)\s*(?=,|$)/g)];
  if(values.length!==1||cc.split(',').filter(x=>/^\s*max-age\b/.test(x)).length!==1)fail();
  const seconds=Number(values[0][1]),date=Date.parse(headers.date||'');
  if(!Number.isSafeInteger(seconds)||seconds<=0||!Number.isFinite(date)||date>received+60000)fail();
  const rawAge=headers.age,age=rawAge==null?0:/^\d+$/.test(rawAge)?Number(rawAge)*1000:fail();
  if(!Number.isSafeInteger(age))fail();
  const currentAge=Math.max(0,received-date,age+received-requested),expiry=received+Math.min(MAX_AGE,seconds*1000-currentAge);
  const expires=headers.expires==null?Infinity:Date.parse(headers.expires);
  if(Number.isNaN(expires))fail();
  const end=Math.min(expiry,expires);if(end<=received)fail();return new Date(end).toISOString();
}
export function parseForecast(data,{point,sourceUrl,retrievedAt,requestedAt=retrievedAt,headers}){
  if(!object(point)||point.point_url!==POINT_URL||point.grid_id!=='EWX'||sourceUrl!==`https://api.weather.gov/gridpoints/EWX/${point.grid_x},${point.grid_y}/forecast`||sourceUrl!==point.forecast_url)fail();
  if(point.expires_at&&stamp(point.expires_at)<=stamp(retrievedAt))fail();
  if(data?.type!=='Feature'||!object(data.properties))fail();
  const p=data.properties,received=stamp(retrievedAt),generated=stamp(p.generatedAt),updated=stamp(p.updateTime);
  if(generated>received+60000||updated>generated||received-updated>MAX_AGE||!['us','si'].includes(p.units))fail();
  const validTimes=text(p.validTimes,140);
  const interval=validTimes.split('/');if(interval.length!==2)fail();
  const start=stamp(interval[0]);
  // This pilot accepts only the documented interval's bounded day/hour/minute/second subset.
  let end;
  if(interval[1].startsWith('P')){
    const m=interval[1].match(/^P(?:(\d+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?)?$/);
    if(!m||!m.slice(1).some(x=>x!==undefined)||(interval[1].includes('T')&&!m.slice(2).some(x=>x!==undefined)))fail();
    const duration=(Number(m[1]||0)*86400+Number(m[2]||0)*3600+Number(m[3]||0)*60+Number(m[4]||0))*1000;
    if(duration<=0||duration>8*DAY)fail();end=start+duration;
  }else end=stamp(interval[1]);
  if(end<=start||end-start>8*DAY||end<=received)fail();
  if(!Array.isArray(p.periods)||p.periods.length<1||p.periods.length>16)fail();
  let previousEnd=null;
  const periods=p.periods.map((r,i)=>{
    if(!object(r)||r.number!==i+1||typeof r.isDaytime!=='boolean')fail();
    const from=stamp(r.startTime),to=stamp(r.endTime);
    if(to<=from||to-from>13*3600000||to<=received||from<start||to>end||to>received+8*DAY||(previousEnd!==null&&from!==previousEnd))fail();
    previousEnd=to;
    let value=r.temperature,unit=r.temperatureUnit;
    if(object(value)){unit=({ 'wmoUnit:degC':'C','wmoUnit:degF':'F' })[value.unitCode];value=value.value;}
    else if(value!==null&&!Number.isInteger(value))fail();
    if(!['C','F'].includes(unit)||!(value===null||(Number.isFinite(value)&&value>=-150&&value<=160)))fail();
    const rain=r.probabilityOfPrecipitation;
    if(rain!==undefined&&(!object(rain)||rain.unitCode!=='wmoUnit:percent'||!(rain.value===null||(Number.isFinite(rain.value)&&rain.value>=0&&rain.value<=100))))fail();
    return {number:r.number,start_time:r.startTime,end_time:r.endTime,is_daytime:r.isDaytime,temperature:{value,unit},precipitation_probability_percent:rain?.value??null,summary:text(r.shortForecast,300)};
  });
  const expiry=cacheExpiry(headers,retrievedAt,requestedAt),expiresAt=new Date(Math.min(Date.parse(expiry),updated+MAX_AGE)).toISOString();
  if(Date.parse(expiresAt)<=received)fail();
  return {source_url:sourceUrl,point_url:POINT_URL,grid_id:point.grid_id,grid_x:point.grid_x,grid_y:point.grid_y,generated_at:p.generatedAt,source_updated_at:p.updateTime,retrieved_at:retrievedAt,valid_times:validTimes,expires_at:expiresAt,periods,evidence_class:'OFFICIAL_FORECAST_CANDIDATE',fact_dates_renewed:false,public_publish_authorized:false,safety_or_suitability_assessed:false};
}
export function forecastAt(record,at){
  const now=stamp(at);if(!object(record)||record.evidence_class!=='OFFICIAL_FORECAST_CANDIDATE'||record.public_publish_authorized!==false||now<stamp(record.retrieved_at)||now>=stamp(record.expires_at))return {state:'unknown-or-expired',period:null};
  const period=record.periods?.find(p=>stamp(p.start_time)<=now&&now<stamp(p.end_time));
  return period?{state:'forecast-candidate-not-actual-weather',period:structuredClone(period)}:{state:'outside-returned-periods',period:null};
}
export async function requestJson(url,{point=null,fetcher=fetch,now=()=>new Date().toISOString()}={}){
  if(url!==POINT_URL&&(!point||url!==point.forecast_url||!/^https:\/\/api\.weather\.gov\/gridpoints\/EWX\/\d{1,4},\d{1,4}\/forecast$/.test(url)))fail();
  const startedAt=now();stamp(startedAt);
  let response;
  try{
    response=await fetcher(url,{redirect:'manual',signal:AbortSignal.timeout(10000),headers:{'User-Agent':USER_AGENT,Accept:'application/geo+json'}});
    const retrievedAt=now();stamp(retrievedAt);
    const result={url,started_at:startedAt,retrieved_at:retrievedAt,http_status:response.status,body_retained:false,headers:Object.fromEntries(['date','age','cache-control','expires','etag','last-modified'].map(k=>[k,response.headers.get(k)?.slice(0,500)??null]))};
    if(response.status!==200){await response.body?.cancel();return {...result,state:'held-http',payload:null};}
    if(response.url&&response.url!==url){await response.body?.cancel();return {...result,state:'held-response-url',payload:null};}
    const type=response.headers.get('content-type')||'';
    if(!/^application\/(?:geo\+)?json(?:;|$)/i.test(type)||Number(response.headers.get('content-length'))>300000){await response.body?.cancel();return {...result,state:'held-format-or-size',payload:null};}
    if(!response.body)return {...result,state:'held-empty',payload:null};
    const reader=response.body.getReader(),chunks=[];let bytes=0;
    while(true){const {done,value}=await reader.read();if(done)break;bytes+=value.length;if(bytes>300000){await reader.cancel();return {...result,state:'held-size',payload:null};}chunks.push(value);}
    const body=Buffer.concat(chunks);let payload;
    try{payload=JSON.parse(body.toString('utf8'));}catch{return {...result,state:'held-json',payload:null};}
    const completedAt=now();stamp(completedAt);
    return {...result,retrieved_at:completedAt,state:'retrieved-json-candidate',bytes,body_sha256:hash(body),payload};
  }catch{return {url,started_at:startedAt,retrieved_at:now(),http_status:response?.status??null,state:'held-fetch',body_retained:false,payload:null};}
}
export async function collectNwsPilot({journalDir,review,fetcher=fetch,now=()=>new Date().toISOString()}){
  if(review?.action_id!=='FT-IMP-166'||!['PASS','PASS_WITH_P3'].includes(review.decision)||! /^[a-f0-9]{64}$/.test(review.manifest_sha256||'')||typeof journalDir!=='string')fail();
  const started=now();stamp(started);
  if(Date.parse(started)<Date.parse('2026-10-14T00:00:00Z')||Date.parse(started)>=Date.parse('2026-10-16T01:47:33Z'))fail();
  const root=resolve(journalDir);await mkdir(root,{mode:0o700});
  const save=(name,value)=>writeFile(resolve(root,name),JSON.stringify(value,null,2)+'\n',{flag:'wx',mode:0o600});
  const packets=[];
  async function attempt(name,url,point=null){
    const attemptAt=now();stamp(attemptAt);if(Date.parse(attemptAt)>=Date.parse('2026-10-16T01:47:33Z'))fail();
    await save(name+'-started.json',{url,started_at:attemptAt,review});
    const fetched=await requestJson(url,{point,fetcher,now});
    const {payload,...metadata}=fetched;let value=null,state=fetched.state;
    if(payload){try{value=point?parseForecast(payload,{point,sourceUrl:url,retrievedAt:metadata.retrieved_at,requestedAt:metadata.started_at,headers:metadata.headers}):{...parsePoint(payload),expires_at:cacheExpiry(metadata.headers,metadata.retrieved_at,metadata.started_at)};state='parsed-candidate';}catch{state='held-normalization';}}
    const packet={...metadata,state,value};await save(name+'-result.json',packet);packets.push(packet);return packet;
  }
  const point=await attempt('point',POINT_URL);
  if(point.state==='parsed-candidate')await attempt('forecast',point.value.forecast_url,point.value);
  const report={action_id:'FT-IMP-166',started_at:started,completed_at:now(),requests:packets.length,packets,public_publish_authorized:false,weekly_baseline_advanced:false,body_archives_retained:false};
  await save('report.json',report);return report;
}
