import React from 'react';
import { motion } from 'framer-motion';
import { Shield, Clock, Users, Award } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';
import { AnimatedCounter } from '../ui/AnimatedCounter';

const STATS = [
  { icon: <Award size={22} />, value: 50, suffix: '+', label: 'Projects Delivered' },
  { icon: <Users size={22} />, value: 30, suffix: '+', label: 'Happy Clients' },
  { icon: <Clock size={22} />, value: 4, suffix: '+', label: 'Years of Experience' },
  { icon: <Shield size={22} />, value: 99, suffix: '%', label: 'Client Satisfaction' },
];

const VALUES = [
  { title: 'Custom Over Cookie-Cutter', desc: 'Every project is built from scratch around your specific goals, brand, and audience — never recycled templates.' },
  { title: 'Business-First Thinking', desc: 'We write code that solves real problems. Our decisions are driven by outcomes, not technology trends.' },
  { title: 'Clean, Maintainable Code', desc: 'Built with future growth in mind. Easy to update, extend, or hand off to any developer.' },
  { title: 'Transparent Communication', desc: 'Regular progress updates, clear timelines, and honest conversations throughout the project.' },
];

export function About() {
  return (
    <section id="about" className="section-padding bg-light-bg dark:bg-dark-bg relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 rounded-full glow-orb bg-accent/5 dark:bg-accent/7" aria-hidden="true" />

      <div className="container-custom relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left: Story */}
          <div>
            <SectionHeading
              badge="About Us"
              title="Built on Trust,"
              highlight="Delivered with Precision"
              subtitle="RP Technologies started with a simple belief — businesses deserve software partners who actually understand their goals, not just their tech stack."
            />

            <div className="space-y-5">
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="text-light-muted dark:text-dark-muted leading-relaxed"
              >
                We are a product-minded software company helping startups, SMEs, and established businesses build, scale, and maintain high-quality digital products. Our team brings together expertise in frontend design, full-stack development, and business process automation.
              </motion.p>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-light-muted dark:text-dark-muted leading-relaxed"
              >
                From a single-page portfolio to a multi-tenant SaaS platform — we approach every project with the same level of craftsmanship, attention to detail, and commitment to delivery.
              </motion.p>

              {/* Values */}
              <div className="grid sm:grid-cols-2 gap-4 mt-8">
                {VALUES.map(({ title, desc }, i) => (
                  <motion.div
                    key={title}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                    className="glass-card p-4"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-accent mt-2 shrink-0" />
                      <div>
                        <h4 className="text-sm font-semibold text-light-text dark:text-dark-text mb-1">{title}</h4>
                        <p className="text-xs text-light-muted dark:text-dark-muted leading-relaxed">{desc}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Stats */}
          <div>
            <div className="grid grid-cols-2 gap-5">
              {STATS.map(({ icon, value, suffix, label }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, scale: 0.92 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, margin: '-40px' }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="glass-card p-6 group hover:border-accent/30 hover:shadow-glow-sm transition-all duration-300"
                >
                  <div className="text-accent mb-3 group-hover:scale-110 transition-transform duration-200 inline-block">
                    {icon}
                  </div>
                  <div className="text-4xl font-bold font-display text-light-text dark:text-dark-text mb-1">
                    <AnimatedCounter target={value} suffix={suffix} />
                  </div>
                  <div className="text-sm text-light-muted dark:text-dark-muted">{label}</div>
                </motion.div>
              ))}
            </div>

            {/* Decorative card */}
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-5 glass-card p-5 border-glow"
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm font-medium text-light-text dark:text-dark-text">Currently accepting projects</span>
              </div>
              <p className="text-sm text-light-muted dark:text-dark-muted leading-relaxed">
                We work with clients across India, UK, USA, Australia, and the Middle East. Every engagement is treated with the care of a long-term partnership.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
