import React from 'react';
import { motion } from 'framer-motion';
import { Clock, Globe2, ShieldCheck, Zap, MessageCircle, TrendingUp } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';

const REASONS = [
  {
    icon: <Clock size={26} />,
    emoji: '⏰',
    title: 'On-Time Delivery',
    desc: 'We ship on the agreed date — every time. No excuses, no vague "almost ready".',
    color: '#00D4FF',
    border: 'border-[#00D4FF]/40',
    shadow: '3px 3px 0px 0px #00D4FF',
    rotate: '-1.5deg',
  },
  {
    icon: <Globe2 size={26} />,
    emoji: '🌍',
    title: 'Global Clients, Indian Value',
    desc: 'Premium software quality at rates that make sense for startups and growing businesses worldwide.',
    color: '#8338EC',
    border: 'border-[#8338EC]/40',
    shadow: '3px 3px 0px 0px #8338EC',
    rotate: '1deg',
  },
  {
    icon: <MessageCircle size={26} />,
    emoji: '💬',
    title: 'Real Communication',
    desc: 'No ghosting, no ticket queues. You get a direct line to the people actually building your product.',
    color: '#FF006E',
    border: 'border-[#FF006E]/40',
    shadow: '3px 3px 0px 0px #FF006E',
    rotate: '-1deg',
  },
  {
    icon: <ShieldCheck size={26} />,
    emoji: '🛡️',
    title: 'Post-Launch Support',
    desc: `30 days of free bug fixes after launch. We don't disappear when the invoice is paid.`,
    color: '#AAFF00',
    border: 'border-[#AAFF00]/40',
    shadow: '3px 3px 0px 0px #AAFF00',
    rotate: '1.5deg',
  },
  {
    icon: <Zap size={26} />,
    emoji: '⚡',
    title: 'Performance First',
    desc: 'Every product we build scores 90+ on Google Lighthouse. Speed is a feature, not a bonus.',
    color: '#FFD60A',
    border: 'border-[#FFD60A]/40',
    shadow: '3px 3px 0px 0px #FFD60A',
    rotate: '-0.5deg',
  },
  {
    icon: <TrendingUp size={26} />,
    emoji: '📈',
    title: 'Built to Scale',
    desc: 'Architecture decisions made for where you\'re going, not just where you are today.',
    color: '#FF5D00',
    border: 'border-[#FF5D00]/40',
    shadow: '3px 3px 0px 0px #FF5D00',
    rotate: '1deg',
  },
];

function ReasonCard({ reason, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotate: reason.rotate }}
      whileInView={{ opacity: 1, y: 0, rotate: reason.rotate }}
      whileHover={{ y: -6, rotate: '0deg', scale: 1.02 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      style={{ boxShadow: reason.shadow }}
      className={`relative bg-dark-card rounded-3xl border-2 ${reason.border}
                  p-6 overflow-hidden group cursor-none transition-all duration-300`}
    >
      {/* Background glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"
        style={{ background: `radial-gradient(circle at 30% 30%, ${reason.color}10 0%, transparent 70%)` }}
      />

      {/* Top-right emoji sticker */}
      <motion.div
        className="absolute top-4 right-4 text-2xl"
        animate={{ rotate: [0, -10, 10, 0] }}
        transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
      >
        {reason.emoji}
      </motion.div>

      {/* Icon */}
      <div
        className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 border-2 transition-transform duration-300 group-hover:scale-110"
        style={{
          color:            reason.color,
          borderColor:      `${reason.color}40`,
          backgroundColor:  `${reason.color}10`,
        }}
      >
        {reason.icon}
      </div>

      <h3
        className="font-black text-lg mb-2 transition-colors duration-200"
        style={{ color: reason.color }}
      >
        {reason.title}
      </h3>
      <p className="text-sm text-dark-muted leading-relaxed">{reason.desc}</p>

      {/* Animated bottom line */}
      <motion.div
        className="absolute bottom-0 left-0 h-[3px] rounded-b-3xl"
        style={{ background: reason.color }}
        initial={{ width: 0 }}
        whileInView={{ width: '40%' }}
        whileHover={{ width: '100%' }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
      />
    </motion.div>
  );
}

export function WhyUs() {
  return (
    <section id="why-us" className="section-padding bg-dark-bg relative overflow-hidden">
      {/* Subtle dot grid */}
      <div className="absolute inset-0 grid-bg opacity-40" aria-hidden="true" />

      {/* Center glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full opacity-5"
           style={{ background: 'radial-gradient(ellipse, #8338EC 0%, transparent 70%)', filter: 'blur(60px)' }}
           aria-hidden="true" />

      <div className="container-custom relative z-10">
        <SectionHeading
          badge="Why RP Tech"
          title="Not Just Another"
          highlight="Dev Agency"
          subtitle="Anyone can write code. We build products that your users love and your business scales on."
        />

        {/* Gen-Z floating stickers above grid — static rotate values, no Math.random() */}
        <div className="flex flex-wrap gap-3 mb-10 justify-center">
          {[
            { text: '🔥 No BS',        color: '#FF5D00', border: '#FF5D00', rotate: '-2deg',   delay: 0   },
            { text: '💯 Transparent',  color: '#00D4FF', border: '#00D4FF', rotate: '1.5deg',  delay: 0.4 },
            { text: '🎯 Results Only', color: '#FF006E', border: '#FF006E', rotate: '-1deg',   delay: 0.8 },
            { text: '⚡ Fast AF',      color: '#FFD60A', border: '#FFD60A', rotate: '2.5deg',  delay: 1.2 },
            { text: '🌍 Global Ready', color: '#AAFF00', border: '#AAFF00', rotate: '-1.5deg', delay: 1.6 },
          ].map(({ text, color, border, rotate, delay }) => (
            <motion.div
              key={text}
              whileHover={{ scale: 1.12, rotate: '0deg' }}
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 3.5, repeat: Infinity, delay, ease: 'easeInOut' }}
              className="text-xs font-black px-4 py-2 rounded-full border-2"
              style={{
                color,
                borderColor:     border,
                backgroundColor: `${color}12`,
                boxShadow:       '2px 2px 0 rgba(0,0,0,0.8)',
                rotate,
              }}
            >
              {text}
            </motion.div>
          ))}
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {REASONS.map((r, i) => (
            <ReasonCard key={r.title} reason={r} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
