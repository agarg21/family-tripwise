import { test } from "node:test";
import assert from "node:assert/strict";
import { metricsOf, summarize, mergeMonth, nyDate, readReceipts } from "./social-insights.mjs";

const receipt = (o = {}) => ({
  entry_id: "2026-11-06-meet-the-tree", item_id: "meet-the-tree", platform: "instagram", media: "reel",
  reel_photo: "rockefeller-30-rock-2024", reel_music: "mixkit-93", status: "posted", via: "zernio",
  posted_at: "2026-11-06T12:40:00.000Z", remote_id: "z1", url: "https://www.instagram.com/reel/x/", ...o,
});

test("metricsOf keeps plain-unit metrics and drops audience data", () => {
  const m = metricsOf({ views: 72, reach: 67, likes: 0, igReelsAvgWatchTime: 1040, reelsSkipRate: 98.5, videoDurationSeconds: 10,
    retentionCurve: { "3": 0.123 }, audienceCountries: { US: 0.9 }, impressionSources: { x: 1 }, engagementRate: 0 });
  assert.deepEqual(m, { views: 72, reach: 67, likes: 0, avg_watch_s: 1, skip_rate_pct: 98.5, video_s: 10, still_watching_3s: 0.12, engagement_rate_pct: 0 });
});

test("skip rate is kept for Instagram only", () => {
  assert.deepEqual(metricsOf({ views: 5, reelsSkipRate: 0 }, "facebook"), { views: 5 });
  assert.deepEqual(metricsOf({ views: 5, reelsSkipRate: 90.8 }, "instagram"), { views: 5, skip_rate_pct: 90.8 });
  assert.deepEqual(metricsOf({ views: 5, reelsSkipRate: 0, igReelsAvgWatchTime: 0 }, "instagram", "image"), { views: 5 }, "image posts have no watch metrics");
});

test("summarize matches receipts by Zernio id and platform entry, groups by NY month", () => {
  const posts = [{ _id: "z1", mediaProductType: "REELS", platforms: [{ platform: "instagram", syncStatus: "synced", analytics: { views: 72, reelsSkipRate: 98.5 } }] }];
  const months = summarize([receipt(), receipt({ remote_id: "z9", platform: "facebook", posted_at: "2026-12-01T03:00:00.000Z" })], posts, "2026-11-07");
  assert.deepEqual(Object.keys(months).sort(), ["2026-11"]);
  const [ig, fb] = [months["2026-11"].find((r) => r.platform === "instagram"), months["2026-11"].find((r) => r.platform === "facebook")];
  assert.deepEqual(ig.metrics, { views: 72, skip_rate_pct: 98.5 });
  assert.equal(ig.ig_type, "REELS");
  assert.equal(ig.reel_music, "mixkit-93");
  assert.equal(fb.sync, "not_found"); // 2026-12-01 03:00Z is still Nov 30 in New York
  assert.equal(fb.posted_on, "2026-11-30");
  assert.ok(!JSON.stringify(months).includes("content"));
});

test("mergeMonth keeps an older reading when the post has left the API window", () => {
  const old = { posts: [{ entry_id: "a", platform: "instagram", posted_on: "2026-11-01", metrics: { views: 5 } }] };
  const merged = mergeMonth(old, [{ entry_id: "a", platform: "instagram", posted_on: "2026-11-01", sync: "not_found" }, { entry_id: "b", platform: "facebook", posted_on: "2026-11-02", metrics: { views: 1 } }]);
  assert.equal(merged.length, 2);
  assert.deepEqual(merged[0].metrics, { views: 5 });
  assert.deepEqual(mergeMonth(old, [{ entry_id: "a", platform: "instagram", posted_on: "2026-11-01", metrics: {}, sync: "failed" }])[0].metrics, { views: 5 }, "a failed sync keeps the old reading");
  const updated = mergeMonth(old, [{ entry_id: "a", platform: "instagram", posted_on: "2026-11-01", metrics: { views: 9 } }]);
  assert.deepEqual(updated[0].metrics, { views: 9 });
});

test("nyDate and receipts reader", () => {
  assert.equal(nyDate("2026-11-07T03:00:00Z"), "2026-11-06");
  for (const r of readReceipts()) assert.ok(r.remote_id && r.via === "zernio" && r.status === "posted");
});
