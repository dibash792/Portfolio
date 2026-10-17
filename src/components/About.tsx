import React from 'react';
import { Code2, GraduationCap, Users2, Compass, Sparkles } from 'lucide-react';
import type { Language } from '../types';
import { translations } from '../i18n/translations';

import { MaskedHeading } from './motion/MaskedHeading';
import { ScrollHighlightText } from './motion/ScrollHighlightText';
import { ScrollRevealBox, CardItem } from './motion/ScrollRevealBox';

interface AboutProps {
  language: Language;
}

export const About: React.FC<AboutProps> = ({ language }) => {
  const t = translations[language].about;

  const cards = [
    {
      icon: <Code2 size={24} color="var(--about-accent)" />,
      title: t.cards.builderTitle,
      desc: t.cards.builderDesc,
    },
    {
      icon: <GraduationCap size={24} color="#38bdf8" />,
      title: t.cards.educatorTitle,
      desc: t.cards.educatorDesc,
    },
    {
      icon: <Users2 size={24} color="#a855f7" />,
      title: t.cards.leaderTitle,
      desc: t.cards.leaderDesc,
    },
    {
      icon: <Compass size={24} color="var(--yoga-accent)" />,
      title: t.cards.seekerTitle,
      desc: t.cards.seekerDesc,
      highlight: true,
    },
  ];

  return (
    <section
      id="about"
      className="section-padding"
      style={{
        backgroundColor: 'var(--about-bg)',
        borderTop: '1px solid var(--border-subtle)',
      }}
    >
      <div className="container-custom">
        {/* Section Header */}
        <div style={{ maxWidth: '780px', marginBottom: '3.75rem' }}>
          <ScrollRevealBox variant="clean" delay={0.05}>
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
        </div>

        {/* Narrative & Split Layout */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '3.5rem',
            alignItems: 'start',
            marginBottom: '4rem',
          }}
        >
          {/* Main Story Narrative (Editorial stone feel) with Scroll-Linked Discovery */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1.5rem',
              fontSize: '1.08rem',
              lineHeight: 1.85,
              color: 'var(--about-muted)',
            }}
          >
            <ScrollHighlightText
              text={t.p1}
              activeColor="var(--about-text)"
              mutedColor="var(--about-muted)"
              accentIndices={[11, 12, 13, 14, 15]}
              accentColor="var(--about-accent)"
            />
            <ScrollRevealBox variant="clean" delay={0.15}>
              <p>{t.p2}</p>
            </ScrollRevealBox>
            <ScrollRevealBox variant="clean" delay={0.25}>
              <p
                style={{
                  paddingLeft: '1.35rem',
                  borderLeft: '2px solid var(--about-accent)',
                  color: 'var(--about-text)',
                  fontSize: '1.12rem',
                  fontStyle: 'normal',
                }}
              >
                {t.p3}
              </p>
            </ScrollRevealBox>
          </div>

          {/* 3D Depth Card Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
              gap: '1.35rem',
            }}
          >
            {cards.map((c, i) => (
              <ScrollRevealBox
                key={i}
                variant="clean"
                delay={0.15 + i * 0.1}
                hoverEffect="border-glow"
                hoverAccentColor={c.highlight ? 'var(--yoga-accent)' : 'var(--about-accent)'}
                style={{
                  padding: '1.85rem',
                  borderRadius: '16px',
                  background: 'var(--about-surface)',
                  border: '1px solid var(--about-border)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.85rem',
                  boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
                }}
              >
                <CardItem step={1} direction="pop">
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      background: c.highlight
                        ? 'rgba(74, 222, 128, 0.1)'
                        : 'rgba(245, 158, 11, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {c.icon}
                  </div>
                </CardItem>

                <CardItem step={2} direction="up">
                  <h3
                    style={{
                      fontSize: '1.18rem',
                      fontWeight: 700,
                      color: c.highlight ? 'var(--yoga-accent)' : 'var(--about-text)',
                    }}
                  >
                    {c.title}
                  </h3>
                </CardItem>

                <CardItem step={3} direction="up">
                  <p
                    style={{
                      fontSize: '0.92rem',
                      color: 'var(--about-muted)',
                      lineHeight: 1.65,
                    }}
                  >
                    {c.desc}
                  </p>
                </CardItem>
              </ScrollRevealBox>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
