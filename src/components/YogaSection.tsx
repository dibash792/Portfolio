import React, { useState, useEffect } from 'react';
import { Compass, Wind, ShieldCheck, Sun, Moon } from 'lucide-react';
import type { Language } from '../types';
import { translations } from '../i18n/translations';
import { MaskedHeading } from './motion/MaskedHeading';
import { ScrollHighlightText } from './motion/ScrollHighlightText';
import { ScrollRevealBox, CardItem } from './motion/ScrollRevealBox';

interface YogaSectionProps {
  language: Language;
}

export const YogaSection: React.FC<YogaSectionProps> = ({ language }) => {
  const t = translations[language].yoga;

  // 16-second conscious pranayama breathing cycle: 4s Inhale, 4s Hold, 4s Exhale, 4s Rest
  const [phaseIndex, setPhaseIndex] = useState(0); // 0: inhale, 1: hold, 2: exhale, 3: rest
  const [breathSeconds, setBreathSeconds] = useState(4);
  const [isBreathingActive, setIsBreathingActive] = useState(true);

  useEffect(() => {
    if (!isBreathingActive) return;

    const timer = setInterval(() => {
      setBreathSeconds((prev) => {
        if (prev <= 1) {
          setPhaseIndex((p) => (p + 1) % 4);
          return 4;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isBreathingActive]);

  const phaseKeys = ['inhale', 'hold', 'exhale', 'rest'] as const;
  const currentPhaseKey = phaseKeys[phaseIndex];
  const currentPhaseText = t.breathPhases[currentPhaseKey];

  return (
    <section
      id="yoga"
      style={{
        position: 'relative',
        paddingTop: '8.5rem',
        paddingBottom: '8.5rem',
        backgroundColor: 'var(--yoga-bg)',
        color: 'var(--yoga-text)',
        transition: 'background-color 0.6s ease',
        overflow: 'hidden',
        borderTop: '1px solid var(--yoga-border)',
      }}
    >
      {/* Meditative Ethereal Sage & Gold Ambient Light (ZERO Blue) */}
      <div
        style={{
          position: 'absolute',
          top: '15%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'min(950px, 95vw)',
          height: '650px',
          background: 'radial-gradient(circle, var(--yoga-accent-glow) 0%, rgba(234, 179, 8, 0.08) 45%, transparent 75%)',
          filter: 'blur(100px)',
          pointerEvents: 'none',
          opacity: 0.7,
        }}
      />

      <div className="container-custom" style={{ position: 'relative', zIndex: 2 }}>
        {/* Sanctuary Header */}
        <div style={{ maxWidth: '820px', marginBottom: '4rem' }}>
          <ScrollRevealBox variant="gentle" delay={0.05}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.55rem',
                padding: '0.4rem 1.15rem',
                borderRadius: '9999px',
                background: 'rgba(74, 222, 128, 0.1)',
                border: '1px solid var(--yoga-border)',
                color: 'var(--yoga-accent)',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.78rem',
                fontWeight: 700,
                letterSpacing: '0.12em',
                marginBottom: '1.25rem',
              }}
            >
              <Compass size={14} />
              <span>{t.label}</span>
            </div>
          </ScrollRevealBox>

          <MaskedHeading
            text={t.heading}
            as="h2"
            gentle={true}
            className="kinetic-heading"
            style={{
              fontSize: 'clamp(2.3rem, 4.6vw, 3.8rem)',
              color: 'var(--yoga-text)',
              background: 'linear-gradient(135deg, var(--yoga-text) 40%, var(--yoga-accent-gold) 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          />

          <ScrollRevealBox variant="gentle" delay={0.15}>
            <p
              style={{
                fontSize: '1.2rem',
                color: 'var(--yoga-muted)',
                lineHeight: 1.85,
                marginBottom: '1.5rem',
                maxWidth: '720px',
              }}
            >
              {t.subheadline}
            </p>
          </ScrollRevealBox>

          {/* Factual Disclaimer */}
          <ScrollRevealBox variant="gentle" delay={0.22}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.65rem',
                padding: '0.55rem 1.15rem',
                borderRadius: '10px',
                background: 'rgba(74, 222, 128, 0.08)',
                border: '1px solid var(--yoga-border)',
                fontSize: '0.86rem',
                color: 'var(--yoga-text)',
              }}
            >
              <ShieldCheck size={16} color="var(--yoga-accent)" />
              <span>{t.disclaimer}</span>
            </div>
          </ScrollRevealBox>
        </div>

        {/* Narrative Split: The Philosophy of Stillness */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3.5rem',
            alignItems: 'center',
            marginBottom: '5.5rem',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              fontSize: '1.1rem',
              lineHeight: 1.9,
              color: 'var(--yoga-muted)',
            }}
          >
            <MaskedHeading
              text={t.narrativeTitle}
              as="h3"
              gentle={true}
              style={{
                fontSize: '1.65rem',
                fontWeight: 700,
                color: 'var(--yoga-text)',
                lineHeight: 1.3,
              }}
            />
            <ScrollHighlightText
              text={t.narrativeP1}
              activeColor="var(--yoga-text)"
              mutedColor="var(--yoga-muted)"
              accentColor="var(--yoga-accent-gold)"
              accentIndices={[0, 1, 2, 3, 4]}
              style={{ fontSize: '1.1rem', lineHeight: 1.9 }}
            />
            <ScrollRevealBox variant="gentle" delay={0.2}>
              <p>{t.narrativeP2}</p>
            </ScrollRevealBox>
          </div>

          {/* Interactive Conscious Breathing Mandala */}
          <ScrollRevealBox
            variant="gentle"
            delay={0.2}
            style={{
              padding: '3rem 2.5rem',
              borderRadius: '28px',
              background: 'var(--yoga-surface)',
              border: '1px solid var(--yoga-border)',
              boxShadow: '0 25px 60px rgba(0, 0, 0, 0.35), 0 0 35px var(--yoga-accent-glow)',
              backdropFilter: 'blur(24px)',
              WebkitBackdropFilter: 'blur(24px)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
            }}
          >
            <CardItem step={1} direction="fade" style={{ width: '100%' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  width: '100%',
                  alignItems: 'center',
                  marginBottom: '1rem',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '0.82rem',
                    color: 'var(--yoga-accent)',
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <Wind size={15} />
                  <span>{t.breathTitle}</span>
                </div>

                <button
                  onClick={() => setIsBreathingActive(!isBreathingActive)}
                  style={{
                    fontSize: '0.74rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--yoga-muted)',
                    border: '1px solid var(--yoga-border)',
                    borderRadius: '9999px',
                    padding: '0.25rem 0.65rem',
                  }}
                >
                  {isBreathingActive ? 'Pause Guide' : 'Resume Guide'}
                </button>
              </div>
            </CardItem>

            <CardItem step={2} direction="up">
              <p
                style={{
                  fontSize: '0.92rem',
                  color: 'var(--yoga-muted)',
                  marginBottom: '2.5rem',
                  maxWidth: '380px',
                  lineHeight: 1.6,
                }}
              >
                {t.breathSubtitle}
              </p>
            </CardItem>

            {/* Expanding / Contracting Sacred Concentric Mandala */}
            <CardItem step={3} direction="pop">
              <div
                style={{
                  position: 'relative',
                  width: '240px',
                  height: '240px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginBottom: '2.5rem',
                }}
              >
                {/* Outer Ripple */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    border: '1px dashed var(--yoga-border)',
                    animation: 'rotateSlow 50s linear infinite',
                    opacity: 0.6,
                  }}
                />

                {/* Organic Middle Ripple */}
                <div
                  style={{
                    position: 'absolute',
                    width: '175px',
                    height: '175px',
                    borderRadius: '50%',
                    border: '1px solid var(--yoga-accent)',
                    opacity: 0.45,
                    transform: phaseIndex === 0 || phaseIndex === 1 ? 'scale(1.3)' : 'scale(0.85)',
                    transition: 'transform 4s cubic-bezier(0.4, 0, 0.2, 1)',
                  }}
                />

                {/* Core Breathing Sphere */}
                <div
                  style={{
                    width: '120px',
                    height: '120px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, var(--yoga-accent) 0%, rgba(74, 222, 128, 0.25) 65%, transparent 100%)',
                    boxShadow: '0 0 45px var(--yoga-accent-glow)',
                    transform: phaseIndex === 0 || phaseIndex === 1 ? 'scale(1.2)' : 'scale(0.72)',
                    transition: 'transform 4s cubic-bezier(0.4, 0, 0.2, 1)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '1.75rem',
                      fontWeight: 800,
                      color: '#fff',
                      textShadow: '0 2px 10px rgba(0,0,0,0.7)',
                    }}
                  >
                    {breathSeconds}s
                  </span>
                </div>
              </div>
            </CardItem>

            {/* Current Breath Phase Display */}
            <CardItem step={4} direction="up">
              <div
                style={{
                  fontSize: '1.18rem',
                  fontWeight: 600,
                  color: 'var(--yoga-text)',
                  minHeight: '2.4rem',
                  lineHeight: 1.5,
                }}
              >
                {currentPhaseText}
              </div>
            </CardItem>
          </ScrollRevealBox>
        </div>

        {/* Dual Practices: Hatha & Kriya Yoga Exploration */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.5rem',
          }}
        >
          {/* Hatha Yoga Card */}
          <ScrollRevealBox
            variant="gentle"
            delay={0.12}
            hoverEffect="border-glow"
            hoverAccentColor="var(--yoga-accent)"
            style={{
              padding: '2.75rem',
              borderRadius: '24px',
              border: '1px solid var(--yoga-border)',
              background: 'var(--yoga-surface)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.25)',
            }}
          >
            <CardItem step={1} direction="pop">
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '16px',
                  background: 'rgba(74, 222, 128, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Sun size={26} color="var(--yoga-accent)" />
              </div>
            </CardItem>

            <CardItem step={2} direction="up">
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--yoga-text)' }}>
                {t.hathaTitle}
              </h3>
            </CardItem>

            <CardItem step={3} direction="up">
              <p style={{ fontSize: '1.02rem', color: 'var(--yoga-muted)', lineHeight: 1.8 }}>
                {t.hathaDesc}
              </p>
            </CardItem>
          </ScrollRevealBox>

          {/* Kriya Yoga Card */}
          <ScrollRevealBox
            variant="gentle"
            delay={0.24}
            hoverEffect="border-glow"
            hoverAccentColor="var(--yoga-accent-gold)"
            style={{
              padding: '2.75rem',
              borderRadius: '24px',
              border: '1px solid var(--yoga-border)',
              background: 'var(--yoga-surface)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
              boxShadow: '0 15px 35px rgba(0, 0, 0, 0.25)',
            }}
          >
            <CardItem step={1} direction="pop">
              <div
                style={{
                  width: '52px',
                  height: '52px',
                  borderRadius: '16px',
                  background: 'rgba(234, 179, 8, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Moon size={26} color="var(--yoga-accent-gold)" />
              </div>
            </CardItem>

            <CardItem step={2} direction="up">
              <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--yoga-text)' }}>
                {t.kriyaTitle}
              </h3>
            </CardItem>

            <CardItem step={3} direction="up">
              <p style={{ fontSize: '1.02rem', color: 'var(--yoga-muted)', lineHeight: 1.8 }}>
                {t.kriyaDesc}
              </p>
            </CardItem>
          </ScrollRevealBox>
        </div>
      </div>

      <style>{`
        @keyframes rotateSlow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
};
