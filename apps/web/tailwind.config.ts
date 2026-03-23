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
        background: '#0a0d14',
        panel: '#111827',
        panelAlt: '#0f172a',
        border: '#1f2937',
        muted: '#94a3b8',
        primary: '#7c3aed',
        success: '#10b981',
        warning: '#f59e0b',
        danger: '#ef4444'
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(124,58,237,.2), 0 12px 40px rgba(2,6,23,.45)',
      },
    },
  },
  plugins: [],
};

export default config;
