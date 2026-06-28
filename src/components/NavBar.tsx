'use client';

import { useState, useEffect } from 'react';
import { useLang, LANGUAGES } from '@/lib/i18n';

/**
 * Shared Navigation Bar — used on ALL pages.
 * Sticky at top, shows on every route.
 */
export default function NavBar() {
  const { t, lang, setLang } = useLang();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navLinks = [
    { label: t('nav.experiences'), href: '/experiences' },
    { label: t('nav.trekking'), href: '/trekking' },
    { label: t('nav.about'), href: '/about' },
    { label: t('nav.stories'), href: '/stories' },
    { label: t('nav.contact'), href: '/contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 nav-blur ${scrolled ? 'nav-scrolled' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-18">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <svg className="w-8 h-8" viewBox="0 0 32 32" fill="none">
              <path d="M16 4L4 28h24L16 4z" fill="#d4a853" opacity="0.8"/>
              <path d="M16 4L22 16L16 14L10 16L16 4z" fill="#f0d68a" opacity="0.6"/>
              <path d="M12 28L18 18L24 28" fill="#a07830" opacity="0.3"/>
            </svg>
            <span className="font-cinematic text-lg font-bold tracking-tight">Himalayan <span className="text-golden-shimmer">Exploration</span></span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-7">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="nav-link-rainbow text-sm text-white/90 hover:text-white transition-colors font-display">{link.label}</a>
            ))}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {/* Language */}
            <div className="relative">
              <button onClick={() => setShowLanguageDropdown(!showLanguageDropdown)} className="lang-switcher">
                <span>{LANGUAGES.find(l => l.code === lang)?.flag}</span>
                <span>{lang}</span>
                <svg className="w-3 h-3" viewBox="0 0 12 12"><path d="M3 5l3 3 3-3" stroke="currentColor" strokeWidth="1.5" fill="none"/></svg>
              </button>
              {showLanguageDropdown && (
                <div className="absolute top-full right-0 mt-1 glass-card-strong p-1 min-w-[140px] z-50">
                  {LANGUAGES.map((l) => (
                    <button key={l.code} onClick={() => { setLang(l.code); setShowLanguageDropdown(false); }} className={`flex items-center gap-2 w-full text-left px-3 py-2 text-xs rounded transition-colors ${lang === l.code ? 'text-himalaya-gold bg-himalaya-gold/10' : 'text-white/80 hover:text-white hover:bg-white/5'}`}>
                      <span>{l.flag}</span>
                      <span>{l.label}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* CTA */}
            <a href="/trekking" className="btn-cinematic !text-xs !py-2 !px-4">{t('nav.book')}</a>
          </div>

          {/* Mobile hamburger */}
          <button className="md:hidden p-2 text-white" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              {mobileMenuOpen ? <path d="M6 6l12 12M6 18L18 6"/> : <><path d="M4 6h16M4 12h16M4 18h16"/></>}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-card-strong border-t border-white/5 p-4 space-y-3">
          {navLinks.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className="block text-sm text-white/90 hover:text-himalaya-gold py-2 transition-colors">{link.label}</a>
          ))}
          <div className="flex gap-2 pt-2 border-t border-white/5 flex-wrap">
            {LANGUAGES.map((l) => (
              <button key={l.code} onClick={() => setLang(l.code)} className={`text-xs px-3 py-1.5 rounded ${lang === l.code ? 'bg-himalaya-gold/20 text-himalaya-gold' : 'text-white/85'}`}>{l.flag} {l.code}</button>
            ))}
          </div>
          <a href="/trekking" className="btn-cinematic w-full !text-sm block text-center">{t('nav.book')}</a>
        </div>
      )}
    </nav>
  );
}
