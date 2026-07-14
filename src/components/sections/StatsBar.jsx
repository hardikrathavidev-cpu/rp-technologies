import React from 'react';
import { motion } from 'framer-motion';
import { AnimatedCounter } from '../ui/AnimatedCounter';

const STATS = [
  { value: 50, suffix: '+', label: 'Projects Delivered', color: '#00D4FF' },
  { value: 30, suffix: '+', label: 'Happy Clients', color: '#8338EC' },
  { value: 4, suffix: '+', label: 'Years Experience', color: '#FF006E' },
  { value: 99, suffix: '%', label: 'Client Satisfaction', color: '#AAFF00' },
  { value: 24, suffix: 'h', label: 'Avg. Response', color: '#FFD60A' },
];

export function StatsBar() {
  return (
    <section className="relative py-14 md:py-16 overflow-hidden border-y border-light-border dark:border-dark-border bg-light-card/50 dark:bg-dark-surface">
      <div className="absolute inset-0 grid-bg opacity-30" aria-hidden="true" />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[200px] rounded-full opacity-[0.06]"
        style={{ background: 'radial-gradient(ellipse, #00D4FF 0%, transparent 70%)', filter: 'blur(40px)' }}
        aria-hidden="true"
      />

      <div className="container-custom relative z-10">
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center text-xs font-bold uppercase tracking-[0.25em] text-accent mb-10"
        >
          Numbers That Define Our Journey
        </motion.p>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:gap-6">
          {STATS.map(({ value, suffix, label, color }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              whileHover={{ y: -6, scale: 1.02 }}
              className="glow-card shine-hover text-center p-5 md:p-6 bg-light-surface/80 dark:bg-dark-card/80 backdrop-blur-md"
            >
              <div
                className="text-3xl md:text-4xl font-black font-display stat-glow mb-1"
                style={{ color }}
              >
                <AnimatedCounter target={value} suffix={suffix} />
              </div>
              <div className="text-xs md:text-sm text-light-muted dark:text-dark-muted font-medium">
                {label}
              </div>
              <motion.div
                className="h-0.5 mx-auto mt-3 rounded-full"
                style={{ background: color, maxWidth: '40%' }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.5 }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
