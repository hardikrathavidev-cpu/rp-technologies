import React from 'react';
import { motion } from 'framer-motion';

export function SectionHeading({ badge, title, highlight, subtitle, center = false }) {
  return (
    <motion.div
      className={`mb-10 md:mb-14 ${center ? 'text-center' : ''}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
    >
      {badge && (
        <motion.div
          className={`mb-4 ${center ? 'flex justify-center' : ''}`}
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <span className="badge animate-pulse-glow">{badge}</span>
        </motion.div>
      )}
      <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight mb-4">
        {title}{' '}
        {highlight && (
          <span className="relative inline-block">
            <span className="text-gradient-genz">{highlight}</span>
            <motion.svg
              className="absolute -bottom-2 left-0 w-full"
              viewBox="0 0 200 12" fill="none"
              style={{ height: 10 }}
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <motion.path
                d="M2 8 Q20 2 38 8 Q56 14 74 8 Q92 2 110 8 Q128 14 146 8 Q164 2 182 8 Q191 11 198 8"
                stroke="#00D4FF" strokeWidth="3" strokeLinecap="round" fill="none"
              />
            </motion.svg>
          </span>
        )}
      </h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className={`text-base md:text-lg text-light-muted dark:text-dark-muted max-w-2xl leading-relaxed ${
            center ? 'mx-auto' : ''
          }`}
        >
          {subtitle}
        </motion.p>
      )}
      {/* Decorative line */}
      <motion.div
        className={`mt-6 h-px bg-gradient-to-r from-transparent via-accent/40 to-transparent ${center ? 'mx-auto max-w-xs' : 'max-w-[200px]'}`}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, duration: 0.6 }}
      />
    </motion.div>
  );
}
