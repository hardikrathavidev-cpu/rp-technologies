import React from 'react';
import { motion } from 'framer-motion';
import { SectionHeading } from '../ui/SectionHeading';
import {
  Search, FileText, Palette, Code2, Rocket, HeartHandshake
} from 'lucide-react';

const STEPS = [
  {
    num: '01',
    icon: <Search size={22} />,
    title: 'Discover',
    desc: 'We start by understanding your business goals, target audience, and technical requirements through in-depth discovery calls and research.',
  },
  {
    num: '02',
    icon: <FileText size={22} />,
    title: 'Plan',
    desc: 'A clear project roadmap is defined — scope, timeline, tech stack, and milestones. No surprises, no scope creep.',
  },
  {
    num: '03',
    icon: <Palette size={22} />,
    title: 'Design',
    desc: 'UI/UX wireframes and visual designs are crafted and iterated on until they perfectly match your brand and user expectations.',
  },
  {
    num: '04',
    icon: <Code2 size={22} />,
    title: 'Develop',
    desc: 'Our developers build the product with clean, well-documented code, regular commits, and bi-weekly demos for your review.',
  },
  {
    num: '05',
    icon: <Rocket size={22} />,
    title: 'Launch',
    desc: 'Thorough testing, performance optimisation, and a smooth deployment to production. We handle the technical side of go-live.',
  },
  {
    num: '06',
    icon: <HeartHandshake size={22} />,
    title: 'Support',
    desc: 'Post-launch, we provide monitoring, bug fixes, and ongoing updates. We are invested in your long-term success.',
  },
];

export function Process() {
  return (
    <section id="process" className="section-padding bg-light-card/40 dark:bg-dark-surface relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-20" aria-hidden="true" />

      <div className="container-custom relative z-10">
        <SectionHeading
          badge="How We Work"
          title="Our Proven"
          highlight="6-Step Process"
          subtitle="A structured, transparent workflow that keeps every project on track — from first call to final deployment."
          center
        />

        {/* Desktop: Horizontal layout */}
        <div className="hidden lg:block">
          {/* Connector line */}
          <div className="relative mb-12">
            <div className="absolute top-8 left-0 right-0 h-px bg-gradient-to-r from-transparent via-light-border dark:via-dark-border to-transparent" />
            <div className="grid grid-cols-6 gap-0 relative">
              {STEPS.map((step, i) => (
                <motion.div
                  key={step.num}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="flex flex-col items-center relative"
                >
                  {/* Node */}
                  <motion.div
                    whileHover={{ scale: 1.12 }}
                    className="relative z-10 w-16 h-16 rounded-2xl flex items-center justify-center mb-3
                      bg-light-surface dark:bg-dark-card
                      border-2 border-light-border dark:border-dark-border
                      hover:border-accent/60 hover:shadow-glow-sm
                      text-accent transition-all duration-300 cursor-default"
                  >
                    {step.icon}
                    {/* Accent dot on hover */}
                  </motion.div>
                  <div className="text-xs font-bold text-accent tracking-widest mb-1">{step.num}</div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Step cards */}
          <div className="grid grid-cols-6 gap-4">
            {STEPS.map((step, i) => (
              <motion.div
                key={step.num + '-card'}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                className="glass-card p-4 hover:border-accent/25 transition-all duration-300"
              >
                <h3 className="text-sm font-bold text-light-text dark:text-dark-text mb-2">{step.title}</h3>
                <p className="text-xs text-light-muted dark:text-dark-muted leading-relaxed">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Mobile: Vertical timeline */}
        <div className="lg:hidden space-y-0">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.08 }}
              className="relative flex gap-5"
            >
              {/* Left: connector */}
              <div className="flex flex-col items-center shrink-0">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-accent bg-light-surface dark:bg-dark-card border-2 border-light-border dark:border-dark-border shrink-0 z-10">
                  {step.icon}
                </div>
                {i < STEPS.length - 1 && (
                  <div className="w-px flex-1 bg-gradient-to-b from-light-border dark:from-dark-border to-transparent my-2 min-h-[24px]" />
                )}
              </div>

              {/* Content */}
              <div className={`pb-8 ${i === STEPS.length - 1 ? 'pb-0' : ''}`}>
                <div className="text-xs font-bold text-accent tracking-widest mb-1">{step.num}</div>
                <h3 className="text-base font-bold text-light-text dark:text-dark-text mb-1.5">{step.title}</h3>
                <p className="text-sm text-light-muted dark:text-dark-muted leading-relaxed">{step.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
