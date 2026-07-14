import React, { useRef, useEffect, useState } from 'react';
import { motion, useMotionValue } from 'framer-motion';

/* ─────────────────── data ─────────────────── */
const CARDS = [
  {
    emoji: '⚡', num: '01', title: 'Discovery & Strategy',
    desc:  'We dig into your goals, audience, and competitors to build a rock-solid product strategy.',
    color: '#00D4FF', bg: '#0A1A2E', tag: 'Week 1', rotate: '-2deg',
  },
  {
    emoji: '🎨', num: '02', title: 'Design & Prototype',
    desc:  'Wireframes to high-fidelity Figma designs to interactive prototype — you see it before we build it.',
    color: '#FF006E', bg: '#2A0A1A', tag: 'Week 2', rotate: '1.5deg',
  },
  {
    emoji: '🚀', num: '03', title: 'Development Sprint',
    desc:  'Agile two-week sprints. Clean code, tested components, daily updates. You stay in the loop.',
    color: '#8338EC', bg: '#150A2A', tag: 'Week 3–6', rotate: '-1deg',
  },
  {
    emoji: '🧪', num: '04', title: 'QA & Testing',
    desc:  'Cross-browser, responsive, performance and accessibility testing. Shipped only when bulletproof.',
    color: '#AAFF00', bg: '#0F1A0A', tag: 'Week 7', rotate: '2deg',
  },
  {
    emoji: '🌐', num: '05', title: 'Launch & Deploy',
    desc:  'We handle hosting setup, domain config, SSL, and go-live. Zero technical headaches for you.',
    color: '#FFD60A', bg: '#1A1500', tag: 'Week 8', rotate: '-1.5deg',
  },
  {
    emoji: '🛡️', num: '06', title: 'Support & Growth',
    desc:  'Post-launch monitoring, updates, and feature additions. We grow with your product long-term.',
    color: '#FF5D00', bg: '#1A0D00', tag: 'Ongoing', rotate: '1deg',
  },
];

const CARD_W   = 300; // px — card width
const CARD_GAP = 20;  // px — gap between cards
const CARD_STEP = CARD_W + CARD_GAP;
const TOTAL_X   = -(CARDS.length - 1) * CARD_STEP; // total horizontal travel

/* How many vh to dedicate per card transition */
const STEP_VH  = 80;
/* Total scroll height for this section */
const SCROLL_VH = (CARDS.length - 1) * STEP_VH + 100; // 500vh

/* ─────────────────── mobile card ─────────────────── */
function MobileCard({ card }) {
  return (
    <div
      className="flex-shrink-0 w-[260px] rounded-2xl overflow-hidden border border-dark-border"
      style={{ background: card.bg }}
    >
      <div className="h-1" style={{ background: card.color }} />
      <div className="p-5">
        <span
          className="inline-block text-[9px] font-black uppercase tracking-widest
                     px-2.5 py-1 rounded-full mb-3 border"
          style={{ color: card.color, borderColor: card.color, background: `${card.color}15` }}
        >
          {card.tag}
        </span>
        <div className="text-3xl mb-2">{card.emoji}</div>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-xl font-black opacity-20" style={{ color: card.color }}>
            {card.num}
          </span>
          <h3 className="text-sm font-bold text-dark-text leading-snug">{card.title}</h3>
        </div>
        <p className="text-xs text-dark-muted leading-relaxed">{card.desc}</p>
      </div>
    </div>
  );
}

/* ─────────────────── desktop card ─────────────────── */
function DesktopCard({ card }) {
  return (
    <motion.div
      whileHover={{ y: -6, scale: 1.02, rotate: '0deg' }}
      transition={{ duration: 0.2 }}
      className="flex-shrink-0 rounded-3xl border-2 border-dark-border cursor-none overflow-hidden"
      style={{
        width:    CARD_W,
        background: card.bg,
        rotate:   card.rotate,
      }}
    >
      <div className="h-1.5" style={{ background: card.color }} />
      <div className="p-6 pt-8">
        <span
          className="inline-block text-[9px] font-black uppercase tracking-widest
                     px-2.5 py-1 rounded-full mb-4 border-2"
          style={{ color: card.color, borderColor: card.color, background: `${card.color}15` }}
        >
          {card.tag}
        </span>

        <div
          className="text-3xl mb-4 w-12 h-12 flex items-center justify-center rounded-2xl border-2"
          style={{ borderColor: `${card.color}40`, background: `${card.color}10` }}
        >
          {card.emoji}
        </div>

        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-[32px] font-black leading-none" style={{ color: card.color, opacity: 0.2 }}>
            {card.num}
          </span>
          <h3 className="text-sm font-bold text-dark-text leading-snug">{card.title}</h3>
        </div>
        <p className="text-xs text-dark-muted leading-relaxed">{card.desc}</p>

        <div
          className="mt-4 h-0.5 rounded-full"
          style={{ background: `linear-gradient(90deg, ${card.color}, transparent)` }}
        />
      </div>
    </motion.div>
  );
}

/* ─────────────────── section header ─────────────────── */
function Header({ showHint }) {
  return (
    <div className="flex items-end justify-between px-6 lg:px-12 pt-10 pb-4">
      <div>
        <div className="badge mb-2">Our Process</div>
        <h2 className="text-3xl md:text-4xl xl:text-5xl font-black font-display text-dark-text leading-tight">
          How We Build{' '}
          <span className="relative inline-block">
            <span className="text-accent">Things</span>
            <svg className="absolute -bottom-1.5 left-0 w-full" viewBox="0 0 200 12" fill="none" style={{ height: 8 }}>
              <path
                d="M2 8 Q20 2 38 8 Q56 14 74 8 Q92 2 110 8 Q128 14 146 8 Q164 2 182 8 Q191 11 198 8"
                stroke="#FF006E" strokeWidth="3" strokeLinecap="round" fill="none"
              />
            </svg>
          </span>
        </h2>
      </div>

      {showHint && (
        <motion.div
          initial={{ opacity: 1 }}
          className="hidden lg:flex items-center gap-2 text-sm font-bold text-accent
                     border-2 border-accent/30 rounded-2xl px-4 py-2 flex-shrink-0"
          style={{ opacity: showHint ? 1 : 0 }}
        >
          <span>Scroll to explore</span>
          <motion.span
            animate={{ x: [0, 6, 0] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >→</motion.span>
        </motion.div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════════════
   MAIN EXPORT

   Gap explanation & fix:
   ───────────────────────────────────────────────────────
   With sticky top:0 height:100vh inside a 500vh container:
   • Sticky exits at scroll = container_top + 400vh
     (when container bottom = viewport bottom)
   • Container ends at container_top + 500vh
   • From 400vh to 500vh → 100vh of empty container is visible → the "gap"

   Fix: We add a solid-bg div that covers that bottom 100vh inside
   the container, making the empty space invisible. Then the next
   section scrolls on top of it normally.
   ═══════════════════════════════════════════════════════ */
export function HorizontalScroll() {
  /* Refs for direct DOM manipulation (no React re-renders for animation) */
  const spacerRef   = useRef(null);
  const cardsRowRef = useRef(null);
  const dotFillRefs = useRef([]); // array of inner fill divs
  const hintRef     = useRef(null);

  /* ── Mobile scroll listener (none needed; CSS overflow-x handles it) ── */

  /* ── Desktop: raw scroll → directly update transforms ── */
  useEffect(() => {
    /* Skip on mobile — the mobile section handles itself */
    const mq = window.matchMedia('(min-width: 768px)');
    if (!mq.matches) return;

    const spacer   = spacerRef.current;
    const cardsRow = cardsRowRef.current;
    if (!spacer || !cardsRow) return;

    const onScroll = () => {
      const rect     = spacer.getBoundingClientRect();
      const vh       = window.innerHeight;
      const scrolled = -rect.top;                          // px above viewport
      const scrollable = spacer.offsetHeight - vh;         // total scrollable range
      if (scrollable <= 0) return;

      const progress = Math.max(0, Math.min(1, scrolled / scrollable));

      /* Translate cards row */
      cardsRow.style.transform = `translateX(${TOTAL_X * progress}px)`;

      /* Update progress dot fills */
      dotFillRefs.current.forEach((fill, i) => {
        if (!fill) return;
        const start = i / CARDS.length;
        const end   = (i + 1) / CARDS.length;
        const p     = Math.max(0, Math.min(1, (progress - start) / (end - start)));
        fill.style.transform = `scaleX(${p})`;
      });

      /* Fade out scroll hint */
      if (hintRef.current) {
        hintRef.current.style.opacity = progress > 0.05 ? '0' : '1';
      }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll(); /* init */

    /* Re-run on resize (viewport size changes) */
    const onResize = () => onScroll();
    window.addEventListener('resize', onResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return (
    <>
      {/* Anchor for nav dots */}
      <div id="process" />

      {/* ══════════════════════════
          MOBILE  (hidden on ≥ md)
          ══════════════════════════ */}
      <section className="block md:hidden bg-dark-bg py-14">
        <div className="px-4 mb-5">
          <div className="badge mb-3">Our Process</div>
          <h2 className="text-3xl font-black font-display text-dark-text">
            How We Build <span className="text-accent">Things</span>
          </h2>
          <p className="text-xs text-dark-muted mt-2 flex items-center gap-1">
            <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>←</motion.span>
            Swipe to explore
            <motion.span animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>→</motion.span>
          </p>
        </div>

        <div className="overflow-x-auto no-scrollbar">
          <div className="flex gap-3 px-4 pb-2" style={{ width: 'max-content' }}>
            {CARDS.map((c) => <MobileCard key={c.num} card={c} />)}
            <div className="flex-shrink-0 w-4" />
          </div>
        </div>

        <div className="flex gap-1.5 px-4 mt-4">
          {CARDS.map((c) => (
            <div key={c.num} className="h-1 flex-1 rounded-full" style={{ background: `${c.color}50` }} />
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════
          DESKTOP  (hidden on < md)

          Structure:
          ┌─ spacer (SCROLL_VH tall, creates scroll space) ──┐
          │  ┌─ sticky panel (h-screen) ───────────────────┐  │
          │  │  Header                                      │  │
          │  │  Cards row (overflow-hidden, fills middle)   │  │
          │  │  Progress dots                               │  │
          │  └──────────────────────────────────────────────┘  │
          │  ┌─ gap cover (h-screen, bg same as section) ──┐  │
          │  │  Fills the trailing 100vh so no black gap   │  │
          │  └──────────────────────────────────────────────┘  │
          └────────────────────────────────────────────────────┘
          ══════════════════════════════════════════════════════ */}
      <div
        ref={spacerRef}
        className="hidden md:block relative bg-dark-bg"
        style={{ height: `${SCROLL_VH}vh` }}
      >
        {/* ── Sticky panel ── */}
        <div
          className="sticky top-0 bg-dark-bg"
          style={{
            height:  '100vh',
            display: 'grid',
            gridTemplateRows: 'auto 1fr auto', /* header | cards | dots */
            zIndex:  20,
          }}
        >
          {/* Row 1: Header */}
          <Header showHint />

          {/* Row 2: Cards (fills all remaining height, overflow-hidden clips off-screen cards) */}
          <div
            style={{
              position: 'relative',
              overflow: 'hidden',
              minHeight: 0,
            }}
          >
            {/* Cards translate inside this absolutely-positioned row */}
            <div
              ref={cardsRowRef}
              style={{
                position:       'absolute',
                top:            0,
                bottom:         0,
                left:           0,
                display:        'flex',
                alignItems:     'center',
                gap:            CARD_GAP,
                paddingLeft:    '2rem',
                willChange:     'transform',
                transform:      'translateX(0px)',
              }}
            >
              {CARDS.map((card) => (
                <DesktopCard key={card.num} card={card} />
              ))}
              <div style={{ flexShrink: 0, width: 16 }} />
            </div>
          </div>

          {/* Row 3: Progress dots */}
          <div className="flex items-center gap-2 px-6 lg:px-12 pb-5 pt-2">
            {CARDS.map((card, i) => (
              <div
                key={card.num}
                style={{
                  flex:         1,
                  height:       4,
                  borderRadius: 9999,
                  overflow:     'hidden',
                  background:   'rgba(42,42,58,0.6)',
                }}
              >
                <div
                  ref={(el) => { dotFillRefs.current[i] = el; }}
                  style={{
                    width:           '100%',
                    height:          '100%',
                    borderRadius:    9999,
                    background:      card.color,
                    transformOrigin: 'left',
                    transform:       'scaleX(0)',
                    transition:      'transform 0.05s linear',
                  }}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ── Gap cover ──
            Covers the trailing 100vh of empty container that
            shows after the sticky panel exits. Same bg = invisible gap. */}
        <div
          className="absolute bottom-0 left-0 right-0 bg-dark-bg"
          style={{ height: '100vh', zIndex: 19 }}
        />
      </div>
    </>
  );
}
