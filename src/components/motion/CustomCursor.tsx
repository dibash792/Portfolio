import React, { useEffect, useRef, useState } from 'react';
import type { Theme } from '../../types';

interface CustomCursorProps {
  theme?: Theme;
}

export const CustomCursor: React.FC<CustomCursorProps> = ({ theme = 'cool-blue' }) => {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const labelRef = useRef<HTMLSpanElement | null>(null);

  const [cursorState, setCursorState] = useState<'default' | 'hover' | 'card' | 'text'>('default');
  const [cursorLabel, setCursorLabel] = useState<string>('');
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  const isViolet = theme === 'warm-violet' || theme === 'light';
  const primaryColor = isViolet ? '#c084fc' : '#00f2fe';
  const glowColor = isViolet ? 'rgba(192, 132, 252, 0.45)' : 'rgba(0, 242, 254, 0.45)';

  useEffect(() => {
    // Check for touch / coarse pointer or reduced motion preference
    if (
      typeof window === 'undefined' ||
      window.matchMedia('(pointer: coarse)').matches ||
      'ontouchstart' in window ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setIsTouchDevice(true);
      return;
    }

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let animId: number | null = null;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) setIsVisible(true);

      // Inspect hovered target for interactive cues
      const target = e.target as HTMLElement | null;
      if (!target) return;

      if (target.closest('#hero-portrait-card')) {
        setCursorState('card');
        setCursorLabel('');
      } else if (target.closest('#projects .scroll-reveal-box')) {
        setCursorState('card');
        setCursorLabel('VIEW ↗');
      } else if (
        target.closest('a, button, input, textarea, select, [role="button"], .btn-primary, .btn-secondary')
      ) {
        setCursorState('hover');
        setCursorLabel('');
      } else if (target.closest('p, h1, h2, h3, h4, span, li, blockquote')) {
        setCursorState('text');
        setCursorLabel('');
      } else {
        setCursorState('default');
        setCursorLabel('');
      }
    };

    const onMouseDown = () => setIsMouseDown(true);
    const onMouseUp = () => setIsMouseDown(false);
    const onMouseLeave = () => setIsVisible(false);
    const onMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    // Silky smooth trailing spring / lerp animation loop
    const render = () => {
      // Linear interpolation: ring glides smoothly toward dot
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
      }

      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
      }

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
    };
  }, [isVisible]);

  if (isTouchDevice) return null;

  const isInteractive = cursorState === 'hover' || cursorState === 'card';
  const ringSize = cursorState === 'card' && cursorLabel ? 60 : isInteractive ? 48 : isMouseDown ? 24 : 32;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 99999,
        overflow: 'hidden',
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.25s ease',
      }}
      aria-hidden="true"
    >
      {/* Precision Center Dot */}
      <div
        ref={dotRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: isInteractive ? '8px' : '6px',
          height: isInteractive ? '8px' : '6px',
          marginTop: isInteractive ? '-4px' : '-3px',
          marginLeft: isInteractive ? '-4px' : '-3px',
          borderRadius: '50%',
          backgroundColor: primaryColor,
          boxShadow: `0 0 12px ${primaryColor}, 0 0 4px #ffffff`,
          transition: 'width 0.2s cubic-bezier(0.16, 1, 0.3, 1), height 0.2s cubic-bezier(0.16, 1, 0.3, 1), background-color 0.3s ease',
          willChange: 'transform',
        }}
      />

      {/* Trailing Luminous Halo & Target Ring */}
      <div
        ref={ringRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: `${ringSize}px`,
          height: `${ringSize}px`,
          marginTop: `-${ringSize / 2}px`,
          marginLeft: `-${ringSize / 2}px`,
          borderRadius: '50%',
          border: `1.5px solid ${isInteractive ? primaryColor : `${primaryColor}66`}`,
          backgroundColor: isInteractive ? `${primaryColor}18` : 'transparent',
          boxShadow: isInteractive
            ? `0 0 20px ${glowColor}, inset 0 0 10px ${glowColor}`
            : `0 0 10px ${glowColor}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition:
            'width 0.25s cubic-bezier(0.16, 1, 0.3, 1), height 0.25s cubic-bezier(0.16, 1, 0.3, 1), margin 0.25s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s ease, background-color 0.25s ease',
          willChange: 'transform',
        }}
      >
        {cursorLabel && (
          <span
            ref={labelRef}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.62rem',
              fontWeight: 800,
              letterSpacing: '0.08em',
              color: '#ffffff',
              textShadow: `0 0 6px ${primaryColor}`,
              textTransform: 'uppercase',
              pointerEvents: 'none',
              animation: 'pulseLabel 1.5s infinite ease-in-out',
            }}
          >
            {cursorLabel}
          </span>
        )}
      </div>

      <style>{`
        @keyframes pulseLabel {
          0%, 100% { transform: scale(1); opacity: 0.95; }
          50% { transform: scale(1.08); opacity: 1; }
        }
      `}</style>
    </div>
  );
};

