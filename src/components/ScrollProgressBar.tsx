import { motion, useReducedMotion, useScroll, useSpring } from 'motion/react';

export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const shouldReduceMotion = useReducedMotion();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 280,
    damping: 34,
    restDelta: 0.001,
  });

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-0 top-0 z-[60] h-[2px] bg-white/[0.04]"
    >
      <motion.div
        className="h-full w-full origin-left bg-gradient-to-r from-[#2563EB] via-[#22D3EE] to-[#8B5CF6] opacity-90"
        style={{ scaleX: shouldReduceMotion ? scrollYProgress : smoothProgress }}
      />
    </div>
  );
}
