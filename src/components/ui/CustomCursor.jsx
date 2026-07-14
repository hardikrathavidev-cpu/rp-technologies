import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';

const PALETTE = ['#00D4FF', '#8338EC', '#FF006E', '#AAFF00', '#FFD60A', '#ffffff'];
const WELD_HOT  = ['#FFFFFF', '#FFF8E7', '#FFE566', '#FFB020', '#FF6B00', '#FF3300'];
const WELD_COOL  = ['#FFD60A', '#FF8800', '#FF4400', '#00D4FF', '#8338EC'];

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
const GRAVITY_EASE = [0.25, 0.46, 0.75, 1];

function weldColor(speed = 0) {
  if (speed > 8) return WELD_HOT[Math.floor(Math.random() * 3)];
  if (Math.random() > 0.55) return WELD_HOT[1 + Math.floor(Math.random() * 4)];
  return WELD_COOL[Math.floor(Math.random() * WELD_COOL.length)];
}

function Particle({ p }) {
  const base = { position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 99997 };

  if (p.type === 'arc') {
    return (
      <motion.div
        style={{
          ...base,
          width: p.size,
          height: p.size,
          borderRadius: '50%',
          background: `radial-gradient(circle, #ffffff 0%, ${p.color} 35%, transparent 72%)`,
          filter: 'blur(1px)',
          boxShadow: `0 0 ${p.size}px ${p.color}, 0 0 ${p.size * 2}px ${p.color}80`,
        }}
        initial={{ x: p.x - p.size / 2, y: p.y - p.size / 2, opacity: p.opacity ?? 0.95, scale: 0.6 }}
        animate={{ opacity: 0, scale: 1.6 }}
        transition={{ duration: p.duration, ease: SMOOTH_EASE }}
      />
    );
  }

  if (p.type === 'spark') {
    return (
      <motion.div
        style={{
          ...base,
          width: p.length,
          height: p.thickness ?? 1.5,
          background: `linear-gradient(90deg, #ffffff 0%, ${p.color} 40%, transparent 100%)`,
          borderRadius: 2,
          originX: 0,
          originY: 0.5,
          rotate: p.angle,
          boxShadow: `0 0 6px ${p.color}, 0 0 12px ${p.color}60`,
        }}
        initial={{ x: p.x, y: p.y, opacity: 1, scaleX: 1 }}
        animate={{
          x: p.x + p.dx,
          y: p.y + p.dy + (p.gravity ?? 18),
          opacity: 0,
          scaleX: 0.15,
        }}
        transition={{ duration: p.duration, ease: GRAVITY_EASE }}
      />
    );
  }

  if (p.type === 'ember') {
    return (
      <motion.div
        style={{
          ...base,
          width: p.size,
          height: p.size,
          borderRadius: '50%',
          background: `radial-gradient(circle, #ffffff 0%, ${p.color} 55%, ${p.color}00 100%)`,
          boxShadow: `0 0 ${p.size * 4}px ${p.color}, 0 0 ${p.size * 8}px ${p.color}50`,
        }}
        initial={{ x: p.x, y: p.y, opacity: 1, scale: 1 }}
        animate={{
          x: p.x + p.dx,
          y: p.y + p.dy + (p.gravity ?? 24),
          opacity: 0,
          scale: 0.05,
        }}
        transition={{ duration: p.duration, ease: GRAVITY_EASE }}
      />
    );
  }

  if (p.type === 'streak') {
    return (
      <motion.div
        style={{
          ...base,
          width: p.length,
          height: 1.5,
          background: `linear-gradient(90deg, ${p.color}cc, transparent)`,
          borderRadius: 2,
          originX: 0,
          originY: 0.5,
          rotate: p.angle,
          boxShadow: `0 0 4px ${p.color}80`,
        }}
        initial={{ x: p.x, y: p.y, opacity: 0.65, scaleX: 1 }}
        animate={{ x: p.x + p.dx, y: p.y + p.dy, opacity: 0, scaleX: 0.35 }}
        transition={{ duration: p.duration, ease: SMOOTH_EASE }}
      />
    );
  }

  if (p.type === 'star') {
    return (
      <motion.div
        style={{ ...base, x: p.x, y: p.y, color: p.color, fontSize: p.size }}
        initial={{ opacity: 0.85, scale: 0.9, rotate: 0 }}
        animate={{
          x: p.x + p.dx,
          y: p.y + p.dy,
          opacity: 0,
          scale: 0.15,
          rotate: p.spin,
        }}
        transition={{ duration: p.duration, ease: SMOOTH_EASE }}
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
        transition={{ duration: p.duration, ease: SMOOTH_EASE }}
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
        boxShadow: `0 0 ${p.size * 3}px ${p.color}, 0 0 ${p.size * 6}px ${p.color}40`,
      }}
      initial={{ x: p.x, y: p.y, opacity: 0.75, scale: 1 }}
      animate={{ x: p.x + p.dx, y: p.y + p.dy, opacity: 0, scale: 0.1 }}
      transition={{ duration: p.duration, ease: SMOOTH_EASE }}
    />
  );
}

export function CustomCursor() {
  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);
  const ringX  = useSpring(mouseX, { stiffness: 120, damping: 22, mass: 0.55 });
  const ringY  = useSpring(mouseY, { stiffness: 120, damping: 22, mass: 0.55 });

  const [visible, setVisible]     = useState(false);
  const [clicking, setClicking]   = useState(false);
  const [hoverType, setHoverType] = useState('none');
  const [particles, setParticles] = useState([]);
  const [moving, setMoving]       = useState(false);

  const lastPos      = useRef({ x: 0, y: 0 });
  const smoothVel    = useRef({ x: 0, y: 0 });
  const cursorPos    = useRef({ x: 0, y: 0 });
  const hoverRef     = useRef('none');
  const isMovingRef  = useRef(false);
  const particleId   = useRef(0);
  const moveTimer    = useRef(null);
  const rafRef       = useRef(null);
  const lastSpawnRef = useRef(0);
  const lastHoverRef = useRef('none');
  const hoverColor   = HOVER_COLORS[hoverType] || HOVER_COLORS.none;
  const isInteractive = hoverType !== 'none';

  const addParticle = useCallback((p) => {
    const id = particleId.current++;
    const particle = { ...p, id, duration: p.duration ?? 0.45 + Math.random() * 0.35 };
    setParticles((prev) => [...prev.slice(-70), particle]);
    setTimeout(() => {
      setParticles((prev) => prev.filter((x) => x.id !== id));
    }, (particle.duration + 0.2) * 1000);
  }, []);

  const spawnWelding = useCallback((x, y, vx, vy, speed, type = 'none') => {
    const moveAngle = Math.atan2(vy, vx) || 0;
    const accent = HOVER_COLORS[type] || '#00D4FF';
    const hot = weldColor(speed);

    /* ── welding arc pool (bright core) ── */
    addParticle({
      type: 'arc',
      x, y,
      size: 10 + Math.min(speed * 0.8, 14),
      color: speed > 6 ? '#FFB020' : accent,
      opacity: 0.85,
      duration: 0.18 + Math.random() * 0.12,
    });

    if (Math.random() > 0.35) {
      addParticle({
        type: 'arc',
        x: x + (Math.random() - 0.5) * 4,
        y: y + (Math.random() - 0.5) * 4,
        size: 6 + Math.random() * 6,
        color: '#FFE566',
        opacity: 0.7,
        duration: 0.12 + Math.random() * 0.1,
      });
    }

    /* ── flying weld sparks (random spray, not just line) ── */
    const sparkCount = 1 + Math.floor(Math.min(speed * 0.35, 4)) + (Math.random() > 0.6 ? 1 : 0);

    for (let i = 0; i < sparkCount; i++) {
      const spray = (Math.random() - 0.5) * Math.PI * 1.4;
      const a = moveAngle + spray;
      const force = 14 + Math.random() * 28 + speed * 0.6;
      const color = weldColor(speed);
      const len = 5 + Math.random() * 14 + speed * 0.25;

      addParticle({
        type: 'spark',
        x: x + (Math.random() - 0.5) * 5,
        y: y + (Math.random() - 0.5) * 5,
        dx: Math.cos(a) * force,
        dy: Math.sin(a) * force * 0.85,
        gravity: 8 + Math.random() * 22,
        angle: (a * 180) / Math.PI,
        length: len,
        thickness: 1 + Math.random() * 1.5,
        color,
        duration: 0.28 + Math.random() * 0.35,
      });
    }

    /* ── ember dots (molten droplets with gravity) ── */
    if (Math.random() > 0.25) {
      const emberCount = 1 + Math.floor(Math.random() * 2);
      for (let i = 0; i < emberCount; i++) {
        const a = moveAngle + (Math.random() - 0.5) * 2.2;
        const force = 6 + Math.random() * 18 + speed * 0.25;
        addParticle({
          type: 'ember',
          x: x + (Math.random() - 0.5) * 6,
          y: y + (Math.random() - 0.5) * 6,
          dx: Math.cos(a) * force,
          dy: Math.sin(a) * force * 0.7,
          gravity: 16 + Math.random() * 28,
          color: hot,
          size: 1.5 + Math.random() * 2.5,
          duration: 0.4 + Math.random() * 0.45,
        });
      }
    }

    /* ── subtle motion trail (keeps smooth path) ── */
    if (speed > 2) {
      addParticle({
        type: 'streak',
        x, y,
        dx: -vx * 0.08,
        dy: -vy * 0.08,
        angle: (moveAngle * 180) / Math.PI,
        length: 4 + Math.min(speed * 0.25, 12),
        color: `${accent}99`,
        duration: 0.35 + Math.min(speed * 0.01, 0.15),
      });
    }
  }, [addParticle]);

  const spawnAt = useCallback((x, y, vx, vy, speed, type = 'none') => {
    spawnWelding(x, y, vx, vy, speed, type);
  }, [spawnWelding]);

  const spawnAlongPath = useCallback((x0, y0, x1, y1, vx, vy, speed, type) => {
    const dist = Math.hypot(x1 - x0, y1 - y0);
    const step = 10;
    const steps = Math.max(1, Math.floor(dist / step));

    for (let i = 1; i <= steps; i++) {
      const t = i / steps;
      spawnAt(x0 + (x1 - x0) * t, y0 + (y1 - y0) * t, vx, vy, speed, type);
    }
  }, [spawnAt]);

  const spawnClickBurst = useCallback((x, y, type) => {
    const color = HOVER_COLORS[type];
    addParticle({ type: 'ring', x, y, size: 22, color, duration: 0.45 });
    addParticle({ type: 'arc', x, y, size: 28, color: '#FFE566', duration: 0.35 });

    const burst = type === 'button' ? 16 : type === 'link' ? 12 : 10;
    for (let i = 0; i < burst; i++) {
      const a = (Math.PI * 2 * i) / burst + (Math.random() - 0.5) * 0.5;
      const force = 24 + Math.random() * 40;
      const hot = weldColor(12);
      addParticle({
        type: Math.random() > 0.5 ? 'spark' : 'ember',
        x, y,
        dx: Math.cos(a) * force,
        dy: Math.sin(a) * force,
        gravity: 12 + Math.random() * 30,
        angle: (a * 180) / Math.PI,
        length: 8 + Math.random() * 16,
        color: hot,
        size: 2 + Math.random() * 3,
        duration: 0.35 + Math.random() * 0.3,
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

    const tick = (now) => {
      if (!isMovingRef.current) return;

      const { x, y } = cursorPos.current;
      const { x: vx, y: vy } = smoothVel.current;
      const speed = Math.hypot(vx, vy);

      if (speed > 0.4 && now - lastSpawnRef.current > 22) {
        spawnAt(x, y, vx, vy, speed, hoverRef.current);
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
        x: smoothVel.current.x * 0.72 + dx * 0.28,
        y: smoothVel.current.y * 0.72 + dy * 0.28,
      };
      cursorPos.current = { x: e.clientX, y: e.clientY };

      if (dist > 1.5) {
        const speed = Math.hypot(smoothVel.current.x, smoothVel.current.y);
        spawnAlongPath(
          lastPos.current.x,
          lastPos.current.y,
          e.clientX,
          e.clientY,
          smoothVel.current.x,
          smoothVel.current.y,
          speed,
          type,
        );
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
      }, 140);
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
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };
  }, [mouseX, mouseY, spawnAt, spawnAlongPath, spawnClickBurst, spawnHoverEnter]);

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
          opacity: isInteractive ? 0.9 : moving ? 0.5 : 0,
          width: isInteractive ? 72 : moving ? 64 : 56,
          height: isInteractive ? 72 : moving ? 64 : 56,
          background: isInteractive
            ? `radial-gradient(circle, ${hoverColor}35 0%, ${hoverColor}12 45%, transparent 70%)`
            : moving
              ? 'radial-gradient(circle, rgba(255,230,102,0.35) 0%, rgba(255,136,0,0.15) 35%, rgba(0,212,255,0.08) 60%, transparent 75%)'
              : 'radial-gradient(circle, rgba(0,212,255,0.12) 0%, transparent 70%)',
        }}
        transition={{ duration: 0.28, ease: SMOOTH_EASE }}
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
          scale: clicking ? 0.55 : isInteractive ? 1.35 : moving ? 1.2 : 1,
          backgroundColor: isInteractive ? hoverColor : moving ? '#FFE566' : '#ffffff',
          boxShadow: moving && !isInteractive
            ? '0 0 14px #FFE566, 0 0 28px #FF8800, 0 0 8px #00D4FF'
            : `0 0 ${isInteractive ? 16 : 8}px ${hoverColor}`,
        }}
        transition={{ duration: 0.2, ease: SMOOTH_EASE }}
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
        transition={{ duration: 0.22, ease: SMOOTH_EASE }}
      />
    </>
  );
}
