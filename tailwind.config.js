/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink:          '#1a1208',
        paper:        '#fdf8f0',
        surface:      '#fff9ef',
        amber:        '#e88c2a',
        'amber-light':'#fdf0d5',
        'amber-mid':  '#f5d48a',
        'amber-dark': '#b06a10',
        teal:         '#1d7a6b',
        'teal-light': '#e0f4f0',
        coral:        '#d95f3b',
        'coral-light':'#fdeee9',
        violet:       '#5c4db1',
        'violet-light':'#eeeafb',
        muted:        '#8a7d6a',
        border:       '#e8dcc8',
        sage:         '#3d6b4f',
      },
      fontFamily: {
        syne:    ['Syne', 'sans-serif'],
        'dm-sans': ['DM Sans', 'sans-serif'],
      },
      fontSize: {
        'h1': ['28px', { lineHeight: '1.2', fontWeight: '800' }],
        'h2': ['20px', { lineHeight: '1.3', fontWeight: '700' }],
        'h3': ['16px', { lineHeight: '1.4', fontWeight: '600' }],
        'body': ['14px', { lineHeight: '1.5', fontWeight: '400' }],
        'label': ['12px', { lineHeight: '1.4', fontWeight: '500', letterSpacing: '0.06em' }],
        'small': ['11px', { lineHeight: '1.4', fontWeight: '400' }],
      },
      borderRadius: {
        'pill': '9999px',
      },
      animation: {
        'fade-up': 'fadeUp 0.35s ease forwards',
        'pulse-slow': 'pulse 2.5s cubic-bezier(0.4,0,0.6,1) infinite',
        'blink': 'blink 1.4s step-end infinite',
      },
      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}
