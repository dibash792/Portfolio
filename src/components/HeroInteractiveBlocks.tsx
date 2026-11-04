import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import type { Theme } from '../types';

interface HeroInteractiveBlocksProps {
  theme: Theme;
  isRevealed?: boolean;
}

interface BlockMesh {
  mesh: THREE.Group;
  baseX: number;
  baseY: number;
  baseZ: number;
  rotSpeedX: number;
  rotSpeedY: number;
  rotSpeedZ: number;
  floatSpeed: number;
  floatOffset: number;
  floatAmplitude: number;
  parallaxFactor: number;
}

export const HeroInteractiveBlocks: React.FC<HeroInteractiveBlocksProps> = ({
  theme,
  isRevealed = true,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let renderer: THREE.WebGLRenderer | null = null;
    let animId: number | null = null;
    const blocks: BlockMesh[] = [];
    const geometriesToDispose: THREE.BufferGeometry[] = [];
    const materialsToDispose: THREE.Material[] = [];

    let handleMouseMove: ((e: MouseEvent) => void) | null = null;
    let handleResize: (() => void) | null = null;
    let handleVisibilityChange: (() => void) | null = null;

    try {
      const width = container.clientWidth || window.innerWidth;
      const height = container.clientHeight || window.innerHeight;

      // 1. Scene, Camera, Renderer
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(55, width / height, 0.1, 1000);
      camera.position.z = 75;

      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true, powerPreference: 'default' });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      container.appendChild(renderer.domElement);

      const isViolet = theme === 'warm-violet' || theme === 'light';

      // 2. Atmosphere-coordinated color palette
      const primaryColor = isViolet ? 0xc084fc : 0x00f2fe; // Amethyst vs Electric Cyan
      const deepColor = isViolet ? 0x7c3aed : 0x0369a1;    // Royal Violet vs Ocean Azure
      const accentColor = isViolet ? 0xe879f9 : 0x38bdf8;  // Orchid Lavender vs Sky Azure
      const wireframeColor = isViolet ? 0xf472b6 : 0x38bdf8; // Rose Violet vs Neon Azure

      // Lighting for depth
      const ambientLight = new THREE.AmbientLight(0xffffff, isViolet ? 0.95 : 0.85);
      scene.add(ambientLight);

      const dirLight = new THREE.DirectionalLight(0xffffff, isViolet ? 1.5 : 1.4);
      dirLight.position.set(40, 60, 50);
      scene.add(dirLight);

      const themePointLight = new THREE.PointLight(primaryColor, 3.5, 130);
      themePointLight.position.set(-20, 10, 30);
      scene.add(themePointLight);

      // Subtle fill light on right
      const fillPointLight = new THREE.PointLight(accentColor, 1.8, 100);
      fillPointLight.position.set(30, -20, 20);
      scene.add(fillPointLight);

      // 3. Create field of Large and Small Interactive Blue Blocks
      // Distributed across hero space (accentuating background without obscuring center content)
      const isMobile = window.innerWidth < 768;
      const blockCount = isMobile ? 16 : 28;

      // Block size tiers: large, medium, small, micro
      const sizeTiers = [
        { size: [7.5, 7.5, 7.5], weight: 0.15 }, // Large signature blocks
        { size: [4.8, 4.8, 4.8], weight: 0.35 }, // Medium blocks
        { size: [2.8, 2.8, 2.8], weight: 0.30 }, // Small blocks
        { size: [1.6, 1.6, 1.6], weight: 0.20 }, // Micro floating cubes
      ];

      for (let i = 0; i < blockCount; i++) {
        // Pick size tier
        const randTier = Math.random();
        let chosenTier = sizeTiers[1];
        let cumulative = 0;
        for (const tier of sizeTiers) {
          cumulative += tier.weight;
          if (randTier <= cumulative) {
            chosenTier = tier;
            break;
          }
        }

        const [w, h, d] = chosenTier.size;
        const boxGeo = new THREE.BoxGeometry(w, h, d);
        geometriesToDispose.push(boxGeo);

        // Styling: some are solid translucent glass, some are wireframe cyber-blocks
        const isWireframe = Math.random() > 0.65;
        const group = new THREE.Group();

        if (isWireframe) {
          // Cyber wireframe block with glowing edges
          const edgesGeo = new THREE.EdgesGeometry(boxGeo);
          geometriesToDispose.push(edgesGeo);

          const lineMat = new THREE.LineBasicMaterial({
            color: wireframeColor,
            transparent: true,
            opacity: 0.75,
            linewidth: 1.5,
          });
          materialsToDispose.push(lineMat);

          const wireframeMesh = new THREE.LineSegments(edgesGeo, lineMat);
          group.add(wireframeMesh);

          // Subtle inner core
          const innerMat = new THREE.MeshBasicMaterial({
            color: deepColor,
            transparent: true,
            opacity: 0.14,
          });
          materialsToDispose.push(innerMat);
          group.add(new THREE.Mesh(boxGeo, innerMat));
        } else {
          // Solid translucent atmospheric block
          const boxMat = new THREE.MeshStandardMaterial({
            color: Math.random() > 0.4 ? primaryColor : deepColor,
            roughness: 0.22,
            metalness: 0.45,
            transparent: true,
            opacity: 0.45,
          });
          materialsToDispose.push(boxMat);

          const solidMesh = new THREE.Mesh(boxGeo, boxMat);
          group.add(solidMesh);

          // Crisp edge highlight
          const edgesGeo = new THREE.EdgesGeometry(boxGeo);
          geometriesToDispose.push(edgesGeo);
          const edgeMat = new THREE.LineBasicMaterial({
            color: wireframeColor,
            transparent: true,
            opacity: 0.65,
          });
          materialsToDispose.push(edgeMat);
          group.add(new THREE.LineSegments(edgesGeo, edgeMat));
        }

        // Spread across hero backdrop (biased toward sides and background for text legibility)
        const sideSign = Math.random() > 0.5 ? 1 : -1;
        const spreadX = sideSign * (18 + Math.random() * 45); // push away from center text
        const spreadY = (Math.random() - 0.5) * 55;
        const spreadZ = -20 + (Math.random() - 0.5) * 45;

        group.position.set(spreadX, spreadY, spreadZ);
        group.rotation.set(
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2,
          Math.random() * Math.PI * 2
        );

        scene.add(group);

        blocks.push({
          mesh: group,
          baseX: spreadX,
          baseY: spreadY,
          baseZ: spreadZ,
          rotSpeedX: (Math.random() - 0.5) * 0.008,
          rotSpeedY: (Math.random() - 0.5) * 0.012,
          rotSpeedZ: (Math.random() - 0.5) * 0.008,
          floatSpeed: 0.8 + Math.random() * 1.2,
          floatOffset: Math.random() * Math.PI * 2,
          floatAmplitude: 1.5 + Math.random() * 2.5,
          parallaxFactor: 0.5 + Math.random() * 1.5,
        });
      }

      // 4. Pointer Interaction
      let mouseX = 0;
      let mouseY = 0;
      let targetX = 0;
      let targetY = 0;

      handleMouseMove = (e: MouseEvent) => {
        // Calculate normalized pointer coordinates (-1 to 1)
        mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
        mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
      };

      window.addEventListener('mousemove', handleMouseMove, { passive: true });

      handleResize = () => {
        if (!container) return;
        const newW = container.clientWidth || window.innerWidth;
        const newH = container.clientHeight || window.innerHeight;
        camera.aspect = newW / newH;
        camera.updateProjectionMatrix();
        renderer?.setSize(newW, newH);
      };

      window.addEventListener('resize', handleResize);

      // 5. Animation Loop
      let clock = new THREE.Clock();
      let isVisible = true;

      handleVisibilityChange = () => {
        isVisible = !document.hidden;
        if (isVisible && !animId) {
          clock.start();
          animate();
        }
      };
      document.addEventListener('visibilitychange', handleVisibilityChange);

      const animate = () => {
        if (!isVisible) {
          animId = null;
          return;
        }
        animId = requestAnimationFrame(animate);
        const elapsedTime = clock.getElapsedTime();

        // Smooth camera dampening toward mouse target
        targetX += (mouseX * 10 - targetX) * 0.045;
        targetY += (-mouseY * 8 - targetY) * 0.045;

        camera.position.x = targetX;
        camera.position.y = targetY;
        camera.lookAt(0, 0, 0);

        // Animate each blue block
        for (let i = 0; i < blocks.length; i++) {
          const b = blocks[i];

          // Continuous rotation
          b.mesh.rotation.x += b.rotSpeedX;
          b.mesh.rotation.y += b.rotSpeedY;
          b.mesh.rotation.z += b.rotSpeedZ;

          // Natural breathing float
          const floatY = Math.sin(elapsedTime * b.floatSpeed + b.floatOffset) * b.floatAmplitude;

          // Dynamic mouse parallax shift per block
          const mouseShiftX = -mouseX * 4 * b.parallaxFactor;
          const mouseShiftY = mouseY * 3 * b.parallaxFactor;

          b.mesh.position.x = b.baseX + mouseShiftX;
          b.mesh.position.y = b.baseY + floatY + mouseShiftY;
        }

        renderer?.render(scene, camera);
      };

      animate();
    } catch (err) {
      console.warn('WebGL Interactive Blocks fallback applied:', err);
    }

    return () => {
      if (handleVisibilityChange) document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (animId) cancelAnimationFrame(animId);
      if (handleMouseMove) window.removeEventListener('mousemove', handleMouseMove);
      if (handleResize) window.removeEventListener('resize', handleResize);
      if (container && renderer?.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      geometriesToDispose.forEach((g) => g.dispose());
      materialsToDispose.forEach((m) => m.dispose());
      renderer?.dispose();
    };
  }, [theme]);

  return (
    <div
      ref={containerRef}
      className="hero-interactive-blocks-container"
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
        opacity: isRevealed ? 0.92 : 0,
        transition: 'opacity 1.2s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
    />
  );
};
