import React from 'react';
import { ArrowUpRight } from 'lucide-react';

// Inline SVG social icons (lucide-react v0.5+ removed brand icons)
const LinkedinIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/>
  </svg>
);
const TwitterIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);
const GithubIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16" aria-hidden="true">
    <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/>
  </svg>
);
const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16" aria-hidden="true">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const QUICK_LINKS = ['Home', 'Services', 'About', 'Process', 'Projects', 'Contact'];
const SERVICES_LIST = [
  'Website Development',
  'Web App Development',
  'UI/UX Design',
  'Custom Software',
  'Maintenance & Support',
  'Business Automation',
];

const SOCIALS = [
  { icon: <LinkedinIcon />, label: 'LinkedIn', href: '#' },
  { icon: <TwitterIcon />, label: 'Twitter / X', href: '#' },
  { icon: <GithubIcon />, label: 'GitHub', href: '#' },
  { icon: <InstagramIcon />, label: 'Instagram', href: '#' },
];

function scrollTo(id) {
  const el = document.getElementById(id);
  if (el) window.scrollTo({ top: el.offsetTop - 72, behavior: 'smooth' });
}

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-light-surface dark:bg-dark-bg border-t border-light-border dark:border-dark-border">
      <div className="container-custom py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="relative w-8 h-8">
                <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-8 h-8" aria-hidden="true">
                  <rect width="36" height="36" rx="10" fill="#00D4FF" fillOpacity="0.12" />
                  <rect x="0.5" y="0.5" width="35" height="35" rx="9.5" stroke="#00D4FF" strokeOpacity="0.4" />
                  <path d="M10 26V10H18.5C20.433 10 22 11.567 22 13.5C22 15.433 20.433 17 18.5 17H10" stroke="#00D4FF" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M17 17L24 26" stroke="#00D4FF" strokeWidth="2.5" strokeLinecap="round"/>
                  <circle cx="26" cy="13" r="2" fill="#00D4FF" />
                </svg>
              </div>
              <span className="font-display font-bold text-base text-light-text dark:text-dark-text">
                RP <span className="text-accent">Technologies</span>
              </span>
            </div>
            <p className="text-sm text-light-muted dark:text-dark-muted leading-relaxed mb-5">
              Custom software and web solutions for startups and businesses worldwide. Clean code, real results.
            </p>
            {/* Socials */}
            <div className="flex gap-2">
              {SOCIALS.map(({ icon, label, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-lg border border-light-border dark:border-dark-border flex items-center justify-center text-light-muted dark:text-dark-muted hover:border-accent/40 hover:text-accent transition-all duration-200"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="font-semibold text-sm text-light-text dark:text-dark-text mb-4 uppercase tracking-wider">Navigation</h4>
            <ul className="space-y-2.5">
              {QUICK_LINKS.map((link) => (
                <li key={link}>
                  <a
                    href={`#${link.toLowerCase()}`}
                    onClick={(e) => { e.preventDefault(); scrollTo(link.toLowerCase()); }}
                    className="text-sm text-light-muted dark:text-dark-muted hover:text-accent transition-colors duration-200 flex items-center gap-1 group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-accent transition-all duration-200 inline-block" />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-sm text-light-text dark:text-dark-text mb-4 uppercase tracking-wider">Services</h4>
            <ul className="space-y-2.5">
              {SERVICES_LIST.map((s) => (
                <li key={s}>
                  <a
                    href="#services"
                    onClick={(e) => { e.preventDefault(); scrollTo('services'); }}
                    className="text-sm text-light-muted dark:text-dark-muted hover:text-accent transition-colors duration-200 flex items-center gap-1 group"
                  >
                    <span className="w-0 group-hover:w-2 h-px bg-accent transition-all duration-200 inline-block" />
                    {s}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA card */}
          <div>
            <h4 className="font-semibold text-sm text-light-text dark:text-dark-text mb-4 uppercase tracking-wider">Start a Project</h4>
            <div className="glass-card p-5">
              <p className="text-sm text-light-muted dark:text-dark-muted mb-4 leading-relaxed">
                Have an idea? Let's talk about how we can bring it to life.
              </p>
              <a
                href="mailto:hello@rptechnologies.in"
                className="flex items-center gap-2 text-sm font-semibold text-accent hover:gap-3 transition-all duration-200 group"
              >
                hello@rptechnologies.in
                <ArrowUpRight size={14} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-6 border-t border-light-border dark:border-dark-border flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-light-muted dark:text-dark-muted">
            © {year} RP Technologies. All rights reserved.
          </p>
          <div className="flex gap-5">
            {['Privacy Policy', 'Terms of Service'].map((t) => (
              <a key={t} href="#" className="text-xs text-light-muted dark:text-dark-muted hover:text-accent transition-colors duration-200">
                {t}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
