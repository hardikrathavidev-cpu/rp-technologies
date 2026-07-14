import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowUpRight, TrendingUp, ExternalLink } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';

const PROJECTS = [
  {
    id: 1,
    category: 'Our Product',
    title: 'VolleyPro',
    description: 'Our volleyball live score tracker — real-time match scoring for courtside use, with set history, team lineup, and instant scoreboard updates coaches and fans can follow live.',
    outcome: 'Live sets & points · Instant court updates · Built for match day',
    stack: ['React', 'Node.js', 'Socket.io', 'MongoDB'],
    color: '#FF5D00',
    bg: 'from-orange-500/20 to-amber-500/10',
    num: '01',
    stat: 'LIVE',
    statLabel: 'Score Tracker',
    href: null,
  },
  {
    id: 2,
    category: 'Web Application',
    title: 'FleetTrack Pro',
    description: 'A real-time fleet management dashboard for a logistics company managing 200+ vehicles. Features live GPS tracking, driver performance analytics, and automated maintenance alerts.',
    outcome: '40% reduction in fuel costs · 60% faster dispatching',
    stack: ['React', 'Node.js', 'MongoDB', 'Socket.io'],
    color: '#00D4FF',
    bg: 'from-cyan-500/20 to-blue-500/10',
    num: '02',
    stat: '40%',
    statLabel: 'Cost Reduction',
  },
  {
    id: 3,
    category: 'E-Commerce Platform',
    title: 'ArtisanMarket',
    description: 'A multi-vendor e-commerce platform for handmade goods, featuring vendor dashboards, automated payouts, order tracking, and a custom recommendation engine.',
    outcome: '₹12L+ GMV in first 6 months · 3-second load time',
    stack: ['Next.js', 'Stripe', 'PostgreSQL', 'Redis'],
    color: '#A855F7',
    bg: 'from-purple-500/20 to-pink-500/10',
    num: '03',
    stat: '₹12L+',
    statLabel: 'GMV Month 6',
  },
  {
    id: 4,
    category: 'Business Software',
    title: 'ClinicDesk',
    description: 'A clinic management system for an independent healthcare provider — appointment scheduling, patient records, billing, and WhatsApp notification integration.',
    outcome: '80% reduction in admin time · 500+ patient records',
    stack: ['React', 'Django', 'MySQL', 'WhatsApp API'],
    color: '#10B981',
    bg: 'from-emerald-500/20 to-teal-500/10',
    num: '04',
    stat: '80%',
    statLabel: 'Less Admin Time',
  },
];

function ProjectCard({ project, index }) {
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ duration: 0.7, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      onHoverStart={() => setHovered(true)}
      onHoverEnd={() => setHovered(false)}
      className="group relative glass-card overflow-hidden cursor-default"
      style={{ borderColor: hovered ? `${project.color}50` : undefined, boxShadow: hovered ? `0 0 40px ${project.color}15` : undefined }}
    >
      {/* Header visual */}
      <div className={`relative h-48 bg-gradient-to-br ${project.bg} overflow-hidden flex items-center justify-between px-7`}>
        <div className="absolute inset-0 grid-bg opacity-30" />

        {/* Big project number */}
        <div className="relative z-10 font-display font-black text-[6rem] leading-none opacity-10 text-light-text dark:text-dark-text select-none">
          {project.num}
        </div>

        {/* Floating stat */}
        <motion.div
          className="relative z-10 text-right"
          animate={{ y: hovered ? -4 : 0 }}
          transition={{ duration: 0.4 }}
        >
          <div
            className="text-5xl font-black font-display"
            style={{ color: project.color }}
          >
            {project.stat}
          </div>
          <div className="text-xs text-dark-muted font-medium">{project.statLabel}</div>
        </motion.div>

        {/* Category */}
        <div className="absolute top-4 left-4">
          <span className="badge" style={{ color: project.color, borderColor: `${project.color}30`, background: `${project.color}10` }}>
            {project.category}
          </span>
        </div>

        {/* Shimmer overlay on hover */}
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: '200%' }}
              exit={{ x: '200%' }}
              transition={{ duration: 0.7, ease: 'easeInOut' }}
              className="absolute inset-0 w-1/3 bg-gradient-to-r from-transparent via-white/8 to-transparent pointer-events-none skew-x-12"
            />
          )}
        </AnimatePresence>
      </div>

      {/* Body */}
      <div className="p-6">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="text-xl font-bold text-light-text dark:text-dark-text group-hover:text-accent transition-colors duration-200">
            {project.title}
          </h3>
          <motion.div
            animate={{ x: hovered ? 2 : 0, y: hovered ? -2 : 0 }}
            transition={{ duration: 0.3 }}
          >
            <ArrowUpRight size={20} className="text-light-muted dark:text-dark-muted group-hover:text-accent transition-colors" />
          </motion.div>
        </div>

        <p className="text-sm text-light-muted dark:text-dark-muted leading-relaxed mb-4">
          {project.description}
        </p>

        {/* Outcome */}
        <div
          className="rounded-xl px-4 py-3 mb-4 border"
          style={{ background: `${project.color}08`, borderColor: `${project.color}20` }}
        >
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={13} style={{ color: project.color }} />
            <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: project.color }}>Outcome</span>
          </div>
          <div className="text-sm font-semibold text-light-text dark:text-dark-text">{project.outcome}</div>
        </div>

        {/* Stack */}
        <div className="flex flex-wrap gap-2">
          {project.stack.map((tag) => (
            <span key={tag} className="tag-chip">{tag}</span>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export function Projects() {
  return (
    <section id="projects" className="section-padding bg-light-bg dark:bg-dark-bg relative overflow-hidden">
      <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full glow-orb bg-accent/4" aria-hidden="true" />
      <div className="absolute top-20 right-0 w-60 h-60 rounded-full glow-orb bg-purple-500/4" aria-hidden="true" />

      <div className="container-custom relative z-10">
        <SectionHeading
          badge="Our Work"
          title="Projects That"
          highlight="Delivered Results"
          subtitle="Real-world projects across industries, each one built to solve a specific business problem and create measurable impact."
        />

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {PROJECTS.map((p, i) => (
            <ProjectCard key={p.id} project={p} index={i} />
          ))}
        </div>

        {/* CTA */}
        <motion.div
          className="mt-14 text-center"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <p className="text-light-muted dark:text-dark-muted text-sm mb-5">
            We've delivered 50+ projects across healthcare, logistics, retail, education, and SaaS.
          </p>
          <button
            onClick={() => {
              const el = document.getElementById('contact');
              if (el) window.scrollTo({ top: el.offsetTop - 72, behavior: 'smooth' });
            }}
            className="inline-flex items-center gap-2 text-sm font-semibold text-accent border border-accent/30 px-6 py-3 rounded-xl hover:bg-accent/8 hover:border-accent/60 transition-all duration-200 group"
          >
            Discuss your project
            <ArrowUpRight size={15} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </motion.div>
      </div>
    </section>
  );
}
