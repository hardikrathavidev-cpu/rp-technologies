import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Rocket } from 'lucide-react';

export function CTABanner() {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.offsetTop - 72, behavior: 'smooth' });
  };

  return (
    <section className="relative py-20 md:py-28 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-dark-bg via-dark-surface to-dark-bg" />
      <div className="absolute inset-0 grid-bg opacity-40" aria-hidden="true" />

      {/* Radial glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] rounded-full opacity-10"
        style={{ background: 'radial-gradient(ellipse, #00D4FF 0%, #8338EC 40%, transparent 70%)', filter: 'blur(60px)' }}
        aria-hidden="true"
      />

      <div className="container-custom relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="glow-card max-w-4xl mx-auto p-10 md:p-14 text-center bg-dark-card/60 backdrop-blur-xl"
        >
          <motion.div
            animate={{ y: [0, -8, 0], rotate: [0, 3, -3, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
            className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-accent/10 border border-accent/30 mb-6"
          >
            <Rocket size={28} className="text-accent" />
          </motion.div>

          <h2 className="text-3xl md:text-5xl font-black font-display text-dark-text leading-tight mb-4">
            Ready to Build Something{' '}
            <span className="text-gradient-genz">Extraordinary?</span>
          </h2>
          <p className="text-dark-muted text-base md:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
            From concept to launch — we turn your ideas into polished digital products
            that users love and businesses scale on.
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <motion.button
              onClick={() => scrollTo('contact')}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 bg-accent text-dark-bg font-bold px-8 py-4 rounded-2xl shadow-glow hover:shadow-glow-lg transition-shadow cursor-none"
            >
              Start Your Project
              <ArrowRight size={18} />
            </motion.button>
            <motion.button
              onClick={() => scrollTo('projects')}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              className="inline-flex items-center gap-2 border-2 border-dark-border text-dark-text font-semibold px-8 py-4 rounded-2xl hover:border-accent/50 hover:text-accent transition-colors cursor-none"
            >
              View Our Work
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
