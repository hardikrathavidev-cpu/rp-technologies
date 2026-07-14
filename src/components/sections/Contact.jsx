import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import {
  Send, Mail, MapPin, MessageSquare,
  CheckCircle2, AlertCircle, Loader2,
} from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';

/* ────────────────────────────────────────────────────────
   Mail API options (pick one):

   1) Free front-end (Netlify/Vercel) + your PHP host:
      Set VITE_CONTACT_API_URL=https://YOUR-PHP-HOST.com/contact.php

   2) Same PHP host for site + form:
      Upload /dist (includes contact.php) — uses /contact.php

   3) EmailJS (optional): set VITE_EMAILJS_* vars
   ──────────────────────────────────────────────────────── */
const RECAPTCHA_SITE_KEY = '6LemeFItAAAAAMKWz73MPzMuNexaTy5iVQLOpq_L';

const CONTACT_API_URL = (import.meta.env.VITE_CONTACT_API_URL || '/contact.php').replace(/\/$/, '');
const EMAILJS_SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID || '';
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '';
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '';
const USE_EMAILJS = Boolean(EMAILJS_SERVICE_ID && EMAILJS_TEMPLATE_ID && EMAILJS_PUBLIC_KEY);

const PROJECT_TYPES = [
  'Website Development',
  'Web Application',
  'UI/UX Design',
  'Custom Software',
  'E-Commerce Platform',
  'Mobile-Friendly Site',
  'Business Automation',
  'Maintenance & Support',
  'Other / Not sure yet',
];

const CONTACT_INFO = [
  {
    icon: <Mail size={18} />,
    label: 'Email Us',
    value: 'rptechnologies26@gmail.com',
    href: 'mailto:rptechnologies26@gmail.com',
  },
  {
    icon: <MapPin size={18} />,
    label: 'Based In',
    value: 'India · Serving Globally',
    href: null,
  },
  {
    icon: <MessageSquare size={18} />,
    label: 'WhatsApp',
    value: '+91 98765 43210',
    href: 'https://wa.me/919876543210',
  },
];

const STATUS = { IDLE: 'idle', SENDING: 'sending', SUCCESS: 'success', ERROR: 'error' };

function loadRecaptchaScript() {
  return new Promise((resolve, reject) => {
    if (window.grecaptcha?.render) {
      resolve(window.grecaptcha);
      return;
    }
    const existing = document.getElementById('recaptcha-script');
    if (existing) {
      existing.addEventListener('load', () => resolve(window.grecaptcha));
      return;
    }
    const script = document.createElement('script');
    script.id = 'recaptcha-script';
    script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
    script.async = true;
    script.defer = true;
    script.onload = () => {
      window.grecaptcha.ready(() => resolve(window.grecaptcha));
    };
    script.onerror = () => reject(new Error('Failed to load reCAPTCHA'));
    document.head.appendChild(script);
  });
}

export function Contact() {
  const [form, setForm]       = useState({ name: '', email: '', type: '', message: '' });
  const [errors, setErrors]   = useState({});
  const [status, setStatus]   = useState(STATUS.IDLE);
  const [errorMsg, setErrorMsg] = useState('');
  const captchaRef = useRef(null);
  const widgetIdRef = useRef(null);

  const resetCaptcha = useCallback(() => {
    if (widgetIdRef.current !== null && window.grecaptcha) {
      try { window.grecaptcha.reset(widgetIdRef.current); } catch { /* ignore */ }
    }
  }, []);

  const renderCaptcha = useCallback(async () => {
    if (!captchaRef.current || widgetIdRef.current !== null) return;
    try {
      const grecaptcha = await loadRecaptchaScript();
      const isDark = document.documentElement.classList.contains('dark');
      widgetIdRef.current = grecaptcha.render(captchaRef.current, {
        sitekey: RECAPTCHA_SITE_KEY,
        theme: isDark ? 'dark' : 'light',
        callback: () => {
          setErrors((er) => ({ ...er, captcha: '' }));
          setStatus((s) => (s === STATUS.ERROR ? STATUS.IDLE : s));
          setErrorMsg('');
        },
        'expired-callback': () => setErrors((er) => ({ ...er, captcha: 'reCAPTCHA expired — tick again' })),
      });
    } catch {
      setErrors((er) => ({ ...er, captcha: 'Could not load reCAPTCHA' }));
    }
  }, []);

  useEffect(() => {
    if (status === STATUS.SUCCESS) {
      widgetIdRef.current = null;
      return;
    }
    const t = setTimeout(renderCaptcha, 50);
    return () => clearTimeout(t);
  }, [status, renderCaptcha]);

  const validate = () => {
    const e = {};
    if (!form.name.trim())
      e.name = 'Name is required';
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email))
      e.email = 'Valid email required';
    if (!form.message.trim() || form.message.trim().length < 10)
      e.message = 'Please write at least 10 characters';
    const token = window.grecaptcha?.getResponse?.(widgetIdRef.current) || '';
    if (!token) e.captcha = 'Please complete the reCAPTCHA';
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setErrors({});
    setStatus(STATUS.SENDING);

    const recaptchaToken = window.grecaptcha.getResponse(widgetIdRef.current);

    try {
      // Prefer PHP API when not using EmailJS (including remote PHP host URL)
      if (!USE_EMAILJS) {
        const res = await fetch(CONTACT_API_URL, {
          method:  'POST',
          headers: { 'Content-Type': 'application/json' },
          body:    JSON.stringify({ ...form, recaptchaToken }),
        });
        const data = await res.json();
        if (!data.success) {
          throw new Error(data.message || 'Something went wrong. Please try again.');
        }
      } else {
        await emailjs.send(
          EMAILJS_SERVICE_ID,
          EMAILJS_TEMPLATE_ID,
          {
            from_name: form.name,
            from_email: form.email,
            project_type: form.type || 'Not specified',
            message: form.message,
            'g-recaptcha-response': recaptchaToken,
          },
          EMAILJS_PUBLIC_KEY
        );
      }

      setStatus(STATUS.SUCCESS);
      setForm({ name: '', email: '', type: '', message: '' });
      widgetIdRef.current = null;
    } catch (err) {
      setErrorMsg(err?.text || err?.message || 'Could not connect. Please email us directly.');
      setStatus(STATUS.ERROR);
      resetCaptcha();
    }
  };

  const ic = (field) =>
    `w-full bg-light-card dark:bg-dark-card border rounded-xl px-4 py-3 text-sm
     text-light-text dark:text-dark-text
     placeholder:text-light-muted dark:placeholder:text-dark-muted
     outline-none transition-all duration-200 focus:ring-2 focus:ring-accent/40
     ${errors[field]
       ? 'border-red-400/70 bg-red-50/30 dark:bg-red-900/10'
       : 'border-light-border dark:border-dark-border focus:border-accent/60'}`;

  const update = (field) => (e) => {
    setForm(f => ({ ...f, [field]: e.target.value }));
    if (errors[field]) setErrors(er => ({ ...er, [field]: '' }));
    if (status === STATUS.ERROR) { setStatus(STATUS.IDLE); setErrorMsg(''); }
  };

  return (
    <section
      id="contact"
      className="section-padding bg-light-card/40 dark:bg-dark-surface relative overflow-hidden"
    >
      <div className="absolute inset-0 grid-bg opacity-25" aria-hidden="true" />
      <div className="absolute bottom-0 right-0 w-96 h-96 rounded-full glow-orb bg-accent/5" aria-hidden="true" />

      <div className="container-custom relative z-10">
        <SectionHeading
          badge="Let's Talk"
          title="Ready to Build"
          highlight="Something Great?"
          subtitle="Tell us about your project. We respond within 24 hours — no sales pitch, just a real conversation."
          center
        />

        <div className="grid lg:grid-cols-5 gap-10 max-w-5xl mx-auto">

          {/* ── Left: Contact info ── */}
          <motion.div
            className="lg:col-span-2 flex flex-col gap-5"
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="glass-card p-6">
              <h3 className="font-bold text-light-text dark:text-dark-text mb-2">
                Start the Conversation
              </h3>
              <p className="text-sm text-light-muted dark:text-dark-muted mb-6 leading-relaxed">
                Whether you have a fully defined brief or just a rough idea, we're here to help
                shape it into a real deliverable plan.
              </p>

              <div className="space-y-4">
                {CONTACT_INFO.map(({ icon, label, value, href }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center text-accent shrink-0">
                      {icon}
                    </div>
                    <div>
                      <div className="text-xs text-light-muted dark:text-dark-muted mb-0.5">{label}</div>
                      {href ? (
                        <a href={href} className="text-sm font-medium text-light-text dark:text-dark-text hover:text-accent transition-colors duration-200">
                          {value}
                        </a>
                      ) : (
                        <div className="text-sm font-medium text-light-text dark:text-dark-text">{value}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Response time */}
            <div className="glass-card p-5 border-glow">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-sm font-semibold text-light-text dark:text-dark-text">
                  24-Hour Response
                </span>
              </div>
              <p className="text-xs text-light-muted dark:text-dark-muted leading-relaxed">
                We respond to all enquiries within 24 business hours.
                For urgent requests, WhatsApp is the fastest.
              </p>
            </div>
          </motion.div>

          {/* ── Right: Form ── */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* SUCCESS */}
            {status === STATUS.SUCCESS ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                className="glass-card p-10 text-center flex flex-col items-center gap-4 border-glow h-full justify-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', damping: 14 }}
                  className="w-20 h-20 rounded-full bg-emerald-400/10 border-2 border-emerald-400/40 flex items-center justify-center"
                >
                  <CheckCircle2 size={36} className="text-emerald-400" />
                </motion.div>
                <h3 className="text-2xl font-bold text-light-text dark:text-dark-text">
                  Message Sent! 🎉
                </h3>
                <p className="text-sm text-light-muted dark:text-dark-muted max-w-xs leading-relaxed">
                  We've received your enquiry and will reply within 24 hours.
                  Check your inbox — a confirmation has been sent too.
                </p>
                <button
                  onClick={() => setStatus(STATUS.IDLE)}
                  className="mt-2 text-sm font-semibold text-accent hover:underline underline-offset-4"
                >
                  Send another message
                </button>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                noValidate
                className="glass-card p-7 space-y-5"
                aria-label="Project enquiry form"
              >
                {/* Error banner */}
                {status === STATUS.ERROR && (
                  <motion.div
                    initial={{ opacity: 0, y: -8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3 bg-red-500/8 border border-red-400/30 rounded-xl p-4"
                  >
                    <AlertCircle size={18} className="text-red-400 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-sm font-semibold text-light-text dark:text-dark-text mb-0.5">
                        Could not send
                      </div>
                      <div className="text-xs text-light-muted dark:text-dark-muted leading-relaxed">
                        {errorMsg}{' '}
                        <a
                          href="mailto:rptechnologies26@gmail.com"
                          className="text-accent underline underline-offset-2 font-medium"
                        >
                          Email us directly →
                        </a>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Name + Email */}
                <div className="grid sm:grid-cols-2 gap-5">
                  <div>
                    <label htmlFor="c-name" className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1.5 uppercase tracking-wider">
                      Your Name *
                    </label>
                    <input
                      id="c-name" type="text" placeholder="Ravi Patel"
                      autoComplete="name" value={form.name} onChange={update('name')}
                      className={ic('name')}
                    />
                    {errors.name && (
                      <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                        <AlertCircle size={11} /> {errors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="c-email" className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1.5 uppercase tracking-wider">
                      Email Address *
                    </label>
                    <input
                      id="c-email" type="email" placeholder="ravi@company.com"
                      autoComplete="email" value={form.email} onChange={update('email')}
                      className={ic('email')}
                    />
                    {errors.email && (
                      <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                        <AlertCircle size={11} /> {errors.email}
                      </p>
                    )}
                  </div>
                </div>

                {/* Project type */}
                <div>
                  <label htmlFor="c-type" className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1.5 uppercase tracking-wider">
                    Project Type
                  </label>
                  <select
                    id="c-type" value={form.type} onChange={update('type')}
                    className={ic('type')}
                  >
                    <option value="">Select a service...</option>
                    {PROJECT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label htmlFor="c-msg" className="block text-xs font-semibold text-light-muted dark:text-dark-muted mb-1.5 uppercase tracking-wider">
                    Project Details *
                  </label>
                  <textarea
                    id="c-msg" rows={5}
                    placeholder="Tell us about your project — goals, timeline, any relevant details..."
                    value={form.message} onChange={update('message')}
                    className={`${ic('message')} resize-none`}
                  />
                  {errors.message && (
                    <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                      <AlertCircle size={11} /> {errors.message}
                    </p>
                  )}
                </div>

                {/* reCAPTCHA */}
                <div>
                  <div ref={captchaRef} className="g-recaptcha" />
                  {errors.captcha && (
                    <p className="text-xs text-red-400 mt-1.5 flex items-center gap-1">
                      <AlertCircle size={11} /> {errors.captcha}
                    </p>
                  )}
                </div>

                {/* Submit */}
                <motion.button
                  type="submit"
                  disabled={status === STATUS.SENDING}
                  whileHover={status !== STATUS.SENDING ? { scale: 1.02 } : {}}
                  whileTap={status !== STATUS.SENDING ? { scale: 0.97 } : {}}
                  className="w-full flex items-center justify-center gap-2 bg-accent text-dark-bg font-bold py-3.5 rounded-xl hover:bg-accent-hover shadow-glow-sm hover:shadow-glow transition-all duration-200 disabled:opacity-70"
                >
                  {status === STATUS.SENDING
                    ? <><Loader2 size={17} className="animate-spin" /> Sending...</>
                    : <><Send size={15} /> Send Enquiry</>
                  }
                </motion.button>

                <p className="text-xs text-center text-light-muted dark:text-dark-muted">
                  Your information is never shared with third parties.
                </p>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
