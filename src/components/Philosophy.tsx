import React from 'react';
import { Quote, Edit3 } from 'lucide-react';
import type { Language } from '../types';
import { translations } from '../i18n/translations';
import { ScrollHighlightText } from './motion/ScrollHighlightText';
import { ScrollRevealBox, CardItem } from './motion/ScrollRevealBox';

interface PhilosophyProps {
  language: Language;
}

export const Philosophy: React.FC<PhilosophyProps> = ({ language }) => {
  const t = translations[language].philosophy;

  return (
    <section
      id="philosophy"
      style={{
        position: 'relative',
        paddingTop: '6.5rem',
        paddingBottom: '7rem',
        backgroundColor: 'var(--yoga-bg)',
        borderBottom: '1px solid var(--yoga-border)',
      }}
    >
      <div className="container-custom">
        <div
          style={{
            maxWidth: '860px',
            margin: '0 auto',
            textAlign: 'center',
            position: 'relative',
          }}
        >
          {/* Subtle Quote Icon */}
          <ScrollRevealBox variant="gentle" delay={0.05}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '58px',
                height: '58px',
                borderRadius: '50%',
                background: 'rgba(74, 222, 128, 0.1)',
                border: '1px solid var(--yoga-border)',
                color: 'var(--yoga-accent)',
                marginBottom: '2rem',
              }}
            >
              <Quote size={26} />
            </div>

            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.82rem',
                color: 'var(--yoga-accent-gold)',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                marginBottom: '1.25rem',
                fontWeight: 700,
              }}
            >
              {t.label}
            </div>
          </ScrollRevealBox>

          {/* Verified Life Intention Quote with Meditative Scroll Highlight */}
          <div
            style={{
              fontSize: 'clamp(1.85rem, 3.8vw, 2.85rem)',
              fontWeight: 800,
              lineHeight: 1.35,
              color: 'var(--yoga-text)',
              marginBottom: '1.5rem',
            }}
          >
            <ScrollHighlightText
              text={`"${t.quote}"`}
              activeColor="var(--yoga-text)"
              mutedColor="var(--yoga-muted)"
              accentColor="var(--yoga-accent-gold)"
              accentIndices={[1, 4, 8]}
              style={{ fontSize: 'inherit', fontWeight: 'inherit', lineHeight: 'inherit' }}
            />
          </div>

          <ScrollRevealBox variant="gentle" delay={0.15}>
            <cite
              style={{
                display: 'block',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.98rem',
                color: 'var(--yoga-accent-gold)',
                fontStyle: 'normal',
                fontWeight: 700,
                marginBottom: '3.5rem',
                letterSpacing: '0.04em',
              }}
            >
              {t.attribution}
            </cite>
          </ScrollRevealBox>

          {/* Reserved Space for His Personal Writing */}
          <ScrollRevealBox
            variant="gentle"
            delay={0.2}
            style={{
              padding: '2.5rem',
              borderRadius: '20px',
              background: 'rgba(74, 222, 128, 0.03)',
              border: '1px dashed var(--yoga-border)',
              textAlign: 'left',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.15rem',
            }}
          >
            <CardItem step={1} direction="fade">
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.55rem',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.8rem',
                  color: 'var(--yoga-accent-gold)',
                  fontWeight: 600,
                }}
              >
                <Edit3 size={15} />
                <span>{t.placeholderNotice}</span>
              </div>
            </CardItem>

            <CardItem step={2} direction="up">
              <h4 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--yoga-text)' }}>
                {t.reflectionLead}
              </h4>
            </CardItem>

            <CardItem step={3} direction="up">
              <p style={{ fontSize: '1rem', color: 'var(--yoga-muted)', lineHeight: 1.8 }}>
                {t.reflectionP}
              </p>
            </CardItem>
          </ScrollRevealBox>
        </div>
      </div>
    </section>
  );
};
