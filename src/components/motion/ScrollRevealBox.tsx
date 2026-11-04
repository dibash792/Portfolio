import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { motion, type TargetAndTransition, type HTMLMotionProps } from 'motion/react';

export type MotionVariant = 'energetic' | 'clean' | 'narrative' | 'gentle' | 'restrained';
export type HoverEffect = 'lift' | 'glow' | 'border-glow' | 'none';

interface RevealContextType {
  isRevealed: boolean;
  baseDelay: number;
  variant: MotionVariant;
  prefersReducedMotion: boolean;
}

const RevealContext = createContext<RevealContextType>({
  isRevealed: false,
  baseDelay: 0,
  variant: 'clean',
  prefersReducedMotion: false,
});

export const useReveal = () => useContext(RevealContext);

export interface ScrollRevealBoxProps extends Omit<React.AllHTMLAttributes<HTMLElement>, 'as'> {
  children: React.ReactNode;
  variant?: MotionVariant;
  delay?: number; // seconds
  duration?: number; // seconds
  hoverEffect?: HoverEffect;
  hoverAccentColor?: string;
  as?: React.ElementType;
  className?: string;
  style?: React.CSSProperties;
  threshold?: number;
  rootMargin?: string;
  replay?: boolean;
}

export const ScrollRevealBox: React.FC<ScrollRevealBoxProps> = ({
  children,
  variant = 'clean',
  delay = 0,
  duration,
  hoverEffect = 'none',
  hoverAccentColor,
  as = 'div',
  className = '',
  style = {},
  threshold = 0.1,
  rootMargin = '0px 0px -40px 0px',
  replay = true,
  ...rest
}) => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  // Section-specific motion character configuration
  const motionConfig = useMemo(() => {
    switch (variant) {
      case 'energetic':
        return {
          initial: { opacity: 0, y: 32, scale: 0.97, rotateX: 5 },
          revealed: { opacity: 1, y: 0, scale: 1, rotateX: 0 },
          ease: [0.16, 1, 0.3, 1] as const,
          defaultDuration: 0.75,
        };
      case 'clean':
        return {
          initial: { opacity: 0, y: 24, scale: 0.98 },
          revealed: { opacity: 1, y: 0, scale: 1 },
          ease: [0.16, 1, 0.3, 1] as const,
          defaultDuration: 0.65,
        };
      case 'narrative':
        return {
          initial: { opacity: 0, y: 28, x: -8 },
          revealed: { opacity: 1, y: 0, x: 0 },
          ease: [0.19, 1, 0.22, 1] as const,
          defaultDuration: 0.72,
        };
      case 'gentle':
        return {
          initial: { opacity: 0, y: 20, scale: 0.985 },
          revealed: { opacity: 1, y: 0, scale: 1 },
          ease: [0.25, 1, 0.5, 1] as const,
          defaultDuration: 0.95,
        };
      case 'restrained':
      default:
        return {
          initial: { opacity: 0, y: 18 },
          revealed: { opacity: 1, y: 0 },
          ease: [0.16, 1, 0.3, 1] as const,
          defaultDuration: 0.6,
        };
    }
  }, [variant]);

  const activeDuration = duration ?? motionConfig.defaultDuration;

  // Hover target transition
  const hoverAnimation: TargetAndTransition | undefined = useMemo(() => {
    if (hoverEffect === 'none' || prefersReducedMotion) return undefined;
    switch (hoverEffect) {
      case 'lift':
        return {
          y: -7,
          borderColor: hoverAccentColor || undefined,
          transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] as const },
        };
      case 'border-glow':
        return {
          y: -6,
          borderColor: hoverAccentColor || undefined,
          boxShadow: hoverAccentColor
            ? `0 18px 40px rgba(0, 0, 0, 0.4), 0 0 24px ${hoverAccentColor}33`
            : '0 18px 40px rgba(0, 0, 0, 0.4)',
          transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] as const },
        };
      case 'glow':
        return {
          y: -8,
          borderColor: hoverAccentColor || undefined,
          boxShadow: hoverAccentColor
            ? `0 22px 50px rgba(0, 0, 0, 0.45), 0 0 32px ${hoverAccentColor}44`
            : '0 22px 50px rgba(0, 0, 0, 0.45)',
          transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] as const },
        };
      default:
        return undefined;
    }
  }, [hoverEffect, hoverAccentColor, prefersReducedMotion]);

  const MotionComponent = as === 'a' ? motion.a : motion.div;

  return (
    <RevealContext.Provider
      value={{
        isRevealed,
        baseDelay: delay,
        variant,
        prefersReducedMotion,
      }}
    >
      <MotionComponent
        className={`scroll-reveal-box ${isRevealed ? 'is-revealed' : ''} ${className}`}
        style={{
          transformStyle: 'preserve-3d',
          ...style,
        }}
        initial={prefersReducedMotion ? false : motionConfig.initial}
        whileInView={motionConfig.revealed}
        viewport={{ once: !replay, amount: threshold, margin: rootMargin }}
        transition={{
          duration: activeDuration,
          delay,
          ease: motionConfig.ease,
        }}
        whileHover={hoverAnimation}
        onViewportEnter={() => setIsRevealed(true)}
        onViewportLeave={() => {
          if (replay) setIsRevealed(false);
        }}
        {...(rest as any)}
      >
        {children}
      </MotionComponent>
    </RevealContext.Provider>
  );
};

export interface CardItemProps extends Omit<HTMLMotionProps<'div'>, 'direction'> {
  children: React.ReactNode;
  step?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'pop' | 'fade';
  delayOffset?: number;
  className?: string;
  style?: React.CSSProperties;
  as?: React.ElementType;
}

export const CardItem: React.FC<CardItemProps> = ({
  children,
  step = 1,
  direction = 'up',
  delayOffset = 0,
  className = '',
  style = {},
  as: _as,
  ...rest
}) => {
  const { isRevealed, baseDelay, variant, prefersReducedMotion } = useReveal();

  // Internal stagger delay
  const stepInterval = variant === 'gentle' ? 0.12 : 0.08;
  const totalDelay = Math.max(0, baseDelay + 0.08 + (step - 1) * stepInterval + delayOffset);
  const duration = variant === 'gentle' ? 0.85 : 0.6;
  const ease = variant === 'gentle' ? ([0.25, 1, 0.5, 1] as const) : ([0.16, 1, 0.3, 1] as const);

  const getInitial = () => {
    switch (direction) {
      case 'down':
        return { opacity: 0, y: -14 };
      case 'left':
        return { opacity: 0, x: 16 };
      case 'right':
        return { opacity: 0, x: -16 };
      case 'pop':
        return { opacity: 0, scale: 0.92, y: 8 };
      case 'fade':
        return { opacity: 0 };
      case 'up':
      default:
        return { opacity: 0, y: 14 };
    }
  };

  return (
    <motion.div
      initial={prefersReducedMotion ? false : getInitial()}
      animate={isRevealed ? { opacity: 1, x: 0, y: 0, scale: 1 } : getInitial()}
      transition={{ duration, ease, delay: totalDelay }}
      className={`card-item ${isRevealed ? 'item-revealed' : ''} ${className}`}
      style={style}
      {...rest}
    >
      {children}
    </motion.div>
  );
};
