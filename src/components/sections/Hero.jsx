import React, { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { ArrowRight, Zap, Globe, Code2, Sparkles } from 'lucide-react';

const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) window.scrollTo({ top: el.offsetTop - 72, behavior: 'smooth' });
};

const HERO_TECH = [
  { label: 'REACT', status: 'ACTIVE', color: '#61DAFB' },
  { label: 'NODE', status: 'ONLINE', color: '#68A063' },
  { label: 'VITE', status: 'READY', color: '#BD34FE' },
  { label: 'TS', status: 'OK', color: '#3178C6' },
];

const HERO_METRICS = [
  { text: '50+ Projects', sub: 'Delivered', icon: '🚀' },
  { text: '99% Satisfaction', sub: 'Client Rating', icon: '⭐' },
  { text: '24h Response', sub: 'Avg. Turnaround', icon: '⚡' },
];

function MagneticButton({ children, className = '', onClick, primary = false }) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 300, damping: 20 });
  const springY = useSpring(y, { stiffness: 300, damping: 20 });

  const handleMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    x.set((e.clientX - cx) * 0.35);
    y.set((e.clientY - cy) * 0.35);
  };

  const handleLeave = () => { x.set(0); y.set(0); };

  return (
    <motion.button
      ref={ref}
      onClick={onClick}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{ x: springX, y: springY }}
      whileTap={{ scale: 0.94 }}
      className={`relative overflow-hidden group cursor-none ${className} ${
        primary
          ? 'bg-accent text-dark-bg font-bold shadow-glow hover:shadow-glow-lg'
          : 'border border-light-border dark:border-dark-border text-light-text dark:text-dark-text hover:border-accent/60 hover:text-accent dark:hover:text-accent bg-light-surface/50 dark:bg-transparent'
      } px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 select-none`}
    >
      {primary && (
        <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}

function FloatOrb({ size, color, delay, top, left, blur = '80px' }) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{ width: size, height: size, top, left, background: color, filter: `blur(${blur})` }}
      animate={{ y: [0, -30, 0], x: [0, 15, 0], scale: [1, 1.08, 1] }}
      transition={{ duration: 8 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
    />
  );
}

/* ── HUD overlay on hero visual ── */
function HeroHUD() {
  const [techIdx, setTechIdx] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTechIdx((i) => i + 1), 2500);
    return () => clearInterval(t);
  }, []);

  const tech = HERO_TECH[techIdx % HERO_TECH.length];

  return (
    <div className="absolute inset-0 pointer-events-none z-20" aria-hidden="true">
      {/* Corner brackets */}
      <svg className="absolute top-2 left-2 w-6 h-6 sm:w-8 sm:h-8 text-accent/40" viewBox="0 0 32 32" fill="none">
        <path d="M2 12 V2 H12" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <svg className="absolute top-2 right-2 w-6 h-6 sm:w-8 sm:h-8 text-accent/40" viewBox="0 0 32 32" fill="none" style={{ transform: 'scaleX(-1)' }}>
        <path d="M2 12 V2 H12" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <svg className="absolute bottom-2 left-2 w-6 h-6 sm:w-8 sm:h-8 text-accent/40" viewBox="0 0 32 32" fill="none" style={{ transform: 'scaleY(-1)' }}>
        <path d="M2 12 V2 H12" stroke="currentColor" strokeWidth="1.5" />
      </svg>
      <svg className="absolute bottom-2 right-2 w-6 h-6 sm:w-8 sm:h-8 text-accent/40" viewBox="0 0 32 32" fill="none" style={{ transform: 'scale(-1)' }}>
        <path d="M2 12 V2 H12" stroke="currentColor" strokeWidth="1.5" />
      </svg>

      {/* Top status bar */}
      <div className="absolute top-3 sm:top-4 left-1/2 -translate-x-1/2 flex items-center gap-2 sm:gap-3 px-3 py-1 rounded-full border border-accent/20 bg-dark-card/60 backdrop-blur-sm">
        <motion.span
          className="w-1.5 h-1.5 rounded-full bg-emerald-400"
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        />
        <span className="font-mono text-[8px] sm:text-[9px] text-accent/70 tracking-wider whitespace-nowrap">
          SYS :: ONLINE
        </span>
        <span className="text-dark-muted/40 hidden sm:inline">|</span>
        <AnimatePresence mode="wait">
          <motion.span
            key={tech.label}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="font-mono text-[8px] sm:text-[9px] tracking-wider whitespace-nowrap hidden sm:inline"
            style={{ color: tech.color }}
          >
            {tech.label} :: {tech.status}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* Mobile tech ticker */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 sm:hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={tech.label}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="font-mono text-[8px] px-2 py-0.5 rounded border border-dark-border/50 bg-dark-card/50"
            style={{ color: tech.color }}
          >
            {tech.label} :: {tech.status}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Scan line */}
      <motion.div
        className="absolute left-4 right-4 h-px bg-gradient-to-r from-transparent via-accent/20 to-transparent"
        animate={{ top: ['15%', '85%'] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  );
}

/* ── Responsive hero visual ── */
function HeroVisual() {
  const particlePositions = useRef(
    Array.from({ length: 8 }, (_, i) => ({
      top: 10 + (i * 11) % 80,
      left: 5 + (i * 13) % 90,
      delay: (i * 0.3) % 2,
      duration: 2 + (i % 3),
    }))
  ).current;

  return (
    <div className="w-full max-w-[480px] mx-auto">
      {/* Visual canvas — scales with viewport */}
      <div className="relative w-full aspect-square max-h-[260px] sm:max-h-[300px] md:max-h-[400px] lg:max-h-[460px] mx-auto overflow-hidden rounded-2xl sm:rounded-3xl border border-dark-border/30 bg-dark-card/20">
        <HeroHUD />

        <div className="absolute inset-0 flex items-center justify-center">
          {/* Pulsing rings — % based */}
          {[1, 2, 3].map((i) => (
            <div
              key={`pulse-${i}`}
              className="pulse-ring absolute rounded-full hidden sm:block"
              style={{
                width: `${35 + i * 18}%`,
                height: `${35 + i * 18}%`,
                animationDelay: `${i * 0.8}s`,
              }}
            />
          ))}

          {/* Spinning rings */}
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border border-accent/10"
              style={{ width: `${40 + i * 15}%`, height: `${40 + i * 15}%` }}
              animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
              transition={{ duration: 18 + i * 6, repeat: Infinity, ease: 'linear' }}
            >
              <div
                className="absolute -top-1 left-1/2 w-2 h-2 sm:w-2.5 sm:h-2.5 rounded-full -translate-x-1/2 shadow-glow-sm"
                style={{ background: i === 1 ? '#00D4FF' : i === 2 ? '#8338EC' : '#FF006E' }}
              />
            </motion.div>
          ))}

          {/* Center emblem */}
          <motion.div
            className="relative z-10 w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center"
            animate={{ rotate: 360 }}
            transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
          >
            <div className="absolute inset-0 rounded-full border border-dashed border-accent/25" />
            <div className="w-10 h-10 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-gradient-to-br from-accent/20 via-purple-500/15 to-pink-500/10 border border-accent/30 flex items-center justify-center shadow-glow">
              <span className="text-base sm:text-xl md:text-2xl font-black font-display text-gradient-genz">RP</span>
            </div>
          </motion.div>

          {/* Code card — centered lower */}
          <motion.div
            className="absolute z-10 left-1/2 -translate-x-1/2 w-[75%] max-w-[200px] sm:max-w-[220px] md:max-w-[240px]
                       bg-dark-card/90 border border-dark-border rounded-xl sm:rounded-2xl p-3 sm:p-4 shadow-glow"
            style={{ bottom: '12%', backdropFilter: 'blur(16px)' }}
            animate={{ y: [0, -6, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <div className="flex gap-1 mb-2">
              {['bg-red-400/70', 'bg-yellow-400/70', 'bg-emerald-400/70'].map((c) => (
                <div key={c} className={`w-2 h-2 rounded-full ${c}`} />
              ))}
            </div>
            {[
              { w: 'w-full', color: 'bg-accent/80' },
              { w: 'w-3/4', color: 'bg-emerald-400/60' },
              { w: 'w-5/6', color: 'bg-purple-400/50' },
              { w: 'w-2/3', color: 'bg-accent/40' },
            ].map(({ w, color }, i) => (
              <motion.div
                key={i}
                className={`h-1.5 sm:h-2 ${w} rounded-full ${color} mb-1.5`}
                initial={{ scaleX: 0, originX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ delay: 0.3 + i * 0.12, duration: 0.5 }}
              />
            ))}
            <div className="mt-2 pt-2 border-t border-dark-border flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[8px] sm:text-[9px] text-dark-muted font-mono">Build: OK ✓</span>
            </div>
          </motion.div>

          {/* Particles */}
          {particlePositions.map((p, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-accent/40"
              style={{ top: `${p.top}%`, left: `${p.left}%` }}
              animate={{ opacity: [0.2, 0.7, 0.2], scale: [1, 1.4, 1] }}
              transition={{ duration: p.duration, repeat: Infinity, delay: p.delay }}
            />
          ))}
        </div>
      </div>

      {/* Metrics — responsive grid below visual (all screens) */}
      <div className="grid grid-cols-3 gap-2 sm:gap-3 mt-4 sm:mt-5">
        {HERO_METRICS.map(({ text, sub, icon }, i) => (
          <motion.div
            key={text}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + i * 0.1 }}
            className="bg-dark-surface/80 dark:bg-dark-card/80 border border-dark-border rounded-xl sm:rounded-2xl px-2 py-2 sm:px-3 sm:py-2.5 text-center sm:text-left"
          >
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-1 sm:gap-2">
              <span className="text-sm sm:text-base">{icon}</span>
              <div className="min-w-0">
                <div className="text-[10px] sm:text-xs font-bold text-dark-text truncate">{text}</div>
                <div className="text-[8px] sm:text-[9px] text-dark-muted truncate sm:block hidden">{sub}</div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const WORDS = ['Modern Websites', 'Web Applications', 'Custom Software', 'Digital Products'];

function Typewriter() {
  const [idx, setIdx] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = WORDS[idx];
    let timeout;
    if (!deleting && displayed.length < word.length) {
      timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length + 1)), 70);
    } else if (!deleting && displayed.length === word.length) {
      timeout = setTimeout(() => setDeleting(true), 2200);
    } else if (deleting && displayed.length > 0) {
      timeout = setTimeout(() => setDisplayed(word.slice(0, displayed.length - 1)), 40);
    } else if (deleting && displayed.length === 0) {
      setDeleting(false);
      setIdx((i) => (i + 1) % WORDS.length);
    }
    return () => clearTimeout(timeout);
  }, [displayed, deleting, idx]);

  return (
    <span className="accent-text inline-block min-h-[1.2em]">
      {displayed}
      <span className="cursor-blink text-accent">|</span>
    </span>
  );
}

const TRUST = [
  { icon: <Zap size={13} />, text: 'Fast Delivery' },
  { icon: <Globe size={13} />, text: 'Scalable Solutions' },
  { icon: <Code2 size={13} />, text: 'Modern Tech Stack' },
  { icon: <Sparkles size={13} />, text: 'Clean Code' },
];

export function Hero() {
  const container = {
    hidden: {},
    show: { transition: { staggerChildren: 0.11, delayChildren: 0.1 } },
  };
  const item = {
    hidden: { opacity: 0, y: 32 },
    show: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.22, 1, 0.36, 1] } },
  };

  return (
    <section
      id="home"
      className="relative min-h-0 lg:min-h-screen flex items-center overflow-hidden bg-light-bg dark:bg-dark-bg pt-[72px]"
    >
      <div className="absolute inset-0 grid-bg opacity-50 dark:opacity-100" aria-hidden="true" />

      <FloatOrb size="500px" color="rgba(0,212,255,0.06)" delay={0} top="-10%" left="-15%" />
      <FloatOrb size="350px" color="rgba(120,80,255,0.05)" delay={2} top="50%" left="65%" />
      <FloatOrb size="250px" color="rgba(0,212,255,0.04)" delay={4} top="70%" left="10%" />

      <div className="container-custom w-full py-10 sm:py-14 lg:py-0 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-10 lg:gap-8 items-center lg:min-h-[calc(100vh-72px)]">

          {/* Left: Copy */}
          <motion.div
            className="flex flex-col justify-center order-1 lg:order-none text-center lg:text-left items-center lg:items-start"
            variants={container}
            initial="hidden"
            animate="show"
          >
            <motion.div variants={item}>
              <div className="badge mb-4 sm:mb-6 w-fit mx-auto lg:mx-0">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                Available for New Projects
              </div>
            </motion.div>

            <motion.h1
              variants={item}
              className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.6rem] font-bold leading-[1.12] tracking-tight mb-4 w-full"
            >
              We Build{' '}
              <br className="hidden sm:block" />
              <Typewriter />
              <br />
              <span className="text-gradient-genz">That Drive Results</span>
            </motion.h1>

            <motion.p
              variants={item}
              className="text-sm sm:text-base md:text-lg text-light-muted dark:text-dark-muted leading-relaxed mb-7 sm:mb-9 max-w-[480px] mx-auto lg:mx-0"
            >
              RP Technologies partners with startups and businesses to design, develop,
              and deliver high-quality digital products — on time, on budget, built to scale.
            </motion.p>

            <motion.div variants={item} className="flex flex-wrap gap-3 sm:gap-4 mb-8 sm:mb-10 justify-center lg:justify-start w-full">
              <MagneticButton primary onClick={() => scrollTo('contact')}>
                Start a Project
                <ArrowRight size={17} />
              </MagneticButton>
              <MagneticButton onClick={() => scrollTo('projects')}>
                View Our Work
              </MagneticButton>
            </motion.div>

            <motion.div variants={item} className="flex flex-wrap gap-2 sm:gap-3 justify-center lg:justify-start">
              {TRUST.map(({ icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-1.5 text-[10px] sm:text-xs font-medium px-2.5 sm:px-3 py-1.5 rounded-full bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border text-light-muted dark:text-dark-muted"
                >
                  <span className="text-accent">{icon}</span>
                  {text}
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Visual — full width on mobile */}
          <motion.div
            className="flex items-center justify-center order-2 lg:order-none w-full px-2 sm:px-4 lg:px-0"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            <HeroVisual />
          </motion.div>
        </div>
      </div>

      <motion.div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:flex flex-col items-center gap-2"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2.2 }}
      >
        <span className="text-[10px] text-light-muted dark:text-dark-muted tracking-[0.2em] uppercase">Scroll</span>
        <motion.div
          className="w-px h-10 bg-gradient-to-b from-accent/70 to-transparent"
          animate={{ scaleY: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        />
      </motion.div>
    </section>
  );
}
