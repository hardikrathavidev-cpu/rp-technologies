import React from 'react';
import { motion } from 'framer-motion';

export function SectionHeading({ badge, title, highlight, subtitle, center = false }) {
  return (
    <motion.div
      className={`mb-8 md:mb-10 ${center ? 'text-center' : ''}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {badge && (
        <div className={`mb-4 ${center ? 'flex justify-center' : ''}`}>
          <span className="badge">{badge}</span>
        </div>
      )}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
        {title}{' '}
        {highlight && (
          <span className="accent-text">{highlight}</span>
        )}
      </h2>
      {subtitle && (
        <p
          className={`text-base md:text-lg text-light-muted dark:text-dark-muted max-w-2xl leading-relaxed ${
            center ? 'mx-auto' : ''
          }`}
        >
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
