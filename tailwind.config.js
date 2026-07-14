/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#00D4FF',
          hover:   '#00BFEA',
          dim:     'rgba(0,212,255,0.12)',
          glow:    'rgba(0,212,255,0.25)',
        },
        /* Gen-Z neon palette */
        neon: {
          pink:   '#FF006E',
          purple: '#8338EC',
          lime:   '#AAFF00',
          orange: '#FF5D00',
          yellow: '#FFD60A',
          cyan:   '#00D4FF',
        },
        dark: {
          bg:      '#0A0A0F',
          surface: '#13131A',
          card:    '#1A1A24',
          border:  '#2A2A3A',
          muted:   '#9090A8',
          text:    '#E8E8F0',
        },
        light: {
          bg:      '#F4F4F8',
          surface: '#FFFFFF',
          card:    '#F0F0F6',
          border:  '#E0E0EC',
          muted:   '#6B6B85',
          text:    '#1A1A2E',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body:    ['"Inter"', 'sans-serif'],
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':  'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      animation: {
        'float':        'float 6s ease-in-out infinite',
        'pulse-glow':   'pulseGlow 3s ease-in-out infinite',
        'spin-slow':    'spin 20s linear infinite',
        'dash':         'dash 2s ease forwards',
        'wiggle':       'wiggle 0.5s ease-in-out',
        'bounce-soft':  'bounceSoft 2s ease-in-out infinite',
        'blob':         'blob 8s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-20px)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '0.6', transform: 'scale(1)' },
          '50%':      { opacity: '1',   transform: 'scale(1.05)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%':      { transform: 'rotate(3deg)' },
        },
        bounceSoft: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%':      { transform: 'translateY(-8px)' },
        },
        blob: {
          '0%, 100%': { borderRadius: '60% 40% 30% 70% / 60% 30% 70% 40%' },
          '50%':      { borderRadius: '30% 60% 70% 40% / 50% 60% 30% 60%' },
        },
      },
      boxShadow: {
        'glow-sm':    '0 0 15px rgba(0,212,255,0.15)',
        'glow':       '0 0 30px rgba(0,212,255,0.2)',
        'glow-lg':    '0 0 60px rgba(0,212,255,0.25)',
        'card-dark':  '0 4px 24px rgba(0,0,0,0.4)',
        'card-light': '0 4px 24px rgba(0,0,0,0.08)',
        /* Gen-Z hard shadow (cartoon style) */
        'hard':       '4px 4px 0px 0px rgba(0,0,0,0.9)',
        'hard-sm':    '2px 2px 0px 0px rgba(0,0,0,0.9)',
        'hard-pink':  '4px 4px 0px 0px #FF006E',
        'hard-cyan':  '4px 4px 0px 0px #00D4FF',
        'hard-purple':'4px 4px 0px 0px #8338EC',
        'hard-lime':  '4px 4px 0px 0px #AAFF00',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};
