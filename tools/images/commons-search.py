"""Find candidate Commons photos for reels and pages (QUEUE G17, Reels v3).

Run by .github/workflows/commons-search.yml (Commons rate-limits the cloud workspace).
Reads tools/images/commons-queries.json, asks the Commons search API once per query,
keeps free-licence photos at least MIN_WIDTH wide, downloads a small thumbnail of each and
writes, into OUT (an artifact, never committed): candidates.json and one numbered contact
sheet per query. Picking a photo still means adding it to commons-images.json, which the
self-host workflow fetches and credits as before.
"""
import io, json, os, re, sys, time, urllib.parse, urllib.request, html, pathlib
from PIL import Image, ImageDraw

ROOT = pathlib.Path(__file__).resolve().parents[2]
QUERIES = ROOT / "tools/images/commons-queries.json"
OUT = pathlib.Path(os.environ.get("COMMONS_SEARCH_OUT", ROOT / "commons-search-out"))
UA = "FamilyTripwiseBot/1.0 (https://familytripwise.com; hello@familytripwise.com) photo curation, a few searches per week"
FREE = re.compile(r"^(CC0|Public domain|CC BY(-SA)? [0-9.]+)$")
MIN_WIDTH = 1200

def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()

def text(v):
    return html.unescape(re.sub(r"<[^>]+>", "", v or "")).strip()

def search(q, limit):
    params = urllib.parse.urlencode({"action": "query", "format": "json", "formatversion": "2", "generator": "search",
        "gsrnamespace": "6", "gsrlimit": str(limit), "gsrsearch": f"{q} filetype:bitmap", "prop": "imageinfo",
        "iiprop": "url|size|extmetadata", "iiurlwidth": "360",
        "iiextmetadatafilter": "LicenseShortName|LicenseUrl|Artist|DateTimeOriginal|ImageDescription"})
    data = json.loads(get("https://commons.wikimedia.org/w/api.php?" + params))
    out = []
    for p in sorted(data.get("query", {}).get("pages", []), key=lambda p: p.get("index", 0)):
        ii = (p.get("imageinfo") or [{}])[0]; m = ii.get("extmetadata", {})
        lic = text(m.get("LicenseShortName", {}).get("value"))
        if not FREE.match(lic) or (ii.get("width") or 0) < MIN_WIDTH:
            continue
        out.append({"file": p["title"][5:].replace(" ", "_"), "width": ii.get("width"), "height": ii.get("height"),
            "license": lic, "artist": text(m.get("Artist", {}).get("value"))[:80],
            "date": text(m.get("DateTimeOriginal", {}).get("value"))[:10],
            "description": text(m.get("ImageDescription", {}).get("value"))[:160],
            "thumb": ii.get("thumburl"), "page": ii.get("descriptionurl")})
    return out

def sheet(items, path):
    tiles = []
    for i, it in enumerate(items):
        try:
            time.sleep(1)
            im = Image.open(io.BytesIO(get(it["thumb"]))).convert("RGB")
        except Exception as e:  # no retry of a denial
            print(f"thumb failed {it['file']}: {e}"); im = Image.new("RGB", (360, 240), (60, 60, 60))
        im.thumbnail((360, 360))
        tile = Image.new("RGB", (380, 400), (255, 255, 255)); tile.paste(im, (10, 10))
        d = ImageDraw.Draw(tile)
        d.text((10, 372), f"#{i} {it['width']}x{it['height']} {it['license']} {it['date']}", fill=(0, 0, 0))
        tiles.append(tile)
    if not tiles:
        return
    cols = 4; rows = (len(tiles) + cols - 1) // cols
    canvas = Image.new("RGB", (cols * 380, rows * 400), (255, 255, 255))
    for i, t in enumerate(tiles):
        canvas.paste(t, ((i % cols) * 380, (i // cols) * 400))
    canvas.save(path, "JPEG", quality=82)

def main():
    cfg = json.loads(QUERIES.read_text())
    OUT.mkdir(parents=True, exist_ok=True)
    result = {}
    for n, q in enumerate(cfg["queries"]):
        time.sleep(2)
        try:
            items = search(q["q"], cfg.get("limit", 20))
        except Exception as e:
            print(f"::error::search failed for {q['q']}: {e}"); continue
        result[q["id"]] = {"query": q["q"], "candidates": items}
        sheet(items, OUT / f"{n:02d}-{q['id']}.jpg")
        print(f"{q['id']}: {len(items)} candidates")
    (OUT / "candidates.json").write_text(json.dumps(result, indent=1, ensure_ascii=False))
    return 0

if __name__ == "__main__":
    sys.exit(main())
