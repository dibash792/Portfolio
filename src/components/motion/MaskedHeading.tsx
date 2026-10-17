import React, { useEffect, useRef, useState, useMemo } from 'react';

interface MaskedHeadingProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'h4';
  className?: string;
  style?: React.CSSProperties;
  wordByWord?: boolean;
  staggerDelay?: number; // seconds
  gentle?: boolean; // for yoga / reflective sections
  highlightWords?: string[];
  highlightColor?: string;
}

export const MaskedHeading: React.FC<MaskedHeadingProps> = ({
  text,
  as: Component = 'h2',
  className = '',
  style = {},
  wordByWord = true,
  staggerDelay = 0.05,
  gentle = false,
  highlightWords = [],
  highlightColor,
}) => {
  const containerRef = useRef<HTMLHeadingElement | null>(null);
  const [inView, setInView] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      setInView(true);
      return;
    }

    const elem = containerRef.current;
    if (!elem) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          // Keep in view without resetting to avoid jarring flickering on fast scroll
          observer.unobserve(elem);
        }
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );

    observer.observe(elem);
    return () => observer.disconnect();
  }, [prefersReducedMotion]);

  const words = useMemo(() => text.split(/\s+/).filter(Boolean), [text]);

  const ease = gentle ? 'cubic-bezier(0.25, 1, 0.5, 1)' : 'cubic-bezier(0.16, 1, 0.3, 1)';
  const duration = gentle ? '1.1s' : '0.85s';

  if (prefersReducedMotion) {
    return (
      <Component ref={containerRef} className={className} style={{ ...style, opacity: 1 }}>
        {text}
      </Component>
    );
  }

  if (!wordByWord) {
    return (
      <Component
        ref={containerRef}
        className={className}
        style={{
          ...style,
          overflow: 'hidden',
          display: 'block',
        }}
      >
        <span
          style={{
            display: 'block',
            transform: inView ? 'translateY(0)' : 'translateY(110%)',
            opacity: inView ? 1 : 0,
            transition: `transform ${duration} ${ease}, opacity ${duration} ${ease}`,
            willChange: 'transform, opacity',
          }}
        >
          {text}
        </span>
      </Component>
    );
  }

  return (
    <Component
      ref={containerRef}
      className={className}
      style={{
        ...style,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'baseline',
      }}
    >
      {words.map((word, idx) => {
        const cleanWord = word.replace(/[^a-zA-Z0-9\u0900-\u097F]/g, '');
        const isHighlight = highlightWords.some(
          (hw) => hw.toLowerCase() === cleanWord.toLowerCase()
        );
        const delay = idx * staggerDelay;

        return (
          <span
            key={idx}
            style={{
              display: 'inline-block',
              overflow: 'hidden',
              verticalAlign: 'bottom',
              marginRight: '0.28em',
              paddingBottom: '0.08em', // prevents font descender clipping
            }}
          >
            <span
              style={{
                display: 'inline-block',
                transform: inView ? 'translateY(0)' : 'translateY(115%)',
                opacity: inView ? 1 : 0.05,
                transition: `transform ${duration} ${ease} ${delay}s, opacity ${duration} ${ease} ${delay}s`,
                willChange: 'transform, opacity',
                color: isHighlight && highlightColor ? highlightColor : 'inherit',
              }}
            >
              {word}
            </span>
          </span>
        );
      })}
    </Component>
  );
};
