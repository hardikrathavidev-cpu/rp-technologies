import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion';
import {
  Globe, LayoutDashboard, Palette, Code2, Wrench, Zap
} from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';

const SERVICES = [
  {
    id: 1,
    icon: <Globe size={28} />,
    title: 'Website Development',
    desc: 'Fast, SEO-optimised, and beautifully crafted websites that convert visitors into clients. Built for performance and long-term growth.',
    tags: ['React', 'Next.js', 'WordPress'],
    gradient: 'from-cyan-500/20 via-transparent to-transparent',
    color: '#00D4FF',
    span: 'lg:col-span-2',
  },
  {
    id: 2,
    icon: <LayoutDashboard size={24} />,
    title: 'Web App Development',
    desc: 'Full-stack web applications with clean architecture, real-time features, and seamless UX.',
    tags: ['Node.js', 'PostgreSQL', 'REST API'],
    gradient: 'from-blue-500/15 via-transparent to-transparent',
    color: '#3B82F6',
    span: '',
  },
  {
    id: 3,
    icon: <Palette size={24} />,
    title: 'UI/UX Design',
    desc: 'Interface design that balances aesthetics with usability — wireframes, design systems, prototypes.',
    tags: ['Figma', 'Design Systems'],
    gradient: 'from-purple-500/15 via-transparent to-transparent',
    color: '#8338EC',
    span: '',
  },
  {
    id: 4,
    icon: <Code2 size={24} />,
    title: 'Custom Software',
    desc: 'Bespoke software built around your exact workflow — CRMs, ERPs, internal tools, SaaS platforms.',
    tags: ['Python', 'Django', 'Microservices'],
    gradient: 'from-indigo-500/15 via-transparent to-transparent',
    color: '#6366F1',
    span: '',
  },
  {
    id: 5,
    icon: <Wrench size={24} />,
    title: 'Maintenance & Support',
    desc: 'Ongoing updates, performance monitoring, bug fixes, and priority support to keep your product reliable.',
    tags: ['24/7 Support', 'SLA'],
    gradient: 'from-emerald-500/15 via-transparent to-transparent',
    color: '#10B981',
    span: '',
  },
  {
    id: 6,
    icon: <Zap size={28} />,
    title: 'Business Automation',
    desc: 'Streamline repetitive workflows with intelligent automation — connect tools, reduce manual effort, and scale operations.',
    tags: ['Zapier', 'n8n', 'Custom APIs'],
    gradient: 'from-amber-500/15 via-transparent to-transparent',
    color: '#FFD60A',
    span: 'lg:col-span-2',
  },
];

/* ── 3D Tilt Card ── */
function TiltCard({ service, index }) {
  const ref = useRef(null);
  const [hovered, setHovered] = useState(false);

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [8, -8]), { stiffness: 200, damping: 25 });
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-8, 8]), { stiffness: 200, damping: 25 });

  const handleMove = (e) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    mx.set((e.clientX - rect.left) / rect.width - 0.5);
    my.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleLeave = () => { mx.set(0); my.set(0); setHovered(false); };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleLeave}
      style={{ rotateX: rotX, rotateY: rotY, transformPerspective: 800, transformStyle: 'preserve-3d' }}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.6, delay: index * 0.08 }}
      className={`relative glow-card shine-hover p-7 overflow-hidden cursor-default transition-all duration-300
        ${hovered ? 'shadow-glow' : ''}
        ${service.span}`}
      style={{
        borderColor: hovered ? `${service.color}50` : undefined,
        boxShadow: hovered ? `0 12px 40px ${service.color}18` : undefined,
      }}
    >
      {/* Gradient overlay */}
      <div className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 ${hovered ? 'opacity-100' : ''} transition-opacity duration-500 pointer-events-none rounded-2xl`} />

      {/* Radial glow on hover */}
      <div
        className="absolute inset-0 opacity-0 transition-opacity duration-500 pointer-events-none rounded-2xl"
        style={{
          background: `radial-gradient(circle at 30% 20%, ${service.color}12 0%, transparent 60%)`,
          opacity: hovered ? 1 : 0,
        }}
      />

      {/* Icon */}
      <motion.div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5 border relative z-10"
        style={{
          color: service.color,
          borderColor: `${service.color}30`,
          backgroundColor: `${service.color}10`,
        }}
        animate={{
          rotate: hovered ? [0, -5, 5, 0] : 0,
          boxShadow: hovered ? `0 0 24px ${service.color}30` : '0 0 0 transparent',
        }}
        transition={{ duration: 0.4 }}
      >
        {service.icon}
      </motion.div>

      {/* Content */}
      <div className={`relative z-10 ${service.span === 'lg:col-span-2' ? 'lg:flex lg:gap-8 lg:items-start' : ''}`}>
        <div className="flex-1">
          <h3
            className={`text-lg font-bold mb-2.5 transition-colors duration-200 ${
              hovered ? '' : 'text-light-text dark:text-dark-text'
            }`}
            style={{ color: hovered ? service.color : undefined }}
          >
            {service.title}
          </h3>
          <p className="text-sm text-light-muted dark:text-dark-muted leading-relaxed mb-4">
            {service.desc}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          {service.tags.map((tag) => (
            <span key={tag} className="tag-chip">{tag}</span>
          ))}
        </div>
      </div>

      {/* Shimmer border on hover */}
      <motion.div
        className="absolute bottom-0 left-0 h-[2px] rounded-b-2xl"
        style={{ background: `linear-gradient(90deg, ${service.color}, transparent)` }}
        initial={{ width: 0 }}
        animate={{ width: hovered ? '100%' : 0 }}
        transition={{ duration: 0.45 }}
      />
    </motion.div>
  );
}

export function Services() {
  return (
    <section id="services" className="section-padding bg-light-card/40 dark:bg-dark-surface relative overflow-hidden">
      <div className="absolute inset-0 grid-bg opacity-25" aria-hidden="true" />
      <div className="absolute top-1/2 right-0 w-80 h-80 rounded-full glow-orb bg-accent/4" aria-hidden="true" />

      <div className="container-custom relative z-10">
        <SectionHeading
          badge="What We Do"
          title="Services Built for"
          highlight="Real Business Impact"
          subtitle="From a landing page to a complex enterprise application — we deliver software that works, scales, and looks great."
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" style={{ perspective: '1200px' }}>
          {SERVICES.map((s, i) => (
            <TiltCard key={s.id} service={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
