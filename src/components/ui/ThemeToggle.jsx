import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';

export function ThemeToggle({ isDark, onToggle }) {
  return (
    <motion.button
      onClick={onToggle}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="relative w-10 h-10 flex items-center justify-center rounded-xl border border-light-border dark:border-dark-border bg-light-card dark:bg-dark-card hover:border-accent/40 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-accent/40"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.92 }}
    >
      <motion.div
        key={isDark ? 'moon' : 'sun'}
        initial={{ opacity: 0, rotate: -30, scale: 0.7 }}
        animate={{ opacity: 1, rotate: 0, scale: 1 }}
        exit={{ opacity: 0, rotate: 30, scale: 0.7 }}
        transition={{ duration: 0.25 }}
      >
        {isDark ? (
          <Sun size={17} className="text-accent" />
        ) : (
          <Moon size={17} className="text-light-muted" />
        )}
      </motion.div>
    </motion.button>
  );
}
