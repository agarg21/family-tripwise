"""Download each Commons photo in commons-images.json once and write site/images/<slug>.webp.

Run by .github/workflows/self-host-images.yml. Polite: one metadata call, then one
download per missing file with a pause; a descriptive User-Agent; no retries of a denial.
Writes tools/images/commons-images.lock.json (dimensions, bytes, licence, author, source).
"""
import io, json, re, sys, time, urllib.parse, urllib.request, datetime, html, pathlib
from PIL import Image

ROOT = pathlib.Path(__file__).resolve().parents[2]
MANIFEST = ROOT / "tools/images/commons-images.json"
LOCK = ROOT / "tools/images/commons-images.lock.json"
OUT = ROOT / "site/images"
UA = "FamilyTripwiseBot/1.0 (https://familytripwise.com; hello@familytripwise.com) one-time self-hosting of credited Commons photos"

def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=60) as r:
        return r.read()

def text(value):
    return html.unescape(re.sub(r"<[^>]+>", "", value or "")).strip()

def main():
    manifest = json.loads(MANIFEST.read_text())
    lock = json.loads(LOCK.read_text()) if LOCK.exists() else {}
    OUT.mkdir(parents=True, exist_ok=True)
    todo = [i for i in manifest["images"] if i["slug"] not in lock or not (OUT / f"{i['slug']}.webp").exists()]
    if not todo:
        print("nothing to fetch"); return 0
    titles = "|".join("File:" + i["file"] for i in todo)
    q = urllib.parse.urlencode({"action": "query", "titles": titles, "prop": "imageinfo",
        "iiprop": "url|size|extmetadata", "iiurlwidth": str(manifest["max_width"]), "format": "json", "formatversion": "2"})
    data = json.loads(get("https://commons.wikimedia.org/w/api.php?" + q))
    pages = {}
    for p in data["query"]["pages"]:
        pages[p["title"].replace(" ", "_")[5:]] = p
    norm = {n["from"].replace(" ", "_")[5:]: n["to"].replace(" ", "_")[5:] for n in data["query"].get("normalized", [])}
    failed = 0
    for item in todo:
        p = pages.get(norm.get(item["file"], item["file"]))
        if not p or "imageinfo" not in p:
            print(f"::error::no imageinfo for {item['file']}"); failed += 1; continue
        ii = p["imageinfo"][0]; m = ii.get("extmetadata", {})
        url = ii.get("thumburl") or ii["url"]
        time.sleep(3)
        try:
            raw = get(url)
        except Exception as e:  # no retry of a denial
            print(f"::error::{item['file']}: {e}"); failed += 1; continue
        img = Image.open(io.BytesIO(raw)).convert("RGB")
        if img.width > manifest["max_width"]:
            img = img.resize((manifest["max_width"], round(img.height * manifest["max_width"] / img.width)), Image.LANCZOS)
        out = None
        for width in (img.width, 1400, 1280, 1120, 960):
            if width > img.width: continue
            sized = img if width == img.width else img.resize((width, round(img.height * width / img.width)), Image.LANCZOS)
            for quality in (80, 74, 68, 62, 56, 50):
                buf = io.BytesIO(); sized.save(buf, "WEBP", quality=quality, method=6)
                if buf.tell() <= manifest["max_bytes"]:
                    out = (sized, buf.getvalue(), quality); break
            if out: break
        if not out:
            print(f"::error::{item['file']} cannot fit {manifest['max_bytes']} bytes"); failed += 1; continue
        sized, blob, quality = out
        (OUT / f"{item['slug']}.webp").write_bytes(blob)
        lock[item["slug"]] = {
            "file": item["file"], "path": f"images/{item['slug']}.webp",
            "width": sized.width, "height": sized.height, "bytes": len(blob), "webp_quality": quality,
            "source_page": ii.get("descriptionurl"), "downloaded_from": url,
            "original_width": ii.get("width"), "original_height": ii.get("height"),
            "license": text(m.get("LicenseShortName", {}).get("value")),
            "license_url": text(m.get("LicenseUrl", {}).get("value")),
            "artist": text(m.get("Artist", {}).get("value")),
            "credit": text(m.get("Credit", {}).get("value"))[:300],
            "observed_on": datetime.date.today().isoformat()
        }
        print(f"ok {item['slug']} {sized.width}x{sized.height} {len(blob)} B q{quality}")
    LOCK.write_text(json.dumps(dict(sorted(lock.items())), indent=2, ensure_ascii=False) + "\n")
    return 1 if failed else 0

if __name__ == "__main__":
    sys.exit(main())
