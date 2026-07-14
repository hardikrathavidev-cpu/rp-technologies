import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

const DOT_COLORS = ['#00D4FF', '#00D4FF', '#8338EC', '#ffffff'];

const HOVER_COLORS = {
  none:   '#00D4FF',
  link:   '#00D4FF',
  button: '#FF006E',
  input:  '#AAFF00',
  card:   '#8338EC',
};

function detectHoverType(el) {
  if (!el) return 'none';
  if (el.closest('a[href]')) return 'link';
  if (el.closest('button, [role="button"]')) return 'button';
  if (el.closest('input, textarea, select')) return 'input';
  if (el.closest('.glass-card, .glow-card, .tech-tile, .cartoon-card')) return 'card';
  return 'none';
}

const SMOOTH_EASE = [0.22, 1, 0.36, 1];

function Dot({ p }) {
  return (
    <motion.div
      className="fixed top-0 left-0 pointer-events-none z-[99997] rounded-full"
      style={{
        width: p.size,
        height: p.size,
        background: p.color,
        boxShadow: `0 0 ${p.size * 2}px ${p.color}50`,
      }}
      initial={{ x: p.x - p.size / 2, y: p.y - p.size / 2, opacity: p.opacity ?? 0.55, scale: 1 }}
      animate={{ opacity: 0, scale: 0.4 }}
      transition={{ duration: p.duration, ease: SMOOTH_EASE }}
    />
  );
}

export function CustomCursor() {
  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);
  const ringX  = useSpring(mouseX, { stiffness: 140, damping: 24, mass: 0.5 });
  const ringY  = useSpring(mouseY, { stiffness: 140, damping: 24, mass: 0.5 });

  const [visible, setVisible]     = useState(false);
  const [clicking, setClicking]   = useState(false);
  const [hoverType, setHoverType] = useState('none');
  const [dots, setDots]           = useState([]);
  const [moving, setMoving]       = useState(false);

  const lastPos      = useRef({ x: 0, y: 0 });
  const cursorPos    = useRef({ x: 0, y: 0 });
  const isMovingRef  = useRef(false);
  const dotId        = useRef(0);
  const moveTimer    = useRef(null);
  const rafRef       = useRef(null);
  const lastSpawnRef = useRef(0);
  const lastHoverRef = useRef('none');
  const hoverRef     = useRef('none');
  const hoverColor   = HOVER_COLORS[hoverType] || HOVER_COLORS.none;
  const isInteractive = hoverType !== 'none';

  const addDot = useCallback((x, y, color, size = 2.5, opacity = 0.5) => {
    const id = dotId.current++;
    const dot = {
      id,
      x,
      y,
      color,
      size,
      opacity,
      duration: 0.5 + Math.random() * 0.3,
    };
    setDots((prev) => [...prev.slice(-28), dot]);
    setTimeout(() => {
      setDots((prev) => prev.filter((d) => d.id !== id));
    }, (dot.duration + 0.1) * 1000);
  }, []);

  const spawnDotsAlongPath = useCallback((x0, y0, x1, y1, color) => {
    const dist = Math.hypot(x1 - x0, y1 - y0);
    const step = 14;
    const steps = Math.min(Math.max(1, Math.floor(dist / step)), 3);

    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      addDot(
        x0 + (x1 - x0) * t + (Math.random() - 0.5) * 2,
        y0 + (y1 - y0) * t + (Math.random() - 0.5) * 2,
        color,
        2 + Math.random() * 1.5,
        0.35 + Math.random() * 0.2,
      );
    }
  }, [addDot]);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const tick = (now) => {
      if (!isMovingRef.current) return;

      const { x, y } = cursorPos.current;
      const color = HOVER_COLORS[hoverRef.current] || DOT_COLORS[Math.floor(Math.random() * DOT_COLORS.length)];

      if (now - lastSpawnRef.current > 48) {
        addDot(x, y, color, 2 + Math.random(), 0.4);
        lastSpawnRef.current = now;
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    const onMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setVisible(true);
      setMoving(true);
      isMovingRef.current = true;

      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      const dist = Math.hypot(dx, dy);
      const type = detectHoverType(e.target);
      hoverRef.current = type;
      const color = HOVER_COLORS[type] || DOT_COLORS[0];

      cursorPos.current = { x: e.clientX, y: e.clientY };

      if (dist > 6) {
        spawnDotsAlongPath(lastPos.current.x, lastPos.current.y, e.clientX, e.clientY, color);
        lastPos.current = { x: e.clientX, y: e.clientY };
      }

      if (!rafRef.current) {
        rafRef.current = requestAnimationFrame(tick);
      }

      clearTimeout(moveTimer.current);
      moveTimer.current = setTimeout(() => {
        setMoving(false);
        isMovingRef.current = false;
        if (rafRef.current) {
          cancelAnimationFrame(rafRef.current);
          rafRef.current = null;
        }
      }, 120);
    };

    const onDown = (e) => {
      setClicking(true);
      const color = HOVER_COLORS[detectHoverType(e.target)] || '#00D4FF';
      for (let i = 0; i < 5; i++) {
        const a = (Math.PI * 2 * i) / 5;
        addDot(
          e.clientX + Math.cos(a) * 6,
          e.clientY + Math.sin(a) * 6,
          color,
          2,
          0.45,
        );
      }
    };

    const onUp = () => setClicking(false);

    const onOver = (e) => {
      const type = detectHoverType(e.target);
      setHoverType(type);
      if (type !== 'none' && type !== lastHoverRef.current) {
        const color = HOVER_COLORS[type];
        for (let i = 0; i < 4; i++) {
          const a = (Math.PI * 2 * i) / 4;
          addDot(
            e.clientX + Math.cos(a) * 5,
            e.clientY + Math.sin(a) * 5,
            color,
            2,
            0.4,
          );
        }
      }
      lastHoverRef.current = type;
    };

    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);

    window.addEventListener('mousemove', onMove, { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup', onUp);
    window.addEventListener('mouseover', onOver, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    document.documentElement.addEventListener('mouseenter', onEnter);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup', onUp);
      window.removeEventListener('mouseover', onOver);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.documentElement.removeEventListener('mouseenter', onEnter);
      clearTimeout(moveTimer.current);
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [mouseX, mouseY, addDot, spawnDotsAlongPath]);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <>
      <AnimatePresence>
        {dots.map((d) => (
          <Dot key={d.id} p={d} />
        ))}
      </AnimatePresence>

      {/* Soft highlight on hover */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[99994] rounded-full"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          opacity: isInteractive ? 0.75 : moving ? 0.25 : 0,
          width: isInteractive ? 64 : 48,
          height: isInteractive ? 64 : 48,
          background: isInteractive
            ? `radial-gradient(circle, ${hoverColor}28 0%, ${hoverColor}08 50%, transparent 72%)`
            : 'radial-gradient(circle, rgba(0,212,255,0.08) 0%, transparent 70%)',
        }}
        transition={{ duration: 0.3, ease: SMOOTH_EASE }}
      />

      <AnimatePresence>
        {hoverType === 'link' && (
          <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[99999] font-mono text-[10px] font-bold tracking-wider"
            style={{ x: mouseX, y: mouseY, translateX: 14, translateY: -16 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <span style={{ color: hoverColor }}>OPEN →</span>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {hoverType === 'button' && (
          <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[99999] font-mono text-[10px] font-bold tracking-wider"
            style={{ x: mouseX, y: mouseY, translateX: 14, translateY: -16 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <span style={{ color: hoverColor }}>▶ GO</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[99999] rounded-full"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
          width: 6,
          height: 6,
        }}
        animate={{
          opacity: visible ? 1 : 0,
          scale: clicking ? 0.7 : isInteractive ? 1.25 : 1,
          backgroundColor: isInteractive ? hoverColor : '#ffffff',
          boxShadow: `0 0 ${isInteractive ? 10 : 6}px ${isInteractive ? hoverColor : 'rgba(0,212,255,0.6)'}`,
        }}
        transition={{ duration: 0.2, ease: SMOOTH_EASE }}
      />

      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[99998] rounded-full box-border"
        style={{
          x: isInteractive ? mouseX : ringX,
          y: isInteractive ? mouseY : ringY,
          translateX: '-50%',
          translateY: '-50%',
          width: 28,
          height: 28,
          borderWidth: 1,
          borderStyle: 'solid',
        }}
        animate={{
          opacity: visible ? 0.85 : 0,
          scale: clicking ? 0.75 : isInteractive ? 1.25 : 1,
          borderColor: isInteractive ? `${hoverColor}99` : 'rgba(0,212,255,0.35)',
          backgroundColor: isInteractive ? `${hoverColor}10` : 'transparent',
        }}
        transition={{ duration: 0.25, ease: SMOOTH_EASE }}
      />
    </>
  );
}
