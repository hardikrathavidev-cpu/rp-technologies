import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeading } from '../ui/SectionHeading';

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
  { name: 'Tailwind', color: '#38BDF8', icon: '🎨' },
  { name: 'Vite', color: '#BD34FE', icon: '⚡' },
  { name: 'Firebase', color: '#FFCA28', icon: '🔥' },
  { name: 'Stripe', color: '#635BFF', icon: '💳' },
];

function TechTile({ name, color, icon, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: '-20px' }}
      transition={{ duration: 0.4, delay: (index % 8) * 0.04 }}
      whileHover={{ y: -6 }}
      className="tech-tile group cursor-none relative"
    >
      <motion.span
        className="text-2xl font-bold"
        style={{ color }}
        animate={{ y: [0, -4, 0] }}
        transition={{ duration: 3, repeat: Infinity, delay: index * 0.2 }}
      >
        {icon}
      </motion.span>
      <span className="text-xs font-semibold text-light-muted dark:text-dark-muted group-hover:text-accent transition-colors">
        {name}
      </span>
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{ boxShadow: `inset 0 0 20px ${color}15` }}
      />
    </motion.div>
  );
}

export function TechGrid() {
  return (
    <section className="section-padding bg-light-bg dark:bg-dark-bg relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20" aria-hidden="true" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 rounded-full glow-orb bg-purple-500/5" aria-hidden="true" />

      <div className="container-custom relative z-10">
        <SectionHeading
          badge="Tech Stack"
          title="Technologies We"
          highlight="Master"
          subtitle="Modern, battle-tested tools chosen for performance, maintainability, and long-term product growth."
          center
        />

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3 md:gap-4">
          {TECH.map((t, i) => (
            <TechTile key={t.name} {...t} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
