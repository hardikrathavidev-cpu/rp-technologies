import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { useScrollSpy } from '../../hooks/useScrollSpy';

const NAV_LINKS = [
  { label: 'Home', href: '#home' },
  { label: 'Services', href: '#services' },
  { label: 'About', href: '#about' },
  { label: 'Process', href: '#process' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

const SECTION_IDS = ['home', 'services', 'about', 'process', 'projects', 'whyus', 'testimonials', 'contact'];

export function Navbar({ isDark, onThemeToggle }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const activeId = useScrollSpy(SECTION_IDS, 100);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavClick = (href) => {
    setMobileOpen(false);
    const id = href.replace('#', '');
    const el = document.getElementById(id);
    if (el) {
      const offset = 72;
      const y = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  return (
    <>
      <motion.header
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-light-surface/90 dark:bg-dark-surface/90 backdrop-blur-xl border-b border-light-border dark:border-dark-border shadow-card-light dark:shadow-card-dark'
            : 'bg-transparent'
        }`}
      >
        <nav className="container-custom flex items-center justify-between h-[72px]" aria-label="Main navigation">
          {/* Logo */}
          <a
            href="#home"
            onClick={(e) => { e.preventDefault(); handleNavClick('#home'); }}
            className="flex items-center gap-2.5 shrink-0"
            aria-label="RP Technologies home"
          >
            <div className="relative w-9 h-9">
              <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-9 h-9" aria-hidden="true">
                <rect width="36" height="36" rx="10" fill="#00D4FF" fillOpacity="0.12" />
                <rect x="0.5" y="0.5" width="35" height="35" rx="9.5" stroke="#00D4FF" strokeOpacity="0.4" />
                <path d="M10 26V10H18.5C20.433 10 22 11.567 22 13.5C22 15.433 20.433 17 18.5 17H10" stroke="#00D4FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M17 17L24 26" stroke="#00D4FF" strokeWidth="2.5" strokeLinecap="round"/>
                <circle cx="26" cy="13" r="2" fill="#00D4FF" />
              </svg>
            </div>
            <span className="font-display font-bold text-lg tracking-tight text-light-text dark:text-dark-text">
              RP <span className="text-accent">Technologies</span>
            </span>
          </a>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map(({ label, href }) => {
              const id = href.replace('#', '');
              const isActive = activeId === id;
              return (
                <a
                  key={label}
                  href={href}
                  onClick={(e) => { e.preventDefault(); handleNavClick(href); }}
                  className={`relative px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    isActive
                      ? 'text-accent'
                      : 'text-light-muted dark:text-dark-muted hover:text-light-text dark:hover:text-dark-text'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute inset-0 bg-accent/8 dark:bg-accent/10 rounded-lg"
                      transition={{ type: 'spring', bounce: 0.25, duration: 0.5 }}
                    />
                  )}
                  <span className="relative z-10">{label}</span>
                </a>
              );
            })}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-3">
            <ThemeToggle isDark={isDark} onToggle={onThemeToggle} />
            <button
              onClick={() => handleNavClick('#contact')}
              className="hidden sm:inline-flex items-center gap-1.5 bg-accent text-dark-bg text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-accent-hover shadow-glow-sm hover:shadow-glow transition-all duration-200 active:scale-95"
            >
              Start a Project
              <ArrowUpRight size={15} strokeWidth={2.5} />
            </button>
            {/* Mobile toggle */}
            <button
              onClick={() => setMobileOpen(v => !v)}
              className="lg:hidden w-10 h-10 flex items-center justify-center rounded-xl border border-light-border dark:border-dark-border text-light-text dark:text-dark-text hover:border-accent/40 transition-colors"
              aria-label="Toggle mobile menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-dark-bg/60 backdrop-blur-sm lg:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="fixed top-0 right-0 h-full w-72 z-50 bg-light-surface dark:bg-dark-surface border-l border-light-border dark:border-dark-border shadow-2xl lg:hidden flex flex-col"
            >
              <div className="flex items-center justify-between p-5 border-b border-light-border dark:border-dark-border">
                <span className="font-display font-bold text-light-text dark:text-dark-text">Navigation</span>
                <button onClick={() => setMobileOpen(false)} aria-label="Close menu" className="text-light-muted dark:text-dark-muted">
                  <X size={22} />
                </button>
              </div>
              <nav className="flex flex-col p-5 gap-1 flex-1" aria-label="Mobile navigation">
                {NAV_LINKS.map(({ label, href }, i) => {
                  const id = href.replace('#', '');
                  const isActive = activeId === id;
                  return (
                    <motion.a
                      key={label}
                      href={href}
                      onClick={(e) => { e.preventDefault(); handleNavClick(href); }}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.06 }}
                      className={`px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-accent/10 text-accent'
                          : 'text-light-muted dark:text-dark-muted hover:bg-light-card dark:hover:bg-dark-card hover:text-light-text dark:hover:text-dark-text'
                      }`}
                    >
                      {label}
                    </motion.a>
                  );
                })}
              </nav>
              <div className="p-5 border-t border-light-border dark:border-dark-border">
                <button
                  onClick={() => handleNavClick('#contact')}
                  className="w-full flex items-center justify-center gap-2 bg-accent text-dark-bg font-semibold py-3 rounded-xl hover:bg-accent-hover transition-colors"
                >
                  Start a Project
                  <ArrowUpRight size={16} />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
