#!/usr/bin/env python3
"""Search for high-quality trekking photos for the gallery section."""
import subprocess, json, re, time

queries = [
    ('everest-sunrise', 'Everest sunrise Himalaya golden light trekker'),
    ('annapurna-trail', 'Annapurna trekking trail Nepal mountain path'),
    ('prayer-flags', 'prayer flags Himalaya Nepal mountains colorful'),
    ('sherpa-village', 'Sherpa village Nepal Himalaya traditional houses'),
    ('mountain-monsoon', 'Nepal Himalaya monsoon clouds mist mountains'),
    ('tea-house', 'Nepal tea house trekking lodge mountain'),
    ('suspension-bridge', 'Nepal suspension bridge trekking river Himalaya'),
    ('thorong-la-pass', 'Thorong La pass Annapurna Nepal trekkers summit'),
    ('base-camp-tent', 'Everest base camp tent trekkers Nepal'),
    ('monastery-nepal', 'Tibetan Buddhist monastery Nepal Himalaya ancient'),
    ('yak-caravan', 'yak caravan Nepal Himalaya trekking supply'),
    ('rhododendron-forest', 'rhododendron forest Nepal spring trekking flowers'),
]

images = {}
for name, query in queries:
    print(f"Searching: {name}...", end=' ')
    try:
        result = subprocess.run(
            ['z-ai', 'image-search', '-q', query, '--count', '2', '--gl', 'us', '--no-rank'],
            capture_output=True, text=True, timeout=120
        )
        json_match = re.search(r'\{[\s\S]*\}', result.stdout)
        if json_match:
            data = json.loads(json_match.group())
            if data.get('success') and data.get('results'):
                images[name] = data['results'][0]['original_url']
                print(f"✓ {images[name][:60]}...")
            else:
                print("✗ no results")
        else:
            print("✗ no JSON")
    except Exception as e:
        print(f"✗ {e}")
    time.sleep(1)

with open('/tmp/gallery-images.json', 'w') as f:
    json.dump(images, f, indent=2)
print(f"\n=== Saved {len(images)} gallery images ===")
