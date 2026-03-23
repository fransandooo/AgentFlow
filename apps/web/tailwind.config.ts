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
        background: '#12110f',
        panel: '#1a1917',
        panelAlt: '#211f1b',
        border: '#312d27',
        muted: '#b8afa2',
        primary: '#e9dfd1',
        accent: '#c8b8a0',
        success: '#b8ccb3',
        warning: '#d8b782',
        danger: '#d39a9a',
      },
      boxShadow: {
        glow: '0 20px 60px rgba(0,0,0,.22)',
        panel: '0 12px 40px rgba(0, 0, 0, .18)',
      },
      letterSpacing: {
        spa: '0.18em',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
    },
  },
  plugins: [],
};

export default config;
