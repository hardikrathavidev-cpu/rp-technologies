import React, { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

const SECTIONS = [
  { id: 'home',       label: 'Home',     emoji: '🏠' },
  { id: 'services',   label: 'Services', emoji: '⚡' },
  { id: 'about',      label: 'About',    emoji: '👋' },
  { id: 'process',    label: 'Process',  emoji: '🔧' },
  { id: 'projects',   label: 'Projects', emoji: '🚀' },
  { id: 'contact',    label: 'Contact',  emoji: '💬' },
];

function useActiveSection() {
  const [active, setActive] = useState('home');
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => { if (e.isIntersecting) setActive(e.target.id); });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    SECTIONS.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) obs.observe(el);
    });
    return () => obs.disconnect();
  }, []);
  return active;
}

/* ── Top scroll progress bar ── */
export function ScrollProgressBar() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 200, damping: 30 });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[99999] h-[3px] origin-left"
      style={{
        scaleX,
        background: 'linear-gradient(90deg, #8338EC, #FF006E, #00D4FF, #AAFF00)',
      }}
    />
  );
}

/* ── Left sticky: section nav dots ── */
export function LeftStickyNav() {
  const active = useActiveSection();

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 72, behavior: 'smooth' });
  };

  return (
    <div className="fixed left-4 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col gap-3">
      {SECTIONS.map(({ id, label, emoji }) => {
        const isActive = active === id;
        return (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            className="group flex items-center gap-2 cursor-none"
            aria-label={label}
          >
            {/* Dot */}
            <motion.div
              animate={{
                scale:           isActive ? 1.3 : 1,
                backgroundColor: isActive ? '#00D4FF' : 'rgba(144,144,168,0.4)',
              }}
              transition={{ duration: 0.25 }}
              className="w-2.5 h-2.5 rounded-full border border-dark-border"
            />
            {/* Label — slides in on hover / active */}
            <motion.span
              animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : -4 }}
              className="text-[10px] font-bold tracking-widest uppercase text-accent whitespace-nowrap
                         group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-200"
            >
              {emoji} {label}
            </motion.span>
          </button>
        );
      })}
    </div>
  );
}

/* ── Right sticky: scroll percentage ── */
export function RightScrollIndicator() {
  const { scrollYProgress } = useScroll();
  const [pct, setPct] = useState(0);

  useEffect(() => {
    return scrollYProgress.on('change', (v) => setPct(Math.round(v * 100)));
  }, [scrollYProgress]);

  return (
    <div className="fixed right-4 top-1/2 -translate-y-1/2 z-40 hidden xl:flex flex-col items-center gap-2">
      {/* Vertical track */}
      <div className="relative w-[3px] h-32 rounded-full bg-dark-border/50">
        <motion.div
          className="absolute top-0 left-0 w-full rounded-full"
          style={{
            height:     `${pct}%`,
            background: 'linear-gradient(180deg, #8338EC, #FF006E, #00D4FF)',
          }}
        />
      </div>

      {/* Percentage badge */}
      <div
        className="text-[10px] font-black font-display px-2 py-1 rounded-lg border-2 border-dark-border
                   bg-dark-card text-accent shadow-hard-cyan"
        style={{ writingMode: 'initial' }}
      >
        {pct}%
      </div>

      {/* Vertical text */}
      <span
        className="text-[9px] font-bold tracking-[0.25em] uppercase text-dark-muted mt-1"
        style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
      >
        scroll
      </span>
    </div>
  );
}
