import React from 'react';
import { motion } from 'framer-motion';

const TECH = [
  { name: 'React', color: '#61DAFB', icon: '⚛' },
  { name: 'Next.js', color: '#FFFFFF', icon: '▲' },
  { name: 'Node.js', color: '#68A063', icon: '⬡' },
  { name: 'TypeScript', color: '#3178C6', icon: 'TS' },
  { name: 'Python', color: '#FFD43B', icon: '🐍' },
  { name: 'PostgreSQL', color: '#336791', icon: '🐘' },
  { name: 'MongoDB', color: '#4EA94B', icon: '🍃' },
  { name: 'Docker', color: '#0db7ed', icon: '🐳' },
  { name: 'AWS', color: '#FF9900', icon: '☁' },
  { name: 'Figma', color: '#F24E1E', icon: '✦' },
  { name: 'Redis', color: '#DC382D', icon: '⚡' },
  { name: 'GraphQL', color: '#E535AB', icon: '◈' },
];

// Duplicate for seamless loop
const ITEMS = [...TECH, ...TECH];

function TechChip({ name, color, icon }) {
  return (
    <div className="flex items-center gap-2.5 px-5 py-3 rounded-2xl border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-card mx-2.5 whitespace-nowrap hover:border-accent/40 transition-all duration-300 group shrink-0 shine-hover">
      <motion.span
        className="text-base font-bold"
        style={{ color }}
        whileHover={{ scale: 1.2, rotate: [0, -10, 10, 0] }}
        transition={{ duration: 0.3 }}
      >
        {icon}
      </motion.span>
      <span className="text-sm font-semibold text-light-muted dark:text-dark-muted group-hover:text-light-text dark:group-hover:text-dark-text transition-colors duration-200">
        {name}
      </span>
    </div>
  );
}

export function TechMarquee() {
  return (
    <section className="py-10 bg-light-card/60 dark:bg-dark-surface border-y border-light-border dark:border-dark-border overflow-hidden relative">
      {/* Fade masks */}
      <div className="absolute left-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-r from-light-card dark:from-dark-surface to-transparent pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-24 z-10 bg-gradient-to-l from-light-card dark:from-dark-surface to-transparent pointer-events-none" />

      <div className="flex items-center gap-0">
        <motion.div
          className="flex items-center"
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
        >
          {ITEMS.map((t, i) => (
            <TechChip key={i} {...t} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
