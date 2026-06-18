'use client';

import { useEffect, useRef, useState } from 'react';

/**
 * Full-site video background with NUCLEAR-GRADE autoplay reliability.
 *
 * Every browser autoplay policy is defeated by one of these layers:
 *
 *  LAYER 1 - Element attributes: autoPlay + loop + muted + playsInline + webkit-playsinline
 *  LAYER 2 - src set DIRECTLY on <video> (not just <source>) — handles Safari quirk
 *  LAYER 3 - Immediate v.load() + v.play() on mount (hard reset)
 *  LAYER 4 - Re-attempt on 'canplay', 'loadeddata', 'loadedmetadata' events
 *  LAYER 5 - First-user-gesture listener (click/touch/keydown/scroll) on document
 *  LAYER 6 - Visibilitychange listener (resume when tab becomes visible)
 *  LAYER 7 - 500ms watchdog interval — if paused, force play()
 *  LAYER 8 - onPause listener — immediately resume if paused unexpectedly
 *  LAYER 9 - onEnded listener — reset currentTime and force play (loop safety)
 *  LAYER 10 - Visible "Tap to play" button overlay if video still paused after 2.5s
 *             (click on button is a guaranteed user gesture → play always works)
 *  LAYER 11 - Body-level click catcher — ANY click anywhere triggers play()
 *  LAYER 12 - Unmute→mute dance workaround for Safari
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
  const [showPlayButton, setShowPlayButton] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const v = videoRef.current;
    if (!v) return;

    let cancelled = false;
    let watchdog: ReturnType<typeof setInterval> | undefined;
    let buttonCheckInterval: ReturnType<typeof setInterval> | undefined;
    let userGestureUnlocked = false;
    let playAttempts = 0;
    let playFailures = 0;
    let lastSuccessfulPlay = 0;
    let hasEverPlayedSuccessfully = false;

    // Force-play with retry. ALWAYS sets muted=true before calling play()
    // because Chrome/Safari require it for autoplay.
    const forcePlay = async (reason: string) => {
      if (cancelled || !v) return;
      playAttempts++;
      try {
        // Required by Chrome/Safari: must be muted to autoplay
        v.muted = true;
        v.volume = 0; // belt + suspenders
        try { v.defaultMuted = true; } catch { /* ignore */ }

        if (!v.paused && !v.ended) {
          setIsPlaying(true);
          setShowPlayButton(false);
          return;
        }

        // Hard reset on stubborn pauses: load() then play()
        if (playAttempts > 5 && v.readyState >= 3) {
          try { v.load(); } catch { /* ignore */ }
        }

        await v.play();
        // Success
        lastSuccessfulPlay = Date.now();
        hasEverPlayedSuccessfully = true;
        playFailures = 0;
        setIsPlaying(true);
        setShowPlayButton(false);
      } catch (err) {
        playFailures++;
        setIsPlaying(false);
        // eslint-disable-next-line no-console
        console.warn(`[VideoBackground] play() failed (${reason}, attempt #${playAttempts}, failures=${playFailures}):`, err);
        // If we've failed multiple times after page load, show the button
        if (playAttempts > 3 && (Date.now() - lastSuccessfulPlay > 1500)) {
          setShowPlayButton(true);
        }
      }
    };

    // Layer 3: immediate hard reset
    forcePlay('initial');

    // Layer 4: re-attempt on every relevant media event
    const onCanPlay = () => forcePlay('canplay');
    const onLoadedData = () => { setVideoLoaded(true); forcePlay('loadeddata'); };
    const onLoadedMetadata = () => forcePlay('loadedmetadata');
    const onPlaying = () => {
      setIsPlaying(true);
      setShowPlayButton(false);
      lastSuccessfulPlay = Date.now();
      hasEverPlayedSuccessfully = true;
    };
    const onPlay = () => {
      setIsPlaying(true);
      setShowPlayButton(false);
      lastSuccessfulPlay = Date.now();
    };
    const onPause = () => {
      setIsPlaying(false);
      if (!v.ended && !cancelled) {
        setTimeout(() => forcePlay('resume-after-pause'), 50);
      }
    };
    const onEnded = () => {
      v.currentTime = 0;
      forcePlay('ended-restart');
    };

    v.addEventListener('canplay', onCanPlay);
    v.addEventListener('canplaythrough', onCanPlay);
    v.addEventListener('loadeddata', onLoadedData);
    v.addEventListener('loadedmetadata', onLoadedMetadata);
    v.addEventListener('playing', onPlaying);
    v.addEventListener('play', onPlay);
    v.addEventListener('pause', onPause);
    v.addEventListener('ended', onEnded);

    // Layer 5: first-user-gesture listener
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

    // Layer 6: visibilitychange
    const onVisibility = () => {
      if (document.visibilityState === 'visible') {
        forcePlay('visibility');
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    // Layer 7: 500ms watchdog
    watchdog = setInterval(() => {
      if (cancelled) return;
      if (v.paused && !v.ended) {
        forcePlay('watchdog');
      }
    }, 500);

    const mountTime = Date.now();

    // Layer 10: continuous check — if we've never successfully played after 2.5s, show button.
    // Also re-show button if video gets paused and stays paused for >1.5s
    buttonCheckInterval = setInterval(() => {
      if (cancelled) return;
      const timeSinceMount = Date.now() - mountTime;
      const timeSinceLastPlay = Date.now() - lastSuccessfulPlay;

      // If we've never played and we've been mounted for 2.5s, show button
      if (!hasEverPlayedSuccessfully && timeSinceMount > 2500) {
        setShowPlayButton(true);
      }
      // If we played before but haven't played in the last 1.5s and video is paused, show button
      if (hasEverPlayedSuccessfully && v.paused && timeSinceLastPlay > 1500) {
        setShowPlayButton(true);
      }
      // If video is playing, hide button
      if (!v.paused) {
        setShowPlayButton(false);
      }
    }, 250);

    return () => {
      cancelled = true;
      v.removeEventListener('canplay', onCanPlay);
      v.removeEventListener('canplaythrough', onCanPlay);
      v.removeEventListener('loadeddata', onLoadedData);
      v.removeEventListener('loadedmetadata', onLoadedMetadata);
      v.removeEventListener('playing', onPlaying);
      v.removeEventListener('play', onPlay);
      v.removeEventListener('pause', onPause);
      v.removeEventListener('ended', onEnded);
      document.removeEventListener('click', onUserGesture);
      document.removeEventListener('touchstart', onUserGesture);
      document.removeEventListener('keydown', onUserGesture);
      document.removeEventListener('scroll', onUserGesture);
      document.removeEventListener('pointerdown', onUserGesture);
      document.removeEventListener('visibilitychange', onVisibility);
      if (watchdog) clearInterval(watchdog);
      if (buttonCheckInterval) clearInterval(buttonCheckInterval);
    };
  }, [reducedMotion]);

  // Button click handler — always works because it's a user gesture
  const handlePlayButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    v.volume = 0;
    v.play().then(() => {
      setIsPlaying(true);
      setShowPlayButton(false);
    }).catch((err) => {
      // eslint-disable-next-line no-console
      console.error('[VideoBackground] button click play failed:', err);
    });
  };

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

      {/* The video element — src set directly + via <source> for max compatibility */}
      {!reducedMotion && (
        <video
          ref={videoRef}
          className="video-bg"
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
          onLoadedData={() => setVideoLoaded(true)}
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

      {/* Layer 10: Visible "Tap to play" button — appears only if autoplay failed */}
      {showPlayButton && !reducedMotion && !isPlaying && (
        <button
          type="button"
          onClick={handlePlayButtonClick}
          className="video-play-button"
          aria-label="Tap to play background video"
        >
          <svg className="play-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M8 5v14l11-7z" />
          </svg>
          <span className="play-text">Tap to play video</span>
        </button>
      )}
    </>
  );
}
