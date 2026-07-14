import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

/* Theme palette */
const THEME = {
  accent: '#00D4FF',
  accentHover: '#00BFEA',
  purple: '#8338EC',
  pink: '#FF006E',
  lime: '#AAFF00',
};

const SPARK_COLORS = [THEME.accent, THEME.accent, THEME.accentHover, THEME.purple];

const HOVER_COLORS = {
  none:   THEME.accent,
  link:   THEME.accent,
  button: THEME.pink,
  input:  THEME.lime,
  card:   THEME.purple,
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

function Spark({ p }) {
  const base = { position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 99997 };

  if (p.type === 'streak') {
    return (
      <motion.div
        style={{
          ...base,
          width: p.length,
          height: 1,
          background: `linear-gradient(90deg, ${p.color}90, transparent)`,
          borderRadius: 2,
          originX: 0,
          originY: 0.5,
          rotate: p.angle,
        }}
        initial={{ x: p.x, y: p.y, opacity: p.opacity ?? 0.5, scaleX: 1 }}
        animate={{ x: p.x + p.dx, y: p.y + p.dy, opacity: 0, scaleX: 0.3 }}
        transition={{ duration: p.duration, ease: SMOOTH_EASE }}
      />
    );
  }

  return (
    <motion.div
      className="rounded-full"
      style={{
        ...base,
        width: p.size,
        height: p.size,
        background: p.color,
        boxShadow: `0 0 ${p.size * 2.5}px ${p.color}40`,
      }}
      initial={{ x: p.x - p.size / 2, y: p.y - p.size / 2, opacity: p.opacity ?? 0.5, scale: 1 }}
      animate={{ x: p.x - p.size / 2 + p.dx, y: p.y - p.size / 2 + p.dy, opacity: 0, scale: 0.2 }}
      transition={{ duration: p.duration, ease: SMOOTH_EASE }}
    />
  );
}

export function CustomCursor() {
  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);
  const ringX  = useSpring(mouseX, { stiffness: 130, damping: 22, mass: 0.5 });
  const ringY  = useSpring(mouseY, { stiffness: 130, damping: 22, mass: 0.5 });

  const [visible, setVisible]     = useState(false);
  const [clicking, setClicking]   = useState(false);
  const [hoverType, setHoverType] = useState('none');
  const [sparks, setSparks]       = useState([]);
  const [moving, setMoving]       = useState(false);

  const lastPos      = useRef({ x: 0, y: 0 });
  const smoothVel    = useRef({ x: 0, y: 0 });
  const cursorPos    = useRef({ x: 0, y: 0 });
  const hoverRef     = useRef('none');
  const isMovingRef  = useRef(false);
  const sparkId      = useRef(0);
  const moveTimer    = useRef(null);
  const rafRef       = useRef(null);
  const lastSpawnRef = useRef(0);
  const lastHoverRef = useRef('none');

  const hoverColor    = HOVER_COLORS[hoverType] || THEME.accent;
  const cursorColor   = hoverType !== 'none' ? hoverColor : THEME.accent;
  const isInteractive = hoverType !== 'none';

  const addSpark = useCallback((p) => {
    const id = sparkId.current++;
    const spark = { ...p, id, duration: p.duration ?? 0.45 + Math.random() * 0.25 };
    setSparks((prev) => [...prev.slice(-36), spark]);
    setTimeout(() => {
      setSparks((prev) => prev.filter((s) => s.id !== id));
    }, (spark.duration + 0.12) * 1000);
  }, []);

  const spawnSpark = useCallback((x, y, vx, vy, speed, color) => {
    const angle = Math.atan2(vy, vx) || 0;
    const drift = 3 + Math.min(speed * 0.15, 8);

    addSpark({
      type: 'dot',
      x, y,
      dx: -vx * 0.04 + (Math.random() - 0.5) * 2,
      dy: -vy * 0.04 + (Math.random() - 0.5) * 2,
      color,
      size: 2 + Math.random() * 1.5,
      opacity: 0.35 + Math.random() * 0.25,
    });

    if (speed > 3 && Math.random() > 0.55) {
      addSpark({
        type: 'streak',
        x, y,
        dx: -vx * 0.06,
        dy: -vy * 0.06,
        angle: (angle * 180) / Math.PI,
        length: 4 + Math.min(speed * 0.3, 10),
        color,
        opacity: 0.35,
        duration: 0.4,
      });
    }
  }, [addSpark]);

  const spawnAlongPath = useCallback((x0, y0, x1, y1, vx, vy, speed, color) => {
    const dist = Math.hypot(x1 - x0, y1 - y0);
    const step = 12;
    const steps = Math.min(Math.max(1, Math.floor(dist / step)), 4);

    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      spawnSpark(
        x0 + (x1 - x0) * t,
        y0 + (y1 - y0) * t,
        vx, vy, speed,
        color,
      );
    }
  }, [spawnSpark]);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const tick = (now) => {
      if (!isMovingRef.current) return;

      const { x, y } = cursorPos.current;
      const { x: vx, y: vy } = smoothVel.current;
      const speed = Math.hypot(vx, vy);
      const color = HOVER_COLORS[hoverRef.current] || SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)];

      if (speed > 0.5 && now - lastSpawnRef.current > 36) {
        spawnSpark(x, y, vx, vy, speed, color);
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

      smoothVel.current = {
        x: smoothVel.current.x * 0.75 + dx * 0.25,
        y: smoothVel.current.y * 0.75 + dy * 0.25,
      };
      cursorPos.current = { x: e.clientX, y: e.clientY };

      const color = HOVER_COLORS[type] || THEME.accent;
      const speed = Math.hypot(smoothVel.current.x, smoothVel.current.y);

      if (dist > 3) {
        spawnAlongPath(lastPos.current.x, lastPos.current.y, e.clientX, e.clientY, smoothVel.current.x, smoothVel.current.y, speed, color);
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
      }, 130);
    };

    const onDown = (e) => {
      setClicking(true);
      const color = HOVER_COLORS[detectHoverType(e.target)] || THEME.accent;
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI * 2 * i) / 6;
        addSpark({
          type: 'dot',
          x: e.clientX,
          y: e.clientY,
          dx: Math.cos(a) * (8 + Math.random() * 6),
          dy: Math.sin(a) * (8 + Math.random() * 6),
          color,
          size: 2,
          opacity: 0.45,
        });
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
          addSpark({
            type: 'dot',
            x: e.clientX,
            y: e.clientY,
            dx: Math.cos(a) * 6,
            dy: Math.sin(a) * 6,
            color,
            size: 2,
            opacity: 0.4,
          });
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
  }, [mouseX, mouseY, addSpark, spawnSpark, spawnAlongPath]);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <>
      <AnimatePresence>
        {sparks.map((s) => (
          <Spark key={s.id} p={s} />
        ))}
      </AnimatePresence>

      {/* Soft theme glow while moving / hovering */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[99994] rounded-full"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          opacity: isInteractive ? 0.7 : moving ? 0.3 : 0,
          width: isInteractive ? 60 : 50,
          height: isInteractive ? 60 : 50,
          background: `radial-gradient(circle, ${cursorColor}22 0%, ${cursorColor}08 50%, transparent 72%)`,
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

      {/* Inner dot — theme accent */}
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
          backgroundColor: cursorColor,
          boxShadow: `0 0 8px ${cursorColor}, 0 0 16px ${cursorColor}50`,
        }}
        transition={{ duration: 0.2, ease: SMOOTH_EASE }}
      />

      {/* Outer ring — theme accent */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[99998] rounded-full box-border"
        style={{
          x: isInteractive ? mouseX : ringX,
          y: isInteractive ? mouseY : ringY,
          translateX: '-50%',
          translateY: '-50%',
          width: 28,
          height: 28,
          borderWidth: 1.5,
          borderStyle: 'solid',
        }}
        animate={{
          opacity: visible ? 0.9 : 0,
          scale: clicking ? 0.75 : isInteractive ? 1.25 : moving ? 1.05 : 1,
          borderColor: `${cursorColor}80`,
          backgroundColor: `${cursorColor}0c`,
          boxShadow: moving ? `0 0 12px ${cursorColor}30` : 'none',
        }}
        transition={{ duration: 0.25, ease: SMOOTH_EASE }}
      />
    </>
  );
}
