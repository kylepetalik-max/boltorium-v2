/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        void: '#080A09',
        surface: '#101412',
        stroke: '#1C2420',
        bolt: '#22E06A',
        gold: '#D4AF37',
        plasma: '#38BDF8',
        solana: '#8B5CF6',
        cyan: '#38BDF8',
        bone: '#FFFFFF',
        graphite: '#101412',
        danger: '#FF3B5C',
      },
      fontFamily: {
        hud: ['Orbitron', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['"Barlow Condensed"', 'Impact', 'sans-serif'],
        sans: ['Barlow', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        tag: ['Audiowide', 'Orbitron', 'sans-serif'],
        mono: ['"Share Tech Mono"', 'ui-monospace', 'monospace'],
      },
      maxWidth: { phone: '430px' },
      boxShadow: {
        bolt: '0 0 24px rgba(34,224,106,0.45)',
        gold: '0 0 24px rgba(212,175,55,0.55)',
        plasma: '0 0 24px rgba(56,189,248,0.4)',
        solana: '0 0 24px rgba(139,92,246,0.45)',
        danger: '0 0 22px rgba(255,59,92,0.55)',
      },
    },
  },
  plugins: [],
};
