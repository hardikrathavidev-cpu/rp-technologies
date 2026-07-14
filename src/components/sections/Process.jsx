import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useInView } from 'framer-motion';
import {
  Compass, Map, PenTool, Terminal, Rocket, LifeBuoy, ChevronRight,
} from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';

const STEPS = [
  {
    id: 'discover',
    num: '01',
    title: 'Discover',
    tag: 'Week 1',
    icon: Compass,
    color: '#00D4FF',
    headline: 'Goals, audience, and constraints — mapped.',
    desc: 'We run focused discovery sessions, audit your current stack, and turn fuzzy ideas into a clear problem statement and success metrics.',
    outcomes: ['Kickoff workshop', 'Competitor scan', 'Success KPIs'],
  },
  {
    id: 'plan',
    num: '02',
    title: 'Plan',
    tag: 'Week 1–2',
    icon: Map,
    color: '#8338EC',
    headline: 'A roadmap you can actually ship against.',
    desc: 'Scope, architecture, milestones, and timelines are locked with no vague estimates. You always know what’s next and when.',
    outcomes: ['Project roadmap', 'Tech stack pick', 'Sprint plan'],
  },
  {
    id: 'design',
    num: '03',
    title: 'Design',
    tag: 'Week 2–3',
    icon: PenTool,
    color: '#FF006E',
    headline: 'Interfaces you can click before we code.',
    desc: 'Wireframes → visual system → interactive prototype. You review real flows early so development starts on a solid base.',
    outcomes: ['Wireframes', 'UI kit', 'Clickable prototype'],
  },
  {
    id: 'build',
    num: '04',
    title: 'Build',
    tag: 'Week 3–7',
    icon: Terminal,
    color: '#AAFF00',
    headline: 'Clean code. Short loops. Visible progress.',
    desc: 'Agile sprints with demos you can review. Performance, accessibility, and security are built in — not bolted on at the end.',
    outcomes: ['Bi-weekly demos', 'Reviewed PRs', 'Staging builds'],
  },
  {
    id: 'launch',
    num: '05',
    title: 'Launch',
    tag: 'Week 8',
    icon: Rocket,
    color: '#FFD60A',
    headline: 'Go-live without the chaos.',
    desc: 'QA across devices, performance checks, hosting, SSL, domains, and a calm deployment plan so launch day feels routine.',
    outcomes: ['Full QA pass', 'Deploy checklist', 'Go-live support'],
  },
  {
    id: 'grow',
    num: '06',
    title: 'Grow',
    tag: 'Ongoing',
    icon: LifeBuoy,
    color: '#FF5D00',
    headline: 'Ship. Measure. Improve. Repeat.',
    desc: 'Monitoring, fixes, and feature work after launch. We stay in the loop so your product keeps getting better, not stuck.',
    outcomes: ['Uptime watch', 'Iteration sprints', 'Priority support'],
  },
];

function StepPanel({ step, index, active, onSelect }) {
  const ref = useRef(null);
  const inView = useInView(ref, { amount: 0.45, margin: '-10% 0px -35% 0px' });
  const Icon = step.icon;
  const isEven = index % 2 === 0;

  useEffect(() => {
    if (inView) onSelect(index);
  }, [inView, index, onSelect]);

  return (
    <motion.article
      ref={ref}
      id={`process-${step.id}`}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.05 }}
      className={`relative grid gap-6 lg:gap-10 lg:grid-cols-2 items-center py-8 md:py-12 ${
        isEven ? '' : 'lg:[&>*:first-child]:order-2'
      }`}
    >
      {/* Visual rail node / number block */}
      <div className={`relative ${isEven ? 'lg:pr-8' : 'lg:pl-8'}`}>
        <div
          className="relative overflow-hidden rounded-3xl border border-light-border dark:border-dark-border bg-light-surface dark:bg-dark-card p-6 sm:p-8 transition-shadow duration-300"
          style={{
            boxShadow: active ? `0 0 0 1px ${step.color}55, 0 20px 50px -24px ${step.color}66` : undefined,
          }}
        >
          <div
            className="pointer-events-none absolute -right-6 -top-10 text-[7rem] sm:text-[9rem] font-black leading-none select-none opacity-[0.06] dark:opacity-[0.09]"
            style={{ color: step.color }}
            aria-hidden="true"
          >
            {step.num}
          </div>

          <div className="relative z-10 flex items-start justify-between gap-4 mb-6">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center border"
              style={{
                color: step.color,
                borderColor: `${step.color}40`,
                background: `${step.color}14`,
              }}
            >
              <Icon size={26} strokeWidth={1.75} />
            </div>
            <span
              className="text-[10px] font-bold uppercase tracking-[0.16em] px-3 py-1.5 rounded-full border"
              style={{
                color: step.color,
                borderColor: `${step.color}45`,
                background: `${step.color}12`,
              }}
            >
              {step.tag}
            </span>
          </div>

          <p className="relative z-10 text-xs font-mono tracking-widest text-light-muted dark:text-dark-muted mb-2">
            PHASE {step.num}
          </p>
          <h3 className="relative z-10 text-2xl sm:text-3xl font-display font-bold text-light-text dark:text-dark-text mb-3">
            {step.title}
          </h3>
          <p className="relative z-10 text-base sm:text-lg font-medium text-light-text/80 dark:text-dark-text/80 leading-snug mb-4">
            {step.headline}
          </p>
          <p className="relative z-10 text-sm text-light-muted dark:text-dark-muted leading-relaxed">
            {step.desc}
          </p>
        </div>
      </div>

      {/* Outcomes */}
      <div className={`${isEven ? 'lg:pl-4' : 'lg:pr-4 lg:text-right'} space-y-3`}>
        <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-light-muted dark:text-dark-muted">
          You walk away with
        </p>
        <ul className={`space-y-2.5 ${isEven ? '' : 'lg:ml-auto'} max-w-md ${isEven ? '' : 'lg:mr-0'}`}>
          {step.outcomes.map((item, i) => (
            <motion.li
              key={item}
              initial={{ opacity: 0, x: isEven ? -12 : 12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.12 + i * 0.08 }}
              className={`flex items-center gap-3 rounded-2xl border border-light-border dark:border-dark-border bg-light-bg/70 dark:bg-dark-bg/50 px-4 py-3 ${
                isEven ? '' : 'lg:flex-row-reverse'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ background: step.color, boxShadow: `0 0 10px ${step.color}` }}
              />
              <span className="text-sm font-medium text-light-text dark:text-dark-text">{item}</span>
            </motion.li>
          ))}
        </ul>
      </div>
    </motion.article>
  );
}

export function Process() {
  const [active, setActive] = useState(0);
  const activeStep = STEPS[active] || STEPS[0];

  const selectStep = (index) => {
    setActive(index);
  };

  const jumpTo = (index) => {
    setActive(index);
    const el = document.getElementById(`process-${STEPS[index].id}`);
    if (el) {
      const top = el.getBoundingClientRect().top + window.scrollY - 96;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="process"
      className="section-padding relative overflow-hidden bg-light-bg dark:bg-dark-bg"
    >
      {/* Atmosphere */}
      <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" aria-hidden="true" />
      <div
        className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[70vw] max-w-3xl h-[40vh] rounded-full blur-[100px] opacity-20 dark:opacity-30 pointer-events-none transition-colors duration-700"
        style={{ background: activeStep.color }}
        aria-hidden="true"
      />

      <div className="container-custom relative z-10">
        <SectionHeading
          badge="Our Process"
          title="How We"
          highlight="Ship Products"
          subtitle="A clear six-phase pipeline — from first conversation to ongoing growth — so you always know where the work stands."
          center
        />

        {/* Phase navigator */}
        <div className="mb-10 md:mb-14">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 -mx-1 px-1">
            {STEPS.map((step, i) => {
              const Icon = step.icon;
              const isActive = active === i;
              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => jumpTo(i)}
                  className={`group relative flex items-center gap-2.5 shrink-0 rounded-2xl border px-3.5 py-2.5 text-left transition-all duration-300 ${
                    isActive
                      ? 'border-transparent bg-light-surface dark:bg-dark-card shadow-glow-sm'
                      : 'border-light-border dark:border-dark-border bg-transparent hover:border-accent/35'
                  }`}
                  style={isActive ? { boxShadow: `0 0 0 1px ${step.color}50` } : undefined}
                  aria-current={isActive ? 'step' : undefined}
                >
                  <span
                    className="w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold"
                    style={{
                      color: isActive ? step.color : undefined,
                      background: isActive ? `${step.color}18` : 'transparent',
                    }}
                  >
                    {isActive ? <Icon size={15} /> : step.num}
                  </span>
                  <span className="hidden sm:block">
                    <span className="block text-xs font-bold text-light-text dark:text-dark-text leading-none mb-0.5">
                      {step.title}
                    </span>
                    <span className="block text-[10px] text-light-muted dark:text-dark-muted">
                      {step.tag}
                    </span>
                  </span>
                </button>
              );
            })}
          </div>

          {/* Progress track */}
          <div className="mt-4 h-1 rounded-full bg-light-border/80 dark:bg-dark-border overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ background: activeStep.color }}
              animate={{ width: `${((active + 1) / STEPS.length) * 100}%` }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            />
          </div>
          <div className="mt-2 flex items-center justify-between text-[11px] font-mono text-light-muted dark:text-dark-muted">
            <AnimatePresence mode="wait">
              <motion.span
                key={activeStep.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                className="tracking-wider"
                style={{ color: activeStep.color }}
              >
                ACTIVE · {activeStep.title.toUpperCase()}
              </motion.span>
            </AnimatePresence>
            <span>{active + 1} / {STEPS.length}</span>
          </div>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Center spine (desktop) */}
          <div
            className="hidden lg:block absolute left-1/2 top-8 bottom-8 w-px -translate-x-1/2 bg-gradient-to-b from-transparent via-light-border dark:via-dark-border to-transparent"
            aria-hidden="true"
          />

          <div className="space-y-2 md:space-y-4">
            {STEPS.map((step, i) => (
              <div key={step.id} className="relative">
                {/* Spine node */}
                <div
                  className="hidden lg:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 w-3.5 h-3.5 rounded-full border-2 bg-light-bg dark:bg-dark-bg transition-colors duration-300"
                  style={{
                    borderColor: active === i ? step.color : 'var(--tw-prose-bullets, #2A2A3A)',
                    boxShadow: active === i ? `0 0 12px ${step.color}` : 'none',
                    backgroundColor: active === i ? step.color : undefined,
                  }}
                  aria-hidden="true"
                />
                <StepPanel
                  step={step}
                  index={i}
                  active={active === i}
                  onSelect={selectStep}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Closing CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 md:mt-16 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 rounded-3xl border border-light-border dark:border-dark-border bg-light-surface/80 dark:bg-dark-card/80 px-6 py-6 sm:px-8"
        >
          <div>
            <p className="text-sm font-bold text-light-text dark:text-dark-text mb-1">
              Ready to start phase 01?
            </p>
            <p className="text-sm text-light-muted dark:text-dark-muted">
              Tell us about your product — we’ll map the pipeline together.
            </p>
          </div>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              const el = document.getElementById('contact');
              if (el) window.scrollTo({ top: el.offsetTop - 72, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 rounded-2xl bg-accent text-dark-bg font-bold text-sm px-5 py-3 shadow-glow hover:bg-accent-hover transition-colors"
          >
            Start a project
            <ChevronRight size={16} />
          </a>
        </motion.div>
      </div>
    </section>
  );
}
