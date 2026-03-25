import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './lib/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        background: '#F8F9FA',
        panel: '#FFFFFF',
        panelAlt: '#F4F6F8',
        border: '#D9E0E8',
        muted: '#64748B',
        primary: '#1A2B49',
        accent: '#3A5A80',
        success: '#2F6F4F',
        warning: '#9A6B2F',
        danger: '#A23D3D',
      },
      boxShadow: {
        glow: '0 10px 30px rgba(26,43,73,.06)',
        panel: '0 4px 18px rgba(15, 23, 42, .04)',
      },
      letterSpacing: {
        spa: '0.14em',
      },
      borderRadius: {
        xl2: '6px',
      },
    },
  },
  plugins: [],
};

export default config;
