import { useEffect, useRef, useState } from 'react';

/**
 * Custom magnetic cursor overlay for fine-pointer devices.
 * Animates strictly via compositor transforms & opacity, pulls smoothly toward
 * [data-magnetic] CTA buttons and navigation links, and applies a subtle elastic
 * magnetic pull to the hovered interactive element itself.
 */
export function MagneticCursor() {
  const dotRef = useRef<HTMLDivElement | null>(null);
  const ringRef = useRef<HTMLDivElement | null>(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const finePointerQuery = window.matchMedia('(pointer: fine)');
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

    const evaluateSupport = () => {
      const active = finePointerQuery.matches && !reducedMotionQuery.matches;
      setEnabled(active);
      if (active) {
        document.body.classList.add('magnetic-cursor-active');
      } else {
        document.body.classList.remove('magnetic-cursor-active');
      }
    };

    evaluateSupport();
    finePointerQuery.addEventListener('change', evaluateSupport);
    reducedMotionQuery.addEventListener('change', evaluateSupport);

    return () => {
      document.body.classList.remove('magnetic-cursor-active');
      finePointerQuery.removeEventListener('change', evaluateSupport);
      reducedMotionQuery.removeEventListener('change', evaluateSupport);
    };
  }, []);

  useEffect(() => {
    if (!enabled) return;

    const dotEl = dotRef.current;
    const ringEl = ringRef.current;
    if (!dotEl || !ringEl) return;

    let mouseX = -100;
    let mouseY = -100;
    let dotX = -100;
    let dotY = -100;
    let ringX = -100;
    let ringY = -100;
    let ringScale = 1;
    let targetScale = 1;
    let visible = false;
    let activeTarget: HTMLElement | null = null;
    let activeKind: 'cta' | 'nav' | 'filter' | null = null;
    let frameId = 0;
    let lastTime = performance.now();

    const releaseTarget = (el: HTMLElement | null) => {
      if (!el) return;
      el.style.transform = '';
      el.style.transition = 'transform 340ms cubic-bezier(0.16, 1, 0.3, 1)';
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType && e.pointerType !== 'mouse' && e.pointerType !== 'pen') return;

      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!visible) {
        visible = true;
        dotX = mouseX;
        dotY = mouseY;
        ringX = mouseX;
        ringY = mouseY;
        dotEl.style.opacity = '1';
        ringEl.style.opacity = '1';
      }

      const rawTarget = e.target as HTMLElement | null;
      const magneticEl = rawTarget?.closest('[data-magnetic]') as HTMLElement | null;

      if (magneticEl !== activeTarget) {
        releaseTarget(activeTarget);
        activeTarget = magneticEl;
        activeKind = (magneticEl?.dataset.magnetic as 'cta' | 'nav' | 'filter') || null;
        if (activeTarget) {
          activeTarget.style.transition = 'transform 120ms cubic-bezier(0.16, 1, 0.3, 1)';
        }
      }

      if (activeTarget) {
        const rect = activeTarget.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const dx = mouseX - centerX;
        const dy = mouseY - centerY;

        const pullStrength = activeKind === 'cta' ? 0.28 : activeKind === 'nav' ? 0.22 : 0.16;
        const maxShift = activeKind === 'cta' ? 10 : 6;
        const shiftX = Math.max(-maxShift, Math.min(maxShift, dx * pullStrength));
        const shiftY = Math.max(-maxShift, Math.min(maxShift, dy * pullStrength));

        activeTarget.style.transform = `translate3d(${shiftX.toFixed(2)}px, ${shiftY.toFixed(2)}px, 0)`;

        targetScale = activeKind === 'cta' ? 1.85 : activeKind === 'nav' ? 1.45 : 1.35;
        ringEl.dataset.state = activeKind || 'hover';
      } else {
        const interactiveEl = rawTarget?.closest('a, button, [role="button"]');
        if (interactiveEl) {
          targetScale = 1.3;
          ringEl.dataset.state = 'interactive';
        } else {
          targetScale = 1;
          ringEl.dataset.state = 'default';
        }
      }
    };

    const handlePointerLeave = () => {
      visible = false;
      dotEl.style.opacity = '0';
      ringEl.style.opacity = '0';
      releaseTarget(activeTarget);
      activeTarget = null;
      activeKind = null;
      targetScale = 1;
    };

    const handlePointerDown = () => {
      targetScale = Math.max(0.82, targetScale * 0.85);
    };

    const handlePointerUp = () => {
      targetScale = activeTarget ? (activeKind === 'cta' ? 1.85 : 1.45) : 1;
    };

    const animate = (now: number) => {
      const dt = Math.min((now - lastTime) / 1000, 0.05);
      lastTime = now;

      let targetRingX = mouseX;
      let targetRingY = mouseY;

      // Subtle magnetic pull on the cursor halo toward the hovered element center
      if (activeTarget && visible) {
        const rect = activeTarget.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const blend = activeKind === 'cta' ? 0.32 : 0.22;
        targetRingX = mouseX + (cx - mouseX) * blend;
        targetRingY = mouseY + (cy - mouseY) * blend;
      }

      const dotAlpha = 1 - Math.exp(-32 * dt);
      const ringAlpha = 1 - Math.exp(-15 * dt);
      const scaleAlpha = 1 - Math.exp(-16 * dt);

      dotX += (mouseX - dotX) * dotAlpha;
      dotY += (mouseY - dotY) * dotAlpha;
      ringX += (targetRingX - ringX) * ringAlpha;
      ringY += (targetRingY - ringY) * ringAlpha;
      ringScale += (targetScale - ringScale) * scaleAlpha;

      dotEl.style.transform = `translate3d(${dotX.toFixed(2)}px, ${dotY.toFixed(2)}px, 0) translate(-50%, -50%)`;
      ringEl.style.transform = `translate3d(${ringX.toFixed(2)}px, ${ringY.toFixed(2)}px, 0) translate(-50%, -50%) scale(${ringScale.toFixed(3)})`;

      frameId = requestAnimationFrame(animate);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    document.addEventListener('pointerleave', handlePointerLeave);
    window.addEventListener('pointerdown', handlePointerDown, { passive: true });
    window.addEventListener('pointerup', handlePointerUp, { passive: true });
    frameId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(frameId);
      releaseTarget(activeTarget);
      window.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerleave', handlePointerLeave);
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointerup', handlePointerUp);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Outer magnetic halo ring */}
      <div
        ref={ringRef}
        data-state="default"
        className="fixed top-0 left-0 h-9 w-9 rounded-full border border-blue-600/55 bg-blue-500/[0.06] opacity-0 transition-[background-color,border-color,box-shadow] duration-200 data-[state=cta]:border-blue-600 data-[state=cta]:bg-blue-500/15 data-[state=cta]:shadow-[0_0_20px_rgba(37,99,235,0.28)] data-[state=nav]:border-blue-600/80 data-[state=nav]:bg-blue-500/10 data-[state=interactive]:border-cyan-600/75 dark:border-cyan-300/60 dark:bg-cyan-400/[0.06] dark:data-[state=cta]:border-cyan-300 dark:data-[state=cta]:bg-blue-500/15 dark:data-[state=cta]:shadow-[0_0_24px_rgba(34,211,238,0.35)] dark:data-[state=nav]:border-cyan-300/85 dark:data-[state=nav]:bg-cyan-400/10 dark:data-[state=interactive]:border-blue-400/75"
        style={{ willChange: 'transform, opacity' }}
      />
      {/* Precision inner dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 h-1.5 w-1.5 rounded-full bg-blue-600 opacity-0 shadow-[0_0_8px_rgba(37,99,235,0.65)] dark:bg-cyan-200 dark:shadow-[0_0_8px_rgba(34,211,238,0.85)]"
        style={{ willChange: 'transform, opacity' }}
      />
    </div>
  );
}
