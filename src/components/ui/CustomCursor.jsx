import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

export function CustomCursor() {
  const mouseX  = useMotionValue(-200);
  const mouseY  = useMotionValue(-200);
  const ringX   = useSpring(mouseX, { stiffness: 140, damping: 18, mass: 0.5 });
  const ringY   = useSpring(mouseY, { stiffness: 140, damping: 18, mass: 0.5 });

  const [visible,  setVisible]  = useState(false);
  const [clicking, setClicking] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    // Touch devices — do nothing
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const onMove  = (e) => { mouseX.set(e.clientX); mouseY.set(e.clientY); setVisible(true); };
    const onDown  = () => setClicking(true);
    const onUp    = () => setClicking(false);
    const onLeave = () => setVisible(false);
    const onEnter = () => setVisible(true);
    const onOver  = (e) => {
      setHovering(!!e.target.closest('a, button, [role="button"], select'));
    };

    window.addEventListener('mousemove', onMove,  { passive: true });
    window.addEventListener('mousedown', onDown);
    window.addEventListener('mouseup',   onUp);
    window.addEventListener('mouseover', onOver,  { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);
    document.documentElement.addEventListener('mouseenter', onEnter);

    return () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mousedown', onDown);
      window.removeEventListener('mouseup',   onUp);
      window.removeEventListener('mouseover', onOver);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      document.documentElement.removeEventListener('mouseenter', onEnter);
    };
  }, [mouseX, mouseY]); // stable refs — no re-register on every move

  // Don't render on touch
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <>
      {/* Inner dot — snaps instantly to cursor */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[99999] mix-blend-difference rounded-full"
        style={{
          width:       8,
          height:      8,
          x:           mouseX,
          y:           mouseY,
          translateX:  '-50%',
          translateY:  '-50%',
          backgroundColor: '#ffffff',
        }}
        animate={{
          opacity:         visible  ? 1   : 0,
          scale:           clicking ? 0.5 : hovering ? 2 : 1,
          backgroundColor: hovering ? '#00D4FF' : '#ffffff',
        }}
        transition={{ scale: { duration: 0.12 }, opacity: { duration: 0.15 } }}
      />

      {/* Outer ring — lags behind with spring */}
      <motion.div
        className="fixed top-0 left-0 pointer-events-none z-[99998] rounded-full"
        style={{
          x:          ringX,
          y:          ringY,
          translateX: '-50%',
          translateY: '-50%',
          border:     '1.5px solid rgba(0,212,255,0.6)',
        }}
        animate={{
          opacity:     visible  ? 1    : 0,
          scale:       clicking ? 0.65 : hovering ? 1.6 : 1,
          width:       hovering ? 44   : 32,
          height:      hovering ? 44   : 32,
          borderColor: hovering
            ? 'rgba(0,212,255,0.9)'
            : 'rgba(0,212,255,0.5)',
          boxShadow: hovering
            ? '0 0 14px rgba(0,212,255,0.35)'
            : '0 0 0px rgba(0,212,255,0)',
        }}
        transition={{
          opacity:     { duration: 0.15 },
          scale:       { duration: 0.18 },
          width:       { duration: 0.22 },
          height:      { duration: 0.22 },
          borderColor: { duration: 0.18 },
          boxShadow:   { duration: 0.18 },
        }}
      />
    </>
  );
}
