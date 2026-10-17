import React, { useRef, useState } from 'react';

interface MagneticProps {
  children: React.ReactNode;
  strength?: number; // pull multiplier (default: 0.25)
  className?: string;
  style?: React.CSSProperties;
}

export const Magnetic: React.FC<MagneticProps> = ({
  children,
  strength = 0.22,
  className = '',
  style = {},
}) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    // Only apply on non-touch devices
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const elem = ref.current;
    if (!elem) return;

    const rect = elem.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    // Clamp maximum translation to prevent extreme offsets
    const maxOffset = 8;
    const clampedX = Math.max(-maxOffset, Math.min(maxOffset, deltaX));
    const clampedY = Math.max(-maxOffset, Math.min(maxOffset, deltaY));

    setPosition({ x: clampedX, y: clampedY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`magnetic-wrapper ${className}`}
      style={{
        display: 'inline-block',
        transform: `translate3d(${position.x}px, ${position.y}px, 0)`,
        transition: position.x === 0 && position.y === 0 ? 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)' : 'transform 0.1s ease-out',
        willChange: 'transform',
        ...style,
      }}
    >
      {children}
    </div>
  );
};
