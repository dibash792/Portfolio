import React, { createContext, useContext, useEffect, useRef, useState, useMemo } from 'react';

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
}

export const ScrollRevealBox: React.FC<ScrollRevealBoxProps> = ({
  children,
  variant = 'clean',
  delay = 0,
  duration,
  hoverEffect = 'none',
  hoverAccentColor,
  as: Component = 'div',
  className = '',
  style = {},
  threshold = 0.1,
  rootMargin = '0px 0px -40px 0px',
  ...rest
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setPrefersReducedMotion(mq.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (prefersReducedMotion) {
      setIsRevealed(true);
      return;
    }

    const elem = containerRef.current;
    if (!elem) return;

    // Trigger when entering viewport. Once revealed, keep revealed so upward scrolling or fast scroll doesn't flash
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsRevealed(true);
          observer.unobserve(elem);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(elem);
    return () => observer.disconnect();
  }, [prefersReducedMotion, threshold, rootMargin]);

  // Section-specific motion character configuration
  const motionConfig = useMemo(() => {
    switch (variant) {
      case 'energetic':
        // Projects: energetic 3D perspective tilt & springy entrance
        return {
          initialTransform: 'perspective(1000px) rotateX(5deg) translateY(32px) scale(0.97)',
          revealedTransform: 'perspective(1000px) rotateX(0deg) translateY(0) scale(1)',
          ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
          defaultDuration: 0.75,
        };
      case 'clean':
        // Skills / Learning: crisp, organized upward translation
        return {
          initialTransform: 'translateY(24px) scale(0.98)',
          revealedTransform: 'translateY(0) scale(1)',
          ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
          defaultDuration: 0.65,
        };
      case 'narrative':
        // Journey & Growth: progressive narrative entrance from timeline
        return {
          initialTransform: 'translateY(28px) translateX(-8px)',
          revealedTransform: 'translateY(0) translateX(0)',
          ease: 'cubic-bezier(0.19, 1, 0.22, 1)',
          defaultDuration: 0.72,
        };
      case 'gentle':
        // Yoga & Philosophy: slow, spacious, meditative breath-like entrance
        return {
          initialTransform: 'translateY(20px) scale(0.985)',
          revealedTransform: 'translateY(0) scale(1)',
          ease: 'cubic-bezier(0.25, 1, 0.5, 1)',
          defaultDuration: 1.1,
        };
      case 'restrained':
      default:
        // Contact & Footer: elegant, restrained entrance
        return {
          initialTransform: 'translateY(18px)',
          revealedTransform: 'translateY(0)',
          ease: 'cubic-bezier(0.16, 1, 0.3, 1)',
          defaultDuration: 0.6,
        };
    }
  }, [variant]);

  const activeDuration = duration ?? motionConfig.defaultDuration;

  // Compute hover style transforms and box shadows
  const getHoverStyles = (): React.CSSProperties => {
    if (!isHovered || prefersReducedMotion) return {};

    switch (hoverEffect) {
      case 'lift':
        return {
          transform: 'translateY(-7px)',
          borderColor: hoverAccentColor || undefined,
        };
      case 'border-glow':
        return {
          transform: 'translateY(-6px)',
          borderColor: hoverAccentColor || undefined,
          boxShadow: hoverAccentColor
            ? `0 18px 40px rgba(0, 0, 0, 0.4), 0 0 24px ${hoverAccentColor}33`
            : '0 18px 40px rgba(0, 0, 0, 0.4)',
        };
      case 'glow':
        return {
          transform: 'translateY(-8px)',
          borderColor: hoverAccentColor || undefined,
          boxShadow: hoverAccentColor
            ? `0 22px 50px rgba(0, 0, 0, 0.45), 0 0 32px ${hoverAccentColor}44`
            : '0 22px 50px rgba(0, 0, 0, 0.45)',
        };
      default:
        return {};
    }
  };

  const containerStyles: React.CSSProperties = prefersReducedMotion
    ? { ...style }
    : {
        ...style,
        opacity: isRevealed ? 1 : 0,
        transform: isRevealed
          ? (isHovered && hoverEffect !== 'none' ? getHoverStyles().transform : motionConfig.revealedTransform)
          : motionConfig.initialTransform,
        transition: isRevealed
          ? (isHovered && hoverEffect !== 'none'
              ? 'transform 0.28s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.28s ease, box-shadow 0.28s ease'
              : `opacity ${activeDuration}s ${motionConfig.ease} ${delay}s, transform ${activeDuration}s ${motionConfig.ease} ${delay}s`)
          : 'none',
        willChange: 'transform, opacity',
        ...getHoverStyles(),
      };

  return (
    <RevealContext.Provider
      value={{
        isRevealed,
        baseDelay: delay,
        variant,
        prefersReducedMotion,
      }}
    >
      <Component
        ref={containerRef}
        className={`scroll-reveal-box ${isRevealed ? 'is-revealed' : ''} ${className}`}
        style={containerStyles}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        {...rest}
      >
        {children}
      </Component>
    </RevealContext.Provider>
  );
};

export interface CardItemProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  step?: number; // 1, 2, 3, 4, 5... internal reveal sequence
  direction?: 'up' | 'down' | 'left' | 'right' | 'pop' | 'fade';
  delayOffset?: number; // extra fine tuning
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
  as: Component = 'div',
  ...rest
}) => {
  const { isRevealed, baseDelay, variant, prefersReducedMotion } = useReveal();

  if (prefersReducedMotion) {
    return (
      <Component className={className} style={{ ...style, opacity: 1 }} {...rest}>
        {children}
      </Component>
    );
  }

  // Calculate internal stagger delay
  const stepInterval = variant === 'gentle' ? 0.12 : 0.08;
  const totalDelay = Math.max(0, baseDelay + 0.1 + (step - 1) * stepInterval + delayOffset);
  const duration = variant === 'gentle' ? 0.9 : 0.65;
  const ease = variant === 'gentle' ? 'cubic-bezier(0.25, 1, 0.5, 1)' : 'cubic-bezier(0.16, 1, 0.3, 1)';

  const getInitialTransform = () => {
    switch (direction) {
      case 'down':
        return 'translateY(-14px)';
      case 'left':
        return 'translateX(16px)';
      case 'right':
        return 'translateX(-16px)';
      case 'pop':
        return 'scale(0.9) translateY(8px)';
      case 'fade':
        return 'none';
      case 'up':
      default:
        return 'translateY(14px)';
    }
  };

  const itemStyles: React.CSSProperties = {
    ...style,
    opacity: isRevealed ? 1 : 0,
    transform: isRevealed ? 'none' : getInitialTransform(),
    transition: isRevealed
      ? `opacity ${duration}s ${ease} ${totalDelay}s, transform ${duration}s ${ease} ${totalDelay}s`
      : 'none',
    willChange: 'transform, opacity',
  };

  return (
    <Component className={`card-item ${isRevealed ? 'item-revealed' : ''} ${className}`} style={itemStyles} {...rest}>
      {children}
    </Component>
  );
};
