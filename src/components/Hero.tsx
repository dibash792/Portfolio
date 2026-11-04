import React, { useMemo } from 'react';
import { ArrowDown, Compass } from 'lucide-react';
import { motion, type Variants } from 'motion/react';
import { GithubIcon, LinkedinIcon } from './Icons';
import type { Language, Theme } from '../types';
import type { IntroPhase } from '../App';
import { translations } from '../i18n/translations';
import { Magnetic } from './motion/Magnetic';
import { ScrollHighlightText } from './motion/ScrollHighlightText';
import { HeroInteractiveBlocks } from './HeroInteractiveBlocks';
import { InteractiveIDCard } from './InteractiveIDCard';

interface HeroProps {
  language: Language;
  theme?: Theme;
  introPhase?: IntroPhase;
}

const heroContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
  },
};

const badgeVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      delay: 0.1,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const nameVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      delay: 0.25,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const headlineContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.48,
      staggerChildren: 0.055,
    },
  },
};

const headlineWordVariants: Variants = {
  hidden: { opacity: 0, y: '115%' },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const subheadlineVariants: Variants = {
  hidden: { opacity: 0, y: 18 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      delay: 1.05,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const actionsContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 1.35,
      staggerChildren: 0.14,
    },
  },
};

const actionButtonVariants: Variants = {
  hidden: { opacity: 0, y: 16, scale: 0.96 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.48,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

const socialContainerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 1.85,
      staggerChildren: 0.1,
    },
  },
};

const socialItemVariants: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export const Hero: React.FC<HeroProps> = ({ language, theme = 'dark', introPhase = 'revealed' }) => {
  const t = translations[language].hero;
  const isViolet = theme === 'warm-violet' || theme === 'light';
  // Text reveal activates strictly AFTER photo assembly settles into the hero layout
  const isTextActive = introPhase === 'revealed';
  // Card and backdrop interactive geometry mounts/activates during transition
  const isCardActive = introPhase !== 'intro';


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
      <HeroInteractiveBlocks theme={theme} isRevealed={isCardActive} />

      {/* Atmospheric Contrast Vignette for Perfect Text Contrast & Readability */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            isViolet
              ? 'radial-gradient(ellipse at 28% 50%, rgba(13, 8, 23, 0.90) 0%, rgba(13, 8, 23, 0.58) 55%, rgba(13, 8, 23, 0.22) 100%)'
              : 'radial-gradient(ellipse at 28% 50%, rgba(4, 7, 17, 0.90) 0%, rgba(4, 7, 17, 0.58) 55%, rgba(4, 7, 17, 0.22) 100%)',
          pointerEvents: 'none',
          zIndex: 1,
          transition: 'background 0.6s ease',
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
          background: isViolet
            ? 'radial-gradient(circle, rgba(192, 132, 252, 0.15) 0%, rgba(124, 58, 237, 0.05) 50%, transparent 75%)'
            : 'radial-gradient(circle, rgba(0, 242, 254, 0.15) 0%, rgba(59, 130, 246, 0.05) 50%, transparent 75%)',
          filter: 'blur(90px)',
          pointerEvents: 'none',
          opacity: introPhase === 'intro' ? 0.3 : 0.85,
          transition: 'opacity 1.2s ease, background 0.6s ease',
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
          {/* Left Column: Typography & Intent with Motion Orchestration */}
          <motion.div
            variants={heroContainerVariants}
            initial="hidden"
            animate={isTextActive ? 'visible' : 'hidden'}
          >
            {/* Status Pill (Step 1) */}
            <motion.div
              variants={badgeVariants}
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
            </motion.div>

            {/* Greeting & Name (Step 2) */}
            <motion.div
              variants={nameVariants}
              style={{
                marginBottom: '1.25rem',
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
            </motion.div>

            {/* Main Headline revealed Word by Word (Step 3: starts after photo assembly) */}
            <motion.h2
              variants={headlineContainerVariants}
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
                  <motion.span
                    variants={headlineWordVariants}
                    style={{
                      display: 'inline-block',
                    }}
                  >
                    {word}
                  </motion.span>
                </span>
              ))}
              <span>"</span>
            </motion.h2>

            {/* Subheadline description with Scroll Highlight (Step 4: appears next with slight delay) */}
            <motion.div variants={subheadlineVariants}>
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
            </motion.div>

            {/* Call to Actions with Motion & Magnetic Interaction (Step 5: coordinated staggered buttons) */}
            <motion.div
              variants={actionsContainerVariants}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '1rem',
                marginBottom: '2.75rem',
              }}
            >
              <Magnetic strength={0.22}>
                <motion.a
                  href="#projects"
                  className="btn-primary"
                  variants={actionButtonVariants}
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <span>{t.ctaProjects}</span>
                  <ArrowDown size={16} />
                </motion.a>
              </Magnetic>

              <Magnetic strength={0.22}>
                <motion.a
                  href="#yoga"
                  className="btn-secondary"
                  variants={actionButtonVariants}
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  style={{
                    borderColor: 'var(--yoga-border)',
                    color: 'var(--yoga-accent)',
                    background: 'rgba(74, 222, 128, 0.06)',
                  }}
                >
                  <Compass size={16} />
                  <span>{t.ctaInner}</span>
                </motion.a>
              </Magnetic>

              <Magnetic strength={0.22}>
                <motion.a
                  href="#contact"
                  className="btn-secondary"
                  variants={actionButtonVariants}
                  whileHover={{ y: -3, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                >
                  <span>{t.ctaContact}</span>
                </motion.a>
              </Magnetic>
            </motion.div>

            {/* Verified Social Links with Motion (Step 6: progressive badge & links) */}
            <motion.div
              variants={socialContainerVariants}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1.5rem',
              }}
            >
              <motion.span
                variants={socialItemVariants}
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.75rem',
                  textTransform: 'uppercase',
                  color: 'var(--hero-muted)',
                  letterSpacing: '0.1em',
                }}
              >
                VERIFIED LINKS
              </motion.span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
                <Magnetic strength={0.3}>
                  <motion.a
                    href="https://github.com/dibash792"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Dibash Lamichhane GitHub Profile"
                    variants={socialItemVariants}
                    whileHover={{ scale: 1.08, borderColor: 'var(--hero-accent)', color: 'var(--hero-accent)' }}
                    whileTap={{ scale: 0.95 }}
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
                      transition: 'border-color 0.2s ease, color 0.2s ease',
                    }}
                  >
                    <GithubIcon size={19} />
                  </motion.a>
                </Magnetic>

                <Magnetic strength={0.3}>
                  <motion.a
                    href="https://www.linkedin.com/in/dibash-lamichhane-47871b434"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Dibash Lamichhane LinkedIn Profile"
                    variants={socialItemVariants}
                    whileHover={{ scale: 1.08, borderColor: 'var(--hero-accent)', color: 'var(--hero-accent)' }}
                    whileTap={{ scale: 0.95 }}
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
                      transition: 'border-color 0.2s ease, color 0.2s ease',
                    }}
                  >
                    <LinkedinIcon size={19} />
                  </motion.a>
                </Magnetic>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Column: Interactive 3D Cybernetic ID Credential Card */}
          <InteractiveIDCard language={language} theme={theme} isRevealed={isCardActive} />
        </div>
      </div>

      {/* Scroll Down Cue with Motion */}
      <motion.a
        href="#about"
        aria-label="Scroll to about section"
        initial={{ opacity: 0, y: -8 }}
        animate={
          isTextActive
            ? { opacity: 0.75, y: 0 }
            : { opacity: 0, y: -8 }
        }
        transition={{ delay: 2.25, duration: 0.7 }}
        whileHover={{ opacity: 1, scale: 1.05 }}
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
          zIndex: 3,
        }}
      >
        <span>EXPLORE JOURNEY</span>
        <ArrowDown size={14} style={{ animation: 'bounceSoft 2s infinite ease-in-out' }} />
      </motion.a>

      <style>{`
        @keyframes bounceSoft {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(5px); }
        }
      `}</style>
    </section>
  );
};
