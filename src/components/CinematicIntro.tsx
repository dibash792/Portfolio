import React, { useEffect, useRef, useState } from 'react';
import { Sparkles, FastForward } from 'lucide-react';
import type { Language } from '../types';
import { translations } from '../i18n/translations';

interface CinematicIntroProps {
  onComplete: () => void;
  onTransitionStart?: () => void;
  language: Language;
}

interface Point {
  x: number;
  y: number;
}

interface Fragment {
  id: number;
  cx: number;
  cy: number;
  points: Point[];
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  width: number;
  height: number;
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  rotX: number;
  rotY: number;
  rotZ: number;
  vRotX: number;
  vRotY: number;
  vRotZ: number;
  delay: number;
  scale: number;
  opacity: number;
  canvas: HTMLCanvasElement | null;
}

// Fast Bowyer-Watson Delaunay Triangulation for organic, irregular glass shards
function delaunayTriangulate(points: Point[]): { a: Point; b: Point; c: Point }[] {
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
  for (const p of points) {
    if (p.x < minX) minX = p.x;
    if (p.y < minY) minY = p.y;
    if (p.x > maxX) maxX = p.x;
    if (p.y > maxY) maxY = p.y;
  }
  const dx = maxX - minX, dy = maxY - minY;
  const deltaMax = Math.max(dx, dy) * 2;
  const midX = (minX + maxX) / 2, midY = (minY + maxY) / 2;

  const sp1: Point = { x: midX - deltaMax * 2, y: midY - deltaMax };
  const sp2: Point = { x: midX, y: midY + deltaMax * 2 };
  const sp3: Point = { x: midX + deltaMax * 2, y: midY - deltaMax };

  let triangles = [{ a: sp1, b: sp2, c: sp3 }];

  for (const p of points) {
    const polygon: { a: Point; b: Point }[] = [];
    const badTriangles: { a: Point; b: Point; c: Point }[] = [];

    for (const t of triangles) {
      const ax = t.a.x, ay = t.a.y, bx = t.b.x, by = t.b.y, cx = t.c.x, cy = t.c.y;
      const d = 2 * (ax * (by - cy) + bx * (cy - ay) + cx * (ay - by));
      if (Math.abs(d) < 1e-9) continue;
      const ux = ((ax * ax + ay * ay) * (by - cy) + (bx * bx + by * by) * (cy - ay) + (cx * cx + cy * cy) * (ay - by)) / d;
      const uy = ((ax * ax + ay * ay) * (cx - bx) + (bx * bx + by * by) * (ax - cx) + (cx * cx + cy * cy) * (bx - ax)) / d;
      const r = Math.hypot(ax - ux, ay - uy);
      const dist = Math.hypot(p.x - ux, p.y - uy);

      if (dist <= r) {
        badTriangles.push(t);
      }
    }

    const edges: { a: Point; b: Point }[] = [];
    for (const t of badTriangles) {
      edges.push({ a: t.a, b: t.b }, { a: t.b, b: t.c }, { a: t.c, b: t.a });
    }

    for (let i = 0; i < edges.length; i++) {
      let isShared = false;
      for (let j = 0; j < edges.length; j++) {
        if (i !== j) {
          const e1 = edges[i], e2 = edges[j];
          if ((e1.a === e2.a && e1.b === e2.b) || (e1.a === e2.b && e1.b === e2.a)) {
            isShared = true;
            break;
          }
        }
      }
      if (!isShared) {
        polygon.push(edges[i]);
      }
    }

    triangles = triangles.filter((t) => !badTriangles.includes(t));

    for (const edge of polygon) {
      triangles.push({ a: edge.a, b: edge.b, c: p });
    }
  }

  // Filter out triangles connected to super-triangle
  return triangles.filter(
    (t) =>
      t.a !== sp1 && t.a !== sp2 && t.a !== sp3 &&
      t.b !== sp1 && t.b !== sp2 && t.b !== sp3 &&
      t.c !== sp1 && t.c !== sp2 && t.c !== sp3
  );
}

export const CinematicIntro: React.FC<CinematicIntroProps> = ({
  onComplete,
  onTransitionStart,
  language,
}) => {
  const [progress, setProgress] = useState(0);
  const [phase, setPhase] = useState<'loading' | 'suspense' | 'shattering' | 'done'>('loading');
  const [isDissolving, setIsDissolving] = useState(false);
  const transitionTriggeredRef = useRef(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fragmentsRef = useRef<Fragment[]>([]);
  const animationFrameRef = useRef<number | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);
  const t = translations[language].intro;

  const skip = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    setPhase('done');
    if (onTransitionStart) onTransitionStart();
    onComplete();
  };

  // Preload portrait image and run a deliberate 4.2-second smooth progress progression
  useEffect(() => {
    let isMounted = true;
    const img = new Image();
    img.src = '/dibash-portrait.jpg';
    imgRef.current = img;

    const startTime = performance.now();
    const targetDuration = 3800; // ms for 0% -> 100%

    const updateProgress = (now: number) => {
      if (!isMounted) return;
      const elapsed = now - startTime;
      const linearRatio = Math.min(elapsed / targetDuration, 1);
      // Non-linear easing: starts steady, builds momentum, settles gently at 100%
      const easedRatio = linearRatio < 0.5
        ? 2 * linearRatio * linearRatio
        : -1 + (4 - 2 * linearRatio) * linearRatio;

      const currentVal = Math.min(Math.floor(easedRatio * 100), 100);
      setProgress(currentVal);

      if (linearRatio < 1) {
        requestAnimationFrame(updateProgress);
      } else {
        setProgress(100);
        // Enter suspense hold
        setPhase('suspense');
      }
    };

    requestAnimationFrame(updateProgress);

    return () => {
      isMounted = false;
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  // When 100% is reached: hold suspense for 750ms, then trigger shattering
  useEffect(() => {
    if (phase !== 'suspense') return;

    const timer = setTimeout(() => {
      try {
        prepareIrregularFragments();
        setPhase('shattering');
      } catch (err) {
        console.warn('Canvas shard error fallback:', err);
        skip();
      }
    }, 750); // 750ms suspense pause

    return () => clearTimeout(timer);
  }, [phase]);

  // Handle ESC key to skip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        skip();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Generate irregular jagged polygonal & Delaunay shards
  const prepareIrregularFragments = () => {
    const canvas = canvasRef.current;
    const img = imgRef.current;
    if (!canvas || !img) {
      skip();
      return;
    }

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      skip();
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = window.innerWidth;
    const h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = `${w}px`;
    canvas.style.height = `${h}px`;
    ctx.scale(dpr, dpr);

    const naturalW = img.naturalWidth || 800;
    const naturalH = img.naturalHeight || 1000;
    const maxImgH = Math.min(h * 0.70, 600);
    const imgAspect = naturalW / naturalH;
    const drawH = maxImgH;
    const drawW = drawH * imgAspect;
    const drawX = (w - drawW) / 2;
    const drawY = (h - drawH) / 2 - 25;

    // Generate organic, clustered points (dense around face, jagged radiating outward)
    const points: Point[] = [];

    // 1. Boundary anchor points
    const perimeterStepsX = 8;
    const perimeterStepsY = 10;
    for (let i = 0; i <= perimeterStepsX; i++) {
      points.push({ x: drawX + (i / perimeterStepsX) * drawW, y: drawY });
      points.push({ x: drawX + (i / perimeterStepsX) * drawW, y: drawY + drawH });
    }
    for (let i = 1; i < perimeterStepsY; i++) {
      points.push({ x: drawX, y: drawY + (i / perimeterStepsY) * drawH });
      points.push({ x: drawX + drawW, y: drawY + (i / perimeterStepsY) * drawH });
    }

    // 2. Interior clustered points: Dense cluster around face & eyes
    const faceCenterX = drawX + drawW * 0.5;
    const faceCenterY = drawY + drawH * 0.38;

    // Sharp splinters in center (small needles)
    for (let i = 0; i < 45; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = Math.pow(Math.random(), 0.6) * (drawW * 0.35);
      points.push({
        x: faceCenterX + Math.cos(angle) * dist,
        y: faceCenterY + Math.sin(angle) * dist * 1.1,
      });
    }

    // Medium & large fractured plates around shoulders and perimeter
    for (let i = 0; i < 40; i++) {
      points.push({
        x: drawX + Math.random() * drawW,
        y: drawY + Math.random() * drawH,
      });
    }

    // 3. Perform Delaunay Triangulation
    const rawTriangles = delaunayTriangulate(points);

    // Filter triangles strictly inside/overlapping bounding box
    const validPolygons: Point[][] = [];
    for (const t of rawTriangles) {
      const pts = [t.a, t.b, t.c];
      const cx = (t.a.x + t.b.x + t.c.x) / 3;
      const cy = (t.a.y + t.b.y + t.c.y) / 3;
      if (cx >= drawX && cx <= drawX + drawW && cy >= drawY && cy <= drawY + drawH) {
        validPolygons.push(pts);
      }
    }

    // 4. Create offscreen canvas textures for each irregular shard
    const fragments: Fragment[] = [];
    const scaleToImgX = naturalW / drawW;
    const scaleToImgY = naturalH / drawH;

    for (let i = 0; i < validPolygons.length; i++) {
      const poly = validPolygons[i];
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      let sumX = 0, sumY = 0;

      for (const p of poly) {
        if (p.x < minX) minX = p.x;
        if (p.y < minY) minY = p.y;
        if (p.x > maxX) maxX = p.x;
        if (p.y > maxY) maxY = p.y;
        sumX += p.x;
        sumY += p.y;
      }

      const fw = Math.max(maxX - minX, 3);
      const fh = Math.max(maxY - minY, 3);
      const cx = sumX / poly.length;
      const cy = sumY / poly.length;

      // Dispersal trajectory away from face center
      const angle = Math.atan2(cy - faceCenterY, cx - faceCenterX) + (Math.random() - 0.5) * 0.4;
      const distFromCenter = Math.hypot(cx - faceCenterX, cy - faceCenterY);
      const speed = 7 + (distFromCenter / (drawW * 0.5)) * 14 + Math.random() * 8;

      // Create offscreen texture
      const offCanvas = document.createElement('canvas');
      offCanvas.width = Math.ceil(fw * dpr);
      offCanvas.height = Math.ceil(fh * dpr);
      const offCtx = offCanvas.getContext('2d');

      if (offCtx && img.complete && img.naturalWidth > 0) {
        offCtx.scale(dpr, dpr);
        offCtx.beginPath();
        offCtx.moveTo(poly[0].x - minX, poly[0].y - minY);
        for (let j = 1; j < poly.length; j++) {
          offCtx.lineTo(poly[j].x - minX, poly[j].y - minY);
        }
        offCtx.closePath();
        offCtx.clip();

        const sx = Math.max((minX - drawX) * scaleToImgX, 0);
        const sy = Math.max((minY - drawY) * scaleToImgY, 0);
        const sWidth = Math.min(fw * scaleToImgX, naturalW - sx);
        const sHeight = Math.min(fh * scaleToImgY, naturalH - sy);

        if (sWidth > 0 && sHeight > 0) {
          try {
            offCtx.drawImage(img, sx, sy, sWidth, sHeight, 0, 0, fw, fh);
            // Sharp glowing glass fractured rim
            offCtx.strokeStyle = 'rgba(0, 242, 254, 0.75)';
            offCtx.lineWidth = 1.2;
            offCtx.stroke();
          } catch {
            // Ignore slice errors
          }
        }
      }

      fragments.push({
        id: i,
        cx,
        cy,
        points: poly.map((p) => ({ x: p.x - cx, y: p.y - cy })),
        minX,
        minY,
        maxX,
        maxY,
        width: fw,
        height: fh,
        x: cx,
        y: cy,
        z: (Math.random() - 0.3) * 50,
        vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 4,
        vy: Math.sin(angle) * speed + (Math.random() - 0.5) * 4 - 2.5,
        vz: 14 + Math.random() * 26, // aggressive forward projection toward camera
        rotX: (Math.random() - 0.5) * 0.3,
        rotY: (Math.random() - 0.5) * 0.3,
        rotZ: (Math.random() - 0.5) * 0.3,
        vRotX: (Math.random() - 0.5) * 0.16,
        vRotY: (Math.random() - 0.5) * 0.16,
        vRotZ: (Math.random() - 0.5) * 0.22,
        delay: (distFromCenter / (drawW * 0.5)) * 4, // center shards detonate first!
        scale: 1,
        opacity: 1,
        canvas: offCanvas,
      });
    }

    fragmentsRef.current = fragments;
  };

  // Run the 3D scattering physics animation loop
  useEffect(() => {
    if (phase !== 'shattering') return;

    const canvas = canvasRef.current;
    if (!canvas) {
      skip();
      return;
    }
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      skip();
      return;
    }

    const startTime = performance.now();
    const duration = 2300; // ms for shatter dispersal

    const render = (now: number) => {
      const elapsed = now - startTime;
      const progressRatio = Math.min(elapsed / duration, 1);

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      let visibleCount = 0;
      const fragments = fragmentsRef.current;

      for (let i = 0; i < fragments.length; i++) {
        const frag = fragments[i];

        if (frag.delay > 0) {
          frag.delay -= 1;
          if (frag.canvas) {
            ctx.drawImage(frag.canvas, frag.minX, frag.minY, frag.width, frag.height);
          }
          visibleCount++;
          continue;
        }

        frag.x += frag.vx;
        frag.y += frag.vy;
        frag.z += frag.vz;
        frag.rotX += frag.vRotX;
        frag.rotY += frag.vRotY;
        frag.rotZ += frag.vRotZ;

        // Deceleration & exponential fade
        frag.vx *= 0.982;
        frag.vy *= 0.982;
        frag.opacity = Math.max(1 - Math.pow(progressRatio, 1.4) * 1.2, 0);

        // Perspective 3D scaling (flying past camera)
        const fov = 650;
        const scale3d = Math.max((fov + frag.z) / fov, 0.1);

        if (frag.opacity > 0.01 && frag.canvas) {
          visibleCount++;
          ctx.save();
          ctx.translate(frag.x, frag.y);
          ctx.rotate(frag.rotZ);
          ctx.scale(scale3d, scale3d);
          ctx.globalAlpha = frag.opacity;

          const halfW = frag.width / 2;
          const halfH = frag.height / 2;
          ctx.drawImage(frag.canvas, -halfW, -halfH, frag.width, frag.height);

          // Specular fractured rim glow
          ctx.strokeStyle = `rgba(0, 242, 254, ${frag.opacity * 0.8})`;
          ctx.lineWidth = 1;
          ctx.strokeRect(-halfW, -halfH, frag.width, frag.height);

          ctx.restore();
        }
      }

      if (progressRatio >= 0.58 && !transitionTriggeredRef.current) {
        transitionTriggeredRef.current = true;
        setIsDissolving(true);
        if (onTransitionStart) onTransitionStart();
      }

      if (progressRatio < 1 && visibleCount > 0) {
        animationFrameRef.current = requestAnimationFrame(render);
      } else {
        setPhase('done');
        onComplete();
      }
    };

    animationFrameRef.current = requestAnimationFrame(render);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [phase, onComplete, onTransitionStart]);

  if (phase === 'done') return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        backgroundColor: '#04060a',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        transition: isDissolving ? 'opacity 0.75s cubic-bezier(0.16, 1, 0.3, 1)' : 'opacity 0.6s ease',
        opacity: isDissolving ? 0 : phase === 'shattering' ? 0.96 : 1,
        pointerEvents: isDissolving ? 'none' : 'auto',
      }}
    >
      {/* Light Sweep Across Scene on Transition */}
      {isDissolving && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background:
              'linear-gradient(105deg, transparent 20%, rgba(0, 242, 254, 0.28) 48%, rgba(255, 255, 255, 0.45) 50%, rgba(0, 242, 254, 0.28) 52%, transparent 80%)',
            pointerEvents: 'none',
            animation: 'lightSweepAcross 0.75s ease-out forwards',
            zIndex: 15,
          }}
        />
      )}
      {/* Background Matrix/Grid lines for the HUD */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage:
            'radial-gradient(circle at center, rgba(0, 242, 254, 0.09) 0%, transparent 70%), linear-gradient(to right, rgba(0, 242, 254, 0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 242, 254, 0.03) 1px, transparent 1px)',
          backgroundSize: '100% 100%, 40px 40px, 40px 40px',
          pointerEvents: 'none',
        }}
      />

      {/* Top HUD Bar */}
      <div
        style={{
          position: 'absolute',
          top: '2rem',
          left: '2rem',
          right: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8rem',
          color: 'var(--accent-cyan)',
          letterSpacing: '0.12em',
          zIndex: 10,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <Sparkles size={16} />
          <span>{t.identity.toUpperCase()}</span>
        </div>

        <button
          onClick={skip}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.45rem',
            padding: '0.45rem 1rem',
            background: 'rgba(0, 242, 254, 0.06)',
            border: '1px solid rgba(0, 242, 254, 0.3)',
            borderRadius: '9999px',
            color: 'var(--accent-cyan)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(0, 242, 254, 0.15)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(0, 242, 254, 0.06)')}
        >
          <FastForward size={14} />
          <span>{t.skipIntro}</span>
        </button>
      </div>

      {/* Portrait Display Frame before Shattering */}
      {phase !== 'shattering' && (
        <div
          style={{
            position: 'relative',
            zIndex: 5,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            transform: 'translateY(-15px)',
          }}
        >
          <div
            style={{
              position: 'relative',
              width: 'clamp(260px, 42vw, 380px)',
              aspectRatio: '4 / 5',
              borderRadius: '16px',
              overflow: 'hidden',
              boxShadow: phase === 'suspense'
                ? '0 0 70px rgba(0, 242, 254, 0.5), 0 20px 50px rgba(0,0,0,0.9)'
                : '0 0 50px rgba(0, 242, 254, 0.25), 0 20px 40px rgba(0,0,0,0.8)',
              border: phase === 'suspense'
                ? '1px solid #00f2fe'
                : '1px solid rgba(0, 242, 254, 0.4)',
              transition: 'box-shadow 0.3s ease, border-color 0.3s ease',
            }}
          >
            <img
              src="/dibash-portrait.jpg"
              alt="Dibash Lamichhane"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: phase === 'suspense'
                  ? 'contrast(1.15) brightness(1.1) saturate(1.1)'
                  : 'contrast(1.05) brightness(1.02)',
                transition: 'filter 0.3s ease',
              }}
            />

            {/* Fracture line preview during suspense */}
            {phase === 'suspense' && (
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  backgroundImage:
                    'radial-gradient(circle at 50% 38%, transparent 40%, rgba(0, 242, 254, 0.15) 100%)',
                  boxShadow: 'inset 0 0 30px rgba(0, 242, 254, 0.6)',
                  pointerEvents: 'none',
                  animation: 'pulseCoherence 0.3s infinite alternate ease-in-out',
                }}
              />
            )}

            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '3px',
                background: 'linear-gradient(90deg, transparent, #00f2fe, transparent)',
                boxShadow: '0 0 15px #00f2fe',
                animation: 'scanline 2s infinite ease-in-out',
              }}
            />
          </div>

          <div
            style={{
              marginTop: '2rem',
              width: 'clamp(260px, 42vw, 380px)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.65rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                fontFamily: 'var(--font-mono)',
                fontSize: '0.8rem',
                color: '#94a3b8',
                letterSpacing: '0.04em',
              }}
            >
              <span>{phase === 'suspense' ? t.readyToShatter : t.loadingSubtitle}</span>
              <span
                style={{
                  color: 'var(--accent-cyan)',
                  fontWeight: 700,
                  fontSize: '0.95rem',
                  textShadow: '0 0 8px rgba(0, 242, 254, 0.6)',
                }}
              >
                {progress}%
              </span>
            </div>

            <div
              style={{
                width: '100%',
                height: '4px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '2px',
                overflow: 'hidden',
                position: 'relative',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: `${progress}%`,
                  background: 'linear-gradient(90deg, #3b82f6, #00f2fe)',
                  boxShadow: '0 0 12px #00f2fe',
                  transition: 'width 0.08s linear',
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Disintegration Canvas for 120+ Irregular Polygonal Shards */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 6,
        }}
      />

      <style>{`
        @keyframes scanline {
          0% { top: 0%; opacity: 0.8; }
          50% { top: 98%; opacity: 1; }
          100% { top: 0%; opacity: 0.8; }
        }
        @keyframes pulseCoherence {
          0% { opacity: 0.6; }
          100% { opacity: 1; }
        }
        @keyframes lightSweepAcross {
          0% { transform: translateX(-100%); opacity: 0; }
          30% { opacity: 0.95; }
          100% { transform: translateX(100%); opacity: 0; }
        }
      `}</style>
    </div>
  );
};
