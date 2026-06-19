#!/usr/bin/env python3
"""Replace the video CSS block (lines 83-490) with a minimal version."""

import re

with open('/home/z/my-project/src/app/globals.css', 'r') as f:
    lines = f.readlines()

# Verify the boundaries
print(f"Line 83: {lines[82].rstrip()}")
print(f"Line 490: {lines[489].rstrip()}")
print(f"Line 491: {lines[490].rstrip()}")
print(f"Total lines before: {len(lines)}")

# New minimal video CSS - just the basics
new_video_css = """/* ========== Video Background ========== */
/* Simple autoplay looping muted video. object-fit:cover scales to fill viewport. */
.video-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  object-fit: cover;
  object-position: center;
  z-index: -1;
  pointer-events: none;
  background: #000;
}

/* Subtle dark overlay so text stays readable over the video */
.video-bg-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  height: 100dvh;
  z-index: -1;
  pointer-events: none;
  background: linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.15) 50%, rgba(0,0,0,0.4) 100%);
}

"""

# Replace lines 83-490 (0-indexed: 82-489)
# Keep lines 0-81 (1-82 in 1-indexed)
# Replace 82-489 (83-490 in 1-indexed) with new_video_css
# Keep lines 490+ (491+ in 1-indexed) -> the Glass Cards section and everything after
new_lines = lines[:82] + [new_video_css] + lines[490:]

with open('/home/z/my-project/src/app/globals.css', 'w') as f:
    f.writelines(new_lines)

print(f"Total lines after: {len(new_lines)}")
print("Done.")
