// Live cam read for /ski/<resort>-conditions.html (QUEUE G19; owner D47/D48/D49).
// The page ships with the build-time card ("No read" until a resort is published). On load this script reads the
// snowcam feed and, only when the resort is published and its read is under 6 hours old, swaps in the read card
// and the cam-by-cam table. Rules mirror camRead() in tools/page-generation/resort-conditions-page.mjs;
// tools/resort-live.test.mjs runs both on the same feed samples so they cannot drift.
var TripwiseResortLive = (function () {
  var FEED = "https://raw.githubusercontent.com/agarg21/snowcam-feed/main/conditions.json";
  var STALE_MIN = 90, HIDE_MIN = 360, MIN_CONF = 0.6;
  var MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  var STATUSES = { "Looks good": "worth_it", Fair: "neutral", Busy: "only_for", Closed: "skip", "No read": "neutral" };
  var FIELD_LABELS = {
    fresh_snow: "Fresh snow", snow_cover: "Snow cover", snowmaking: "Snowmaking", lifts_moving: "Lifts",
    base_busyness: "Base area", visibility: "Visibility", falling_snow: "Falling snow"
  };
  var ALLOWED_BUSY = { quiet: 1, normal: 1, busy: 1 };
  var BANNED = /\b(safe|unsafe|safety|ic[ey]|iced|groom\w*|open\w*|closed?|trails?|runs?|people|person|crowd\w*)\b/i;
  var hasPrice = function (s) { return /\$\d/.test(String(s == null ? "" : s)); };
  var e = function (v) {
    return String(v == null ? "" : v).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  };
  var short = function (iso) { var p = iso.split("-").map(Number); return MONTHS[p[1] - 1] + " " + p[2]; };
  var etTime = function (iso) {
    return new Date(iso).toLocaleTimeString("en-US", { timeZone: "America/New_York", hour: "numeric", minute: "2-digit" }).replace(" AM", "am").replace(" PM", "pm");
  };
  var etDay = function (iso) { return new Date(iso).toLocaleDateString("en-CA", { timeZone: "America/New_York" }); };

  function camRead(f, now) {
    var none = { state: "none" };
    if (!f || f.publish !== true) return none;
    var at = Date.parse(f.read_at || "");
    if (!isFinite(at)) return none;
    var mins = (now.getTime() - at) / 60000;
    if (mins > HIDE_MIN || mins < -5) return none;
    var status = Object.prototype.hasOwnProperty.call(STATUSES, f.status == null ? "" : f.status) ? f.status : "No read";
    var fields = [];
    var raw = f.fields || {};
    Object.keys(raw).forEach(function (key) {
      var x = raw[key];
      if (!Object.prototype.hasOwnProperty.call(FIELD_LABELS, key) || !x || typeof x.conf !== "number" || x.conf < MIN_CONF) return;
      var value = String(x.value == null ? "" : x.value).trim();
      if (!value || hasPrice(value) || BANNED.test(value)) return;
      if (key === "base_busyness" && !ALLOWED_BUSY[value.toLowerCase()]) return;
      fields.push(FIELD_LABELS[key] + ": " + value);
    });
    var stakeConf = f.stake_conf != null ? f.stake_conf : raw.stake != null ? raw.stake.conf : undefined;
    if (typeof f.stake_inches === "number" && f.stake_inches >= 0 && !(typeof stakeConf === "number" && stakeConf < MIN_CONF)) fields.unshift("New snow on stake: " + f.stake_inches + " in.");
    return {
      state: mins > STALE_MIN ? "stale" : "fresh", age: Math.max(0, Math.round(mins)), status: status,
      line: BANNED.test(String(f.line == null ? "" : f.line)) ? "" : String(f.line == null ? "" : f.line), fields: fields,
      read_at: f.read_at, cams_used: f.cams_used, cams_total: f.cams_total, cams: Array.isArray(f.cams) ? f.cams : []
    };
  }

  // Feed cam names are short ("Summit"); the page uses the resort's own names ("Summit Cam", "Okemo Snow Stake").
  function camKey(name, resortName) {
    return String(name == null ? "" : name).toLowerCase().replace(String(resortName || "").toLowerCase(), "").replace(/\b(web)?cam\b/g, "").replace(/\s+/g, " ").trim();
  }
  function matchCam(pageName, feedCams, resortName) {
    var k = camKey(pageName, resortName), i, f;
    feedCams = feedCams.filter(function (c) { return c && typeof c === "object"; });
    for (i = 0; i < feedCams.length; i++) if (camKey(feedCams[i].name, resortName) === k) return feedCams[i];
    for (i = 0; i < feedCams.length; i++) { f = camKey(feedCams[i].name, resortName); if (f && k && (k.indexOf(f) === 0 || f.indexOf(k) === 0)) return feedCams[i]; }
    return undefined;
  }
  var ago = function (m) { return m < 60 ? m + " min ago" : "about " + Math.round(m / 60) + " hr ago"; };

  function card(r, read, today) {
    var chip = read.state === "stale" ? "Older read" : read.status;
    var variant = read.state === "stale" ? "neutral" : STATUSES[read.status];
    var when = (etDay(read.read_at) === today ? "" : short(etDay(read.read_at)) + ", ") + etTime(read.read_at) + " ET (" + ago(read.age) + ")";
    var before = r.opening && today < r.opening.date;
    var lead = before ? '<p class="holiday-answer-figure"><span>Not open yet</span><strong>Opens ' + e(r.opening_when) + "</strong><small>" + e(r.name) + "'s hours page, read " + e(r.observed) + "</small></p>" : "";
    var closed = read.status === "Closed" ? "<p><strong>" + e(r.name) + " says it is closed.</strong> The cam read below is context only.</p>" : "";
    var opening = r.opening && today <= r.opening.date ? "<li>" + e(r.opening.text) + " (read " + e(r.observed) + ")</li>" : "";
    return lead + '<ul class="deal-chips"><li class="deal-verdict-' + e(variant) + '">' + e(chip) + "</li>" +
      read.fields.map(function (x) { return "<li>" + e(x) + "</li>"; }).join("") + "</ul>" +
      closed + (read.line ? "<p><strong>" + e(read.line) + "</strong></p>" : "") +
      '<p class="holiday-note">Read from ' + e(read.cams_used) + " of " + e(read.cams_total) + " " + e(r.name) + " cams at " + e(when) +
      ". Our reading of the pictures, not " + e(r.name) + "'s report.</p>" +
      (!before && opening ? "<ul>" + opening + "</ul>" : "") +
      '<p><a class="button primary" href="' + e(r.cam_page) + '">Watch ' + e(r.name) + "'s own cams</a></p>";
  }

  function table(r, read) {
    var rows = r.cams.map(function (c) {
      var x = matchCam(c.name, read.cams || [], r.name);
      var last = !x ? "Not yet" : x.no_read ? "No read: " + x.no_read : x.read_at ? etTime(x.read_at) + " ET" : "No read";
      return '<tr><th scope="row">' + e(c.name) + "</th><td>" + e(c.reads) + "</td><td>" + e(last) + "</td></tr>";
    }).join("");
    return '<div class="holiday-table-wrap"><table class="holiday-table"><caption><span>' + e(r.name) + "'s " + r.cams.length +
      " public cams, as named on its cam page (read " + e(r.observed) + ').</span></caption><thead><tr><th scope="col">Cam</th>' +
      '<th scope="col">What we read from it</th><th scope="col">Last read</th></tr></thead><tbody>' + rows + "</tbody></table></div>";
  }

  function start() {
    var dataEl = document.getElementById("resort-live-data");
    var box = document.getElementById("ski-answer");
    var camsTitle = document.getElementById("cams-title");
    if (!dataEl || !box || !camsTitle || !window.fetch) return;
    var r;
    try { r = JSON.parse(dataEl.textContent); } catch (err) { return; }
    fetch(FEED, { cache: "no-store" })
      .then(function (res) { return res.ok ? res.json() : null; })
      .then(function (feed) {
        var read = camRead(feed && feed.resorts && feed.resorts[r.slug], new Date());
        if (read.state === "none") return;
        var today = new Date().toLocaleDateString("en-CA", { timeZone: "America/New_York" });
        box.setAttribute("aria-label", "Cam read now");
        box.innerHTML = card(r, read, today);
        var tableHtml = table(r, read);
        var section = camsTitle.parentNode;
        while (camsTitle.nextSibling) section.removeChild(camsTitle.nextSibling);
        section.insertAdjacentHTML("beforeend", tableHtml);
      })
      .catch(function () { /* keep the build-time card */ });
  }

  if (typeof document !== "undefined") {
    if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", start);
    else start();
  }
  return { camRead: camRead, card: card, table: table, FEED: FEED };
})();
