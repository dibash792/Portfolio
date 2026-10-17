import React from 'react';
import { Sparkles, GraduationCap, Users2, BookOpen, CheckCircle } from 'lucide-react';
import type { Language } from '../types';
import { translations } from '../i18n/translations';
import { MaskedHeading } from './motion/MaskedHeading';
import { ScrollRevealBox, CardItem } from './motion/ScrollRevealBox';

interface TimelineProps {
  language: Language;
}

export const Timeline: React.FC<TimelineProps> = ({ language }) => {
  const t = translations[language].journey;

  const milestones = [
    {
      role: t.items.nss.role,
      org: t.items.nss.org,
      period: t.items.nss.period,
      desc: t.items.nss.desc,
      highlights: t.items.nss.highlights,
      icon: <GraduationCap size={22} color="var(--journey-accent)" />,
      accent: 'var(--journey-accent)',
    },
    {
      role: t.items.stem.role,
      org: t.items.stem.org,
      period: t.items.stem.period,
      desc: t.items.stem.desc,
      highlights: t.items.stem.highlights,
      icon: <Users2 size={22} color="#f97316" />,
      accent: '#f97316',
    },
    {
      role: t.items.teaching.role,
      org: t.items.teaching.org,
      period: t.items.teaching.period,
      desc: t.items.teaching.desc,
      highlights: t.items.teaching.highlights,
      icon: <BookOpen size={22} color="#fb923c" />,
      accent: '#fb923c',
    },
  ];

  return (
    <section
      id="journey"
      className="section-padding"
      style={{
        backgroundColor: 'var(--journey-bg)',
        borderTop: '1px solid var(--border-subtle)',
      }}
    >
      <div className="container-custom">
        {/* Section Header */}
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
                color: 'var(--journey-accent)',
                background: 'rgba(234, 88, 12, 0.08)',
                border: '1px solid var(--journey-border)',
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
            style={{ color: 'var(--journey-text)' }}
          />
          <ScrollRevealBox variant="narrative" delay={0.15}>
            <p style={{ fontSize: '1.08rem', color: 'var(--journey-muted)', lineHeight: 1.75 }}>
              {t.subheading}
            </p>
          </ScrollRevealBox>
        </div>

        {/* Spatial Vertical Timeline */}
        <div
          style={{
            position: 'relative',
            maxWidth: '920px',
            margin: '0 auto',
            paddingLeft: '2.5rem',
          }}
        >
          {/* Vertical Glowing Line */}
          <div
            style={{
              position: 'absolute',
              top: '20px',
              bottom: '20px',
              left: '23px',
              width: '2px',
              background: 'linear-gradient(to bottom, var(--journey-accent), #f97316, #fb923c, transparent)',
              opacity: 0.5,
            }}
          />

          <div style={{ display: 'flex', flexDirection: 'column', gap: '3.25rem' }}>
            {milestones.map((item, idx) => (
              <ScrollRevealBox
                key={idx}
                variant="narrative"
                delay={idx * 0.15}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '2rem',
                }}
              >
                {/* Node Beacon */}
                <CardItem step={1} direction="pop">
                  <div
                    style={{
                      position: 'absolute',
                      left: '-37px',
                      top: '8px',
                      width: '26px',
                      height: '26px',
                      borderRadius: '50%',
                      background: 'var(--journey-bg)',
                      border: `2px solid ${item.accent}`,
                      boxShadow: `0 0 14px ${item.accent}66`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      zIndex: 2,
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: item.accent,
                      }}
                    />
                  </div>
                </CardItem>

                {/* Milestone Content Card */}
                <div
                  style={{
                    flex: 1,
                    padding: '2.5rem',
                    borderRadius: '20px',
                    background: 'var(--journey-surface)',
                    borderLeft: `3px solid ${item.accent}`,
                    borderTop: '1px solid var(--border-subtle)',
                    borderRight: '1px solid var(--border-subtle)',
                    borderBottom: '1px solid var(--border-subtle)',
                    boxShadow: '0 12px 35px rgba(0, 0, 0, 0.3)',
                    transition: 'border-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)';
                    e.currentTarget.style.boxShadow = `0 16px 40px rgba(0,0,0,0.4), 0 0 20px ${item.accent}22`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 12px 35px rgba(0, 0, 0, 0.3)';
                  }}
                >
                  <CardItem step={1} direction="fade">
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '0.75rem',
                        marginBottom: '0.85rem',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.8rem',
                          color: item.accent,
                          background: 'rgba(234, 88, 12, 0.1)',
                          padding: '0.3rem 0.75rem',
                          borderRadius: '9999px',
                          border: '1px solid var(--journey-border)',
                          fontWeight: 600,
                        }}
                      >
                        {item.period}
                      </span>
                      <span
                        style={{
                          fontFamily: 'var(--font-heading)',
                          fontSize: '0.96rem',
                          color: 'var(--journey-muted)',
                        }}
                      >
                        {item.org}
                      </span>
                    </div>
                  </CardItem>

                  <CardItem step={2} direction="up">
                    <h3
                      style={{
                        fontSize: '1.45rem',
                        fontWeight: 800,
                        marginBottom: '0.85rem',
                        color: 'var(--journey-text)',
                      }}
                    >
                      {item.role}
                    </h3>
                  </CardItem>

                  <CardItem step={3} direction="up">
                    <p
                      style={{
                        fontSize: '1rem',
                        color: 'var(--journey-muted)',
                        lineHeight: 1.75,
                        marginBottom: '1.35rem',
                      }}
                    >
                      {item.desc}
                    </p>
                  </CardItem>

                  <CardItem step={4} direction="up">
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.6rem',
                        paddingTop: '1rem',
                        borderTop: '1px solid var(--border-subtle)',
                      }}
                    >
                      {item.highlights.map((hl, i) => (
                        <div
                          key={i}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.75rem',
                            fontSize: '0.9rem',
                            color: 'var(--journey-text)',
                          }}
                        >
                          <CheckCircle size={15} color={item.accent} />
                          <span>{hl}</span>
                        </div>
                      ))}
                    </div>
                  </CardItem>
                </div>
              </ScrollRevealBox>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
