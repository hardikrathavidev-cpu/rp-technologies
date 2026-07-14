import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Quote, ChevronLeft, ChevronRight, Star } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';

const TESTIMONIALS = [
  {
    id: 1,
    name: 'Arjun Mehta',
    role: 'Founder & CEO',
    company: 'FleetTrack Logistics',
    initials: 'AM',
    color: 'from-blue-500 to-cyan-500',
    stars: 5,
    text: 'RP Technologies completely transformed our operations. They built us a fleet management system that replaced three separate tools we were using. The team was proactive, communicated daily, and delivered ahead of schedule. Honestly, the best tech investment we have made.',
  },
  {
    id: 2,
    name: 'Priya Sharma',
    role: 'Co-Founder',
    company: 'ArtisanMarket',
    initials: 'PS',
    color: 'from-purple-500 to-pink-500',
    stars: 5,
    text: 'We needed a complex multi-vendor platform in a tight timeline. The RP Technologies team not only delivered on time but went above and beyond — the UI is gorgeous and the backend handles our peak traffic without a hiccup. They feel less like contractors and more like our in-house team.',
  },
  {
    id: 3,
    name: 'Dr. Rahul Nair',
    role: 'Director',
    company: 'ClinicDesk Healthcare',
    initials: 'RN',
    color: 'from-emerald-500 to-teal-500',
    stars: 5,
    text: 'I was sceptical about digitising our clinic workflow, but RP Technologies made the transition seamless. Patient records, billing, WhatsApp reminders — it all just works. Our staff love it, and we have saved hours of admin every single day. Highly recommend for any healthcare business.',
  },
];

export function Testimonials() {
  const [current, setCurrent] = useState(0);

  const prev = () => setCurrent((c) => (c === 0 ? TESTIMONIALS.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === TESTIMONIALS.length - 1 ? 0 : c + 1));

  const t = TESTIMONIALS[current];

  return (
    <section id="testimonials" className="section-padding bg-light-bg dark:bg-dark-bg relative overflow-hidden">
      <div className="absolute top-0 right-0 w-72 h-72 rounded-full glow-orb bg-accent/5" aria-hidden="true" />

      <div className="container-custom relative z-10">
        <SectionHeading
          badge="Client Stories"
          title="What Our"
          highlight="Clients Say"
          subtitle="Don't take our word for it — here's what the businesses we've worked with have to say."
          center
        />

        <div className="max-w-3xl mx-auto">
          {/* Main testimonial */}
          <div className="relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="glass-card p-8 md:p-10 relative overflow-hidden border-glow"
              >
                {/* Quote icon */}
                <div className="absolute top-6 right-6 text-accent/15">
                  <Quote size={64} />
                </div>

                {/* Stars */}
                <div className="flex gap-1 mb-5">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} size={16} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>

                {/* Quote */}
                <blockquote className="text-base md:text-lg text-light-text dark:text-dark-text leading-relaxed mb-8 relative z-10 font-medium">
                  "{t.text}"
                </blockquote>

                {/* Author */}
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center text-white font-bold text-sm shrink-0`}>
                    {t.initials}
                  </div>
                  <div>
                    <div className="font-semibold text-light-text dark:text-dark-text">{t.name}</div>
                    <div className="text-sm text-light-muted dark:text-dark-muted">{t.role} · {t.company}</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between mt-6">
            {/* Dots */}
            <div className="flex gap-2">
              {TESTIMONIALS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  aria-label={`Go to testimonial ${i + 1}`}
                  className={`rounded-full transition-all duration-300 ${
                    i === current
                      ? 'w-6 h-2 bg-accent'
                      : 'w-2 h-2 bg-light-border dark:bg-dark-border hover:bg-accent/40'
                  }`}
                />
              ))}
            </div>

            {/* Prev / Next */}
            <div className="flex gap-2">
              <button
                onClick={prev}
                aria-label="Previous testimonial"
                className="w-10 h-10 rounded-xl border border-light-border dark:border-dark-border flex items-center justify-center text-light-muted dark:text-dark-muted hover:border-accent/40 hover:text-accent transition-all duration-200"
              >
                <ChevronLeft size={18} />
              </button>
              <button
                onClick={next}
                aria-label="Next testimonial"
                className="w-10 h-10 rounded-xl border border-light-border dark:border-dark-border flex items-center justify-center text-light-muted dark:text-dark-muted hover:border-accent/40 hover:text-accent transition-all duration-200"
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </div>

          {/* Compact cards for other testimonials */}
          <div className="grid sm:grid-cols-2 gap-4 mt-8">
            {TESTIMONIALS.filter((_, i) => i !== current).map((item) => (
              <motion.button
                key={item.id}
                onClick={() => setCurrent(TESTIMONIALS.indexOf(item))}
                layout
                whileHover={{ scale: 1.02 }}
                className="glass-card p-4 text-left cursor-pointer hover:border-accent/25 transition-all duration-200 group"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${item.color} flex items-center justify-center text-white text-xs font-bold`}>
                    {item.initials}
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-light-text dark:text-dark-text">{item.name}</div>
                    <div className="text-xs text-light-muted dark:text-dark-muted">{item.company}</div>
                  </div>
                </div>
                <p className="text-xs text-light-muted dark:text-dark-muted line-clamp-2">{item.text}</p>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
