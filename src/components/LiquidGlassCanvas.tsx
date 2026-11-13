import { type RefObject, useEffect, useRef, useState } from 'react';
import { usePreferences } from '../context/PreferencesContext';
import { LiquidGlassEngine, isWebGLAvailable } from './LiquidGlassEngine';
import { LiquidGlassFallback } from './LiquidGlassFallback';

interface LiquidGlassCanvasProps {
  stageRef?: RefObject<HTMLElement | null>;
  compact?: boolean;
}

export default function LiquidGlassCanvas({
  stageRef,
  compact = false,
}: LiquidGlassCanvasProps) {
  const { theme } = usePreferences();
  const localWrapperRef = useRef<HTMLDivElement | null>(null);
  const mountRef = useRef<HTMLDivElement | null>(null);
  const glowRef = useRef<HTMLDivElement | null>(null);
  const engineRef = useRef<LiquidGlassEngine | null>(null);
  const scrollStateRef = useRef({ progress: 0, exitFade: 1 });
  const [contextFailed, setContextFailed] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isWebGLAvailable()) {
      setContextFailed(true);
      return;
    }

    const mountEl = mountRef.current;
    if (!mountEl) return;

    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const engine = new LiquidGlassEngine(mountEl, motionQuery.matches, {
      onHoverChange: (hovered) => setIsHovered(hovered),
      onParallaxUpdate: (ox, oy, hoverIntensity) => {
        if (glowRef.current) {
          const { progress } = scrollStateRef.current;
          const isDesktop = window.innerWidth >= 1024;
          const baseShiftX = isDesktop ? (0.24 - progress * 0.48) * window.innerWidth : 0;
          const tx = baseShiftX + ox * -34;
          const ty = oy * 28;
          const scale = 1 + hoverIntensity * 0.14;
          glowRef.current.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${scale})`;
          glowRef.current.style.opacity = String(0.62 + hoverIntensity * 0.28);
        }
      },
      onContextLost: () => setContextFailed(true),
    });

    engineRef.current = engine;
    engine.setTheme(theme);

    const computeScroll = () => {
      const targetEl = stageRef?.current ?? localWrapperRef.current;
      if (!targetEl) return;

      const rect = targetEl.getBoundingClientRect();
      const vh = window.innerHeight || 900;

      if (compact) {
        const p = Math.min(Math.max(-rect.top / Math.max(vh * 0.7, 1), 0), 1);
        scrollStateRef.current.progress = p;
        scrollStateRef.current.exitFade = 1;
        engine.setScrollProgress(p, 1);
        return;
      }

      const scrollableDistance = Math.max(rect.height - vh, vh * 0.85);
      const rawProgress = -rect.top / scrollableDistance;
      const progress = Math.min(Math.max(rawProgress, 0), 1);

      const overflow = Math.max(0, rawProgress - 1);
      const exitFade = Math.min(Math.max(1 - overflow * 2.5, 0.25), 1);

      scrollStateRef.current.progress = progress;
      scrollStateRef.current.exitFade = exitFade;
      engine.setScrollProgress(progress, exitFade);

      if (localWrapperRef.current) {
        localWrapperRef.current.style.opacity = String(exitFade);
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      const targetEl = stageRef?.current ?? localWrapperRef.current;
      if (!targetEl) {
        engine.setPointer(e.clientX, e.clientY);
        return;
      }
      const rect = targetEl.getBoundingClientRect();
      if (e.clientY >= rect.top - 80 && e.clientY <= rect.bottom + 80) {
        engine.setPointer(e.clientX, e.clientY);
      } else {
        engine.resetPointer();
      }
    };

    const handlePointerLeave = () => {
      engine.resetPointer();
    };

    const handleMotionChange = (e: MediaQueryListEvent) => {
      engine.setReducedMotion(e.matches);
    };

    computeScroll();
    window.addEventListener('scroll', computeScroll, { passive: true });
    window.addEventListener('resize', computeScroll, { passive: true });
    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('pointerleave', handlePointerLeave);
    motionQuery.addEventListener('change', handleMotionChange);

    return () => {
      window.removeEventListener('scroll', computeScroll);
      window.removeEventListener('resize', computeScroll);
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerleave', handlePointerLeave);
      motionQuery.removeEventListener('change', handleMotionChange);
      engine.dispose();
      engineRef.current = null;
    };
  }, [compact, stageRef]);

  useEffect(() => {
    engineRef.current?.setTheme(theme);
  }, [theme]);

  if (contextFailed) {
    return <LiquidGlassFallback compact={compact} reason="fallback" />;
  }

  return (
    <div
      ref={localWrapperRef}
      className={`relative w-full h-full ${isHovered ? 'cursor-pointer' : ''}`}
      style={{ transition: 'opacity 180ms ease-out' }}
    >
      {/* Background atmospheric glow layer (parallax depth layer 1) */}
      <div
        ref={glowRef}
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        style={{ opacity: 0.62 }}
      >
        <div
          className={`${
            compact ? 'w-72 h-72' : 'w-[420px] h-[420px] xl:w-[540px] xl:h-[540px]'
          } rounded-full`}
          style={{
            background:
              theme === 'dark'
                ? 'radial-gradient(circle at 45% 42%, rgba(34, 211, 238, 0.24) 0%, rgba(37, 99, 235, 0.22) 38%, rgba(124, 58, 237, 0.14) 64%, rgba(7, 21, 46, 0) 76%)'
                : 'radial-gradient(circle at 45% 42%, rgba(8, 145, 178, 0.2) 0%, rgba(37, 99, 235, 0.18) 38%, rgba(124, 58, 237, 0.1) 64%, rgba(244, 247, 252, 0) 76%)',
            filter: 'blur(38px)',
          }}
        />
      </div>

      {/* Dedicated isolated WebGL mount node */}
      <div ref={mountRef} className="relative w-full h-full" />
    </div>
  );
}
