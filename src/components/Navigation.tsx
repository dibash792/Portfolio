import React, { useState, useEffect } from 'react';
import { Globe, Sparkles, Menu, X, ArrowUpRight } from 'lucide-react';
import type { Language, Theme } from '../types';
import { translations } from '../i18n/translations';

interface NavigationProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  theme: Theme;
  onThemeChange: (theme: Theme) => void;
  onReplayIntro: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  language,
  onLanguageChange,
  theme,
  onThemeChange,
  onReplayIntro,
}) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const t = translations[language].nav;
  const isViolet = theme === 'warm-violet' || theme === 'light';

  useEffect(() => {
    const sections = ['hero', 'about', 'projects', 'skills', 'journey', 'yoga', 'speaking', 'contact'];

    const handleScroll = () => {
      setScrolled(window.scrollY > 40);

      const scrollPos = window.scrollY + 220;
      for (let i = sections.length - 1; i >= 0; i--) {
        const el = document.getElementById(sections[i]);
        if (el && el.offsetTop <= scrollPos) {
          setActiveSection(sections[i]);
          break;
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: '#about', label: t.about },
    { href: '#projects', label: t.projects },
    { href: '#skills', label: t.skills },
    { href: '#journey', label: t.journey },
    { href: '#yoga', label: t.innerWorld, highlight: true },
    { href: '#speaking', label: t.speaking },
    { href: '#contact', label: t.contact },
  ];

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        padding: scrolled ? '0.75rem 0' : '1.25rem 0',
        transition: 'padding 0.3s ease, background 0.4s ease, border-color 0.4s ease',
        background: scrolled
          ? 'var(--bg-card)'
          : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled
          ? '1px solid var(--border-subtle)'
          : '1px solid transparent',
      }}
    >
      <div className="container-custom" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* Brand / Name */}
        <a
          href="#"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            fontFamily: 'var(--font-heading)',
            fontWeight: 800,
            fontSize: '1.15rem',
            letterSpacing: '-0.02em',
          }}
        >
          <div
            style={{
              width: '10px',
              height: '10px',
              borderRadius: '50%',
              background: 'var(--accent-cyan)',
              boxShadow: '0 0 10px var(--accent-cyan)',
              animation: 'pulseDot 2s infinite ease-in-out',
            }}
          />
          <span>DIBASH<span style={{ color: 'var(--accent-cyan)' }}>.L</span></span>
        </a>

        {/* Desktop Nav Links */}
        <nav
          style={{
            display: 'none',
            alignItems: 'center',
            gap: '1.75rem',
          }}
          className="desktop-nav"
        >
          {navLinks.map((link) => {
            const isActive = activeSection === link.href.slice(1);
            return (
              <a
                key={link.href}
                href={link.href}
                style={{
                  position: 'relative',
                  fontSize: '0.88rem',
                  fontWeight: isActive ? 600 : 500,
                  color: isActive
                    ? link.highlight
                      ? 'var(--yoga-accent)'
                      : 'var(--accent-cyan)'
                    : link.highlight
                    ? 'var(--yoga-accent)'
                    : 'var(--text-secondary)',
                  transition: 'color 0.2s ease, transform 0.2s ease',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.25rem',
                  padding: '0.25rem 0',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = link.highlight ? 'var(--yoga-accent)' : 'var(--accent-cyan)';
                  e.currentTarget.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = isActive
                    ? link.highlight
                      ? 'var(--yoga-accent)'
                      : 'var(--accent-cyan)'
                    : link.highlight
                    ? 'var(--yoga-accent)'
                    : 'var(--text-secondary)';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                {link.label}
                {link.highlight && !isActive && (
                  <span
                    style={{
                      display: 'inline-block',
                      width: '6px',
                      height: '6px',
                      borderRadius: '50%',
                      background: 'var(--yoga-accent)',
                    }}
                  />
                )}
                {/* Active Indicator Underline */}
                {isActive && (
                  <span
                    style={{
                      position: 'absolute',
                      bottom: '-4px',
                      left: '0',
                      right: '0',
                      height: '2px',
                      borderRadius: '2px',
                      background: link.highlight ? 'var(--yoga-accent)' : 'var(--accent-cyan)',
                      boxShadow: link.highlight
                        ? '0 0 8px var(--yoga-accent)'
                        : '0 0 8px var(--accent-cyan)',
                      animation: 'activeLineIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                  />
                )}
              </a>
            );
          })}
        </nav>

        {/* Action Controls: Language, Theme, Replay Intro */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          {/* Replay Intro Trigger */}
          <button
            onClick={onReplayIntro}
            title={t.replayIntro}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.45rem 0.75rem',
              fontSize: '0.75rem',
              fontFamily: 'var(--font-mono)',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-full)',
              color: 'var(--accent-cyan)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent-cyan)')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
          >
            <Sparkles size={13} />
            <span className="desktop-only">{t.replayIntro}</span>
          </button>

          {/* Language Switcher */}
          <button
            onClick={() => onLanguageChange(language === 'en' ? 'np' : 'en')}
            title="Toggle Language (English / नेपाली)"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.45rem 0.75rem',
              fontSize: '0.8rem',
              fontWeight: 600,
              fontFamily: 'var(--font-mono)',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-full)',
              color: 'var(--text-primary)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent-cyan)')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
          >
            <Globe size={14} color="var(--accent-cyan)" />
            <span>{language === 'en' ? 'नेपाली' : 'EN'}</span>
          </button>

          {/* Color-Atmosphere Switcher */}
          <button
            onClick={() => onThemeChange(isViolet ? 'cool-blue' : 'warm-violet')}
            title={isViolet ? 'Atmosphere: Warm Violet (Click for Cool Blue)' : 'Atmosphere: Cool Blue (Click for Warm Violet)'}
            aria-label={isViolet ? 'Atmosphere: Warm Violet (Click for Cool Blue)' : 'Atmosphere: Cool Blue (Click for Warm Violet)'}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '38px',
              height: '38px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '50%',
              color: 'var(--accent-cyan)',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-cyan)';
              e.currentTarget.style.boxShadow = '0 0 14px var(--accent-cyan-glow)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
              e.currentTarget.style.boxShadow = 'none';
            }}
          >
            {isViolet ? (
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #c084fc, #e879f9)',
                  boxShadow: '0 0 10px rgba(192, 132, 252, 0.7)',
                }}
              />
            ) : (
              <span
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '18px',
                  height: '18px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #00f2fe, #3b82f6)',
                  boxShadow: '0 0 10px rgba(0, 242, 254, 0.7)',
                }}
              />
            )}
          </button>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="mobile-menu-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '36px',
              height: '36px',
              background: 'var(--bg-card)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '50%',
              color: 'var(--text-primary)',
            }}
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div
          style={{
            position: 'fixed',
            top: '64px',
            left: 0,
            right: 0,
            bottom: 0,
            background: 'var(--hero-surface)',
            backdropFilter: 'blur(20px)',
            display: 'flex',
            flexDirection: 'column',
            padding: '2.5rem 1.5rem',
            gap: '1.5rem',
            zIndex: 999,
          }}
        >
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              style={{
                fontSize: '1.25rem',
                fontWeight: 600,
                color: link.highlight ? 'var(--yoga-accent)' : 'var(--text-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                paddingBottom: '0.75rem',
                borderBottom: '1px solid var(--border-subtle)',
              }}
            >
              <span>{link.label}</span>
              <ArrowUpRight size={18} />
            </a>
          ))}
        </div>
      )}

      <style>{`
        @media (min-width: 900px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
        }
        @media (max-width: 600px) {
          .desktop-only {
            display: none;
          }
        }
        @keyframes pulseDot {
          0% { transform: scale(0.9); opacity: 0.7; }
          50% { transform: scale(1.2); opacity: 1; }
          100% { transform: scale(0.9); opacity: 0.7; }
        }
      `}</style>
    </header>
  );
};
