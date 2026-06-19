#!/usr/bin/env python3
"""Remove sections from homepage that have been moved to dedicated pages."""

with open('/home/z/my-project/src/app/page.tsx', 'r') as f:
    lines = f.readlines()

# Sections to REMOVE (1-indexed line ranges, inclusive)
# Format: (start_comment_line, end_line_before_next_section_starts)
# We remove from the section comment line until the line before the next section comment
remove_ranges = [
    # Custom Package Builder (1161) → next section at 1347
    (1161, 1346),
    # Feature Grid (1347) → next at 1369
    (1347, 1368),
    # Product Showcase (1369) → next at 1414
    (1369, 1413),
    # Destinations Grid (1414) → next at 1449
    (1414, 1448),
    # Interactive Tools (1449) → next at 1733
    (1449, 1732),
    # About Us (1733) → next at 1828
    (1733, 1827),
    # Travel Guides (1828) → next at 1850
    (1828, 1849),
    # Trust & Safety (1850) → next at 1899
    (1850, 1898),
    # Gallery (1899) → next at 1934
    (1899, 1933),
    # Testimonials (1934) → next at 1964
    (1934, 1963),
    # Blog/Stories (1964) → next at 1995
    (1964, 1994),
    # FAQ (1995) → next at 2026
    (1995, 2025),
    # Pricing (2026) → next at 2057
    (2026, 2056),
    # Contact (2091) → next at 2185
    (2091, 2184),
    # Countdown (2185) → next at 2210
    (2185, 2209),
    # NEW 1: Trust Badges Marquee (2227) → next at 2258
    (2227, 2257),
    # NEW 2: Live Countdown (2258) → next at 2284
    (2258, 2283),
    # NEW 3: Testimonials Carousel (2284) → next at 2319
    (2284, 2318),
    # NEW 4: Interactive Nepal Map (2319) → next at 2387
    (2319, 2386),
    # NEW 5: Instagram Grid (2387) → next at 2433
    (2387, 2432),
    # NEW 6: Newsletter CTA (2433) → next at 2460 (footer)
    (2433, 2459),
]

# Convert to 0-indexed and mark lines for removal
lines_to_remove = set()
for start, end in remove_ranges:
    for i in range(start - 1, end):
        lines_to_remove.add(i)

print(f"Total lines: {len(lines)}")
print(f"Lines to remove: {len(lines_to_remove)}")

# Keep lines not in removal set
new_lines = [line for i, line in enumerate(lines) if i not in lines_to_remove]

print(f"Lines after removal: {len(new_lines)}")
print(f"Removed: {len(lines) - len(new_lines)} lines")

with open('/home/z/my-project/src/app/page.tsx', 'w') as f:
    f.writelines(new_lines)

print("Done.")
