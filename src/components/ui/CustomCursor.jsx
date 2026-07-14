import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

const PALETTE = ['#00D4FF', '#8338EC', '#FF006E', '#AAFF00', '#FFD60A', '#ffffff'];

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

function Particle({ p }) {
  const base = { position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 99997 };

  if (p.type === 'streak') {
    return (
      <motion.div
        style={{
          ...base,
          width: p.length,
          height: 2,
          background: `linear-gradient(90deg, ${p.color}, transparent)`,
          borderRadius: 2,
          originX: 0,
          originY: 0.5,
          rotate: p.angle,
          boxShadow: `0 0 6px ${p.color}`,
        }}
        initial={{ x: p.x, y: p.y, opacity: 0.9, scaleX: 1 }}
        animate={{ x: p.x + p.dx, y: p.y + p.dy, opacity: 0, scaleX: 0.2 }}
        transition={{ duration: p.duration, ease: 'easeOut' }}
      />
    );
  }

  if (p.type === 'star') {
    return (
      <motion.div
        style={{ ...base, x: p.x, y: p.y, color: p.color, fontSize: p.size }}
        initial={{ opacity: 1, scale: 1, rotate: 0 }}
        animate={{
          x: p.x + p.dx,
          y: p.y + p.dy,
          opacity: 0,
          scale: 0,
          rotate: p.spin,
        }}
        transition={{ duration: p.duration, ease: 'easeOut' }}
      >
        ✦
      </motion.div>
    );
  }

  if (p.type === 'ring') {
    return (
      <motion.div
        style={{
          ...base,
          width: p.size,
          height: p.size,
          border: `1.5px solid ${p.color}`,
          borderRadius: '50%',
          boxShadow: `0 0 12px ${p.color}60`,
        }}
        initial={{ x: p.x - p.size / 2, y: p.y - p.size / 2, opacity: 0.8, scale: 0.3 }}
        animate={{ opacity: 0, scale: 2.5 }}
        transition={{ duration: p.duration, ease: 'easeOut' }}
      />
    );
  }

  return (
    <motion.div
      style={{
        ...base,
        width: p.size,
        height: p.size,
        borderRadius: '50%',
        background: p.color,
        boxShadow: `0 0 ${p.size * 4}px ${p.color}, 0 0 ${p.size * 8}px ${p.color}50`,
      }}
      initial={{ x: p.x, y: p.y, opacity: 1, scale: 1 }}
      animate={{ x: p.x + p.dx, y: p.y + p.dy, opacity: 0, scale: 0 }}
      transition={{ duration: p.duration, ease: 'easeOut' }}
    />
  );
}

export function CustomCursor() {
  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);
  const ringX  = useSpring(mouseX, { stiffness: 160, damping: 20, mass: 0.45 });
  const ringY  = useSpring(mouseY, { stiffness: 160, damping: 20, mass: 0.45 });

  const [visible, setVisible]     = useState(false);
  const [clicking, setClicking]   = useState(false);
  const [hoverType, setHoverType] = useState('none');
  const [particles, setParticles] = useState([]);
  const [moving, setMoving]       = useState(false);

  const lastPos      = useRef({ x: 0, y: 0 });
  const particleId   = useRef(0);
  const moveTimer    = useRef(null);
  const lastHoverRef = useRef('none');
  const hoverColor   = HOVER_COLORS[hoverType] || HOVER_COLORS.none;
  const isInteractive = hoverType !== 'none';

  const addParticle = useCallback((p) => {
    const id = particleId.current++;
    const particle = { ...p, id, duration: p.duration ?? 0.4 + Math.random() * 0.2 };
    setParticles((prev) => [...prev.slice(-45), particle]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((x) => x.id !== id));
    }, (particle.duration + 0.1) * 1000);
  }, []);

  const spawnTrail = useCallback((x, y, vx, vy, dist, type = 'none') => {
    const angle = Math.atan2(vy, vx);
    const speedFactor = Math.min(dist / 6, 5);
    const color = HOVER_COLORS[type] || PALETTE[Math.floor(Math.random() * PALETTE.length)];

    if (dist > 12) {
      addParticle({
        type: 'streak',
        x, y,
        dx: vx * 0.4,
        dy: vy * 0.4,
        angle: (angle * 180) / Math.PI,
        length: 8 + speedFactor * 6,
        color,
        duration: 0.25,
      });
    }

    const count = Math.floor(speedFactor);
    for (let i = 0; i < count; i++) {
      const a = angle + (Math.random() - 0.5) * 1.2;
      const force = 15 + Math.random() * 25;
      addParticle({
        type: Math.random() > 0.85 ? 'star' : 'dot',
        x: x + (Math.random() - 0.5) * 6,
        y: y + (Math.random() - 0.5) * 6,
        dx: Math.cos(a) * force,
        dy: Math.sin(a) * force,
        color: PALETTE[Math.floor(Math.random() * PALETTE.length)],
        size: 2 + Math.random() * 3,
        spin: Math.random() * 180 - 90,
        duration: 0.35 + Math.random() * 0.2,
      });
    }
  }, [addParticle]);

  const spawnClickBurst = useCallback((x, y, type) => {
    const color = HOVER_COLORS[type];
    addParticle({ type: 'ring', x, y, size: 22, color, duration: 0.45 });
    addParticle({ type: 'ring', x, y, size: 34, color: '#8338EC', duration: 0.6 });

    const burst = type === 'button' ? 12 : type === 'link' ? 10 : 8;
    for (let i = 0; i < burst; i++) {
      const a = (Math.PI * 2 * i) / burst + Math.random() * 0.3;
      const force = 28 + Math.random() * 36;
      addParticle({
        type: i % 3 === 0 ? 'star' : 'dot',
        x, y,
        dx: Math.cos(a) * force,
        dy: Math.sin(a) * force,
        color: i % 2 === 0 ? color : PALETTE[i % PALETTE.length],
        size: 3 + Math.random() * 3,
        spin: (360 * i) / burst,
        duration: 0.45 + Math.random() * 0.15,
      });
    }
  }, [addParticle]);

  const spawnHoverEnter = useCallback((x, y, type) => {
    const color = HOVER_COLORS[type];
    for (let i = 0; i < 6; i++) {
      const a = (Math.PI * 2 * i) / 6;
      addParticle({
        type: 'dot',
        x, y,
        dx: Math.cos(a) * 16,
        dy: Math.sin(a) * 16,
        color,
        size: 2.5,
        duration: 0.3,
      });
    }
    addParticle({ type: 'ring', x, y, size: 14, color, duration: 0.35 });
  }, [addParticle]);

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
      const type = detectHoverType(e.target);

      if (dist > 4) {
        spawnTrail(e.clientX, e.clientY, dx, dy, dist, type);
        lastPos.current = { x: e.clientX, y: e.clientY };
      }

      clearTimeout(moveTimer.current);
      moveTimer.current = setTimeout(() => setMoving(false), 100);
    };

    const onDown = (e) => {
      setClicking(true);
      spawnClickBurst(e.clientX, e.clientY, detectHoverType(e.target));
    };

    const onUp = () => setClicking(false);

    const onOver = (e) => {
      const type = detectHoverType(e.target);
      setHoverType(type);
      if (type !== 'none' && type !== lastHoverRef.current) {
        spawnHoverEnter(e.clientX, e.clientY, type);
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
    };
  }, [mouseX, mouseY, spawnTrail, spawnClickBurst, spawnHoverEnter]);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <>
      <AnimatePresence>
        {particles.map((p) => (
          <Particle key={p.id} p={p} />
        ))}
      </AnimatePresence>

      {/* Soft select / highlight bg under cursor on interactive hover */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[99994] rounded-full"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          opacity: isInteractive ? 0.9 : moving ? 0.45 : 0,
          width: isInteractive ? 72 : 56,
          height: isInteractive ? 72 : 56,
          background: isInteractive
            ? `radial-gradient(circle, ${hoverColor}35 0%, ${hoverColor}12 45%, transparent 70%)`
            : 'radial-gradient(circle, rgba(0,212,255,0.12) 0%, transparent 70%)',
        }}
        transition={{ duration: 0.15 }}
      />

      {/* Hover labels */}
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

      {/* Inner circle dot — always circular */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[99999] rounded-full"
        style={{
          x: mouseX,
          y: mouseY,
          translateX: '-50%',
          translateY: '-50%',
          width: 8,
          height: 8,
        }}
        animate={{
          opacity: visible ? 1 : 0,
          scale: clicking ? 0.55 : isInteractive ? 1.35 : 1,
          backgroundColor: isInteractive ? hoverColor : '#ffffff',
          boxShadow: `0 0 ${isInteractive ? 16 : 8}px ${hoverColor}`,
        }}
        transition={{ duration: 0.12 }}
      />

      {/* Outer circle ring — always circular, never square */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[99998] rounded-full box-border"
        style={{
          x: isInteractive ? mouseX : ringX,
          y: isInteractive ? mouseY : ringY,
          translateX: '-50%',
          translateY: '-50%',
          width: 32,
          height: 32,
          borderWidth: 1.5,
          borderStyle: 'solid',
        }}
        animate={{
          opacity: visible ? 1 : 0,
          scale: clicking ? 0.7 : isInteractive ? 1.35 : moving ? 1.1 : 1,
          borderColor: isInteractive ? `${hoverColor}cc` : 'rgba(0,212,255,0.5)',
          boxShadow: isInteractive ? `0 0 18px ${hoverColor}45` : 'none',
          backgroundColor: isInteractive ? `${hoverColor}18` : 'transparent',
        }}
        transition={{ duration: 0.14 }}
      />
    </>
  );
}
