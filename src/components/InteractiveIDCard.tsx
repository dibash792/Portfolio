import React, { useState, useRef } from 'react';
import { Sparkles, BookOpen } from 'lucide-react';
import { motion, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'motion/react';
import type { Language, Theme } from '../types';
import { translations } from '../i18n/translations';

interface InteractiveIDCardProps {
  language: Language;
  theme?: Theme;
  isRevealed?: boolean;
}

export const InteractiveIDCard: React.FC<InteractiveIDCardProps> = ({
  language,
  theme = 'cool-blue',
  isRevealed = true,
}) => {
  const t = translations[language].hero;
  const cardRef = useRef<HTMLDivElement | null>(null);

  // Normalized mouse coordinates (-1 to 1 relative to card center)
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Physics-based spring configuration for smooth, natural lag-free motion
  const springConfig = { damping: 22, stiffness: 220, mass: 0.6 };
  const smoothMouseX = useSpring(mouseX, springConfig);
  const smoothMouseY = useSpring(mouseY, springConfig);

  // Subtle 6.5° maximum tilt (strictly between 5° and 8° as specified)
  // Tilt direction:
  // Cursor moves right -> card tilts toward right (rotateY > 0)
  // Cursor moves left -> card tilts toward left (rotateY < 0)
  // Cursor moves top -> card tilts toward top (rotateX > 0)
  // Cursor moves bottom -> card tilts toward bottom (rotateX < 0)
  const rotateX = useTransform(smoothMouseY, [-1, 1], [6.5, -6.5]);
  const rotateY = useTransform(smoothMouseX, [-1, 1], [-6.5, 6.5]);

  // Dynamic directional shadow responding to tilt
  const shadowX = useTransform(smoothMouseX, [-1, 1], [18, -18]);
  const shadowY = useTransform(smoothMouseY, [-1, 1], [14, 38]);

  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });

  const isViolet = theme === 'warm-violet' || theme === 'light';
  const accentColor = isViolet ? 'var(--hero-accent)' : 'var(--hero-accent)';
  const glowColor = isViolet ? 'var(--hero-accent-glow)' : 'var(--hero-accent-glow)';

  const dynamicBoxShadow = useMotionTemplate`${shadowX}px ${shadowY}px 55px -12px rgba(0, 0, 0, 0.85), 0 0 38px ${glowColor}`;

  // Mouse-follow 3D tilt tracking
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only track non-touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Normalize from -1 to 1 relative to center
    const normX = Math.max(-1, Math.min(1, (x / rect.width) * 2 - 1));
    const normY = Math.max(-1, Math.min(1, (y / rect.height) * 2 - 1));

    mouseX.set(normX);
    mouseY.set(normY);

    setGlowPos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
    });
  };

  // Smooth physical spring return to neutral position when cursor leaves
  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
    setGlowPos({ x: 50, y: 50 });
  };

  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        perspective: '1200px',
        width: '100%',
        maxWidth: '410px',
      }}
    >
      <motion.div
        id="hero-portrait-card"
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        initial={{ opacity: 0, scale: 0.96 }}
        animate={isRevealed ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.96 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        style={{
          position: 'relative',
          width: '100%',
          aspectRatio: '4 / 5.1',
          borderRadius: '24px',
          transformStyle: 'preserve-3d',
          rotateX,
          rotateY,
          boxShadow: dynamicBoxShadow,
          cursor: 'default',
        }}
        aria-label="Dibash Lamichhane — Student-Builder ID Credential"
      >
        {/* Forward-Facing Cyber Portrait Frame */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '24px',
            overflow: 'hidden',
            border: `1.5px solid ${accentColor}`,
            backgroundColor: '#04060a',
            transformStyle: 'preserve-3d',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {/* Main Photo */}
          <img
            src="/dibash-portrait.jpg"
            alt="Dibash Lamichhane"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'contrast(1.05) brightness(1.02)',
              pointerEvents: 'none',
            }}
          />

          {/* Dynamic Light Sheen tracking cursor */}
          <div
            style={{
              position: 'absolute',
              inset: 0,
              background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, rgba(255, 255, 255, 0.28) 0%, transparent 60%)`,
              pointerEvents: 'none',
              mixBlendMode: 'overlay',
            }}
          />

          {/* Top Cybernetic ID Header HUD */}
          <div
            style={{
              position: 'absolute',
              top: '1rem',
              left: '1rem',
              right: '1rem',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '0.45rem 0.85rem',
              borderRadius: '9999px',
              background: 'rgba(4, 7, 17, 0.8)',
              backdropFilter: 'blur(12px)',
              WebkitBackdropFilter: 'blur(12px)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              fontFamily: 'var(--font-mono)',
              fontSize: '0.7rem',
              letterSpacing: '0.08em',
              zIndex: 3,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: accentColor, fontWeight: 700 }}>
              <span
                style={{
                  width: '7px',
                  height: '7px',
                  borderRadius: '50%',
                  background: accentColor,
                  boxShadow: `0 0 8px ${accentColor}`,
                  animation: 'pulseBeacon 2s infinite ease-in-out',
                }}
              />
              <span>NSS LAINCHAUR</span>
            </div>
            <span style={{ color: 'var(--hero-muted)', fontWeight: 600 }}>2026 – PRESENT</span>
          </div>

          {/* Holographic Corner Brackets */}
          <div
            style={{
              position: 'absolute',
              top: '12px',
              left: '12px',
              width: '16px',
              height: '16px',
              borderTop: `2px solid ${accentColor}`,
              borderLeft: `2px solid ${accentColor}`,
              pointerEvents: 'none',
              zIndex: 2,
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              width: '16px',
              height: '16px',
              borderTop: `2px solid ${accentColor}`,
              borderRight: `2px solid ${accentColor}`,
              pointerEvents: 'none',
              zIndex: 2,
            }}
          />

          {/* Bottom Identity Scrim */}
          <div
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '2.5rem 1.25rem 1.25rem',
              background: 'linear-gradient(to top, rgba(4, 7, 17, 0.96) 0%, rgba(4, 7, 17, 0.72) 65%, transparent 100%)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem',
              zIndex: 3,
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.68rem',
                color: accentColor,
                fontWeight: 700,
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
              }}
            >
              GRADE 11–12 SCIENCE // BUILDER
            </span>
            <h3
              style={{
                fontFamily: 'var(--font-heading)',
                fontSize: '1.3rem',
                fontWeight: 800,
                color: '#ffffff',
                lineHeight: 1.2,
              }}
            >
              Dibash Lamichhane
            </h3>
            <span
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.72rem',
                color: 'var(--hero-muted)',
              }}
            >
              National School of Sciences (NSS), Lainchaur
            </span>
          </div>
        </div>

        {/* Floating 3D HUD Badges with Natural Depth */}
        {/* Top-Right Floating Chip */}
        <div
          style={{
            position: 'absolute',
            top: '-15px',
            right: '-15px',
            padding: '0.55rem 0.95rem',
            borderRadius: '12px',
            background: 'var(--hero-surface)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid var(--hero-border)',
            boxShadow: 'var(--shadow-3d)',
            transform: 'translateZ(38px)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.76rem',
            color: 'var(--hero-text)',
            fontWeight: 600,
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          <Sparkles size={14} color={accentColor} />
          <span>{t.stats.role}</span>
        </div>

        {/* Bottom Floating Chip */}
        <div
          style={{
            position: 'absolute',
            bottom: '-15px',
            left: '14px',
            padding: '0.6rem 1rem',
            borderRadius: '14px',
            background: 'var(--hero-surface)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            border: '1px solid var(--border-subtle)',
            boxShadow: 'var(--shadow-3d)',
            transform: 'translateZ(32px)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.74rem',
            color: 'var(--hero-text)',
            fontWeight: 600,
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          <BookOpen size={14} color={accentColor} />
          <span>{t.stats.teaching}</span>
        </div>
      </motion.div>

      <style>{`
        @keyframes pulseBeacon {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.45; transform: scale(1.3); }
        }
      `}</style>
    </div>
  );
};
