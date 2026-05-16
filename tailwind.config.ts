import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        scene: {
          bg: '#070712',
          card: '#121225',
          ink: '#f7f3ff',
          muted: '#a7a1bd',
          accent: '#ff5c8a',
        },
      },
    },
  },
  plugins: [],
};

export default config;
