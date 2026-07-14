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

/* ── Particle renderers ── */
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

  if (p.type === 'hex') {
    return (
      <motion.svg
        style={{ ...base, x: p.x - 20, y: p.y - 20, width: 40, height: 40 }}
        viewBox="0 0 40 40"
        initial={{ opacity: 0.9, scale: 0.5, rotate: 0 }}
        animate={{ opacity: 0, scale: 2, rotate: 60 }}
        transition={{ duration: p.duration, ease: 'easeOut' }}
      >
        <polygon
          points="20,2 36,11 36,29 20,38 4,29 4,11"
          fill="none"
          stroke={p.color}
          strokeWidth="1.5"
          opacity="0.7"
        />
      </motion.svg>
    );
  }

  // default dot spark
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
  const ringX  = useSpring(mouseX, { stiffness: 120, damping: 16, mass: 0.6 });
  const ringY  = useSpring(mouseY, { stiffness: 120, damping: 16, mass: 0.6 });

  const [visible, setVisible]     = useState(false);
  const [clicking, setClicking]   = useState(false);
  const [hoverType, setHoverType] = useState('none');
  const [particles, setParticles] = useState([]);
  const [moving, setMoving]     = useState(false);
  const [speed, setSpeed]         = useState(0);

  const lastPos      = useRef({ x: 0, y: 0 });
  const particleId   = useRef(0);
  const moveTimer    = useRef(null);
  const lastHoverRef = useRef('none');
  const hoverColor   = HOVER_COLORS[hoverType] || HOVER_COLORS.none;

  const addParticle = useCallback((p) => {
    const id = particleId.current++;
    const particle = { ...p, id, duration: p.duration ?? 0.4 + Math.random() * 0.2 };
    setParticles((prev) => [...prev.slice(-55), particle]);
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
        size: type === 'link' ? 3 + Math.random() * 2 : 2 + Math.random() * 3,
        spin: Math.random() * 180 - 90,
        duration: 0.35 + Math.random() * 0.2,
      });
    }
  }, [addParticle]);

  const spawnClickBurst = useCallback((x, y, type) => {
    const color = HOVER_COLORS[type];

    addParticle({ type: 'ring', x, y, size: 20, color, duration: 0.5 });
    addParticle({ type: 'ring', x, y, size: 30, color: '#8338EC', duration: 0.65 });

    if (type === 'button') {
      addParticle({ type: 'hex', x, y, color, duration: 0.55 });
    }

    const burst = type === 'button' ? 14 : type === 'link' ? 10 : 8;
    for (let i = 0; i < burst; i++) {
      const a = (Math.PI * 2 * i) / burst + Math.random() * 0.3;
      const force = 30 + Math.random() * 40;
      addParticle({
        type: i % 3 === 0 ? 'star' : 'dot',
        x, y,
        dx: Math.cos(a) * force,
        dy: Math.sin(a) * force,
        color: i % 2 === 0 ? color : PALETTE[i % PALETTE.length],
        size: 3 + Math.random() * 4,
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
        dx: Math.cos(a) * 18,
        dy: Math.sin(a) * 18,
        color,
        size: 3,
        duration: 0.35,
      });
    }
    if (type === 'link') {
      addParticle({ type: 'ring', x, y, size: 16, color, duration: 0.4 });
    }
    if (type === 'button') {
      addParticle({ type: 'hex', x, y, color, duration: 0.45 });
    }
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
      setSpeed(dist);

      const type = detectHoverType(e.target);
      if (dist > 4) {
        spawnTrail(e.clientX, e.clientY, dx, dy, dist, type);
        lastPos.current = { x: e.clientX, y: e.clientY };
      }

      clearTimeout(moveTimer.current);
      moveTimer.current = setTimeout(() => { setMoving(false); setSpeed(0); }, 100);
    };

    const onDown = (e) => {
      setClicking(true);
      const type = detectHoverType(e.target);
      spawnClickBurst(e.clientX, e.clientY, type);
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

  const isInteractive = hoverType !== 'none';
  // Snap ring to cursor on interactive elements — no spring lag
  const ringPosX = isInteractive ? mouseX : ringX;
  const ringPosY = isInteractive ? mouseY : ringY;

  return (
    <>
      <AnimatePresence>
        {particles.map((p) => (
          <Particle key={p.id} p={p} />
        ))}
      </AnimatePresence>

      {/* Comet tail */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[99994] rounded-full"
        style={{
          x: isInteractive ? mouseX : ringX,
          y: isInteractive ? mouseY : ringY,
          translateX: '-50%',
          translateY: '-50%',
          width: 100 + speed * 3,
          height: 100 + speed * 3,
          background: `radial-gradient(circle, ${hoverColor}18 0%, transparent 65%)`,
        }}
        animate={{ opacity: moving ? 0.9 : isInteractive ? 0.5 : 0 }}
        transition={{ duration: 0.12 }}
      />

      {/* Link: arrow pointer */}
      <AnimatePresence>
        {hoverType === 'link' && (
          <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[99999] font-mono text-[10px] font-bold tracking-wider"
            style={{ x: mouseX, y: mouseY, translateX: 14, translateY: -18 }}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            <span style={{ color: hoverColor }}>OPEN →</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Button: action label */}
      <AnimatePresence>
        {hoverType === 'button' && (
          <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[99999] font-mono text-[10px] font-bold tracking-wider"
            style={{ x: mouseX, y: mouseY, translateX: 16, translateY: -20 }}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            <span style={{ color: hoverColor }}>▶ GO</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Input: text beam */}
      <AnimatePresence>
        {hoverType === 'input' && (
          <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[99999]"
            style={{ x: mouseX, y: mouseY, translateX: '-50%', translateY: '-50%' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="w-0.5 h-5 bg-[#AAFF00] rounded-full"
              animate={{ opacity: [1, 0.2, 1] }}
              transition={{ duration: 0.8, repeat: Infinity }}
              style={{ boxShadow: '0 0 8px #AAFF00' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Inner dot / pointer */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[99999] flex items-center justify-center"
        style={{ x: mouseX, y: mouseY, translateX: '-50%', translateY: '-50%' }}
        animate={{
          opacity: visible ? 1 : 0,
          width: hoverType === 'input' ? 2 : hoverType === 'button' ? 8 : clicking ? 6 : isInteractive ? 8 : 8,
          height: hoverType === 'input' ? 14 : hoverType === 'button' ? 8 : clicking ? 6 : isInteractive ? 8 : 8,
          borderRadius: hoverType === 'input' ? 2 : hoverType === 'button' ? 4 : '50%',
          backgroundColor: isInteractive ? hoverColor : '#ffffff',
          boxShadow: `0 0 ${isInteractive ? 16 : 10}px ${hoverColor}`,
        }}
        transition={{ duration: 0.12, ease: 'easeOut' }}
      />

      {/* Outer ring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[99998] box-border"
        style={{
          x: ringPosX,
          y: ringPosY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          opacity: visible ? 1 : 0,
          scale: clicking ? 0.75 : 1,
          width: hoverType === 'button' ? 36 : hoverType === 'link' ? 34 : moving ? 34 : 30,
          height: hoverType === 'button' ? 36 : hoverType === 'link' ? 34 : moving ? 34 : 30,
          borderRadius: hoverType === 'button' ? 8 : '50%',
          rotate: hoverType === 'link' ? [0, 360] : 0,
          borderWidth: 2,
          borderStyle: hoverType === 'card' ? 'dashed' : 'solid',
          borderColor: isInteractive ? `${hoverColor}cc` : 'rgba(0,212,255,0.5)',
          boxShadow: isInteractive
            ? `0 0 20px ${hoverColor}40`
            : moving
              ? '0 0 14px rgba(131,56,236,0.25)'
              : 'none',
        }}
        transition={{
          scale: { duration: 0.12 },
          width: { duration: 0.15 },
          height: { duration: 0.15 },
          rotate: hoverType === 'link' ? { duration: 4, repeat: Infinity, ease: 'linear' } : { duration: 0.15 },
        }}
      />

      {/* Button hex overlay */}
      <AnimatePresence>
        {hoverType === 'button' && (
          <motion.svg
            className="fixed top-0 left-0 pointer-events-none z-[99997]"
            style={{ x: mouseX, y: mouseY, translateX: '-50%', translateY: '-50%', width: 44, height: 44 }}
            viewBox="0 0 44 44"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 0.5, scale: 1, rotate: 360 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ rotate: { duration: 8, repeat: Infinity, ease: 'linear' }, opacity: { duration: 0.15 } }}
          >
            <polygon
              points="22,3 39,12 39,32 22,41 5,32 5,12"
              fill="none"
              stroke="#FF006E"
              strokeWidth="1"
              strokeDasharray="3 3"
            />
          </motion.svg>
        )}
      </AnimatePresence>

      {/* Link orbit dots */}
      <AnimatePresence>
        {hoverType === 'link' && (
          <motion.div
            className="fixed top-0 left-0 pointer-events-none z-[99996]"
            style={{ x: mouseX, y: mouseY, translateX: '-50%', translateY: '-50%' }}
            animate={{ rotate: 360 }}
            transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
          >
            {[0, 120, 240].map((deg) => (
              <div
                key={deg}
                className="absolute w-1.5 h-1.5 rounded-full bg-accent"
                style={{
                  transform: `rotate(${deg}deg) translateX(22px)`,
                  boxShadow: '0 0 6px #00D4FF',
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Crosshair when moving fast */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[99995]"
        style={{ x: mouseX, y: mouseY, translateX: '-50%', translateY: '-50%' }}
        animate={{ opacity: moving && speed > 10 ? 0.6 : 0 }}
      >
        <div className="absolute w-px h-6 bg-accent/50 -translate-x-1/2 -top-9 left-1/2" />
        <div className="absolute w-px h-6 bg-accent/50 -translate-x-1/2 top-3 left-1/2" />
        <div className="absolute h-px w-6 bg-accent/50 -translate-y-1/2 -left-9 top-1/2" />
        <div className="absolute h-px w-6 bg-accent/50 -translate-y-1/2 left-3 top-1/2" />
      </motion.div>
    </>
  );
}
