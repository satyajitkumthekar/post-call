/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      // Design tokens for the light homepage. Change a colour here and it changes everywhere it is used.
      colors: {
        canvas: '#FAFAF7', // page background, warm off-white
        surface: '#FFFFFF', // cards that sit on the canvas
        ink: '#12291E', // deep forest: headlines and the dark bands
        accent: '#1F6F43', // links, labels, small highlights
        muted: '#5C6B61', // secondary text on light backgrounds
        line: '#E6E6DF', // hairlines and borders
        volt: { DEFAULT: '#C6F432', hi: '#D4FF45' }, // the one bright green, used sparingly
        paper: { DEFAULT: '#FAFAF7', soft: '#D8E2DB', muted: '#9DB0A3' }, // text on the dark bands
      },
      fontFamily: {
        display: ['"Instrument Sans"', 'system-ui', '-apple-system', '"Segoe UI"', 'sans-serif'],
        body: ['Inter', 'system-ui', '-apple-system', '"Segoe UI"', 'sans-serif'],
        label: ['"IBM Plex Mono"', 'ui-monospace', '"SF Mono"', 'Menlo', 'Consolas', 'monospace'],
      },
      borderRadius: {
        card: '14px',
        panel: '22px',
      },
      boxShadow: {
        card: '0 1px 2px rgba(18,41,30,.04), 0 10px 30px rgba(18,41,30,.07)',
        lift: '0 2px 4px rgba(18,41,30,.05), 0 24px 60px rgba(18,41,30,.12)',
      },
      maxWidth: {
        site: '1120px',
      },
    },
  },
  plugins: [],
};
