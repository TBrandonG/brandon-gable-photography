# tools/build-galleries.py
# Builds a JSON photo list for EVERY gallery folder.
# Run it whenever you add/remove photos:  python tools/build-galleries.py

import os
import json
from PIL import Image

# Add a line here for each new gallery — that's the only change needed later
# (image folder, output JSON file, src prefix written into the JSON)
GALLERIES = [
    ("public/images",         "public/data/home-photos.json",   "images/"),
    ("public/images/travels", "public/data/travel-photos.json", "images/travels/"),
]

def build_gallery(image_folder, output_file, src_prefix):
    photos = []
    for filename in sorted(os.listdir(image_folder)):
        if not filename.lower().endswith((".jpg", ".jpeg", ".png", ".webp")):
            continue
        path = os.path.join(image_folder, filename)
        with Image.open(path) as img:
            width, height = img.size
        photos.append({
            "src": f"{src_prefix}{filename}",
            "alt": os.path.splitext(filename)[0],
            "width": width,
            "height": height
        })

    os.makedirs(os.path.dirname(output_file), exist_ok=True)
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(photos, f, indent=2)

    print(f"{image_folder}: wrote {len(photos)} photos to {output_file}")

# Build every gallery in the list
for folder, output, prefix in GALLERIES:
    build_gallery(folder, output, prefix)