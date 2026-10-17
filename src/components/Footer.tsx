import React from 'react';
import { ArrowUp } from 'lucide-react';
import { GithubIcon, LinkedinIcon } from './Icons';
import type { Language } from '../types';
import { translations } from '../i18n/translations';
import { ScrollRevealBox, CardItem } from './motion/ScrollRevealBox';

interface FooterProps {
  language: Language;
}

export const Footer: React.FC<FooterProps> = ({ language }) => {
  const t = translations[language].footer;

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer
      style={{
        padding: '4.5rem 0 3rem 0',
        borderTop: '1px solid var(--border-subtle)',
        background: 'var(--bg-secondary)',
        position: 'relative',
        zIndex: 10,
      }}
    >
      <div className="container-custom">
        <ScrollRevealBox variant="restrained" delay={0.05}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '2rem',
              marginBottom: '3rem',
            }}
          >
            {/* Brand & Headline */}
            <CardItem step={1} direction="up">
              <div>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: '1.35rem',
                    fontWeight: 800,
                    marginBottom: '0.45rem',
                  }}
                >
                  DIBASH<span style={{ color: 'var(--accent-cyan)' }}>.L</span>
                </div>
                <p
                  style={{
                    fontSize: '0.92rem',
                    color: 'var(--text-secondary)',
                    fontStyle: 'italic',
                  }}
                >
                  "{t.tagline}"
                </p>
              </div>
            </CardItem>

            {/* Socials & Return to Top */}
            <CardItem step={2} direction="up">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <a
                  href="https://github.com/dibash792"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub Profile"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    transition: 'transform 0.2s ease, border-color 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.borderColor = 'var(--accent-cyan)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  }}
                >
                  <GithubIcon size={17} />
                </a>

                <a
                  href="https://www.linkedin.com/in/dibash-lamichhane-47871b434"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn Profile"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '38px',
                    height: '38px',
                    borderRadius: '50%',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border-subtle)',
                    color: 'var(--text-primary)',
                    transition: 'transform 0.2s ease, border-color 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.borderColor = 'var(--accent-cyan)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'var(--border-subtle)';
                  }}
                >
                  <LinkedinIcon size={17} />
                </a>

                <button
                  onClick={scrollToTop}
                  className="btn-secondary"
                  style={{
                    padding: '0.5rem 1rem',
                    fontSize: '0.82rem',
                    gap: '0.4rem',
                  }}
                >
                  <span>{t.backToTop}</span>
                  <ArrowUp size={14} />
                </button>
              </div>
            </CardItem>
          </div>
        </ScrollRevealBox>

        {/* Bottom Credits & Origin */}
        <ScrollRevealBox variant="restrained" delay={0.15}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              alignItems: 'center',
              gap: '1rem',
              paddingTop: '2rem',
              borderTop: '1px solid var(--border-subtle)',
              fontSize: '0.82rem',
              color: 'var(--text-tertiary)',
              fontFamily: 'var(--font-mono)',
            }}
          >
            <div>© {new Date().getFullYear()} {t.rights}</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
              <span>{t.location}</span>
            </div>
          </div>
        </ScrollRevealBox>
      </div>
    </footer>
  );
};
