import React, { useState } from 'react';
import { Sparkles, Terminal, Cpu, Calculator, MessageSquare, Users2 } from 'lucide-react';
import type { Language } from '../types';
import { translations } from '../i18n/translations';
import { MaskedHeading } from './motion/MaskedHeading';
import { ScrollRevealBox, CardItem } from './motion/ScrollRevealBox';

interface SkillsProps {
  language: Language;
}

export const Skills: React.FC<SkillsProps> = ({ language }) => {
  const [activeCategory, setActiveCategory] = useState<'all' | 'active' | 'exploring' | 'realWorld'>('all');
  const t = translations[language].skills;

  const skillsData = [
    {
      name: t.items.htmlCss.name,
      level: t.items.htmlCss.level,
      desc: t.items.htmlCss.desc,
      category: 'active',
      icon: <Terminal size={20} color="var(--skills-accent)" />,
      badgeColor: 'var(--skills-accent)',
    },
    {
      name: t.items.js.name,
      level: t.items.js.level,
      desc: t.items.js.desc,
      category: 'active',
      icon: <Terminal size={20} color="#38bdf8" />,
      badgeColor: '#38bdf8',
    },
    {
      name: t.items.python.name,
      level: t.items.python.level,
      desc: t.items.python.desc,
      category: 'exploring',
      icon: <Terminal size={20} color="#a3e635" />,
      badgeColor: '#a3e635',
    },
    {
      name: t.items.aiTools.name,
      level: t.items.aiTools.level,
      desc: t.items.aiTools.desc,
      category: 'exploring',
      icon: <Cpu size={20} color="#f59e0b" />,
      badgeColor: '#f59e0b',
    },
    {
      name: t.items.math.name,
      level: t.items.math.level,
      desc: t.items.math.desc,
      category: 'active',
      icon: <Calculator size={20} color="#34d399" />,
      badgeColor: '#34d399',
    },
    {
      name: t.items.teaching.name,
      level: t.items.teaching.level,
      desc: t.items.teaching.desc,
      category: 'realWorld',
      icon: <MessageSquare size={20} color="#ec4899" />,
      badgeColor: '#ec4899',
    },
    {
      name: t.items.leadership.name,
      level: t.items.leadership.level,
      desc: t.items.leadership.desc,
      category: 'realWorld',
      icon: <Users2 size={20} color="#818cf8" />,
      badgeColor: '#818cf8',
    },
  ];

  const filteredSkills = activeCategory === 'all'
    ? skillsData
    : skillsData.filter((s) => s.category === activeCategory);

  return (
    <section
      id="skills"
      className="section-padding"
      style={{
        backgroundColor: 'var(--skills-bg)',
        borderTop: '1px solid var(--border-subtle)',
      }}
    >
      <div className="container-custom">
        {/* Header */}
        <div style={{ maxWidth: '780px', marginBottom: '3.5rem' }}>
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
                color: 'var(--skills-accent)',
                background: 'rgba(192, 132, 252, 0.08)',
                border: '1px solid var(--skills-border)',
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
            style={{ color: 'var(--skills-text)' }}
          />
          <ScrollRevealBox variant="clean" delay={0.15}>
            <p style={{ fontSize: '1.08rem', color: 'var(--skills-muted)', lineHeight: 1.75 }}>
              {t.subheading}
            </p>
          </ScrollRevealBox>
        </div>

        {/* Category Filters */}
        <ScrollRevealBox variant="clean" delay={0.1}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: '0.75rem',
              marginBottom: '2.75rem',
            }}
          >
            <button
              onClick={() => setActiveCategory('all')}
              style={{
                padding: '0.55rem 1.25rem',
                borderRadius: '9999px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.82rem',
                fontWeight: 600,
                background: activeCategory === 'all' ? 'var(--skills-accent)' : 'var(--skills-surface)',
                color: activeCategory === 'all' ? '#000' : 'var(--skills-text)',
                border: '1px solid',
                borderColor: activeCategory === 'all' ? 'var(--skills-accent)' : 'var(--border-subtle)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              All Areas ({skillsData.length})
            </button>
            <button
              onClick={() => setActiveCategory('active')}
              style={{
                padding: '0.55rem 1.25rem',
                borderRadius: '9999px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.82rem',
                fontWeight: 600,
                background: activeCategory === 'active' ? 'var(--skills-accent)' : 'var(--skills-surface)',
                color: activeCategory === 'active' ? '#000' : 'var(--skills-text)',
                border: '1px solid',
                borderColor: activeCategory === 'active' ? 'var(--skills-accent)' : 'var(--border-subtle)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {t.categories.active}
            </button>
            <button
              onClick={() => setActiveCategory('exploring')}
              style={{
                padding: '0.55rem 1.25rem',
                borderRadius: '9999px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.82rem',
                fontWeight: 600,
                background: activeCategory === 'exploring' ? 'var(--skills-accent)' : 'var(--skills-surface)',
                color: activeCategory === 'exploring' ? '#000' : 'var(--skills-text)',
                border: '1px solid',
                borderColor: activeCategory === 'exploring' ? 'var(--skills-accent)' : 'var(--border-subtle)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {t.categories.exploring}
            </button>
            <button
              onClick={() => setActiveCategory('realWorld')}
              style={{
                padding: '0.55rem 1.25rem',
                borderRadius: '9999px',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.82rem',
                fontWeight: 600,
                background: activeCategory === 'realWorld' ? 'var(--skills-accent)' : 'var(--skills-surface)',
                color: activeCategory === 'realWorld' ? '#000' : 'var(--skills-text)',
                border: '1px solid',
                borderColor: activeCategory === 'realWorld' ? 'var(--skills-accent)' : 'var(--border-subtle)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {t.categories.realWorld}
            </button>
          </div>
        </ScrollRevealBox>

        {/* Skills Cards Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1.75rem',
          }}
        >
          {filteredSkills.map((s, idx) => (
            <ScrollRevealBox
              key={idx}
              variant="clean"
              delay={0.06 * (idx % 3)}
              hoverEffect="border-glow"
              hoverAccentColor={s.badgeColor}
              style={{
                padding: '2rem',
                borderRadius: '18px',
                background: 'var(--skills-surface)',
                border: '1px solid var(--skills-border)',
                display: 'flex',
                flexDirection: 'column',
                gap: '1rem',
                position: 'relative',
                boxShadow: '0 10px 30px rgba(0, 0, 0, 0.25)',
              }}
            >
              <CardItem step={1} direction="pop">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div
                    style={{
                      width: '46px',
                      height: '46px',
                      borderRadius: '12px',
                      background: `${s.badgeColor}18`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {s.icon}
                  </div>

                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.72rem',
                      color: s.badgeColor,
                      background: `${s.badgeColor}12`,
                      border: `1px solid ${s.badgeColor}33`,
                      padding: '0.3rem 0.75rem',
                      borderRadius: '9999px',
                      fontWeight: 600,
                    }}
                  >
                    {s.level}
                  </span>
                </div>
              </CardItem>

              <CardItem step={2} direction="up">
                <h3
                  style={{
                    fontSize: '1.25rem',
                    fontWeight: 700,
                    marginBottom: '0.5rem',
                    color: 'var(--skills-text)',
                  }}
                >
                  {s.name}
                </h3>
              </CardItem>

              <CardItem step={3} direction="up">
                <p
                  style={{
                    fontSize: '0.92rem',
                    color: 'var(--skills-muted)',
                    lineHeight: 1.65,
                  }}
                >
                  {s.desc}
                </p>
              </CardItem>
            </ScrollRevealBox>
          ))}
        </div>
      </div>
    </section>
  );
};
