import React from 'react';
import { Navbar }         from './components/layout/Navbar';
import { Footer }         from './components/layout/Footer';
import { Hero }           from './components/sections/Hero';
import { TechMarquee }    from './components/sections/TechMarquee';
import { Services }       from './components/sections/Services';
import { About }          from './components/sections/About';
import { HorizontalScroll } from './components/sections/HorizontalScroll';
import { Projects }       from './components/sections/Projects';
import { WhyUs }          from './components/sections/WhyUs';
import { Testimonials }   from './components/sections/Testimonials';
import { Contact }        from './components/sections/Contact';
import { WhatsAppButton } from './components/ui/WhatsAppButton';
import { CustomCursor }   from './components/ui/CustomCursor';
import {
  ScrollProgressBar,
  LeftStickyNav,
  RightScrollIndicator,
} from './components/ui/ScrollUI';
import { useTheme }       from './hooks/useTheme';
import { motion }         from 'framer-motion';

/* ── Floating Gen-Z blobs (decorative, fixed position) ── */
function FloatingBlobs() {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      <motion.div
        className="absolute w-64 h-64 opacity-[0.04] dark:opacity-[0.06]"
        style={{
          top: '15%', left: '-5%',
          background: '#8338EC',
          filter: 'blur(60px)',
        }}
        animate={{
          borderRadius: [
            '60% 40% 30% 70% / 60% 30% 70% 40%',
            '30% 60% 70% 40% / 50% 60% 30% 60%',
            '60% 40% 30% 70% / 60% 30% 70% 40%',
          ],
          scale: [1, 1.1, 1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute w-80 h-80 opacity-[0.04] dark:opacity-[0.05]"
        style={{
          bottom: '20%', right: '-8%',
          background: '#FF006E',
          filter: 'blur(70px)',
        }}
        animate={{
          borderRadius: [
            '30% 70% 70% 30% / 30% 30% 70% 70%',
            '70% 30% 30% 70% / 70% 70% 30% 30%',
            '30% 70% 70% 30% / 30% 30% 70% 70%',
          ],
          scale: [1, 1.15, 1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      />
      <motion.div
        className="absolute w-52 h-52 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          top: '55%', left: '40%',
          background: '#AAFF00',
          filter: 'blur(80px)',
        }}
        animate={{
          borderRadius: [
            '40% 60% 60% 40% / 60% 40% 60% 40%',
            '60% 40% 40% 60% / 40% 60% 40% 60%',
            '40% 60% 60% 40% / 60% 40% 60% 40%',
          ],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 4 }}
      />
    </div>
  );
}

/* ── Mobile sticky CTA ── */
function MobileCTA() {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 sm:hidden">
      <div className="bg-light-surface/90 dark:bg-dark-surface/90 backdrop-blur-xl border-t border-light-border dark:border-dark-border px-4 py-3">
        <button
          onClick={() => {
            const el = document.getElementById('contact');
            if (el) window.scrollTo({ top: el.offsetTop - 72, behavior: 'smooth' });
          }}
          className="w-full bg-accent text-dark-bg font-bold py-3 rounded-xl text-sm shadow-glow hover:bg-accent-hover transition-colors duration-200"
        >
          Start a Project →
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const { isDark, toggle } = useTheme();

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="font-body bg-light-bg dark:bg-dark-bg text-light-text dark:text-dark-text min-h-screen transition-colors duration-300 relative">

        {/* Fixed overlays */}
        <CustomCursor />
        <ScrollProgressBar />
        <LeftStickyNav />
        <RightScrollIndicator />
        <FloatingBlobs />

        <Navbar isDark={isDark} onThemeToggle={toggle} />

        <main id="main-content" className="relative z-10 pb-20 sm:pb-0">
          <Hero />
          <TechMarquee />
          <Services />
          <About />
          {/* <HorizontalScroll /> */}  {/* hidden — re-enable when ready */}
          <Projects />
          <WhyUs />
          <Testimonials />
          <Contact />
        </main>

        <Footer />
        <WhatsAppButton />
        <MobileCTA />
      </div>
    </div>
  );
}
