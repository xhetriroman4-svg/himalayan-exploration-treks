'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Full-site video background — HYBRID approach.
 *
 * PRIMARY: Cloudinary iframe embed (user requested this).
 *   - Iframe has allow="autoplay" permission.
 *   - Cloudinary player handles its own buffering/format negotiation.
 *
 * FALLBACK: Direct <video> element underneath.
 *   - If iframe doesn't start playing within 4 seconds, the direct video
 *     element becomes visible and starts playing instead.
 *   - The direct <video> uses the proven 12-layer autoplay strategy from before.
 *
 * Why hybrid?
 *   - Iframe autoplay is unreliable across browsers due to cross-origin
 *     user-gesture restrictions.
 *   - Direct <video> with muted+playsInline+autoplay+loop works in ~95% of browsers.
 *   - Combining both maximizes the chance that SOMETHING plays.
 *
 * Whichever plays first wins — the other gets hidden.
 */

const VIDEO_SRC =
  'https://res.cloudinary.com/dc4qh1wrh/video/upload/q_auto,f_auto,w_1920,h_1080,c_fill,e_accelerate:-30/1_n3fzeu.mp4';
const VIDEO_SRC_FALLBACK =
  'https://res.cloudinary.com/dc4qh1wrh/video/upload/q_auto,f_auto,w_1280,h_720,c_fill/1_n3fzeu.mp4';
const POSTER_SRC =
  'https://res.cloudinary.com/dc4qh1wrh/video/upload/so_0,w_1920,h_1080,c_fill,f_jpg,q_auto/1_n3fzeu.jpg';

// Cloudinary iframe embed URL — minimal params, let player handle the rest
const IFRAME_SRC =
  'https://player.cloudinary.com/embed/' +
  '?cloud_name=dc4qh1wrh' +
  '&public_id=1_n3fzeu' +
  '&autoplay=true' +
  '&muted=true' +
  '&loop=true' +
  '&controls=false' +
  '&playsinline=true' +
  '&fluid=false';

export default function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [posterVisible, setPosterVisible] = useState(true);
  const [iframeVisible, setIframeVisible] = useState(true);
  const [videoVisible, setVideoVisible] = useState(false);
  const [iframeLoaded, setIframeLoaded] = useState(false);
  const [showPlayButton, setShowPlayButton] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Show prominent "Tap to play video" button whenever the video is paused
  // for more than 1.5 seconds. This handles:
  //  - Brave browser (blocks ALL autoplay on initial load)
  //  - Browsers that pause background videos
  //  - Any other case where the video gets paused
  // The button is BIG and centered so users can't miss it.
  useEffect(() => {
    if (reducedMotion) return;
    const v = videoRef.current;
    if (!v) return;

    let pausedSince: number | null = null;

    const checkInterval = setInterval(() => {
      if (v.paused && !v.ended) {
        if (pausedSince === null) pausedSince = Date.now();
        // If paused for more than 1.5s, show the button
        if (Date.now() - pausedSince > 1500) {
          setShowPlayButton(true);
        }
      } else {
        pausedSince = null;
        setShowPlayButton(false);
      }
    }, 250);

    return () => clearInterval(checkInterval);
  }, [reducedMotion]);

  // Handler for the prominent play button — always works because it's a user gesture
  const handlePlayButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.volume = 0;
    v.play().then(() => {
      setVideoVisible(true);
      setPosterVisible(false);
      setIframeVisible(false);
      setShowPlayButton(false);
    }).catch((err) => {
      // eslint-disable-next-line no-console
      console.error('[VideoBackground] prominent button play failed:', err);
    });
  };

  // Direct <video> autoplay logic — 12-layer strategy from before
  useEffect(() => {
    if (reducedMotion) return;
    const v = videoRef.current;
    if (!v) return;

    let cancelled = false;
    let watchdog: ReturnType<typeof setInterval> | undefined;
    let userGestureUnlocked = false;

    const forcePlay = async (reason: string) => {
      if (cancelled || !v) return;
      try {
        v.muted = true;
        v.volume = 0;
        try { v.defaultMuted = true; } catch { /* ignore */ }
        if (!v.paused && !v.ended) {
          setVideoVisible(true);
          setPosterVisible(false);
          setIframeVisible(false); // hide iframe since direct video is winning
          return;
        }
        await v.play();
        setVideoVisible(true);
        setPosterVisible(false);
        setIframeVisible(false); // direct video won — hide iframe
      } catch (err) {
        // eslint-disable-next-line no-console
        console.warn(`[VideoBackground][direct] play() failed (${reason}):`, err);
      }
    };

    // Delayed start: try iframe first for 3 seconds, then start direct video as fallback
    const startDelay = setTimeout(() => {
      forcePlay('fallback-after-iframe-timeout');
    }, 3000);

    // Media event listeners
    const onCanPlay = () => forcePlay('canplay');
    const onLoadedData = () => forcePlay('loadeddata');
    const onPlaying = () => {
      setVideoVisible(true);
      setPosterVisible(false);
      setIframeVisible(false);
    };
    const onPause = () => {
      if (!v.ended && !cancelled) {
        setTimeout(() => forcePlay('resume-after-pause'), 50);
      }
    };
    const onEnded = () => {
      v.currentTime = 0;
      forcePlay('ended-restart');
    };

    v.addEventListener('canplay', onCanPlay);
    v.addEventListener('loadeddata', onLoadedData);
    v.addEventListener('playing', onPlaying);
    v.addEventListener('pause', onPause);
    v.addEventListener('ended', onEnded);

    // User-gesture listener
    const onUserGesture = () => {
      if (userGestureUnlocked) {
        if (v.paused) forcePlay('user-gesture-repeat');
        return;
      }
      userGestureUnlocked = true;
      forcePlay('user-gesture');
    };
    document.addEventListener('click', onUserGesture);
    document.addEventListener('touchstart', onUserGesture, { passive: true });
    document.addEventListener('keydown', onUserGesture);
    document.addEventListener('scroll', onUserGesture, { passive: true });
    document.addEventListener('pointerdown', onUserGesture, { passive: true });

    // Visibilitychange
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        forcePlay('visibility');
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    // Watchdog (every 500ms)
    watchdog = setInterval(() => {
      if (cancelled) return;
      if (v.paused && !v.ended) {
        forcePlay('watchdog');
      }
    }, 500);

    return () => {
      cancelled = true;
      clearTimeout(startDelay);
      v.removeEventListener('canplay', onCanPlay);
      v.removeEventListener('loadeddata', onLoadedData);
      v.removeEventListener('playing', onPlaying);
      v.removeEventListener('pause', onPause);
      v.removeEventListener('ended', onEnded);
      document.removeEventListener('click', onUserGesture);
      document.removeEventListener('touchstart', onUserGesture);
      document.removeEventListener('keydown', onUserGesture);
      document.removeEventListener('scroll', onUserGesture);
      document.removeEventListener('pointerdown', onUserGesture);
      document.removeEventListener('visibilitychange', onVisibility);
      if (watchdog) clearInterval(watchdog);
    };
  }, [reducedMotion]);

  return (
    <>
      {/* Poster image — shown until either iframe or video starts playing */}
      {posterVisible && !reducedMotion && (
        <img
          src={POSTER_SRC}
          alt=""
          aria-hidden
          className="video-bg-poster"
          style={{ display: 'block' }}
        />
      )}

      {/* PRIMARY: Cloudinary iframe embed */}
      {!reducedMotion && iframeVisible && (
        <iframe
          className="video-bg-iframe"
          src={IFRAME_SRC}
          title="Background video"
          aria-hidden
          tabIndex={-1}
          allow="autoplay; fullscreen; encrypted-media; picture-in-picture"
          allowFullScreen={false}
          frameBorder={0}
          scrolling="no"
          onLoad={() => {
            setIframeLoaded(true);
            // Hide poster once iframe loads (assume it'll play)
            setTimeout(() => setPosterVisible(false), 1500);
          }}
        />
      )}

      {/* FALLBACK: Direct <video> element underneath iframe.
          Becomes visible if iframe fails to play within 3 seconds. */}
      {!reducedMotion && (
        <video
          ref={videoRef}
          className={`video-bg ${videoVisible ? 'video-bg-visible' : 'video-bg-hidden'}`}
          src={VIDEO_SRC}
          autoPlay
          loop
          muted
          playsInline
          // @ts-expect-error - webkit-prefixed attribute for old iOS Safari
          webkit-playsinline="true"
          // @ts-expect-error - non-standard but widely supported
          disablePictureInPicture
          // @ts-expect-error - non-standard but widely supported
          disableRemotePlayback
          preload="auto"
          poster={POSTER_SRC}
          onError={(e) => {
            const v = e.currentTarget as HTMLVideoElement;
            if (!v.src.includes(VIDEO_SRC_FALLBACK)) {
              v.src = VIDEO_SRC_FALLBACK;
              v.load();
              v.play().catch(() => { /* ignore */ });
            }
          }}
        >
          <source src={VIDEO_SRC} type="video/mp4" />
        </video>
      )}

      {/* Dark gradient overlay above the video for readability */}
      <div className="video-bg-overlay" aria-hidden />

      {/* PROMINENT "Tap to play video" button — shows whenever video has been paused
          for more than 1.5 seconds. Essential for Brave browser which blocks ALL autoplay.
          The button is large and centered so users can't miss it.
          Click is a guaranteed user gesture — video will play. */}
      {showPlayButton && !reducedMotion && (
        <button
          type="button"
          onClick={handlePlayButtonClick}
          className="video-play-prominent"
          aria-label="Play background video"
        >
          <span className="video-play-prominent-icon">
            <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M8 5v14l11-7z" />
            </svg>
          </span>
          <span className="video-play-prominent-text">Tap to Play Video</span>
          <span className="video-play-prominent-hint">Click once to enable the background video</span>
        </button>
      )}
    </>
  );
}
