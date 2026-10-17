import React from 'react';
import { Mic, Lightbulb, TrendingUp, Sparkles } from 'lucide-react';
import type { Language } from '../types';
import { translations } from '../i18n/translations';
import { MaskedHeading } from './motion/MaskedHeading';
import { ScrollRevealBox, CardItem } from './motion/ScrollRevealBox';

interface SpeakingGrowthProps {
  language: Language;
}

export const SpeakingGrowth: React.FC<SpeakingGrowthProps> = ({ language }) => {
  const t = translations[language].speaking;

  const cards = [
    {
      icon: <Mic size={24} color="#38bdf8" />,
      title: t.cards.c1Title,
      desc: t.cards.c1Desc,
      accent: '#38bdf8',
    },
    {
      icon: <Lightbulb size={24} color="#f59e0b" />,
      title: t.cards.c2Title,
      desc: t.cards.c2Desc,
      accent: '#f59e0b',
    },
    {
      icon: <TrendingUp size={24} color="#a3e635" />,
      title: t.cards.c3Title,
      desc: t.cards.c3Desc,
      accent: '#a3e635',
    },
  ];

  return (
    <section
      id="speaking"
      className="section-padding"
      style={{
        backgroundColor: 'var(--about-bg)',
        borderTop: '1px solid var(--border-subtle)',
      }}
    >
      <div className="container-custom">
        <div style={{ maxWidth: '780px', marginBottom: '3.75rem' }}>
          <ScrollRevealBox variant="narrative" delay={0.05}>
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.35rem 0.85rem',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                fontWeight: 600,
                textTransform: 'uppercase',
                letterSpacing: '0.1em',
                color: 'var(--about-accent)',
                background: 'rgba(245, 158, 11, 0.08)',
                border: '1px solid var(--about-border)',
                borderRadius: 'var(--radius-full)',
                marginBottom: '1rem',
              }}
            >
              <Sparkles size={12} />
              <span>{t.label}</span>
            </div>
          </ScrollRevealBox>

          <MaskedHeading
            text={t.heading}
            as="h2"
            className="kinetic-heading"
            style={{ color: 'var(--about-text)' }}
          />
          <ScrollRevealBox variant="narrative" delay={0.15}>
            <p style={{ fontSize: '1.08rem', color: 'var(--about-muted)', lineHeight: 1.75 }}>
              {t.subheading}
            </p>
          </ScrollRevealBox>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '2.25rem',
          }}
        >
          {cards.map((c, i) => (
            <ScrollRevealBox
              key={i}
              variant="narrative"
              delay={i * 0.12}
              hoverEffect="border-glow"
              hoverAccentColor={c.accent}
              style={{
                padding: '2.5rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '1.15rem',
                borderRadius: '22px',
                background: 'var(--about-surface)',
                border: '1px solid var(--about-border)',
                boxShadow: '0 12px 35px rgba(0, 0, 0, 0.25)',
              }}
            >
              <CardItem step={1} direction="pop">
                <div
                  style={{
                    width: '50px',
                    height: '50px',
                    borderRadius: '14px',
                    background: `${c.accent}15`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  {c.icon}
                </div>
              </CardItem>

              <CardItem step={2} direction="up">
                <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--about-text)' }}>
                  {c.title}
                </h3>
              </CardItem>

              <CardItem step={3} direction="up">
                <p style={{ fontSize: '0.98rem', color: 'var(--about-muted)', lineHeight: 1.75 }}>
                  {c.desc}
                </p>
              </CardItem>
            </ScrollRevealBox>
          ))}
        </div>
      </div>
    </section>
  );
};
