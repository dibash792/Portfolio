import React, { useState } from 'react';
import { ExternalLink, Sparkles, Info, X, CheckCircle2 } from 'lucide-react';
import { GithubIcon } from './Icons';
import type { Language } from '../types';
import { translations } from '../i18n/translations';

import { MaskedHeading } from './motion/MaskedHeading';
import { ScrollHighlightText } from './motion/ScrollHighlightText';
import { ScrollRevealBox, CardItem } from './motion/ScrollRevealBox';

interface ProjectsProps {
  language: Language;
}

interface ProjectData {
  id: string;
  title: string;
  category: string;
  status: string;
  description: string;
  fullDetails: string;
  learnings: string;
  tags: string[];
  githubUrl?: string;
  accent: string;
  badgeBg: string;
  isSpotlight?: boolean;
}

export const Projects: React.FC<ProjectsProps> = ({ language }) => {
  const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
  const t = translations[language].projects;

  const projectList: ProjectData[] = [
    {
      id: 'rollx',
      title: t.items.rollx.title,
      category: t.items.rollx.category,
      status: t.items.rollx.status,
      description: t.items.rollx.description,
      fullDetails: t.items.rollx.fullDetails,
      learnings: t.items.rollx.learnings,
      tags: ['Concept & Prototype', 'UI/UX Design', 'Lalbandi Recreation', 'Entrepreneurship'],
      githubUrl: 'https://github.com/dibash792',
      accent: 'var(--projects-accent)',
      badgeBg: 'rgba(163, 230, 53, 0.15)',
      isSpotlight: true,
    },
    {
      id: 'webDev',
      title: t.items.webDev.title,
      category: t.items.webDev.category,
      status: t.items.webDev.status,
      description: t.items.webDev.description,
      fullDetails: t.items.webDev.fullDetails,
      learnings: t.items.webDev.learnings,
      tags: ['HTML & CSS', 'Semantic Layouts', 'Responsive Design', 'JavaScript'],
      githubUrl: 'https://github.com/dibash792',
      accent: '#38bdf8',
      badgeBg: 'rgba(56, 189, 248, 0.15)',
    },
    {
      id: 'pythonMath',
      title: t.items.pythonMath.title,
      category: t.items.pythonMath.category,
      status: t.items.pythonMath.status,
      description: t.items.pythonMath.description,
      fullDetails: t.items.pythonMath.fullDetails,
      learnings: t.items.pythonMath.learnings,
      tags: ['Python', 'Grade 11 Mathematics', 'Trigonometry', 'Logic Problem-Solving'],
      githubUrl: 'https://github.com/dibash792',
      accent: '#c084fc',
      badgeBg: 'rgba(192, 132, 252, 0.15)',
    },
    {
      id: 'aiAssisted',
      title: t.items.aiAssisted.title,
      category: t.items.aiAssisted.category,
      status: t.items.aiAssisted.status,
      description: t.items.aiAssisted.description,
      fullDetails: t.items.aiAssisted.fullDetails,
      learnings: t.items.aiAssisted.learnings,
      tags: ['Prompting', 'Workflow Acceleration', 'Student Self-Study', 'AI Tooling'],
      githubUrl: 'https://github.com/dibash792',
      accent: '#f59e0b',
      badgeBg: 'rgba(245, 158, 11, 0.15)',
    },
  ];

  return (
    <section
      id="projects"
      className="section-padding"
      style={{
        backgroundColor: 'var(--projects-bg)',
        borderTop: '1px solid var(--border-subtle)',
      }}
    >
      <div className="container-custom">
        {/* Header */}
        <div style={{ maxWidth: '780px', marginBottom: '3.75rem' }}>
          <ScrollRevealBox variant="energetic" delay={0.05}>
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
                color: 'var(--projects-accent)',
                background: 'rgba(163, 230, 53, 0.08)',
                border: '1px solid var(--projects-border)',
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
            style={{ color: 'var(--projects-text)' }}
          />
          <ScrollRevealBox variant="energetic" delay={0.15}>
            <p style={{ fontSize: '1.08rem', color: 'var(--projects-muted)', lineHeight: 1.75 }}>
              {t.subheading}
            </p>
          </ScrollRevealBox>
        </div>

        {/* Project Grid */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '2.25rem',
          }}
          className="perspective-container"
        >
          {projectList.map((p, idx) => (
            <ScrollRevealBox
              key={p.id}
              variant="energetic"
              delay={idx * 0.1}
              hoverEffect="glow"
              hoverAccentColor={p.accent}
              onClick={() => setSelectedProject(p)}
              style={{
                padding: '2.25rem',
                borderRadius: '20px',
                background: 'var(--projects-surface)',
                border: p.isSpotlight ? '2px solid var(--projects-accent)' : '1px solid var(--border-subtle)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: p.isSpotlight ? '410px' : '370px',
                position: 'relative',
                cursor: 'pointer',
                boxShadow: p.isSpotlight
                  ? '0 20px 45px rgba(0, 0, 0, 0.5), 0 0 30px var(--projects-accent-glow)'
                  : '0 15px 35px rgba(0, 0, 0, 0.3)',
              }}
            >
              <div>
                {/* Status Badges */}
                <CardItem step={1} direction="fade">
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      marginBottom: '1.25rem',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.72rem',
                        color: p.accent,
                        background: p.badgeBg,
                        border: `1px solid ${p.accent}44`,
                        padding: '0.3rem 0.75rem',
                        borderRadius: '9999px',
                        fontWeight: 600,
                      }}
                    >
                      {p.status}
                    </span>

                    {p.isSpotlight && (
                      <span
                        style={{
                          fontFamily: 'var(--font-mono)',
                          fontSize: '0.7rem',
                          background: 'var(--projects-accent)',
                          color: '#000',
                          fontWeight: 800,
                          padding: '0.2rem 0.6rem',
                          borderRadius: '4px',
                          letterSpacing: '0.05em',
                        }}
                      >
                        FEATURED CONCEPT
                      </span>
                    )}
                  </div>
                </CardItem>

                <CardItem step={2} direction="up">
                  <div
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.8rem',
                      color: 'var(--projects-muted)',
                      marginBottom: '0.45rem',
                    }}
                  >
                    {p.category}
                  </div>
                </CardItem>

                <CardItem step={3} direction="up">
                  <h3
                    style={{
                      fontSize: '1.45rem',
                      fontWeight: 800,
                      marginBottom: '0.95rem',
                      color: 'var(--projects-text)',
                    }}
                  >
                    {p.title}
                  </h3>
                </CardItem>

                <CardItem step={4} direction="up">
                  {p.isSpotlight ? (
                    <ScrollHighlightText
                      text={p.description}
                      style={{
                        fontSize: '0.94rem',
                        lineHeight: 1.7,
                        marginBottom: '1.75rem',
                      }}
                      activeColor="var(--projects-text)"
                      mutedColor="var(--projects-muted)"
                      accentColor="var(--projects-accent)"
                      accentIndices={[6, 7, 8]}
                    />
                  ) : (
                    <p
                      style={{
                        fontSize: '0.94rem',
                        color: 'var(--projects-muted)',
                        lineHeight: 1.7,
                        marginBottom: '1.75rem',
                      }}
                    >
                      {p.description}
                    </p>
                  )}
                </CardItem>
              </div>

              <div>
                {/* Tags */}
                <CardItem step={5} direction="up">
                  <div
                    style={{
                      display: 'flex',
                      flexWrap: 'wrap',
                      gap: '0.5rem',
                      marginBottom: '1.5rem',
                    }}
                  >
                    {p.tags.map((tag) => (
                      <span
                        key={tag}
                        style={{
                          fontSize: '0.74rem',
                          fontFamily: 'var(--font-mono)',
                          padding: '0.25rem 0.6rem',
                          borderRadius: '6px',
                          background: 'rgba(255, 255, 255, 0.04)',
                          border: '1px solid var(--border-subtle)',
                          color: 'var(--projects-text)',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </CardItem>

                <CardItem step={6} direction="up">
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      paddingTop: '1rem',
                      borderTop: '1px solid var(--border-subtle)',
                      fontSize: '0.86rem',
                      fontWeight: 600,
                      color: p.accent,
                    }}
                  >
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      <Info size={15} />
                      <span>{t.viewDetails}</span>
                    </span>
                    <ExternalLink size={15} />
                  </div>
                </CardItem>
              </div>
            </ScrollRevealBox>
          ))}
        </div>

        {/* Modal for In-depth Project Details */}
        {selectedProject && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 2000,
              backgroundColor: 'rgba(0, 0, 0, 0.88)',
              backdropFilter: 'blur(16px)',
              WebkitBackdropFilter: 'blur(16px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '1.5rem',
            }}
            onClick={() => setSelectedProject(null)}
          >
            <div
              style={{
                maxWidth: '680px',
                width: '100%',
                maxHeight: '90vh',
                overflowY: 'auto',
                padding: '2.5rem',
                borderRadius: '24px',
                background: 'var(--projects-surface)',
                border: `2px solid ${selectedProject.accent}`,
                position: 'relative',
                boxShadow: `0 30px 80px rgba(0,0,0,0.9), 0 0 40px ${selectedProject.accent}33`,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedProject(null)}
                style={{
                  position: 'absolute',
                  top: '1.5rem',
                  right: '1.5rem',
                  width: '38px',
                  height: '38px',
                  borderRadius: '50%',
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--projects-text)',
                }}
                aria-label="Close details"
              >
                <X size={18} />
              </button>

              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.35rem 0.85rem',
                  borderRadius: '9999px',
                  background: `${selectedProject.accent}15`,
                  border: `1px solid ${selectedProject.accent}44`,
                  color: selectedProject.accent,
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  marginBottom: '1.25rem',
                }}
              >
                <span>{selectedProject.status}</span>
                <span>•</span>
                <span>{selectedProject.category}</span>
              </div>

              <h3
                style={{
                  fontSize: '1.85rem',
                  fontWeight: 800,
                  marginBottom: '1.5rem',
                  color: 'var(--projects-text)',
                }}
              >
                {selectedProject.title}
              </h3>

              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.75rem',
                  marginBottom: '2.25rem',
                }}
              >
                <div>
                  <h4
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.85rem',
                      color: selectedProject.accent,
                      textTransform: 'uppercase',
                      marginBottom: '0.65rem',
                      letterSpacing: '0.08em',
                    }}
                  >
                    Context & Purpose
                  </h4>
                  <p
                    style={{
                      fontSize: '1rem',
                      color: 'var(--projects-muted)',
                      lineHeight: 1.75,
                    }}
                  >
                    {selectedProject.fullDetails}
                  </p>
                </div>

                <div
                  style={{
                    padding: '1.35rem',
                    borderRadius: '14px',
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-subtle)',
                  }}
                >
                  <h4
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '0.85rem',
                      color: selectedProject.accent,
                      textTransform: 'uppercase',
                      marginBottom: '0.65rem',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                    }}
                  >
                    <CheckCircle2 size={16} />
                    <span>Real Practical Learnings</span>
                  </h4>
                  <p
                    style={{
                      fontSize: '0.94rem',
                      color: 'var(--projects-text)',
                      lineHeight: 1.65,
                    }}
                  >
                    {selectedProject.learnings}
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {selectedProject.githubUrl && (
                  <a
                    href={selectedProject.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn-primary"
                    style={{
                      background: `linear-gradient(135deg, ${selectedProject.accent}, #22c55e)`,
                      color: '#000',
                    }}
                  >
                    <GithubIcon size={16} />
                    <span>{t.viewGithub}</span>
                  </a>
                )}
                <button
                  onClick={() => setSelectedProject(null)}
                  className="btn-secondary"
                >
                  <span>{t.closeDetails}</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
