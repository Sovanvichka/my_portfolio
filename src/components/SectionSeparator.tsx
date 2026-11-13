import { motion, useReducedMotion } from 'motion/react';

export function SectionSeparator() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div
      aria-hidden="true"
      className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10"
    >
      <div className="relative h-px w-full overflow-hidden">
        {/* Hairline editorial gradient base */}
        <motion.div
          initial={shouldReduceMotion ? false : { scaleX: 0, opacity: 0 }}
          whileInView={{ scaleX: 1, opacity: 1 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1] }}
          className="h-full w-full origin-center bg-gradient-to-r from-transparent via-slate-900/15 to-transparent dark:via-white/15"
        />

        {/* Subtle traveling cyan-cobalt luminous shimmer */}
        {!shouldReduceMotion && (
          <motion.div
            initial={{ x: '-45%', opacity: 0 }}
            animate={{
              x: ['-45%', '145%'],
              opacity: [0, 0.85, 0.85, 0],
            }}
            transition={{
              duration: 5.5,
              repeat: Infinity,
              repeatDelay: 2.5,
              ease: 'easeInOut',
            }}
            className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-blue-600/60 to-transparent dark:via-cyan-400/70"
          />
        )}
      </div>
    </div>
  );
}
