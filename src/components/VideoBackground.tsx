'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Full-site video background.
 *
 * - Single <video> element mounted once in the root layout, fixed behind all
 *   content (z-index: -2). A dark gradient overlay sits at z-index: -1 to
 *   keep text readable while letting the video's motion shine through.
 * - Plays on loop, muted, autoplay, inline — the only combination that
 *   works on iOS Safari, Android Chrome, and desktop browsers alike.
 * - Respects prefers-reduced-motion: hides the video and shows a static
 *   poster image instead for users who request less motion.
 * - Uses object-fit: cover so it fills any viewport (mobile, tablet,
 *   desktop, ultrawide) without distortion.
 * - Falls back gracefully: poster image while loading, black background
 *   if everything fails.
 */

const VIDEO_SRC =
  'https://res.cloudinary.com/dc4qh1wrh/video/upload/q_auto,f_auto,w_1920,h_1080,c_fill,e_accelerate:-30/1_n3fzeu.mp4';

// A simplified fallback (lower resolution) for slow connections
const VIDEO_SRC_FALLBACK =
  'https://res.cloudinary.com/dc4qh1wrh/video/upload/q_auto,f_auto,w_1280,h_720,c_fill/1_n3fzeu.mp4';

// Poster image: same video's first frame, fetched as an image from Cloudinary
const POSTER_SRC =
  'https://res.cloudinary.com/dc4qh1wrh/video/upload/so_0,w_1920,h_1080,c_fill,f_jpg,q_auto/1_n3fzeu.jpg';

export default function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    // Check user's motion preference
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);

    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);

    // Try to force-play (some browsers stall until a user gesture,
    // but muted+playsInline usually allows autoplay)
    const v = videoRef.current;
    if (v && !mq.matches) {
      v.play().catch(() => {
        // Autoplay blocked: try muting harder, then play again
        v.muted = true;
        v.play().catch(() => {
          /* give up silently — poster image is already showing */
        });
      });
    }

    return () => mq.removeEventListener('change', onChange);
  }, []);

  return (
    <>
      {/* Poster image: shown while video loads OR when reduced motion is set */}
      <img
        src={POSTER_SRC}
        alt=""
        aria-hidden
        className={`video-bg-poster ${videoLoaded && !reducedMotion ? 'is-hidden' : 'is-visible'}`}
        style={{
          display: videoLoaded && !reducedMotion ? 'none' : 'block',
          opacity: videoLoaded ? 0 : 1,
          transition: 'opacity 0.6s ease',
        }}
      />

      {/* The video element itself */}
      {!reducedMotion && (
        <video
          ref={videoRef}
          className="video-bg"
          autoPlay
          loop
          muted
          playsInline
          // @ts-expect-error - non-standard but widely supported attribute
          disablePictureInPicture
          // @ts-expect-error - non-standard but widely supported attribute
          disableRemotePlayback
          preload="auto"
          poster={POSTER_SRC}
          onLoadedData={() => setVideoLoaded(true)}
          onError={(e) => {
            // If the high-quality source fails, swap to the lower-res fallback
            const v = e.currentTarget as HTMLVideoElement;
            if (!v.src.includes(VIDEO_SRC_FALLBACK)) {
              v.src = VIDEO_SRC_FALLBACK;
              v.load();
            }
          }}
        >
          <source src={VIDEO_SRC} type="video/mp4" />
          {/* If MP4 isn't supported, the poster image stays visible */}
        </video>
      )}

      {/* Dark gradient overlay above the video for readability */}
      <div className="video-bg-overlay" aria-hidden />

      {/* Subtle color tint to harmonize with the Himalayan theme */}
      <div className="video-bg-tint" aria-hidden />
    </>
  );
}
