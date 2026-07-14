import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const TECH_STATUS = [
  { label: 'REACT', status: 'ACTIVE', color: '#61DAFB' },
  { label: 'NODE.JS', status: 'ONLINE', color: '#68A063' },
  { label: 'TYPESCRIPT', status: 'COMPILED', color: '#3178C6' },
  { label: 'VITE', status: 'READY', color: '#BD34FE' },
  { label: 'MONGODB', status: 'SYNCED', color: '#4EA94B' },
  { label: 'DOCKER', status: 'RUNNING', color: '#0db7ed' },
  { label: 'AWS', status: 'DEPLOYED', color: '#FF9900' },
  { label: 'GRAPHQL', status: 'QUERYING', color: '#E535AB' },
];

const HUD_TERMS = [
  'build :: optimized',
  'api :: responding',
  'cache :: warm',
  'ssl :: secured',
  'cdn :: active',
  'ci/cd :: passing',
  'lighthouse :: 98',
  'uptime :: 99.9%',
];

function CornerBracket({ className, flip = false }) {
  return (
    <svg
      className={`absolute w-8 h-8 text-accent/30 ${className}`}
      viewBox="0 0 32 32"
      fill="none"
      style={{ transform: flip ? 'scale(-1,-1)' : undefined }}
    >
      <motion.path
        d="M2 12 V2 H12"
        stroke="currentColor"
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, repeat: Infinity, repeatType: 'reverse' }}
      />
    </svg>
  );
}

function StatusRow({ tech, index }) {
  return (
    <motion.div
      key={tech.label}
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 8 }}
      transition={{ duration: 0.3 }}
      className="flex items-center gap-2 font-mono text-[9px] tracking-wider"
    >
      <motion.span
        className="w-1 h-1 rounded-full"
        style={{ background: tech.color }}
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: index * 0.2 }}
      />
      <span style={{ color: tech.color }}>{tech.label}</span>
      <span className="text-dark-muted/60">::</span>
      <span className="text-accent/70">{tech.status}</span>
    </motion.div>
  );
}

export function TechHUD() {
  const [techIdx, setTechIdx] = useState(0);
  const [termIdx, setTermIdx] = useState(0);
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [visible, setVisible] = useState(false);

  const visibleTech = [
    TECH_STATUS[techIdx % TECH_STATUS.length],
    TECH_STATUS[(techIdx + 1) % TECH_STATUS.length],
    TECH_STATUS[(techIdx + 2) % TECH_STATUS.length],
  ];

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;

    const onMove = (e) => {
      setCoords({ x: e.clientX, y: e.clientY });
      setVisible(true);
    };
    const onLeave = () => setVisible(false);

    window.addEventListener('mousemove', onMove, { passive: true });
    document.documentElement.addEventListener('mouseleave', onLeave);

    const techTimer = setInterval(() => setTechIdx((i) => i + 1), 2800);
    const termTimer = setInterval(() => setTermIdx((i) => i + 1), 3200);

    return () => {
      window.removeEventListener('mousemove', onMove);
      document.documentElement.removeEventListener('mouseleave', onLeave);
      clearInterval(techTimer);
      clearInterval(termTimer);
    };
  }, []);

  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <div className="fixed inset-0 pointer-events-none z-[35] hidden xl:block overflow-hidden" aria-hidden="true">
      {/* Scan line */}
      <motion.div
        className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent/25 to-transparent"
        animate={{ top: ['0%', '100%'] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
      />

      {/* Top-left: system label */}
      <div className="absolute top-24 left-6 space-y-1">
        <CornerBracket className="top-0 left-0" />
        <motion.div
          className="pl-5 pt-3 font-mono text-[10px] tracking-[0.2em] text-accent/50 uppercase"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          RP Technologies
        </motion.div>
        <div className="pl-5 font-mono text-[9px] text-dark-muted/50">
          sys.build v2.0.26
        </div>
        <div className="pl-5 mt-3 space-y-1.5">
          <AnimatePresence mode="popLayout">
            {visibleTech.map((t, i) => (
              <StatusRow key={`${t.label}-${techIdx}-${i}`} tech={t} index={i} />
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Top-right: coordinates + status */}
      <div className="absolute top-24 right-6 text-right">
        <CornerBracket className="top-0 right-0" flip />
        <motion.div
          className="pr-5 pt-3 font-mono text-[9px] text-dark-muted/50 space-y-0.5"
          animate={{ opacity: visible ? 1 : 0.3 }}
        >
          <div>
            <span className="text-accent/40">X</span>{' '}
            <span className="text-accent/70 tabular-nums">{String(coords.x).padStart(4, '0')}</span>
          </div>
          <div>
            <span className="text-accent/40">Y</span>{' '}
            <span className="text-accent/70 tabular-nums">{String(coords.y).padStart(4, '0')}</span>
          </div>
        </motion.div>
        <motion.div
          className="pr-5 mt-2 font-mono text-[9px] text-emerald-400/60 flex items-center justify-end gap-1.5"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          ALL SYSTEMS GO
        </motion.div>
      </div>

      {/* Bottom-left: cycling tech terms */}
      <div className="absolute bottom-8 left-6">
        <CornerBracket className="bottom-0 left-0" flip />
        <div className="pl-5 pb-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={termIdx}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.35 }}
              className="font-mono text-[10px] text-accent/50 tracking-widest"
            >
              &gt; {HUD_TERMS[termIdx % HUD_TERMS.length]}
              <motion.span
                animate={{ opacity: [1, 0] }}
                transition={{ duration: 0.6, repeat: Infinity }}
                className="text-accent"
              >
                _
              </motion.span>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom-right: stack indicator */}
      <div className="absolute bottom-8 right-6 text-right">
        <CornerBracket className="bottom-0 right-0" flip />
        <div className="pr-5 pb-3 space-y-1">
          {['FRONTEND', 'BACKEND', 'DEVOPS'].map((layer, i) => (
            <motion.div
              key={layer}
              className="font-mono text-[8px] tracking-[0.15em] text-dark-muted/40 flex items-center justify-end gap-2"
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.6 }}
            >
              <span>{layer}</span>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <motion.div
                    key={j}
                    className="w-1 h-2 rounded-sm"
                    style={{
                      background: j < 3 + i ? '#00D4FF' : '#2A2A3A',
                      opacity: j < 3 + i ? 0.6 : 0.2,
                    }}
                    animate={j < 3 + i ? { opacity: [0.4, 0.9, 0.4] } : {}}
                    transition={{ duration: 1.2, repeat: Infinity, delay: j * 0.1 }}
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
