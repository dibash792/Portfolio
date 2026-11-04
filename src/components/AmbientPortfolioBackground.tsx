import React, { useEffect, useRef } from 'react';
import type { Theme } from '../types';

interface AmbientPortfolioBackgroundProps {
  theme: Theme;
}

interface Point3D {
  x: number;
  y: number;
  z: number;
}

interface FloatingCube {
  x: number;          // -500 to +500
  baseY: number;      // based on page percentage or continuous loop
  y: number;
  z: number;          // 50 to 500 depth
  size: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  vRotX: number;
  vRotY: number;
  vRotZ: number;
  driftSpeedY: number;
  driftSpeedX: number;
  floatOffset: number;
  isWireframe: boolean;
  opacity: number;
  sectionZone: number; // 0: about, 1: projects, 2: skills, 3: journey, 4: yoga, 5: contact
}

interface AmbientParticle {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  radius: number;
  alpha: number;
  pulseSpeed: number;
  pulseOffset: number;
}

export const AmbientPortfolioBackground: React.FC<AmbientPortfolioBackgroundProps> = ({ theme }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number | null = null;
    let isVisible = true;
    let scrollY = window.scrollY;
    let targetScrollY = window.scrollY;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const isMobile = window.innerWidth < 768;

    // Canvas sizing with DPR cap
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = window.innerWidth;
    let height = window.innerHeight;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener('resize', resize, { passive: true });

    // Track scroll with passive listener
    const onScroll = () => {
      targetScrollY = window.scrollY;
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    const isViolet = theme === 'warm-violet' || theme === 'light';

    // 1. Color Palette for active atmosphere
    const primaryRGB = isViolet ? '192, 132, 252' : '0, 242, 254';      // Amethyst vs Cyan
    const accentRGB = isViolet ? '232, 121, 249' : '56, 189, 248';      // Orchid vs Sky Blue
    const deepRGB = isViolet ? '124, 58, 237' : '37, 99, 235';          // Royal Violet vs Azure
    const warmMoteRGB = isViolet ? '244, 114, 182' : '45, 212, 191';    // Rose vs Teal

    // 2. Generate Floating Geometric 3D Cubes with Multi-Layered Depth
    const cubeCount = isMobile ? 14 : 24;
    const cubes: FloatingCube[] = [];

    for (let i = 0; i < cubeCount; i++) {
      const zone = i % 6; // Distributed across page sections
      const sizeTiers = [18, 26, 34, 46];
      const size = sizeTiers[Math.floor(Math.random() * sizeTiers.length)];

      cubes.push({
        x: (Math.random() - 0.5) * (width * 1.35),
        baseY: (i / cubeCount) * height * 1.6 - height * 0.3,
        y: (i / cubeCount) * height * 1.6 - height * 0.3,
        z: 90 + Math.random() * 420,
        size,
        rotX: Math.random() * Math.PI * 2,
        rotY: Math.random() * Math.PI * 2,
        rotZ: Math.random() * Math.PI * 2,
        vRotX: (Math.random() - 0.5) * 0.006,
        vRotY: (Math.random() - 0.5) * 0.007,
        vRotZ: (Math.random() - 0.5) * 0.005,
        driftSpeedY: (0.14 + Math.random() * 0.28) * (prefersReducedMotion ? 0.05 : 1),
        driftSpeedX: (Math.random() - 0.5) * 0.12 * (prefersReducedMotion ? 0.05 : 1),
        floatOffset: Math.random() * Math.PI * 2,
        isWireframe: Math.random() > 0.3, // Mix of pure wireframes and translucent glass facets
        opacity: 0.18 + Math.random() * 0.28,
        sectionZone: zone,
      });
    }

    // 3. Ambient Stardust Motes & Spatial Light Filaments
    const particleCount = isMobile ? 16 : 28;
    const particles: AmbientParticle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        z: 80 + Math.random() * 320,
        vx: (Math.random() - 0.5) * 0.22 * (prefersReducedMotion ? 0.05 : 1),
        vy: (-0.1 - Math.random() * 0.22) * (prefersReducedMotion ? 0.05 : 1),
        radius: 1.2 + Math.random() * 1.6,
        alpha: 0.18 + Math.random() * 0.35,
        pulseSpeed: 1.0 + Math.random() * 1.8,
        pulseOffset: Math.random() * Math.PI * 2,
      });
    }

    // Isometric 3D projection helper
    // Projects 3D point (x, y, z) into 2D screen coordinate
    const project = (p: Point3D, fov = 500): { sx: number; sy: number; scale: number } => {
      const scale = fov / Math.max(fov + p.z, 20);
      return {
        sx: width / 2 + p.x * scale,
        sy: height / 2 + p.y * scale,
        scale,
      };
    };

    // Draw a projected 3D Box with lighting and crisp wireframe or translucent facets
    const draw3DCube = (cube: FloatingCube, scrollOffset: number, time: number) => {
      // Perspective parallax depth: farther objects move slower with scroll
      const parallaxY = scrollOffset * (1 - cube.z / 650) * 0.22;
      const breathingY = Math.sin(time * 0.8 + cube.floatOffset) * 12;

      let currentY = ((cube.baseY - parallaxY) % (height * 1.5 + 200));
      if (currentY < -150) currentY += height * 1.5 + 200;
      if (currentY > height + 150) currentY -= height * 1.5 + 200;

      const half = cube.size / 2;

      // Local 8 vertices of a cube centered at origin
      const rawVerts: Point3D[] = [
        { x: -half, y: -half, z: -half },
        { x: half, y: -half, z: -half },
        { x: half, y: half, z: -half },
        { x: -half, y: half, z: -half },
        { x: -half, y: -half, z: half },
        { x: half, y: -half, z: half },
        { x: half, y: half, z: half },
        { x: -half, y: half, z: half },
      ];

      // Rotate vertices
      const cosX = Math.cos(cube.rotX), sinX = Math.sin(cube.rotX);
      const cosY = Math.cos(cube.rotY), sinY = Math.sin(cube.rotY);
      const cosZ = Math.cos(cube.rotZ), sinZ = Math.sin(cube.rotZ);

      const rotated: Point3D[] = rawVerts.map((v) => {
        // Rot X
        const y1 = v.y * cosX - v.z * sinX;
        const z1 = v.y * sinX + v.z * cosX;
        // Rot Y
        const x2 = v.x * cosY + z1 * sinY;
        const z2 = -v.x * sinY + z1 * cosY;
        // Rot Z
        const x3 = x2 * cosZ - y1 * sinZ;
        const y3 = x2 * sinZ + y1 * cosZ;

        return {
          x: x3 + cube.x,
          y: y3 + (currentY - height / 2) + breathingY,
          z: z2 + cube.z,
        };
      });

      const projected = rotated.map((r) => project(r));

      // 6 faces (each has 4 vertex indices)
      const faces = [
        [0, 1, 2, 3], // Front
        [5, 4, 7, 6], // Back
        [4, 0, 3, 7], // Left
        [1, 5, 6, 2], // Right
        [4, 5, 1, 0], // Top
        [3, 2, 6, 7], // Bottom
      ];

      // Wireframe edges
      const edges = [
        [0, 1], [1, 2], [2, 3], [3, 0],
        [4, 5], [5, 6], [6, 7], [7, 4],
        [0, 4], [1, 5], [2, 6], [3, 7],
      ];

      // Subtle solid fill
      if (!cube.isWireframe) {
        ctx.fillStyle = `rgba(${deepRGB}, ${cube.opacity * 0.12})`;
        for (const face of faces) {
          ctx.beginPath();
          ctx.moveTo(projected[face[0]].sx, projected[face[0]].sy);
          for (let fi = 1; fi < face.length; fi++) {
            ctx.lineTo(projected[face[fi]].sx, projected[face[fi]].sy);
          }
          ctx.closePath();
          ctx.fill();
        }
      }

      // Crisp glowing wireframe outlines
      ctx.strokeStyle = `rgba(${cube.isWireframe ? primaryRGB : accentRGB}, ${cube.opacity * 0.75})`;
      ctx.lineWidth = 1.0;
      ctx.beginPath();
      for (const [e1, e2] of edges) {
        ctx.moveTo(projected[e1].sx, projected[e1].sy);
        ctx.lineTo(projected[e2].sx, projected[e2].sy);
      }
      ctx.stroke();

      // Soft corner vertex glints on wireframes
      if (cube.isWireframe) {
        ctx.fillStyle = `rgba(${accentRGB}, ${cube.opacity * 0.75})`;
        for (const pt of projected) {
          ctx.beginPath();
          ctx.arc(pt.sx, pt.sy, 0.9, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    };

    // Pause when page is hidden
    const handleVisibility = () => {
      isVisible = !document.hidden;
      if (isVisible && !animId) {
        lastTime = performance.now();
        render(lastTime);
      }
    };
    document.addEventListener('visibilitychange', handleVisibility);

    let lastTime = performance.now();

    const render = (now: number) => {
      if (!isVisible) {
        animId = null;
        return;
      }

      animId = requestAnimationFrame(render);
      lastTime = now;
      const time = now * 0.001;

      // Smooth scroll interpolation
      scrollY += (targetScrollY - scrollY) * 0.08;

      ctx.clearRect(0, 0, width, height);

      // 1. Subtle Ethereal Filaments between nearby stardust motes (Delicate, soft cosmic aura)
      for (let i = 0; i < particles.length; i++) {
        const p1 = particles[i];
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const distSq = dx * dx + dy * dy;
          if (distSq < 75 * 75) {
            const dist = Math.sqrt(distSq);
            const lineAlpha = (1 - dist / 75) * 0.11;
            ctx.strokeStyle = `rgba(${accentRGB}, ${lineAlpha})`;
            ctx.lineWidth = 0.65;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
          }
        }
      }

      // 2. Animate and Draw Luminous Ambient Stardust Motes
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        p.x += p.vx;
        p.y += p.vy;

        // Wrap around viewport edges
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Gentle pulse
        const pulse = Math.sin(time * p.pulseSpeed + p.pulseOffset) * 0.25 + 0.75;
        const currentAlpha = p.alpha * pulse * 0.7;

        ctx.fillStyle = `rgba(${warmMoteRGB}, ${currentAlpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Animate and Draw Floating 3D Cubes
      for (let i = 0; i < cubes.length; i++) {
        const cube = cubes[i];

        if (!prefersReducedMotion) {
          cube.rotX += cube.vRotX;
          cube.rotY += cube.vRotY;
          cube.rotZ += cube.vRotZ;
          cube.baseY -= cube.driftSpeedY;
          cube.x += cube.driftSpeedX;

          // Gentle drift boundaries
          if (cube.x < -width * 0.6) cube.x = width * 0.6;
          if (cube.x > width * 0.6) cube.x = -width * 0.6;
        }

        draw3DCube(cube, scrollY, time);
      }
    };

    animId = requestAnimationFrame(render);

    return () => {
      if (animId) cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
      window.removeEventListener('scroll', onScroll);
      document.removeEventListener('visibilitychange', handleVisibility);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      className="ambient-portfolio-background"
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        opacity: 0.9,
        transition: 'opacity 0.8s ease',
      }}
      aria-hidden="true"
    />
  );
};
