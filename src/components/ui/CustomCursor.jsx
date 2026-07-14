import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

const SPARK_COLORS = ['#00D4FF', '#8338EC', '#FF006E', '#AAFF00', '#FFD60A', '#ffffff'];

function Spark({ id, x, y, angle, color, size }) {
  const dx = Math.cos(angle) * (20 + Math.random() * 30);
  const dy = Math.sin(angle) * (20 + Math.random() * 30);

  return (
    <motion.div
      key={id}
      className="fixed top-0 left-0 pointer-events-none z-[99997] rounded-full"
      style={{
        width: size,
        height: size,
        background: color,
        boxShadow: `0 0 ${size * 3}px ${color}, 0 0 ${size * 6}px ${color}80`,
      }}
      initial={{ x, y, opacity: 1, scale: 1 }}
      animate={{
        x: x + dx,
        y: y + dy,
        opacity: 0,
        scale: 0,
      }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.35 + Math.random() * 0.25, ease: 'easeOut' }}
    />
  );
}

export function CustomCursor() {
  const mouseX  = useMotionValue(-200);
  const mouseY  = useMotionValue(-200);
  const ringX   = useSpring(mouseX, { stiffness: 140, damping: 18, mass: 0.5 });
  const ringY   = useSpring(mouseY, { stiffness: 140, damping: 18, mass: 0.5 });

  const [visible,  setVisible]  = useState(false);
  const [clicking, setClicking] = useState(false);
  const [hovering, setHovering] = useState(false);
  const [sparks, setSparks]     = useState([]);
  const [moving, setMoving]     = useState(false);

  const lastPos   = useRef({ x: 0, y: 0 });
  const sparkId   = useRef(0);
  const moveTimer = useRef(null);

  const spawnSparks = useCallback((x, y, count = 2) => {
    const newSparks = Array.from({ length: count }, () => {
      const id = sparkId.current++;
      return {
        id,
        x: x - 4 + (Math.random() - 0.5) * 8,
        y: y - 4 + (Math.random() - 0.5) * 8,
        angle: Math.random() * Math.PI * 2,
        color: SPARK_COLORS[Math.floor(Math.random() * SPARK_COLORS.length)],
        size: 2 + Math.random() * 3,
      };
    });
    setSparks((prev) => [...prev.slice(-40), ...newSparks]);
    newSparks.forEach((s) => {
      setTimeout(() => {
        setSparks((prev) => prev.filter((p) => p.id !== s.id));
      }, 600);
    });
  }, []);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const onMove = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setVisible(true);
      setMoving(true);

      const dx = e.clientX - lastPos.current.x;
      const dy = e.clientY - lastPos.current.y;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > 6) {
        const speed = Math.min(dist / 8, 4);
        spawnSparks(e.clientX, e.clientY, Math.floor(speed));
        lastPos.current = { x: e.clientX, y: e.clientY };
      }

      clearTimeout(moveTimer.current);
      moveTimer.current = setTimeout(() => setMoving(false), 80);
    };

    const onDown  = () => {
      setClicking(true);
      const x = mouseX.get();
      const y = mouseY.get();
      spawnSparks(x, y, 8);
    };
    const onUp    = () => setClicking(false);
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);
    const onOver  = (e) => {
      setHovering(!!e.target.closest('a, button, [role="button"], select, input, textarea'));
    };

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
    };
  }, [mouseX, mouseY, spawnSparks]);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <>
      {/* Spark trail */}
      <AnimatePresence>
        {sparks.map((s) => (
          <Spark key={s.id} {...s} />
        ))}
      </AnimatePresence>

      {/* Cursor glow aura when moving */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[99996] rounded-full"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          width: 80,
          height: 80,
          background: 'radial-gradient(circle, rgba(0,212,255,0.12) 0%, transparent 70%)',
        }}
        animate={{ opacity: moving ? 0.8 : 0, scale: moving ? 1.2 : 0.8 }}
        transition={{ duration: 0.15 }}
      />

      {/* Inner dot */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[99999] rounded-full"
        style={{
          width: 8,
          height: 8,
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          opacity: visible ? 1 : 0,
          scale: clicking ? 0.5 : hovering ? 2 : 1,
          backgroundColor: hovering ? '#00D4FF' : '#ffffff',
          boxShadow: moving
            ? '0 0 12px #00D4FF, 0 0 24px #00D4FF80'
            : hovering
              ? '0 0 16px #00D4FF'
              : '0 0 6px #ffffff80',
        }}
        transition={{ scale: { duration: 0.12 }, opacity: { duration: 0.15 } }}
      />

      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[99998] rounded-full"
        style={{
          x: ringX,
          y: ringY,
          translateX: '-50%',
          translateY: '-50%',
          border: '1.5px solid rgba(0,212,255,0.6)',
        }}
        animate={{
          opacity: visible ? 1 : 0,
          scale: clicking ? 0.65 : hovering ? 1.6 : moving ? 1.15 : 1,
          width: hovering ? 44 : moving ? 36 : 32,
          height: hovering ? 44 : moving ? 36 : 32,
          borderColor: hovering
            ? 'rgba(0,212,255,0.9)'
            : moving
              ? 'rgba(131,56,236,0.7)'
              : 'rgba(0,212,255,0.5)',
          boxShadow: moving || hovering
            ? '0 0 20px rgba(0,212,255,0.4), 0 0 40px rgba(131,56,236,0.15)'
            : '0 0 0px transparent',
        }}
        transition={{
          opacity: { duration: 0.15 },
          scale: { duration: 0.18 },
          width: { duration: 0.22 },
          height: { duration: 0.22 },
        }}
      />

      {/* Crosshair lines when moving fast */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[99995]"
        style={{ x: mouseX, y: mouseY, translateX: '-50%', translateY: '-50%' }}
        animate={{ opacity: moving ? 0.5 : 0 }}
        transition={{ duration: 0.1 }}
      >
        <div className="absolute w-px h-5 bg-accent/60 -translate-x-1/2 -top-8 left-1/2" />
        <div className="absolute w-px h-5 bg-accent/60 -translate-x-1/2 top-3 left-1/2" />
        <div className="absolute h-px w-5 bg-accent/60 -translate-y-1/2 -left-8 top-1/2" />
        <div className="absolute h-px w-5 bg-accent/60 -translate-y-1/2 left-3 top-1/2" />
      </motion.div>
    </>
  );
}
