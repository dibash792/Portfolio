import React, { useRef, useState, useEffect, useMemo } from 'react';
import { ArrowDown, Sparkles, BookOpen, Compass } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';
import type { Language, Theme } from '../types';
import type { IntroPhase } from '../App';
import { translations } from '../i18n/translations';
import { Magnetic } from './motion/Magnetic';
import { ScrollHighlightText } from './motion/ScrollHighlightText';
import { HeroInteractiveBlocks } from './HeroInteractiveBlocks';

interface HeroProps {
  language: Language;
  theme?: Theme;
  introPhase?: IntroPhase;
}

export const Hero: React.FC<HeroProps> = ({ language, theme = 'dark', introPhase = 'revealed' }) => {
  const t = translations[language].hero;
  const cardRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, glowX: 50, glowY: 50 });
  const [revealedStep, setRevealedStep] = useState(() => (introPhase === 'revealed' ? 7 : 0));

  // Sequence timing triggers when introPhase transitions to 'transitioning' or 'revealed'
  useEffect(() => {
    if (introPhase === 'revealed') {
      setRevealedStep(7);
      return;
    }

    if (introPhase === 'transitioning') {
      // Staged reveal sequence over ~2.1 seconds
      const timers: ReturnType<typeof setTimeout>[] = [];
      const steps = [
        { step: 1, delay: 100 },  // Status badge & personal identifier
        { step: 2, delay: 280 },  // Greeting & Name
        { step: 3, delay: 550 },  // Headline word-by-word
        { step: 4, delay: 1100 }, // Supporting text
        { step: 5, delay: 1400 }, // Action links (CTAs)
        { step: 6, delay: 1750 }, // Floating 3D HUD badges & verified links
        { step: 7, delay: 2100 }, // Scroll cue
      ];

      steps.forEach(({ step, delay }) => {
        const timer = setTimeout(() => {
          setRevealedStep((prev) => Math.max(prev, step));
        }, delay);
        timers.push(timer);
      });

      return () => {
        timers.forEach((t) => clearTimeout(t));
      };
    }

    if (introPhase === 'intro') {
      setRevealedStep(0);
    }
  }, [introPhase]);

  // 3D Pointer tilt interaction for the portrait
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rx = ((y - centerY) / centerY) * -10;
    const ry = ((x - centerX) / centerX) * 10;
    const glowX = (x / rect.width) * 100;
    const glowY = (y / rect.height) * 100;

    setTilt({ rx, ry, glowX, glowY });
  };

  const handleMouseLeave = () => {
    setTilt({ rx: 0, ry: 0, glowX: 50, glowY: 50 });
  };

  const isStepActive = (step: number) => revealedStep >= step;

  // Split main headline into words for staged masked reveal
  const headlineWords = useMemo(() => {
    return t.headline.split(/\s+/).filter(Boolean);
  }, [t.headline]);

  return (
    <section
      id="hero"
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        position: 'relative',
        paddingTop: '6.5rem',
        paddingBottom: '5.5rem',
        backgroundColor: 'var(--hero-bg)',
        overflow: 'hidden',
      }}
      className="perspective-container"
    >
      {/* Signature 3D Interactive Blue-Block Background — Primary Opening Showcase */}
      <HeroInteractiveBlocks theme={theme} isRevealed={introPhase !== 'intro'} />

      {/* Atmospheric Contrast Vignette for Perfect Text Contrast & Readability */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            theme === 'dark'
              ? 'radial-gradient(ellipse at 28% 50%, rgba(5, 7, 12, 0.88) 0%, rgba(5, 7, 12, 0.55) 55%, rgba(5, 7, 12, 0.22) 100%)'
              : 'radial-gradient(ellipse at 28% 50%, rgba(248, 250, 252, 0.90) 0%, rgba(248, 250, 252, 0.6) 55%, rgba(248, 250, 252, 0.25) 100%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />

      {/* Subtle camera-like perspective radial light that activates during transition */}
      <div
        style={{
          position: 'absolute',
          top: '30%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(1100px, 95vw)',
          height: '600px',
          background: 'radial-gradient(circle, rgba(0, 242, 254, 0.12) 0%, rgba(59, 130, 246, 0.05) 50%, transparent 75%)',
          filter: 'blur(90px)',
          pointerEvents: 'none',
          opacity: introPhase === 'intro' ? 0.3 : 0.85,
          transition: 'opacity 1.2s ease',
          zIndex: 1,
        }}
      />

      <div className="container-custom" style={{ position: 'relative', zIndex: 2 }}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            alignItems: 'center',
            gap: '3.5rem',
          }}
        >
          {/* Left Column: Typography & Intent */}
          <div>
            {/* Status Pill (Step 1) */}
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.4rem 1rem',
                borderRadius: '9999px',
                background: 'rgba(0, 242, 254, 0.08)',
                border: '1px solid var(--hero-border)',
                color: 'var(--hero-accent)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                fontWeight: 600,
                letterSpacing: '0.08em',
                marginBottom: '1.5rem',
                transform: isStepActive(1) ? 'translateY(0)' : 'translateY(20px)',
                opacity: isStepActive(1) ? 1 : 0,
                transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.6s ease',
              }}
            >
              <span
                style={{
                  width: '8px',
                  height: '8px',
                  borderRadius: '50%',
                  background: 'var(--hero-accent)',
                  boxShadow: '0 0 10px var(--hero-accent)',
                }}
              />
              <span>{t.badge}</span>
            </div>

            {/* Greeting & Name (Step 2) */}
            <div
              style={{
                marginBottom: '1.25rem',
                transform: isStepActive(2) ? 'translateY(0)' : 'translateY(25px)',
                opacity: isStepActive(2) ? 1 : 0,
                transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.7s ease',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.95rem',
                  color: 'var(--hero-muted)',
                  display: 'block',
                  marginBottom: '0.35rem',
                  letterSpacing: '0.05em',
                }}
              >
                {t.greeting}
              </span>
              <h1
                className="kinetic-heading"
                style={{
                  color: 'var(--hero-text)',
                  background: 'linear-gradient(135deg, var(--hero-text) 30%, var(--hero-accent) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                {t.name}
              </h1>
            </div>

            {/* Main Headline revealed Word by Word (Step 3) */}
            <h2
              style={{
                fontSize: 'clamp(1.35rem, 2.6vw, 1.95rem)',
                fontWeight: 700,
                color: 'var(--hero-text)',
                lineHeight: 1.35,
                marginBottom: '1.5rem',
                borderLeft: '3px solid var(--hero-accent)',
                paddingLeft: '1.15rem',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'baseline',
              }}
            >
              <span style={{ marginRight: '0.2em' }}>"</span>
              {headlineWords.map((word, idx) => (
                <span
                  key={idx}
                  style={{
                    display: 'inline-block',
                    overflow: 'hidden',
                    marginRight: '0.28em',
                    verticalAlign: 'bottom',
                  }}
                >
                  <span
                    style={{
                      display: 'inline-block',
                      transform: isStepActive(3) ? 'translateY(0)' : 'translateY(115%)',
                      opacity: isStepActive(3) ? 1 : 0,
                      transition: `transform 0.65s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 0.06}s, opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 0.06}s`,
                    }}
                  >
                    {word}
                  </span>
                </span>
              ))}
              <span>"</span>
            </h2>

            {/* Subheadline description with Scroll Highlight (Step 4) */}
            <div
              style={{
                transform: isStepActive(4) ? 'translateY(0)' : 'translateY(20px)',
                opacity: isStepActive(4) ? 1 : 0,
                transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.7s ease',
              }}
            >
              <ScrollHighlightText
                text={t.subheadline}
                style={{
                  fontSize: '1.05rem',
                  lineHeight: 1.75,
                  maxWidth: '540px',
                  marginBottom: '2.5rem',
                }}
                activeColor="var(--hero-text)"
                mutedColor="var(--hero-muted)"
              />
            </div>

            {/* Call to Actions with Magnetic Motion (Step 5) */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '2.75rem',
                transform: isStepActive(5) ? 'translateY(0)' : 'translateY(20px)',
                opacity: isStepActive(5) ? 1 : 0,
                transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.7s ease',
              }}
            >
              <Magnetic strength={0.22}>
                <a href="#projects" className="btn-primary">
                  <span>{t.ctaProjects}</span>
                  <ArrowDown size={16} />
                </a>
              </Magnetic>

              <Magnetic strength={0.22}>
                <a
                  href="#yoga"
                  className="btn-secondary"
                  style={{
                    borderColor: 'var(--yoga-border)',
                    color: 'var(--yoga-accent)',
                    background: 'rgba(74, 222, 128, 0.06)',
                  }}
                >
                  <Compass size={16} />
                  <span>{t.ctaInner}</span>
                </a>
              </Magnetic>

              <Magnetic strength={0.22}>
                <a href="#contact" className="btn-secondary">
                  <span>{t.ctaContact}</span>
                </a>
              </Magnetic>
            </div>

            {/* Verified Social Links (Step 6) */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
                transform: isStepActive(6) ? 'translateY(0)' : 'translateY(15px)',
                opacity: isStepActive(6) ? 1 : 0,
                transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.7s ease',
              }}
            >
              <span
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  color: 'var(--hero-muted)',
                  letterSpacing: '0.1em',
                }}
              >
                VERIFIED LINKS
              </span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <Magnetic strength={0.3}>
                  <a
                    href="https://github.com/dibash792"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Dibash Lamichhane GitHub Profile"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: 'var(--hero-surface)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--hero-text)',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--hero-accent)';
                      e.currentTarget.style.color = 'var(--hero-accent)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-subtle)';
                      e.currentTarget.style.color = 'var(--hero-text)';
                    }}
                  >
                    <GithubIcon size={19} />
                  </a>
                </Magnetic>

                <Magnetic strength={0.3}>
                  <a
                    href="https://www.linkedin.com/in/dibash-lamichhane-47871b434"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Dibash Lamichhane LinkedIn Profile"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '42px',
                      height: '42px',
                      borderRadius: '50%',
                      background: 'var(--hero-surface)',
                      border: '1px solid var(--border-subtle)',
                      color: 'var(--hero-text)',
                      transition: 'all 0.2s ease',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'var(--hero-accent)';
                      e.currentTarget.style.color = 'var(--hero-accent)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'var(--border-subtle)';
                      e.currentTarget.style.color = 'var(--hero-text)';
                    }}
                  >
                    <LinkedinIcon size={19} />
                  </a>
                </Magnetic>
              </div>
            </div>
          </div>

          {/* Right Column: 3D Tilting Interactive Portrait Experience with Cinematic Settle */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              perspective: '1200px',
            }}
          >
            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                position: 'relative',
                width: '100%',
                maxWidth: '400px',
                aspectRatio: '4 / 5',
                borderRadius: '24px',
                transform: introPhase === 'intro'
                  ? 'perspective(1000px) scale(1.05) translateZ(40px)'
                  : `perspective(1000px) scale(1) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
                transformStyle: 'preserve-3d',
                transition: introPhase === 'transitioning'
                  ? 'transform 1.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 1.3s ease'
                  : 'transform 0.15s ease-out, box-shadow 0.15s ease-out',
                boxShadow:
                  '0 30px 60px -15px rgba(0, 0, 0, 0.75), 0 0 45px var(--hero-accent-glow)',
                cursor: 'pointer',
              }}
            >
              {/* Image Frame */}
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  borderRadius: '24px',
                  overflow: 'hidden',
                  border: '1px solid var(--hero-border)',
                  background: '#04060a',
                }}
              >
                <img
                  src="/dibash-portrait.jpg"
                  alt="Dibash Lamichhane"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    filter: 'contrast(1.05) brightness(1.02)',
                  }}
                />

                {/* Specular Dynamic Light Sheen */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    background: `radial-gradient(circle at ${tilt.glowX}% ${tilt.glowY}%, rgba(255, 255, 255, 0.28) 0%, transparent 60%)`,
                    pointerEvents: 'none',
                    mixBlendMode: 'overlay',
                  }}
                />

                <div
                  style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '40%',
                    background: 'linear-gradient(to top, rgba(5, 7, 12, 0.95), transparent)',
                    pointerEvents: 'none',
                  }}
                />
              </div>

              {/* Floating 3D HUD Badges (Step 6) */}
              <div
                style={{
                  position: 'absolute',
                  top: '-15px',
                  right: '-15px',
                  padding: '0.65rem 1rem',
                  borderRadius: '12px',
                  background: 'var(--hero-surface)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid var(--hero-border)',
                  boxShadow: 'var(--shadow-3d)',
                  transform: isStepActive(6) ? 'translateZ(40px)' : 'translateZ(10px) translateY(10px)',
                  opacity: isStepActive(6) ? 1 : 0,
                  transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  color: 'var(--hero-text)',
                  fontWeight: 600,
                }}
              >
                <Sparkles size={14} color="var(--hero-accent)" />
                <span>{t.stats.role}</span>
              </div>

              <div
                style={{
                  position: 'absolute',
                  bottom: '18px',
                  left: '18px',
                  right: '18px',
                  padding: '0.85rem 1.15rem',
                  borderRadius: '16px',
                  background: 'var(--hero-surface)',
                  backdropFilter: 'blur(16px)',
                  WebkitBackdropFilter: 'blur(16px)',
                  border: '1px solid var(--border-subtle)',
                  transform: isStepActive(6) ? 'translateZ(30px)' : 'translateZ(10px) translateY(10px)',
                  opacity: isStepActive(6) ? 1 : 0,
                  transition: 'all 0.7s cubic-bezier(0.16, 1, 0.3, 1) 0.1s',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.35rem',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.45rem',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.72rem',
                    color: 'var(--hero-accent)',
                    letterSpacing: '0.08em',
                  }}
                >
                  <BookOpen size={12} />
                  <span>{t.stats.academic}</span>
                </div>
                <div
                  style={{
                    fontSize: '0.84rem',
                    fontWeight: 600,
                    color: 'var(--hero-text)',
                  }}
                >
                  {t.stats.teaching}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll Down Cue (Step 7) */}
      <a
        href="#about"
        aria-label="Scroll to about section"
        style={{
          position: 'absolute',
          bottom: '1.75rem',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '0.35rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.72rem',
          letterSpacing: '0.14em',
          color: 'var(--hero-muted)',
          opacity: isStepActive(7) ? 0.75 : 0,
          transition: 'opacity 0.8s ease',
          zIndex: 3,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--hero-accent)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--hero-muted)')}
      >
        <span>EXPLORE JOURNEY</span>
        <ArrowDown size={14} style={{ animation: 'bounceSoft 2s infinite ease-in-out' }} />
      </a>

      <style>{`
        @keyframes bounceSoft {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(5px); }
        }
      `}</style>
    </section>
  );
};
