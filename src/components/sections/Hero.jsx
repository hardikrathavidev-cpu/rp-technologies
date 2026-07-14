import React, { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import { ArrowRight, Zap, Globe, Code2, Sparkles } from 'lucide-react';

/* ─── Smooth Scroll helper ─── */
const scrollTo = (id) => {
  const el = document.getElementById(id);
  if (el) window.scrollTo({ top: el.offsetTop - 72, behavior: 'smooth' });
};

/* ─── Magnetic Button ─── */
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
      } px-8 py-4 rounded-2xl text-sm font-semibold transition-all duration-300 flex items-center gap-2 select-none`}
    >
      {/* Ripple on hover */}
      {primary && (
        <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
      )}
      <span className="relative z-10 flex items-center gap-2">{children}</span>
    </motion.button>
  );
}

/* ─── Floating Orb ─── */
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

/* ─── Animated Rings Visual ─── */
function HeroVisual() {
  return (
    <div
      className="relative w-full max-w-[480px] h-[480px] mx-auto flex items-center justify-center select-none"
      aria-hidden="true"
    >
      {/* Outer rings */}
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border border-accent/10 dark:border-accent/15"
          style={{ width: `${i * 130}px`, height: `${i * 130}px` }}
          animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
          transition={{ duration: 18 + i * 6, repeat: Infinity, ease: 'linear' }}
        >
          {/* Dot on ring */}
          <motion.div
            className="absolute -top-1.5 left-1/2 w-3 h-3 rounded-full bg-accent shadow-glow-sm"
            style={{ transform: 'translateX(-50%)' }}
          />
        </motion.div>
      ))}

      {/* Glowing center card */}
      <motion.div
        className="relative z-10 bg-dark-card/90 dark:bg-dark-card border border-dark-border rounded-3xl p-5 w-56 shadow-glow"
        animate={{ y: [0, -10, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        style={{ backdropFilter: 'blur(20px)' }}
      >
        {/* Window dots */}
        <div className="flex gap-1.5 mb-3">
          {['bg-red-400/70', 'bg-yellow-400/70', 'bg-emerald-400/70'].map(c => (
            <div key={c} className={`w-2.5 h-2.5 rounded-full ${c}`} />
          ))}
        </div>
        {/* Simulated code lines */}
        {[
          { w: 'w-full', color: 'bg-accent/80' },
          { w: 'w-3/4', color: 'bg-emerald-400/60' },
          { w: 'w-5/6', color: 'bg-purple-400/50' },
          { w: 'w-2/3', color: 'bg-accent/40' },
          { w: 'w-4/5', color: 'bg-emerald-400/40' },
        ].map(({ w, color }, i) => (
          <motion.div
            key={i}
            className={`h-2 ${w} rounded-full ${color} mb-2`}
            initial={{ scaleX: 0, originX: 0 }}
            animate={{ scaleX: 1 }}
            transition={{ delay: 0.3 + i * 0.15, duration: 0.5 }}
          />
        ))}
        <div className="mt-3 pt-3 border-t border-dark-border flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] text-dark-muted font-mono">Build: Successful ✓</span>
        </div>
      </motion.div>

      {/* Floating metric badges */}
      {[
        { text: '50+ Projects', sub: 'Delivered', top: '8%', left: '0%', delay: 0, icon: '🚀' },
        { text: '99% Satisfaction', sub: 'Client Rating', top: '70%', left: '68%', delay: 0.4, icon: '⭐' },
        { text: '3-Day Response', sub: 'Avg. Turnaround', top: '10%', left: '62%', delay: 0.8, icon: '⚡' },
      ].map(({ text, sub, top, left, delay, icon }) => (
        <motion.div
          key={text}
          className="absolute bg-dark-surface/90 dark:bg-dark-card/90 border border-dark-border rounded-2xl px-3 py-2.5 shadow-card-dark"
          style={{ top, left, backdropFilter: 'blur(10px)' }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1 + delay, duration: 0.5, type: 'spring' }}
        >
          <div className="flex items-center gap-2">
            <span className="text-base">{icon}</span>
            <div>
              <div className="text-xs font-bold text-dark-text whitespace-nowrap">{text}</div>
              <div className="text-[9px] text-dark-muted whitespace-nowrap">{sub}</div>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Particle dots */}
      {Array.from({ length: 12 }).map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 rounded-full bg-accent/50"
          style={{
            top: `${10 + Math.random() * 80}%`,
            left: `${5 + Math.random() * 90}%`,
          }}
          animate={{ opacity: [0.2, 0.8, 0.2], scale: [1, 1.5, 1] }}
          transition={{
            duration: 2 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Typewriter Component ─── */
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
    <span className="accent-text">
      {displayed}
      <span className="cursor-blink text-accent">|</span>
    </span>
  );
}

/* ─── Trust Badge ─── */
const TRUST = [
  { icon: <Zap size={13} />, text: 'Fast Delivery' },
  { icon: <Globe size={13} />, text: 'Scalable Solutions' },
  { icon: <Code2 size={13} />, text: 'Modern Tech Stack' },
  { icon: <Sparkles size={13} />, text: 'Clean Code' },
];

/* ─── Main Hero ─── */
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
      className="relative min-h-screen flex items-center overflow-hidden bg-light-bg dark:bg-dark-bg pt-[72px]"
    >
      {/* Grid bg */}
      <div className="absolute inset-0 grid-bg opacity-50 dark:opacity-100" aria-hidden="true" />

      {/* Animated orbs */}
      <FloatOrb size="500px" color="rgba(0,212,255,0.06)" delay={0} top="-10%" left="-15%" />
      <FloatOrb size="350px" color="rgba(120,80,255,0.05)" delay={2} top="50%" left="65%" />
      <FloatOrb size="250px" color="rgba(0,212,255,0.04)" delay={4} top="70%" left="10%" />

      <div className="container-custom w-full py-16 lg:py-0 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center min-h-[calc(100vh-72px)]">

          {/* ── Left: Copy ── */}
          <motion.div
            className="flex flex-col justify-center"
            variants={container}
            initial="hidden"
            animate="show"
          >
            {/* Badge */}
            <motion.div variants={item}>
              <div className="badge mb-6 w-fit">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block animate-pulse" />
                Available for New Projects
              </div>
            </motion.div>

            {/* Headline */}
            <motion.h1
              variants={item}
              className="text-4xl sm:text-5xl md:text-[3.6rem] font-bold leading-[1.1] tracking-tight mb-4"
            >
              We Build{' '}
              <br />
              <Typewriter />
              <br />
              <span className="dark:text-dark-text text-light-text">That Drive Results</span>
            </motion.h1>

            <motion.p
              variants={item}
              className="text-base md:text-lg text-light-muted dark:text-dark-muted leading-relaxed mb-9 max-w-[480px]"
            >
              RP Technologies partners with startups and businesses to design, develop,
              and deliver high-quality digital products — on time, on budget, built to scale.
            </motion.p>

            {/* CTA Buttons — fixed with onClick only, no href conflict */}
            <motion.div variants={item} className="flex flex-wrap gap-4 mb-10">
              <MagneticButton primary onClick={() => scrollTo('contact')}>
                Start a Project
                <ArrowRight size={17} />
              </MagneticButton>
              <MagneticButton onClick={() => scrollTo('projects')}>
                View Our Work
              </MagneticButton>
            </motion.div>

            {/* Trust pills */}
            <motion.div variants={item} className="flex flex-wrap gap-3">
              {TRUST.map(({ icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-full bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border text-light-muted dark:text-dark-muted"
                >
                  <span className="text-accent">{icon}</span>
                  {text}
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* ── Right: Visual ── */}
          <motion.div
            className="flex items-center justify-center"
            initial={{ opacity: 0, scale: 0.88, x: 40 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <HeroVisual />
          </motion.div>
        </div>
      </div>

      {/* Scroll cue */}
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
