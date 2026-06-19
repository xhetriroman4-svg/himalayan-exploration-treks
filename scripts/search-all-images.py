#!/usr/bin/env python3
"""Run image searches for all Nepal destinations and extract URLs."""
import subprocess
import json
import re
import os
import time

destinations = [
    ('everest', 'Everest Base Camp trek Nepal Himalaya mountains'),
    ('annapurna', 'Annapurna Circuit trek Nepal mountains Thorong La'),
    ('mustang', 'Upper Mustang Nepal ancient monastery Lo Manthang landscape'),
    ('langtang', 'Langtang Valley trek Nepal glaciers Tamang'),
    ('manaslu', 'Manaslu Circuit trek Nepal Himalaya Larkya La'),
    ('dolpo', 'Upper Dolpo Nepal Phoksundo Lake remote trek'),
    ('gokyo', 'Gokyo Lakes Nepal trek blue lakes mountains'),
    ('mera', 'Mera Peak climbing Nepal Himalaya summit'),
    ('island', 'Island Peak climbing Nepal Himalaya'),
    ('kanchen', 'Kanchenjunga trek Nepal remote eastern Himalaya'),
    ('helambu', 'Helambu trek Nepal valley green hills'),
    ('poonhill', 'Ghorepani Poon Hill trek Nepal sunrise Annapurna'),
    ('tsum', 'Tsum Valley trek Nepal ancient Buddhist'),
    ('rara', 'Rara Lake trek Nepal largest lake remote'),
    ('khopra', 'Khopra Ridge trek Nepal community lodge Annapurna'),
    ('kathmandu', 'Kathmandu Nepal valley cultural heritage temples'),
]

images = {}

for dest, query in destinations:
    print(f"\n--- Searching: {dest} ---")
    try:
        result = subprocess.run(
            ['z-ai', 'image-search', '-q', query, '--count', '3', '--gl', 'us', '--no-rank'],
            capture_output=True, text=True, timeout=180
        )
        output = result.stdout
        # Extract JSON from output (find first { and last })
        json_match = re.search(r'\{[\s\S]*\}', output)
        if json_match:
            data = json.loads(json_match.group())
            if data.get('success') and data.get('results'):
                url = data['results'][0]['original_url']
                images[dest] = url
                print(f"✓ {dest}: {url[:80]}...")
            else:
                print(f"✗ {dest}: no results in response")
        else:
            print(f"✗ {dest}: no JSON found in output")
            print(f"  Output: {output[:200]}")
    except subprocess.TimeoutExpired:
        print(f"✗ {dest}: timeout")
    except Exception as e:
        print(f"✗ {dest}: {e}")
    time.sleep(1)  # small delay between calls

# Save consolidated results
with open('/tmp/all-images.json', 'w') as f:
    json.dump(images, f, indent=2)

print(f"\n=== Saved {len(images)} image URLs ===")
for dest, url in images.items():
    print(f"  {dest}: {url}")
