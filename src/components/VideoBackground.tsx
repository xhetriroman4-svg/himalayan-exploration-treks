'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Full-site video background with BULLETPROOF autoplay.
 *
 * Strategy (handles every browser's autoplay policy):
 *  1. Mount with muted+playsInline+loop — the only combo that allows autoplay
 *     in Chrome/Safari/Firefox out of the box.
 *  2. Try play() immediately on mount. If rejected, retry on:
 *     - 'canplay' event (video finished loading enough to play)
 *     - 'loadeddata' event (first frame available)
 *     - first user gesture (click/touch/keydown) — unlocks autoplay on
 *       strict browsers that block until user interacts with the page
 *     - 'visibilitychange' — resumes if user switches back to the tab
 *  3. setInterval watchdog every 2s: if paused, force play() again.
 *     This catches edge cases where browsers pause background videos
 *     or where another script accidentally pauses it.
 *  4. Explicitly set v.muted = true BEFORE calling play() — required
 *     by Chrome's autoplay policy.
 *
 * Visibility strategy:
 *  - Video at z-index: -2 with brightness/contrast/saturate boost
 *  - Light overlay at z-index: -1 for text readability
 *  - Cards are FROSTED (translucent dark + blur) so video shows through
 */

const VIDEO_SRC =
  'https://res.cloudinary.com/dc4qh1wrh/video/upload/q_auto,f_auto,w_1920,h_1080,c_fill,e_accelerate:-30/1_n3fzeu.mp4';

const VIDEO_SRC_FALLBACK =
  'https://res.cloudinary.com/dc4qh1wrh/video/upload/q_auto,f_auto,w_1280,h_720,c_fill/1_n3fzeu.mp4';

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

    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) return; // No video to manage
    const v = videoRef.current;
    if (!v) return;

    let cancelled = false;
    let watchdog: ReturnType<typeof setInterval> | undefined;
    let userGestureUnlocked = false;

    // Force-play with retry. Some browsers reject play() if not muted
    // or if there hasn't been a user gesture yet — we handle both.
    const forcePlay = async (reason: string) => {
      if (cancelled || !v) return;
      try {
        v.muted = true; // Required by Chrome/Safari autoplay policy
        // If already playing, no-op
        if (!v.paused && !v.ended) return;
        await v.play();
        // eslint-disable-next-line no-console
        console.log(`[VideoBackground] playing (${reason})`);
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn(`[VideoBackground] play() failed (${reason}):`, err);
      }
    };

    // 1. Immediate attempt
    forcePlay('initial');

    // 2. On 'canplay' — re-attempt when enough data is buffered
    const onCanPlay = () => forcePlay('canplay');
    const onLoadedData = () => {
      setVideoLoaded(true);
      forcePlay('loadeddata');
    };
    const onPlay = () => {
      // eslint-disable-next-line no-console
      console.log('[VideoBackground] play event fired');
    };
    const onPause = () => {
      // If something paused it (other than the user or end-of-video), resume
      if (!v.ended && !cancelled) {
        // eslint-disable-next-line no-console
        console.log('[VideoBackground] paused unexpectedly — resuming');
        setTimeout(() => forcePlay('resume-after-pause'), 50);
      }
    };
    const onEnded = () => {
      // loop=true should auto-restart, but force it just in case
      v.currentTime = 0;
      forcePlay('ended-restart');
    };

    v.addEventListener('canplay', onCanPlay);
    v.addEventListener('loadeddata', onLoadedData);
    v.addEventListener('play', onPlay);
    v.addEventListener('pause', onPause);
    v.addEventListener('ended', onEnded);

    // 3. First user gesture fallback — unlocks autoplay on strict browsers
    const onUserGesture = () => {
      if (userGestureUnlocked) return;
      userGestureUnlocked = true;
      forcePlay('user-gesture');
      // Clean up listeners after first gesture
      document.removeEventListener('click', onUserGesture);
      document.removeEventListener('touchstart', onUserGesture);
      document.removeEventListener('keydown', onUserGesture);
      document.removeEventListener('scroll', onUserGesture);
    };
    document.addEventListener('click', onUserGesture);
    document.addEventListener('touchstart', onUserGesture, { passive: true });
    document.addEventListener('keydown', onUserGesture);
    document.addEventListener('scroll', onUserGesture, { passive: true });

    // 4. Visibility change — resume when tab becomes visible again
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        forcePlay('visibility');
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    // 5. Watchdog — every 2s, if paused, force play
    watchdog = setInterval(() => {
      if (v.paused && !v.ended && !cancelled) {
        forcePlay('watchdog');
      }
    }, 2000);

    return () => {
      cancelled = true;
      v.removeEventListener('canplay', onCanPlay);
      v.removeEventListener('loadeddata', onLoadedData);
      v.removeEventListener('play', onPlay);
      v.removeEventListener('pause', onPause);
      v.removeEventListener('ended', onEnded);
      document.removeEventListener('click', onUserGesture);
      document.removeEventListener('touchstart', onUserGesture);
      document.removeEventListener('keydown', onUserGesture);
      document.removeEventListener('scroll', onUserGesture);
      document.removeEventListener('visibilitychange', onVisibility);
      if (watchdog) clearInterval(watchdog);
    };
  }, [reducedMotion]);

  return (
    <>
      {/* Poster image: shown while video loads OR when reduced motion is set */}
      <img
        src={POSTER_SRC}
        alt=""
        aria-hidden
        className="video-bg-poster"
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
            const v = e.currentTarget as HTMLVideoElement;
            if (!v.src.includes(VIDEO_SRC_FALLBACK)) {
              v.src = VIDEO_SRC_FALLBACK;
              v.load();
            }
          }}
        >
          <source src={VIDEO_SRC} type="video/mp4" />
        </video>
      )}

      {/* Dark gradient overlay above the video for readability */}
      <div className="video-bg-overlay" aria-hidden />
    </>
  );
}
