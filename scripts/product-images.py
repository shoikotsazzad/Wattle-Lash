#!/usr/bin/env python3
# Builds one stand-in photo per seeded product (public/images/products/<sku>.webp) from a pool of
# Pexels photos per category, plus the dedicated home-page photos. Each photo gets several crops,
# so no two products share an identical image. Usage: python3 scripts/product-images.py
# Needs Pillow. Pexels License, no attribution required. Credits: notes/assets/photo-credits.md
import json, os, subprocess
from PIL import Image, ImageOps

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
CACHE = os.environ.get("PHOTO_CACHE", "/tmp/wl-photos")
POOLS = {
    "strip-lashes": [7755523, 7479567, 7479587, 7588357, 256380],
    "individual-lash-clusters": [8554941, 5128220, 7585308, 3657418],
    "lash-extension-kits": [7755531, 18186944, 5128316, 4207234],
    "lash-serums-and-growth": [9775171, 8101521, 8101533, 19833254],
    "lash-adhesives-and-glues": [8533216, 16038198, 16038186, 13516802],
    "lash-primers-and-bonders": [13516789, 13608711, 16378446, 16378451],
    "lash-removers-and-cleansers": [3764016, 4202383, 5468634, 5938626],
    "mascaras": [7712436, 4938457, 7588600, 1383537, 3813896],
    "lash-curlers-and-tools": [8558538, 1472098, 4889714, 8903263],
    "brow-products": [3762664, 8558248, 6153020, 7298683],
    "eye-creams-and-under-eye-care": [3762537, 5069452, 3852204, 5313753, 9774609, 9219049],
    "lash-lift-and-perm-kits": [5177994, 1510634, 4056467, 10316192],
    "lash-storage-and-accessories": [15191189, 8580734, 4620873, 1115128, 5492767],
    "gift-sets-and-bundles": [4397900, 4397903, 6045704, 5486841, 7410461],
    "lash-and-beauty-supplements": [4841353, 17820729, 17820730, 4040562],
}
# Home and category files, written to public/images/stock/<name>.webp (long edge in px).
STOCK = {
    "collection-lashes": (21412169, 1000), "collection-serums": (30229022, 1000),
    "collection-tools": (7512745, 1000), "collection-brows": (5240248, 1000),
    "gift-box": (5704738, 1000), "story-mirror": (35285769, 1400), "about-eye": (3373716, 1600), "adhesives": (8533216, 900), "primers": (13516789, 900),
}
# (zoom, x, y, mirror): x and y place the crop inside the free space, 0 to 1.
VARIANTS = [(1, .5, .5, False), (1.15, .3, .45, True), (1.15, .7, .6, False), (1.3, .5, .55, True)]

def photo(pid):
    os.makedirs(CACHE, exist_ok=True)
    path = f"{CACHE}/{pid}.jpg"
    if not os.path.exists(path):
        url = f"https://images.pexels.com/photos/{pid}/pexels-photo-{pid}.jpeg?auto=compress&cs=tinysrgb&w=1400"
        subprocess.run(["curl", "-sSL", "-m", "60", "-o", path, url], check=True)
    return ImageOps.exif_transpose(Image.open(path)).convert("RGB")

def crop(im, zoom, x, y, mirror, size=(800, 1000)):
    w, h = im.size
    ratio = size[0] / size[1]
    cw, ch = (w, w / ratio) if w / h < ratio else (h * ratio, h)
    cw, ch = cw / zoom, ch / zoom
    left, top = (w - cw) * x, (h - ch) * y
    out = im.crop((int(left), int(top), int(left + cw), int(top + ch))).resize(size, Image.LANCZOS)
    return ImageOps.mirror(out) if mirror else out

def main():
    products = json.load(open(f"{ROOT}/notes/assets/products.json"))["products"]
    out = f"{ROOT}/public/images/products"
    os.makedirs(out, exist_ok=True)
    seen = {}
    for p in products:
        pool = POOLS[p["category"]]
        i = seen.get(p["category"], 0)
        seen[p["category"]] = i + 1
        v = VARIANTS[min(i // len(pool), len(VARIANTS) - 1)]
        crop(photo(pool[i % len(pool)]), *v).save(f"{out}/{p['sku'].lower()}.webp", quality=72, method=6)
    for name, (pid, edge) in STOCK.items():
        im = photo(pid)
        im.thumbnail((edge, edge))
        im.save(f"{ROOT}/public/images/stock/{name}.webp", quality=76, method=6)
    print(len(products), "product images,", len(STOCK), "stock images")

if __name__ == "__main__":
    main()
