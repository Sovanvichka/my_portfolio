import { useEffect, useRef } from 'react';
import { usePreferences } from '../context/PreferencesContext';

interface HoloNode {
  x: number;
  y: number;
  z: number;
  vx: number;
  vy: number;
  vz: number;
  size: number;
  hue: 'cyan' | 'cobalt' | 'violet';
}

interface HoloPulse {
  from: number;
  to: number;
  progress: number;
  speed: number;
}

/**
 * Live 3D-projected Holographic Technology Background.
 * Adapts palette seamlessly between Dark Midnight Navy and Light Daylight Slate.
 */
export function HologramBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { theme } = usePreferences();
  const themeRef = useRef(theme);
  const drawStaticRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    themeRef.current = theme;
    drawStaticRef.current?.();
  }, [theme]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    let reducedMotion = motionQuery.matches;

    let width = window.innerWidth;
    let height = window.innerHeight;
    let dpr = Math.min(window.devicePixelRatio || 1, 1.5);
    let isMobile = width < 768;

    let pointerX = 0;
    let pointerY = 0;
    let smoothPointerX = 0;
    let smoothPointerY = 0;
    let scrollOffset = window.scrollY;

    const nodes: HoloNode[] = [];
    const pulses: HoloPulse[] = [];

    const initNodes = () => {
      nodes.length = 0;
      pulses.length = 0;
      const count = isMobile ? 22 : 44;
      const hues: HoloNode['hue'][] = ['cyan', 'cobalt', 'violet'];

      for (let i = 0; i < count; i++) {
        nodes.push({
          x: (Math.random() - 0.5) * 1.9,
          y: (Math.random() - 0.5) * 1.6,
          z: 0.25 + Math.random() * 1.4,
          vx: (Math.random() - 0.5) * 0.045,
          vy: (Math.random() - 0.5) * 0.035,
          vz: (Math.random() - 0.5) * 0.03,
          size: 1.4 + Math.random() * 1.8,
          hue: hues[i % hues.length],
        });
      }

      const pulseCount = isMobile ? 6 : 14;
      for (let i = 0; i < pulseCount; i++) {
        const from = i % count;
        const to = (from + 3 + (i % 5)) % count;
        pulses.push({
          from,
          to,
          progress: Math.random(),
          speed: 0.22 + Math.random() * 0.28,
        });
      }
    };

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      isMobile = width < 768;
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      initNodes();
    };

    resize();

    const projectedX = new Float32Array(64);
    const projectedY = new Float32Array(64);
    const projectedScale = new Float32Array(64);

    let frameId = 0;
    let lastTime = performance.now();
    let elapsed = 0;

    const drawHologramGrid = (t: number, px: number, py: number, isDark: boolean) => {
      const horizonY = height * 0.56 - py * 18 - (scrollOffset * 0.03) % 40;
      const centerX = width * 0.5 + px * 26;

      ctx.save();
      ctx.lineWidth = 1;

      const cols = isMobile ? 10 : 18;
      const spreadX = width * 0.85;
      for (let i = -cols; i <= cols; i++) {
        const ratio = i / cols;
        const topX = centerX + ratio * (width * 0.22);
        const bottomX = centerX + ratio * spreadX * 1.35;

        const grad = ctx.createLinearGradient(topX, horizonY, bottomX, height);
        if (isDark) {
          grad.addColorStop(0, 'rgba(34, 211, 238, 0)');
          grad.addColorStop(0.35, 'rgba(37, 99, 235, 0.09)');
          grad.addColorStop(1, 'rgba(34, 211, 238, 0.14)');
        } else {
          grad.addColorStop(0, 'rgba(37, 99, 235, 0)');
          grad.addColorStop(0.35, 'rgba(37, 99, 235, 0.09)');
          grad.addColorStop(1, 'rgba(8, 145, 178, 0.16)');
        }

        ctx.strokeStyle = grad;
        ctx.beginPath();
        ctx.moveTo(topX, horizonY);
        ctx.lineTo(bottomX, height);
        ctx.stroke();
      }

      const rows = isMobile ? 8 : 12;
      const drift = reducedMotion ? 0 : (t * 0.16) % 1;
      for (let r = 0; r < rows; r++) {
        const norm = (r + drift) / rows;
        const depth = norm * norm;
        const y = horizonY + depth * (height - horizonY);
        const alpha = Math.sin(norm * Math.PI) * (isDark ? 0.14 : 0.12);
        if (alpha <= 0.005) continue;

        ctx.strokeStyle = isDark
          ? `rgba(56, 189, 248, ${alpha.toFixed(3)})`
          : `rgba(37, 99, 235, ${alpha.toFixed(3)})`;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }
      ctx.restore();
    };

    const drawOrbitalReticle = (t: number, px: number, py: number, isDark: boolean) => {
      const cx = width * (isMobile ? 0.5 : 0.68) + px * 22;
      const cy = height * 0.48 + py * 16;
      const baseRadius = Math.min(width, height) * (isMobile ? 0.34 : 0.36);

      ctx.save();
      ctx.translate(cx, cy);

      ctx.save();
      ctx.rotate(reducedMotion ? 0.2 : t * 0.045);
      ctx.strokeStyle = isDark ? 'rgba(34, 211, 238, 0.14)' : 'rgba(8, 145, 178, 0.18)';
      ctx.lineWidth = 1;
      ctx.setLineDash([6, 14, 2, 14]);
      ctx.beginPath();
      ctx.arc(0, 0, baseRadius, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      ctx.save();
      ctx.rotate(reducedMotion ? -0.4 : -t * 0.07);
      ctx.strokeStyle = isDark ? 'rgba(59, 130, 246, 0.18)' : 'rgba(37, 99, 235, 0.2)';
      ctx.lineWidth = 1.25;
      for (let a = 0; a < 4; a++) {
        const start = (a * Math.PI) / 2 + 0.18;
        ctx.beginPath();
        ctx.arc(0, 0, baseRadius * 0.78, start, start + 0.68);
        ctx.stroke();
      }
      ctx.restore();

      if (!reducedMotion) {
        const scanY = Math.sin(t * 0.45) * baseRadius * 0.85;
        const scanGrad = ctx.createLinearGradient(-baseRadius, scanY, baseRadius, scanY);
        if (isDark) {
          scanGrad.addColorStop(0, 'rgba(34, 211, 238, 0)');
          scanGrad.addColorStop(0.5, 'rgba(34, 211, 238, 0.16)');
          scanGrad.addColorStop(1, 'rgba(34, 211, 238, 0)');
        } else {
          scanGrad.addColorStop(0, 'rgba(37, 99, 235, 0)');
          scanGrad.addColorStop(0.5, 'rgba(8, 145, 178, 0.22)');
          scanGrad.addColorStop(1, 'rgba(37, 99, 235, 0)');
        }
        ctx.strokeStyle = scanGrad;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(-baseRadius, scanY);
        ctx.lineTo(baseRadius, scanY);
        ctx.stroke();
      }

      ctx.restore();
    };

    const drawConstellation = (dt: number, t: number, px: number, py: number, isDark: boolean) => {
      const fov = Math.min(width, height) * 0.78;
      const scrollParallax = (scrollOffset * 0.00025) % 0.6;

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (!reducedMotion) {
          n.x += n.vx * dt;
          n.y += n.vy * dt;
          n.z += n.vz * dt;

          if (n.x > 1.05 || n.x < -1.05) n.vx *= -1;
          if (n.y > 0.85 || n.y < -0.85) n.vy *= -1;
          if (n.z > 1.75 || n.z < 0.25) n.vz *= -1;
        }

        const scale = fov / (n.z + 1.0);
        const sx = width * 0.5 + (n.x + px * 0.08 * (1.8 - n.z)) * scale;
        const sy = height * 0.5 + (n.y + py * 0.06 * (1.8 - n.z) - scrollParallax * 0.35) * scale;

        projectedX[i] = sx;
        projectedY[i] = sy;
        projectedScale[i] = Math.max(0.35, 1.4 - n.z * 0.55);
      }

      const maxDist = isMobile ? 140 : 185;
      const maxDistSq = maxDist * maxDist;
      ctx.lineWidth = 0.85;

      for (let i = 0; i < nodes.length; i++) {
        const x1 = projectedX[i];
        const y1 = projectedY[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = x1 - projectedX[j];
          const dy = y1 - projectedY[j];
          const dSq = dx * dx + dy * dy;
          if (dSq < maxDistSq) {
            const alpha = (1 - Math.sqrt(dSq) / maxDist) * (isDark ? 0.2 : 0.16);
            ctx.strokeStyle = isDark
              ? `rgba(56, 189, 248, ${alpha.toFixed(3)})`
              : `rgba(37, 99, 235, ${alpha.toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(x1, y1);
            ctx.lineTo(projectedX[j], projectedY[j]);
            ctx.stroke();
          }
        }
      }

      if (!reducedMotion) {
        for (let p = 0; p < pulses.length; p++) {
          const pulse = pulses[p];
          pulse.progress += pulse.speed * dt;
          if (pulse.progress >= 1) {
            pulse.progress = 0;
            pulse.from = pulse.to;
            pulse.to = (pulse.to + 2 + (p % 7)) % nodes.length;
          }

          const x1 = projectedX[pulse.from];
          const y1 = projectedY[pulse.from];
          const x2 = projectedX[pulse.to];
          const y2 = projectedY[pulse.to];
          const pxPos = x1 + (x2 - x1) * pulse.progress;
          const pyPos = y1 + (y2 - y1) * pulse.progress;

          const tail = Math.max(0, pulse.progress - 0.18);
          const txPos = x1 + (x2 - x1) * tail;
          const tyPos = y1 + (y2 - y1) * tail;

          const grad = ctx.createLinearGradient(txPos, tyPos, pxPos, pyPos);
          if (isDark) {
            grad.addColorStop(0, 'rgba(34, 211, 238, 0)');
            grad.addColorStop(1, 'rgba(103, 232, 249, 0.55)');
          } else {
            grad.addColorStop(0, 'rgba(37, 99, 235, 0)');
            grad.addColorStop(1, 'rgba(8, 145, 178, 0.55)');
          }
          ctx.strokeStyle = grad;
          ctx.lineWidth = 1.4;
          ctx.beginPath();
          ctx.moveTo(txPos, tyPos);
          ctx.lineTo(pxPos, pyPos);
          ctx.stroke();

          ctx.fillStyle = isDark ? 'rgba(165, 243, 252, 0.85)' : 'rgba(37, 99, 235, 0.82)';
          ctx.beginPath();
          ctx.arc(pxPos, pyPos, 1.8, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const x = projectedX[i];
        const y = projectedY[i];
        const s = projectedScale[i];
        const r = n.size * s;
        const pulse = reducedMotion ? 0.75 : 0.65 + 0.35 * Math.sin(t * 1.6 + i);

        let fill = '';
        if (isDark) {
          fill = `rgba(34, 211, 238, ${(0.45 * pulse).toFixed(3)})`;
          if (n.hue === 'cobalt') fill = `rgba(59, 130, 246, ${(0.48 * pulse).toFixed(3)})`;
          if (n.hue === 'violet') fill = `rgba(139, 92, 246, ${(0.42 * pulse).toFixed(3)})`;
        } else {
          fill = `rgba(8, 145, 178, ${(0.44 * pulse).toFixed(3)})`;
          if (n.hue === 'cobalt') fill = `rgba(37, 99, 235, ${(0.46 * pulse).toFixed(3)})`;
          if (n.hue === 'violet') fill = `rgba(124, 58, 237, ${(0.36 * pulse).toFixed(3)})`;
        }

        ctx.fillStyle = fill;
        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fill();

        if (i % 5 === 0) {
          ctx.strokeStyle = isDark
            ? `rgba(103, 232, 249, ${(0.22 * pulse).toFixed(3)})`
            : `rgba(37, 99, 235, ${(0.24 * pulse).toFixed(3)})`;
          ctx.lineWidth = 0.8;
          ctx.beginPath();
          ctx.moveTo(x - r * 2.4, y);
          ctx.lineTo(x + r * 2.4, y);
          ctx.moveTo(x, y - r * 2.4);
          ctx.lineTo(x, y + r * 2.4);
          ctx.stroke();
        }
      }
    };

    const render = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;
      if (!reducedMotion) {
        elapsed += dt;
      }

      const damp = 1 - Math.exp(-6 * dt);
      smoothPointerX += (pointerX - smoothPointerX) * damp;
      smoothPointerY += (pointerY - smoothPointerY) * damp;

      const isDark = themeRef.current === 'dark';

      ctx.clearRect(0, 0, width, height);

      const wash = ctx.createRadialGradient(
        width * 0.72 + smoothPointerX * 24,
        height * 0.32 + smoothPointerY * 18,
        20,
        width * 0.72,
        height * 0.32,
        Math.max(width, height) * 0.65,
      );
      if (isDark) {
        wash.addColorStop(0, 'rgba(34, 211, 238, 0.075)');
        wash.addColorStop(0.45, 'rgba(37, 99, 235, 0.045)');
        wash.addColorStop(1, 'rgba(7, 21, 46, 0)');
      } else {
        wash.addColorStop(0, 'rgba(34, 211, 238, 0.1)');
        wash.addColorStop(0.45, 'rgba(37, 99, 235, 0.06)');
        wash.addColorStop(1, 'rgba(244, 247, 252, 0)');
      }
      ctx.fillStyle = wash;
      ctx.fillRect(0, 0, width, height);

      drawHologramGrid(elapsed, smoothPointerX, smoothPointerY, isDark);
      drawOrbitalReticle(elapsed, smoothPointerX, smoothPointerY, isDark);
      drawConstellation(dt, elapsed, smoothPointerX, smoothPointerY, isDark);

      if (!reducedMotion && !document.hidden) {
        frameId = requestAnimationFrame(render);
      }
    };

    drawStaticRef.current = () => {
      if (reducedMotion || document.hidden) {
        render(performance.now());
      }
    };

    const start = () => {
      cancelAnimationFrame(frameId);
      lastTime = performance.now();
      frameId = requestAnimationFrame(render);
    };

    const handlePointerMove = (e: PointerEvent) => {
      pointerX = (e.clientX / Math.max(width, 1)) * 2 - 1;
      pointerY = (e.clientY / Math.max(height, 1)) * 2 - 1;
    };

    const handleScroll = () => {
      scrollOffset = window.scrollY;
    };

    const handleVisibility = () => {
      if (!document.hidden && !reducedMotion) {
        start();
      } else {
        cancelAnimationFrame(frameId);
      }
    };

    const handleMotionChange = (e: MediaQueryListEvent) => {
      reducedMotion = e.matches;
      if (reducedMotion) {
        cancelAnimationFrame(frameId);
        render(performance.now());
      } else {
        start();
      }
    };

    const handleResize = () => {
      resize();
      if (reducedMotion) {
        render(performance.now());
      }
    };

    window.addEventListener('resize', handleResize, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    document.addEventListener('visibilitychange', handleVisibility);
    motionQuery.addEventListener('change', handleMotionChange);

    start();

    return () => {
      cancelAnimationFrame(frameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('visibilitychange', handleVisibility);
      motionQuery.removeEventListener('change', handleMotionChange);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-0 h-full w-full"
    />
  );
}
