'use client'

import { useEffect, useRef, useState, useCallback } from 'react'

/* ──────────────────────────────────────────────
   SVG Components
   ────────────────────────────────────────────── */

function MountainLogo() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 4L4 30H32L18 4Z" fill="url(#logo-grad)" />
      <path d="M18 4L11 17L25 17L18 4Z" fill="rgba(255,255,255,0.15)" />
      <path d="M18 4L14.5 10.5L21.5 10.5L18 4Z" fill="rgba(255,255,255,0.1)" />
      <defs>
        <linearGradient id="logo-grad" x1="18" y1="4" x2="18" y2="30" gradientUnits="userSpaceOnUse">
          <stop stopColor="#d4a853" />
          <stop offset="1" stopColor="#a07830" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function HeroSVGBackground() {
  return (
    <div className="pattern-overlay">
      {/* Dot grid */}
      <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="dot-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="white" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dot-grid)" />
      </svg>

      {/* Geometric mountain shapes */}
      <svg className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] opacity-[0.06] animate-float-slow" viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M300 100L500 450H100L300 100Z" stroke="#d4a853" strokeWidth="1" fill="none" />
        <path d="M300 160L440 420H160L300 160Z" stroke="#d4a853" strokeWidth="0.5" fill="none" />
        <path d="M300 220L380 390H220L300 220Z" stroke="#d4a853" strokeWidth="0.3" fill="none" />
        <circle cx="300" cy="100" r="4" fill="#d4a853" opacity="0.5" />
      </svg>

      {/* Abstract circles */}
      <svg className="absolute left-[10%] top-[20%] w-[300px] h-[300px] opacity-[0.04] animate-float-delay-1" viewBox="0 0 300 300" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="150" cy="150" r="120" stroke="#d4a853" strokeWidth="0.5" strokeDasharray="4 8" className="animate-dash" />
        <circle cx="150" cy="150" r="80" stroke="#4a90d9" strokeWidth="0.5" strokeDasharray="3 6" className="animate-dash" />
        <circle cx="150" cy="150" r="40" stroke="#2dd4bf" strokeWidth="0.5" />
      </svg>

      {/* Gradient orbs */}
      <div className="absolute top-[15%] right-[15%] w-[400px] h-[400px] rounded-full bg-gradient-to-br from-[#d4a853]/[0.04] to-transparent blur-3xl animate-pulse-glow" />
      <div className="absolute bottom-[20%] left-[10%] w-[300px] h-[300px] rounded-full bg-gradient-to-tr from-[#4a90d9]/[0.03] to-transparent blur-3xl animate-pulse-glow" style={{ animationDelay: '2s' }} />
    </div>
  )
}

function FeatureSVG1() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-60 group-hover:opacity-100 transition-opacity duration-500">
      <path d="M40 10L60 50H20L40 10Z" stroke="#d4a853" strokeWidth="1.5" fill="none" />
      <path d="M40 20L52 45H28L40 20Z" stroke="#d4a853" strokeWidth="0.8" fill="rgba(212,168,83,0.05)" />
      <circle cx="40" cy="10" r="3" fill="#d4a853" opacity="0.5" />
      <path d="M15 55H65" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
      <path d="M20 60H60" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
    </svg>
  )
}

function FeatureSVG2() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-60 group-hover:opacity-100 transition-opacity duration-500">
      <circle cx="40" cy="35" r="18" stroke="#2dd4bf" strokeWidth="1.5" fill="none" />
      <circle cx="40" cy="35" r="10" stroke="#2dd4bf" strokeWidth="0.8" fill="rgba(45,212,191,0.05)" />
      <circle cx="40" cy="35" r="3" fill="#2dd4bf" opacity="0.5" />
      <path d="M40 17V12" stroke="#2dd4bf" strokeWidth="1" opacity="0.4" />
      <path d="M40 53V58" stroke="#2dd4bf" strokeWidth="1" opacity="0.4" />
      <path d="M22 35H17" stroke="#2dd4bf" strokeWidth="1" opacity="0.4" />
      <path d="M58 35H63" stroke="#2dd4bf" strokeWidth="1" opacity="0.4" />
      <path d="M25 60H55" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
    </svg>
  )
}

function FeatureSVG3() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-60 group-hover:opacity-100 transition-opacity duration-500">
      <rect x="15" y="20" width="50" height="35" rx="4" stroke="#4a90d9" strokeWidth="1.5" fill="none" />
      <rect x="20" y="25" width="18" height="12" rx="2" stroke="#4a90d9" strokeWidth="0.8" fill="rgba(74,144,217,0.05)" />
      <rect x="42" y="25" width="18" height="5" rx="1" stroke="#4a90d9" strokeWidth="0.5" fill="none" />
      <rect x="42" y="33" width="12" height="3" rx="1" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" fill="none" />
      <rect x="20" y="42" width="40" height="8" rx="2" stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" fill="none" />
    </svg>
  )
}

function FeatureSVG4() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-60 group-hover:opacity-100 transition-opacity duration-500">
      <path d="M20 55L30 35L38 45L50 20L60 55" stroke="#d4a853" strokeWidth="1.5" fill="none" strokeLinejoin="round" />
      <circle cx="30" cy="35" r="2.5" fill="#d4a853" opacity="0.6" />
      <circle cx="50" cy="20" r="2.5" fill="#d4a853" opacity="0.6" />
      <path d="M15 58H65" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5" />
      <path d="M20 63H60" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" strokeDasharray="3 3" />
    </svg>
  )
}

function ShowcaseSVG() {
  return (
    <svg viewBox="0 0 500 350" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
      {/* Mountain landscape */}
      <defs>
        <linearGradient id="sky-grad" x1="250" y1="0" x2="250" y2="350" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0a0a0a" />
          <stop offset="0.5" stopColor="#111118" />
          <stop offset="1" stopColor="#0d1117" />
        </linearGradient>
        <linearGradient id="mountain1" x1="250" y1="80" x2="250" y2="280" gradientUnits="userSpaceOnUse">
          <stop stopColor="#1a1a2e" />
          <stop offset="1" stopColor="#0f0f1a" />
        </linearGradient>
        <linearGradient id="mountain2" x1="150" y1="120" x2="150" y2="280" gradientUnits="userSpaceOnUse">
          <stop stopColor="#16213e" />
          <stop offset="1" stopColor="#0a0a14" />
        </linearGradient>
        <linearGradient id="snow-grad" x1="250" y1="80" x2="250" y2="120" gradientUnits="userSpaceOnUse">
          <stop stopColor="rgba(255,255,255,0.2)" />
          <stop offset="1" stopColor="transparent" />
        </linearGradient>
      </defs>

      {/* Sky background */}
      <rect width="500" height="350" rx="12" fill="url(#sky-grad)" />

      {/* Stars */}
      {[
        { x: 50, y: 30 }, { x: 120, y: 55 }, { x: 200, y: 20 },
        { x: 280, y: 45 }, { x: 350, y: 25 }, { x: 420, y: 50 },
        { x: 460, y: 15 }, { x: 80, y: 70 }, { x: 310, y: 70 },
        { x: 380, y: 65 }, { x: 160, y: 80 },
      ].map((s, i) => (
        <circle key={i} cx={s.x} cy={s.y} r={i % 3 === 0 ? 1 : 0.5} fill="white" opacity={0.3 + (i * 0.07) % 0.4} />
      ))}

      {/* Moon */}
      <circle cx="400" cy="60" r="18" fill="rgba(212,168,83,0.15)" />
      <circle cx="400" cy="60" r="15" fill="rgba(212,168,83,0.1)" />
      <circle cx="400" cy="60" r="10" fill="rgba(255,255,255,0.08)" />

      {/* Far mountains */}
      <path d="M0 220L80 140L140 180L200 120L260 160L320 100L380 150L440 130L500 170V280H0Z" fill="url(#mountain2)" opacity="0.6" />

      {/* Main mountain */}
      <path d="M0 280L100 180L160 210L250 90L340 200L400 170L500 220V280H0Z" fill="url(#mountain1)" />

      {/* Snow caps */}
      <path d="M240 95L250 90L260 95L255 100L250 98L245 100Z" fill="rgba(255,255,255,0.15)" />
      <path d="M320 105L340 100L350 110L345 112L340 108Z" fill="rgba(255,255,255,0.08)" />

      {/* Foreground */}
      <path d="M0 260L60 240L130 255L200 235L280 250L360 238L440 252L500 245V350H0Z" fill="#050508" />

      {/* Lake reflection */}
      <rect x="100" y="270" width="300" height="30" rx="2" fill="rgba(74,144,217,0.03)" />
      <path d="M120 278H380" stroke="rgba(74,144,217,0.08)" strokeWidth="0.5" />
      <path d="M150 285H350" stroke="rgba(74,144,217,0.05)" strokeWidth="0.5" />
      <path d="M180 292H320" stroke="rgba(74,144,217,0.03)" strokeWidth="0.5" />

      {/* Border glow */}
      <rect width="500" height="350" rx="12" stroke="rgba(255,255,255,0.06)" strokeWidth="1" fill="none" />
    </svg>
  )
}

function FloatingUICard({ className, delay }: { className?: string; delay?: string }) {
  return (
    <div
      className={`glass-card-strong p-4 absolute ${className}`}
      style={{ animationDelay: delay, animation: `float 6s ease-in-out ${delay || '0s'} infinite` }}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#d4a853]/20 to-[#d4a853]/5 flex items-center justify-center">
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M7 2L10 8H4L7 2Z" fill="#d4a853" opacity="0.7" /></svg>
        </div>
        <div>
          <div className="w-16 h-1.5 bg-white/10 rounded" />
          <div className="w-10 h-1 bg-white/5 rounded mt-1.5" />
        </div>
      </div>
      <div className="space-y-1.5">
        <div className="w-full h-1 bg-white/5 rounded" />
        <div className="w-3/4 h-1 bg-white/5 rounded" />
      </div>
    </div>
  )
}


/* ──────────────────────────────────────────────
   Main Page Component
   ────────────────────────────────────────────── */

export default function Home() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const sectionsRef = useRef<HTMLDivElement>(null)

  /* Scroll detection */
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  /* Intersection Observer for scroll reveals */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
    )

    document.querySelectorAll('.reveal, .reveal-scale').forEach((el) => {
      observer.observe(el)
    })

    return () => observer.disconnect()
  }, [])

  /* Parallax effect */
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (window.innerWidth < 768) return
    const { clientX, clientY } = e
    const x = (clientX / window.innerWidth - 0.5) * 20
    const y = (clientY / window.innerHeight - 0.5) * 20
    const el = document.getElementById('parallax-hero')
    if (el) {
      el.style.transform = `translate(${x}px, ${y}px)`
    }
  }, [])

  return (
    <div className="min-h-screen bg-black text-white font-sans" onMouseMove={handleMouseMove}>
      {/* ═══════ NAVIGATION ═══════ */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 nav-blur ${
          scrolled ? 'nav-scrolled' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-2.5 group">
            <MountainLogo />
            <span className="text-lg font-semibold tracking-tight">
              <span className="gradient-text">Himalayan</span>
              <span className="text-white/80 ml-1">Explorer</span>
            </span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {['Destinations', 'Experiences', 'Pricing', 'Stories'].map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase()}`}
                className="text-sm text-white/50 hover:text-white transition-colors duration-300 relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-[#d4a853] group-hover:w-full transition-all duration-300" />
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:block">
            <button className="btn-primary text-sm">Book Expedition</button>
          </div>

          {/* Mobile menu toggle */}
          <button
            className="md:hidden flex flex-col gap-1.5 p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span className={`w-5 h-px bg-white/70 transition-all ${mobileMenuOpen ? 'rotate-45 translate-y-[3.5px]' : ''}`} />
            <span className={`w-5 h-px bg-white/70 transition-all ${mobileMenuOpen ? 'opacity-0' : ''}`} />
            <span className={`w-5 h-px bg-white/70 transition-all ${mobileMenuOpen ? '-rotate-45 -translate-y-[3.5px]' : ''}`} />
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden glass-card-strong mx-4 mb-4 p-6" style={{ animation: 'fade-in-up 0.3s ease' }}>
            <div className="flex flex-col gap-4">
              {['Destinations', 'Experiences', 'Pricing', 'Stories'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-white/60 hover:text-white transition-colors text-sm"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item}
                </a>
              ))}
              <button className="btn-primary text-sm mt-2 w-full">Book Expedition</button>
            </div>
          </div>
        )}
      </nav>

      {/* ═══════ HERO SECTION ═══════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <HeroSVGBackground />

        {/* Hero content */}
        <div id="parallax-hero" className="relative z-10 max-w-5xl mx-auto px-6 text-center" style={{ transition: 'transform 0.3s ease-out' }}>
          {/* Category pill */}
          <div style={{ animation: 'fade-in-up 0.6s ease' }}>
            <span className="category-pill">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1L9 6H3L6 1Z" fill="#d4a853" /></svg>
              Premium Himalayan Expeditions
            </span>
          </div>

          {/* Headline */}
          <h1
            className="mt-8 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] tracking-tight"
            style={{ animation: 'fade-in-up 0.8s ease 0.1s both' }}
          >
            Discover the Roof
            <br />
            of the{' '}
            <span className="gradient-text">World</span>
          </h1>

          {/* Subheadline */}
          <p
            className="mt-6 text-base sm:text-lg text-white/40 max-w-2xl mx-auto leading-relaxed"
            style={{ animation: 'fade-in-up 0.8s ease 0.2s both' }}
          >
            Curated expeditions through the highest peaks on Earth. From Everest Base Camp to
            hidden valleys of Bhutan, experience the Himalayas like never before.
          </p>

          {/* CTA Buttons */}
          <div
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            style={{ animation: 'fade-in-up 0.8s ease 0.3s both' }}
          >
            <button className="btn-primary px-8 py-3.5" onClick={() => document.getElementById('destinations')?.scrollIntoView({ behavior: 'smooth' })}>Explore Expeditions</button>
            <button className="btn-outline px-8 py-3.5">Watch Documentary</button>
          </div>

          {/* Stats row */}
          <div
            className="mt-16 flex flex-wrap items-center justify-center gap-8 sm:gap-16"
            style={{ animation: 'fade-in-up 0.8s ease 0.4s both' }}
          >
            {[
              { value: '8,849m', label: 'Highest Peak' },
              { value: '150+', label: 'Expeditions' },
              { value: '12', label: 'Countries' },
              { value: '98%', label: 'Satisfaction' },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-xl sm:text-2xl font-bold gradient-text">{stat.value}</div>
                <div className="text-xs text-white/30 mt-1 uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="text-[10px] uppercase tracking-[0.2em] text-white/50">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent" />
        </div>
      </section>

      {/* ═══════ FEATURE GRID ═══════ */}
      <section id="experiences" className="relative py-24 sm:py-32">
        {/* Background pattern */}
        <div className="pattern-overlay">
          <svg className="absolute inset-0 w-full h-full opacity-[0.02]" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="line-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                <path d="M0 30H60" stroke="white" strokeWidth="0.5" />
                <path d="M30 0V60" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#line-pattern)" />
          </svg>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          {/* Section header */}
          <div className="text-center mb-16 reveal">
            <span className="category-pill mb-4 inline-flex">
              Why Choose Us
            </span>
            <h2 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              Expeditions, <span className="gradient-text">Reimagined</span>
            </h2>
            <p className="mt-4 text-white/40 max-w-xl mx-auto">
              Every journey is meticulously crafted to deliver transformative experiences at the highest altitudes on Earth.
            </p>
          </div>

          {/* Feature cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <FeatureSVG1 />,
                title: 'Expert Guided Treks',
                description: 'Professional mountaineers and local Sherpas lead every expedition with decades of high-altitude experience and intimate knowledge of the terrain.',
              },
              {
                icon: <FeatureSVG2 />,
                title: 'GPS Live Tracking',
                description: 'Real-time location sharing and satellite communication keep your loved ones informed throughout your journey across remote Himalayan passes.',
              },
              {
                icon: <FeatureSVG3 />,
                title: 'Smart Itineraries',
                description: 'AI-optimized schedules adapt to weather patterns, acclimatization needs, and your personal fitness level for the safest and most rewarding experience.',
              },
              {
                icon: <FeatureSVG4 />,
                title: 'Altitude Analytics',
                description: 'Monitor your acclimatization progress with medical-grade data tracking, oxygen level readings, and personalized health recommendations in real-time.',
              },
            ].map((feature, i) => (
              <div
                key={feature.title}
                className="glass-card p-6 group reveal"
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-base font-semibold mb-2 text-white/90 group-hover:text-white transition-colors">
                  {feature.title}
                </h3>
                <p className="text-sm text-white/35 leading-relaxed group-hover:text-white/50 transition-colors">
                  {feature.description}
                </p>
                <div className="mt-4 flex items-center gap-1.5 text-xs text-[#d4a853] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span>Learn more</span>
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M4 2L9 6L4 10" stroke="currentColor" strokeWidth="1.5" /></svg>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ PRODUCT SHOWCASE ═══════ */}
      <section id="destinations" className="relative py-24 sm:py-32 overflow-hidden">
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left: Text */}
            <div className="reveal">
              <span className="category-pill mb-4 inline-flex">
                Featured Experience
              </span>
              <h2 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight leading-tight">
                Everest Base Camp
                <br />
                <span className="gradient-text">Expedition</span>
              </h2>
              <p className="mt-6 text-white/40 leading-relaxed max-w-md">
                Walk in the footsteps of legends on our signature 16-day expedition to the foot of the
                world&apos;s highest peak. Acclimatize in authentic Sherpa villages, cross suspension bridges
                over deep gorges, and witness sunrise over the Khumbu icefall.
              </p>

              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  { label: 'Duration', value: '16 Days' },
                  { label: 'Altitude', value: '5,364m' },
                  { label: 'Difficulty', value: 'Moderate' },
                  { label: 'Group Size', value: 'Max 12' },
                ].map((item) => (
                  <div key={item.label} className="glass-card p-3">
                    <div className="text-xs text-white/30 uppercase tracking-wider">{item.label}</div>
                    <div className="text-sm font-semibold mt-0.5 text-white/80">{item.value}</div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex gap-4">
                <button className="btn-primary">Reserve Spot</button>
                <button className="btn-outline">View Itinerary</button>
              </div>
            </div>

            {/* Right: Showcase with floating elements */}
            <div className="relative reveal-scale">
              {/* Main showcase */}
              <div className="tilt-card glass-card-strong overflow-hidden relative">
                <ShowcaseSVG />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-2xl" />
                {/* Label */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-white/40 uppercase tracking-wider">Nepal</div>
                      <div className="text-sm font-semibold">Everest Region</div>
                    </div>
                    <div className="glass-card px-3 py-1.5 text-xs font-medium text-[#d4a853]">
                      From $4,299
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating UI cards */}
              <FloatingUICard className="top-4 -right-4 w-36 hidden lg:block" delay="0s" />
              <FloatingUICard className="bottom-12 -left-6 w-40 hidden lg:block" delay="2s" />
            </div>
          </div>
        </div>
      </section>

      {/* ═══════ DESTINATIONS GRID ═══════ */}
      <section className="relative py-24 sm:py-32">
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 reveal">
            <span className="category-pill mb-4 inline-flex">
              Popular Destinations
            </span>
            <h2 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              Explore the <span className="gradient-text">Himalayas</span>
            </h2>
            <p className="mt-4 text-white/40 max-w-xl mx-auto">
              From sacred valleys to towering passes, each destination offers a unique window into the soul of the mountains.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                name: 'Annapurna Circuit',
                country: 'Nepal',
                altitude: '5,416m',
                days: '18 Days',
                price: '$3,199',
                gradient: 'from-amber-900/20 to-orange-900/10',
              },
              {
                name: 'Bhutan Dragon Trail',
                country: 'Bhutan',
                altitude: '4,200m',
                days: '12 Days',
                price: '$5,499',
                gradient: 'from-teal-900/20 to-emerald-900/10',
              },
              {
                name: 'K2 Base Camp',
                country: 'Pakistan',
                altitude: '5,150m',
                days: '20 Days',
                price: '$4,899',
                gradient: 'from-blue-900/20 to-indigo-900/10',
              },
            ].map((dest, i) => (
              <div
                key={dest.name}
                className="glass-card overflow-hidden group reveal"
                style={{ transitionDelay: `${i * 0.15}s` }}
              >
                {/* Card image area */}
                <div className={`relative h-48 bg-gradient-to-br ${dest.gradient} overflow-hidden`}>
                  {/* Mountain SVG for card */}
                  <svg className="absolute bottom-0 left-0 w-full h-full opacity-30" viewBox="0 0 400 200" fill="none">
                    <path d="M0 200L80 100L140 140L200 60L260 120L320 80L400 130V200H0Z" fill="rgba(255,255,255,0.05)" />
                    <path d="M0 200L60 130L120 160L180 90L240 140L300 100L400 160V200H0Z" fill="rgba(255,255,255,0.03)" />
                  </svg>
                  {/* Price badge */}
                  <div className="absolute top-4 right-4 glass-card px-3 py-1 text-xs font-semibold text-[#d4a853]">
                    {dest.price}
                  </div>
                  {/* Country tag */}
                  <div className="absolute bottom-4 left-4 text-xs text-white/50 uppercase tracking-wider">
                    {dest.country}
                  </div>
                </div>

                {/* Card content */}
                <div className="p-6">
                  <h3 className="text-lg font-semibold group-hover:text-[#d4a853] transition-colors">
                    {dest.name}
                  </h3>
                  <div className="mt-3 flex items-center gap-4 text-xs text-white/40">
                    <span className="flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M6 1L9 8H3L6 1Z" fill="#d4a853" opacity="0.5" /></svg>
                      {dest.altitude}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><circle cx="6" cy="6" r="4" stroke="white" strokeWidth="0.5" opacity="0.3" /><path d="M6 4V6L7.5 7" stroke="white" strokeWidth="0.5" opacity="0.3" /></svg>
                      {dest.days}
                    </span>
                  </div>
                  <button className="mt-4 text-xs text-[#d4a853] flex items-center gap-1 group/btn opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    View Details
                    <svg width="10" height="10" viewBox="0 0 10 10" fill="none" className="group-hover/btn:translate-x-0.5 transition-transform"><path d="M3 2L7 5L3 8" stroke="currentColor" strokeWidth="1.2" /></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ TESTIMONIALS ═══════ */}
      <section className="relative py-24 sm:py-32">
        <div className="pattern-overlay">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-[#d4a853]/[0.03] to-transparent blur-3xl" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 reveal">
            <span className="category-pill mb-4 inline-flex">
              Testimonials
            </span>
            <h2 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              Voices from the <span className="gradient-text">Trail</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                quote: 'The EBC expedition changed my life. The guides were incredible — professional, caring, and deeply knowledgeable about every step of the journey.',
                name: 'Sarah Chen',
                role: 'EBC Expedition 2024',
                avatar: 'SC',
              },
              {
                quote: 'From the moment I landed in Kathmandu to the final sunrise at Kala Patthar, every detail was perfectly orchestrated. This is adventure at its finest.',
                name: 'Marcus Weber',
                role: 'Annapurna Circuit',
                avatar: 'MW',
              },
              {
                quote: 'Bhutan was beyond anything I imagined. The monasteries, the trails, the people — Himalayan Explorer delivered an experience that exceeded every expectation.',
                name: 'Priya Sharma',
                role: 'Dragon Trail Expedition',
                avatar: 'PS',
              },
            ].map((t, i) => (
              <div
                key={t.name}
                className="glass-card p-6 reveal"
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                {/* Stars */}
                <div className="flex gap-0.5 mb-4">
                  {[...Array(5)].map((_, s) => (
                    <svg key={s} width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <path d="M7 1L8.8 4.8L13 5.4L10 8.3L10.7 12.5L7 10.5L3.3 12.5L4 8.3L1 5.4L5.2 4.8L7 1Z" fill="#d4a853" opacity="0.6" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-white/50 leading-relaxed italic">&ldquo;{t.quote}&rdquo;</p>
                <div className="mt-5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#d4a853]/20 to-[#d4a853]/5 flex items-center justify-center text-xs font-semibold text-[#d4a853]">
                    {t.avatar}
                  </div>
                  <div>
                    <div className="text-sm font-medium">{t.name}</div>
                    <div className="text-xs text-white/30">{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ PRICING ═══════ */}
      <section id="pricing" className="relative py-24 sm:py-32">
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="text-center mb-16 reveal">
            <span className="category-pill mb-4 inline-flex">
              Pricing Plans
            </span>
            <h2 className="mt-6 text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
              Choose Your <span className="gradient-text">Adventure</span>
            </h2>
            <p className="mt-4 text-white/40 max-w-xl mx-auto">
              Flexible plans designed for every level of explorer, from first-time trekkers to seasoned mountaineers.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              {
                name: 'Explorer',
                price: '$2,499',
                period: 'per expedition',
                features: ['Guided group trek', 'Basic accommodation', 'Meals included', 'Emergency support', 'Group equipment'],
                highlight: false,
              },
              {
                name: 'Adventurer',
                price: '$4,999',
                period: 'per expedition',
                features: ['Private guide', 'Premium lodges', 'All meals & drinks', 'Satellite phone', 'Personal porter', 'Photo package'],
                highlight: true,
              },
              {
                name: 'Summit',
                price: '$8,999',
                period: 'per expedition',
                features: ['Elite mountaineer guide', 'Luxury base camps', 'Gourmet dining', 'Helicopter evacuation', 'Custom itinerary', 'Documentary film', 'Lifetime membership'],
                highlight: false,
              },
            ].map((plan, i) => (
              <div
                key={plan.name}
                className={`glass-card p-6 relative reveal ${
                  plan.highlight
                    ? 'border-[#d4a853]/30 shadow-[0_0_60px_rgba(212,168,83,0.08)]'
                    : ''
                }`}
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                {plan.highlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#d4a853] text-black text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <div className="text-sm font-medium text-white/60">{plan.name}</div>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-3xl font-bold gradient-text">{plan.price}</span>
                  <span className="text-xs text-white/30">{plan.period}</span>
                </div>
                <div className="mt-6 space-y-3">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-center gap-2.5 text-sm text-white/50">
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M3 7L6 10L11 4" stroke="#d4a853" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                      {f}
                    </div>
                  ))}
                </div>
                <button
                  className={`mt-6 w-full py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    plan.highlight
                      ? 'bg-[#d4a853] text-black hover:bg-[#e0b85e]'
                      : 'bg-white/5 text-white/70 hover:bg-white/10 border border-white/10'
                  }`}
                >
                  Get Started
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CTA SECTION ═══════ */}
      <section className="relative py-24 sm:py-32 overflow-hidden">
        <div className="pattern-overlay">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-br from-[#d4a853]/[0.04] to-transparent blur-3xl" />
          <svg className="absolute right-0 top-0 w-[400px] h-[400px] opacity-[0.03] animate-float-slow" viewBox="0 0 400 400" fill="none">
            <path d="M200 50L350 300H50L200 50Z" stroke="white" strokeWidth="1" fill="none" />
            <path d="M200 100L300 280H100L200 100Z" stroke="white" strokeWidth="0.5" fill="none" />
          </svg>
        </div>

        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center reveal">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight">
            Ready to Reach <span className="gradient-text">New Heights</span>?
          </h2>
          <p className="mt-6 text-white/40 max-w-lg mx-auto leading-relaxed">
            Join thousands of adventurers who have discovered the transformative power of the Himalayas.
            Your next great story starts here.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="btn-primary px-10 py-4 text-base">Start Your Journey</button>
            <button className="btn-outline px-10 py-4 text-base">Talk to an Expert</button>
          </div>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="border-t border-white/[0.04] py-16 mt-auto">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
            {/* Brand */}
            <div className="col-span-2 md:col-span-1">
              <a href="#" className="flex items-center gap-2.5 mb-4">
                <MountainLogo />
                <span className="text-base font-semibold">
                  <span className="gradient-text">Himalayan</span>
                  <span className="text-white/80 ml-1">Explorer</span>
                </span>
              </a>
              <p className="text-xs text-white/30 leading-relaxed max-w-[200px]">
                Curating extraordinary Himalayan adventures since 2015. Trusted by over 5,000 explorers worldwide.
              </p>
            </div>

            {/* Links */}
            {[
              { title: 'Expeditions', links: ['Everest Base Camp', 'Annapurna Circuit', 'K2 Base Camp', 'Bhutan Dragon Trail'] },
              { title: 'Company', links: ['About Us', 'Our Team', 'Careers', 'Press'] },
              { title: 'Support', links: ['Help Center', 'Contact', 'Safety', 'Terms'] },
            ].map((col) => (
              <div key={col.title}>
                <div className="text-xs font-semibold uppercase tracking-wider text-white/50 mb-3">{col.title}</div>
                <div className="space-y-2">
                  {col.links.map((link) => (
                    <a key={link} href="#" className="block text-xs text-white/25 hover:text-white/60 transition-colors">
                      {link}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/[0.04] pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="text-xs text-white/20">
              &copy; {new Date().getFullYear()} Himalayan Explorer. All rights reserved.
            </div>
            <div className="flex items-center gap-4">
              {['Privacy', 'Terms', 'Cookies'].map((item) => (
                <a key={item} href="#" className="text-xs text-white/20 hover:text-white/40 transition-colors">
                  {item}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
