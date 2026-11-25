# tools/build-home-gallery.py
# Scans public/images/ and writes public/data/home-photos.json
# Run it whenever you add or remove photos:  python tools/build-home-gallery.py

import os
import json
from PIL import Image

# Where to look for photos, and where to write the list
IMAGE_FOLDER = "public/images"
OUTPUT_FILE = "public/data/home-photos.json"

photos = []

# Go through every file in the images folder, in alphabetical order
for filename in sorted(os.listdir(IMAGE_FOLDER)):
    # Only include image files, skip anything else
    if not filename.lower().endswith((".jpg", ".jpeg", ".png", ".webp")):
        continue

    path = os.path.join(IMAGE_FOLDER, filename)

    # Open the image just long enough to read its width and height
    with Image.open(path) as img:
        width, height = img.size

    # Build one entry for the JSON list
    photos.append({
        "src": f"images/{filename}",
        "alt": os.path.splitext(filename)[0],  # filename without .jpg
        "width": width,
        "height": height
    })

# Make sure the data folder exists, then write the JSON file
os.makedirs(os.path.dirname(OUTPUT_FILE), exist_ok=True)
with open(OUTPUT_FILE, "w", encoding="utf-8") as f:
    json.dump(photos, f, indent=2)

print(f"Wrote {len(photos)} photos to {OUTPUT_FILE}")