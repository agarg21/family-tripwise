import test from 'node:test';
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {execFileSync,spawnSync} from 'node:child_process';
import {mkdtemp,mkdir,writeFile,readFile,rm,symlink,chmod} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {reviewedPilotState,readReviewedPilotState,OFFICIAL_CHECK} from './nws-forecast-state.mjs';
import {POINT_URL} from './nws-forecast-pilot.mjs';
const hash=b=>createHash('sha256').update(b).digest('hex'),bytes=x=>Buffer.from(JSON.stringify(x)+'\n');
function fixture(){
  const point={url:POINT_URL,started_at:'2026-10-14T12:00:00.001Z',retrieved_at:'2026-10-14T12:00:00.010Z',http_status:200,state:'parsed-candidate',body_sha256:'a'.repeat(64),body_retained:false,value:{point_url:POINT_URL,forecast_url:'https://api.weather.gov/gridpoints/EWX/126,54/forecast',grid_id:'EWX',grid_x:126,grid_y:54,city:'San Antonio',state:'TX',time_zone:'America/Chicago',expires_at:'2026-10-14T18:00:00Z'}};
  const forecast={url:point.value.forecast_url,started_at:'2026-10-14T12:00:00.020Z',retrieved_at:'2026-10-14T12:00:00.030Z',http_status:200,state:'parsed-candidate',body_sha256:'b'.repeat(64),body_retained:false,value:{source_url:point.value.forecast_url,point_url:POINT_URL,grid_id:'EWX',grid_x:126,grid_y:54,generated_at:'2026-10-14T11:59:00Z',source_updated_at:'2026-10-14T11:00:00Z',retrieved_at:'2026-10-14T12:00:00.030Z',expires_at:'2026-10-14T12:05:00Z',evidence_class:'OFFICIAL_FORECAST_CANDIDATE',public_publish_authorized:false,fact_dates_renewed:false,safety_or_suitability_assessed:false,periods:[{number:1,start_time:'2026-10-14T11:00:00Z',end_time:'2026-10-14T23:00:00Z',is_daytime:true,temperature:{value:80,unit:'F'},precipitation_probability_percent:null,summary:'private source words never emitted'}]}};
  const report={action_id:'FT-IMP-166',started_at:'2026-10-14T12:00:00Z',completed_at:'2026-10-14T12:00:00.040Z',requests:2,packets:[point,forecast],public_publish_authorized:false,weekly_baseline_advanced:false,body_archives_retained:false};
  const review={action_id:'FT-IMP-166',decision:'PASS',manifest_sha256:'c'.repeat(64)},events={'point-started.json':bytes({url:point.url,started_at:report.started_at,review}),'point-result.json':bytes(point),'forecast-started.json':bytes({url:forecast.url,started_at:'2026-10-14T12:00:00.015Z',review}),'forecast-result.json':bytes(forecast)};
  return seal(report,events);
}
function seal(report,events){const reportBytes=bytes(report);return {report,events,reportBytes,options:{expectedReportSha256:hash(reportBytes),expectedEventSha256:Object.fromEntries(Object.entries(events).map(([k,b])=>[k,hash(b)])),events,at:'2026-10-14T12:01:00Z'}};}
test('pure: available reviewed snapshot returns metadata only with no current-weather or renewal authority',()=>{
  const f=fixture(),r=reviewedPilotState(f.reportBytes,f.options);assert.equal(r.state,'available-reviewed-candidate');assert.equal(r.period_available,true);assert.equal(r.official_current_check,OFFICIAL_CHECK);
  for(const k of ['retry_authorized','public_publish_authorized','fact_dates_renewed','weekly_baseline_advanced','source_authenticity_assessed'])assert.equal(r[k],false);
  const s=JSON.stringify(r);for(const forbidden of ['private source words','temperature','80','precipitation_probability','reviewer','manifest_sha256'])assert.ok(!s.includes(forbidden));
});
test('pure: before capture and exact expiry remain unknown without serving future or stale periods',()=>{
  const f=fixture();assert.equal(reviewedPilotState(f.reportBytes,{...f.options,at:'2026-10-14T11:59:00Z'}).state,'before-capture');
  for(const at of ['2026-10-14T12:05:00Z','2026-10-20T12:00:00Z']){const r=reviewedPilotState(f.reportBytes,{...f.options,at});assert.equal(r.state,'expired-review');assert.equal(r.period_available,false);assert.equal(r.retry_authorized,false);}
});
test('pure: missing or wrong hash pins and malformed bytes hold without leaking payloads',()=>{
  const f=fixture();for(const options of [{...f.options,expectedReportSha256:null},{...f.options,expectedReportSha256:'d'.repeat(64)},{...f.options,expectedEventSha256:{}},{...f.options,events:{}}])assert.equal(reviewedPilotState(f.reportBytes,options).state,'held-integrity');
  const bad=Buffer.from('{private words');assert.equal(reviewedPilotState(bad,{...f.options,expectedReportSha256:hash(bad)}).state,'held-integrity');assert.equal(reviewedPilotState(Buffer.alloc(300001),f.options).state,'held-integrity');
  assert.equal(reviewedPilotState(f.reportBytes,{...f.options,at:'2026-02-30T12:00:00Z'}).state,'held-evaluation-clock');
});
test('pure: changed result or start event remains held even when the complete report hash is intact',()=>{
  const f=fixture();for(const name of Object.keys(f.events)){const events={...f.events,[name]:bytes({untrusted:'private words'})};assert.equal(reviewedPilotState(f.reportBytes,{...f.options,events}).state,'held-integrity');}
  const result=JSON.parse(f.events['forecast-result.json']);result.http_status=403;const events={...f.events,'forecast-result.json':bytes(result)},pins={...f.options.expectedEventSha256,'forecast-result.json':hash(events['forecast-result.json'])};assert.equal(reviewedPilotState(f.reportBytes,{...f.options,events,expectedEventSha256:pins}).state,'held-integrity');
});
test('pure: joined re-pinned controls reject wrong source mapping clocks publication flags units and chronology',()=>{
  for(const mutate of [r=>r.packets[1].url+='?x=1',r=>r.packets[1].value.grid_y=53,r=>r.public_publish_authorized=true,r=>r.packets[1].value.fact_dates_renewed=true,r=>r.packets[1].value.expires_at='2026-10-15T12:00:00Z',r=>r.packets[1].value.periods[0].temperature.unit='K',r=>r.packets[1].value.periods[0].precipitation_probability_percent=101,r=>r.completed_at='2026-10-14T11:00:00Z',r=>r.packets[1].started_at='2026-10-14T11:00:00Z']){
    const f=fixture();mutate(f.report);f.events['point-result.json']=bytes(f.report.packets[0]);f.events['forecast-result.json']=bytes(f.report.packets[1]);const sealed=seal(f.report,f.events);assert.equal(reviewedPilotState(sealed.reportBytes,sealed.options).state,'held-integrity');
  }
});
test('pure: known held point is preserved, and started but unreported forecast is not complete coverage',()=>{
  const f=fixture(),point={...f.report.packets[0],state:'held-http',http_status:403,value:null};const report={...f.report,requests:1,packets:[point]},events={'point-started.json':f.events['point-started.json'],'point-result.json':bytes(point)},s=seal(report,events);assert.equal(reviewedPilotState(s.reportBytes,s.options).state,'held-source-result');
  const incomplete=seal({...f.report,requests:1,packets:[f.report.packets[0]]},{'point-started.json':f.events['point-started.json'],'point-result.json':f.events['point-result.json']});assert.equal(reviewedPilotState(incomplete.reportBytes,incomplete.options).state,'held-incomplete');
  const interrupted={...incomplete.options,events:{...incomplete.events,'forecast-started.json':f.events['forecast-started.json']}};assert.equal(reviewedPilotState(incomplete.reportBytes,interrupted).state,'held-integrity');
});
test('filesystem: private immutable snapshot loads read-only and remains byte-identical',async()=>{
  const parent=await mkdtemp(join(tmpdir(),'nws-state-test-')),dir=join(parent,'journal'),f=fixture();try{
    await mkdir(dir,{mode:0o700});for(const [name,b] of Object.entries({...f.events,'report.json':f.reportBytes}))await writeFile(join(dir,name),b,{mode:0o600});
    const r=await readReviewedPilotState({journalDir:dir,expectedReportSha256:f.options.expectedReportSha256,expectedEventSha256:f.options.expectedEventSha256,at:f.options.at});assert.equal(r.state,'available-reviewed-candidate');for(const [name,b] of Object.entries({...f.events,'report.json':f.reportBytes}))assert.deepEqual(await readFile(join(dir,name)),b);
    await chmod(join(dir,'report.json'),0o644);assert.equal((await readReviewedPilotState({journalDir:dir,...f.options})).state,'held-unavailable-or-incomplete');
  }finally{await rm(parent,{recursive:true,force:true});}
});
test('filesystem: missing unknown and symlinked inputs hold without alternate files or collection',async()=>{
  const parent=await mkdtemp(join(tmpdir(),'nws-state-test-')),dir=join(parent,'journal'),f=fixture();try{
    await mkdir(dir,{mode:0o700});assert.equal((await readReviewedPilotState({journalDir:dir,...f.options})).state,'held-unavailable-or-incomplete');
    await writeFile(join(parent,'other.json'),f.reportBytes,{mode:0o600});await symlink(join(parent,'other.json'),join(dir,'report.json'));assert.equal((await readReviewedPilotState({journalDir:dir,...f.options})).state,'held-unavailable-or-incomplete');
    assert.equal((await readReviewedPilotState({journalDir:'.',...f.options})).state,'held-unavailable-or-incomplete');
  }finally{await rm(parent,{recursive:true,force:true});}
});
test('filesystem: a FIFO with no writer is held promptly without leaving a blocking open',async()=>{
  const parent=await mkdtemp(join(tmpdir(),'nws-state-test-')),dir=join(parent,'journal'),f=fixture();
  try{
    await mkdir(dir,{mode:0o700});execFileSync('mkfifo',[join(dir,'report.json')]);await chmod(join(dir,'report.json'),0o600);
    const script=`import {readReviewedPilotState} from ${JSON.stringify(new URL('./nws-forecast-state.mjs',import.meta.url).href)};console.log(JSON.stringify(await readReviewedPilotState(${JSON.stringify({journalDir:dir,expectedReportSha256:f.options.expectedReportSha256,expectedEventSha256:f.options.expectedEventSha256,at:f.options.at})})));`;
    const result=spawnSync(process.execPath,['--input-type=module','-e',script],{encoding:'utf8',timeout:2000});
    assert.equal(result.error,undefined);assert.equal(result.status,0,result.stderr);assert.equal(JSON.parse(result.stdout).state,'held-unavailable-or-incomplete');
  }finally{await rm(parent,{recursive:true,force:true});}
});
