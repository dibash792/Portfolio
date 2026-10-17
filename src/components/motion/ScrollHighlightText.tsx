import React, { useEffect, useRef, useState, useMemo } from 'react';

interface ScrollHighlightTextProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  activeColor?: string;
  mutedColor?: string;
  accentIndices?: number[]; // indices of words to highlight in special accent color
  accentColor?: string;
}

export const ScrollHighlightText: React.FC<ScrollHighlightTextProps> = ({
  text,
  className = '',
  style = {},
  activeColor,
  mutedColor,
  accentIndices = [],
  accentColor = 'var(--accent-cyan)',
}) => {
  const containerRef = useRef<HTMLParagraphElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mediaQuery.matches);

    const listener = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener('change', listener);
    return () => mediaQuery.removeEventListener('change', listener);
  }, []);

  const words = useMemo(() => text.split(/\s+/).filter(Boolean), [text]);

  useEffect(() => {
    if (prefersReducedMotion) {
      setProgress(1);
      return;
    }

    const container = containerRef.current;
    if (!container) return;

    let ticking = false;

    const calculateProgress = () => {
      const rect = container.getBoundingClientRect();
      const windowH = window.innerHeight;

      // Element starts highlighting when its top enters 85% of viewport
      // and completes when its center reaches 38% of viewport
      const startY = windowH * 0.85;
      const endY = windowH * 0.38;

      const current = rect.top;
      const rawRatio = (startY - current) / (startY - endY);
      const clamped = Math.max(0, Math.min(1, rawRatio));

      setProgress(clamped);
      ticking = false;
    };

    const onScrollOrResize = () => {
      if (!ticking) {
        requestAnimationFrame(calculateProgress);
        ticking = true;
      }
    };

    // Initial calculation
    calculateProgress();

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScrollOrResize);
      window.removeEventListener('resize', onScrollOrResize);
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <p ref={containerRef} className={className} style={{ ...style, opacity: 1 }}>
        {text}
      </p>
    );
  }

  const totalWords = words.length;

  return (
    <p
      ref={containerRef}
      className={`scroll-highlight-container ${className}`}
      style={{
        lineHeight: 1.8,
        position: 'relative',
        display: 'inline-block',
        ...style,
      }}
    >
      {words.map((word, idx) => {
        // Compute threshold for this specific word
        const wordThreshold = idx / (totalWords || 1);
        const isHighlighted = progress >= wordThreshold;
        const isAccent = accentIndices.includes(idx);

        const targetColor = isHighlighted
          ? isAccent
            ? accentColor
            : activeColor || 'inherit'
          : mutedColor || 'rgba(148, 163, 184, 0.35)';

        const targetOpacity = isHighlighted ? 1 : 0.28;

        return (
          <span
            key={idx}
            className="scroll-highlight-word"
            style={{
              display: 'inline-block',
              marginRight: '0.28em',
              transition: 'opacity 0.28s cubic-bezier(0.16, 1, 0.3, 1), color 0.28s ease',
              opacity: targetOpacity,
              color: targetColor,
              fontWeight: isHighlighted && isAccent ? 600 : 'inherit',
            }}
          >
            {word}
          </span>
        );
      })}
    </p>
  );
};
