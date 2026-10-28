const plugin = require('tailwindcss/plugin');
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
    "./app.vue"
  ],
  theme: {
    extend: {
      backgroundImage: {
        'custom-bg': "url('/heroBg.png')",
      },
      animation: {
        marquee: 'marquee linear infinite',
        'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      fontFamily: {
        sans: ['Satoshi', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Clash Display', 'Satoshi', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        heading: ['Clash Display', 'Satoshi', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['Satoshi', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          DEFAULT: '#27628C',
          50: '#eff6fb',
          100: '#dceaf4',
          200: '#b9d6e8',
          300: '#8bbbd7',
          400: '#5598be',
          500: '#27628C',
          600: '#1f5378',
          700: '#1b4a6b',
          800: '#123b57',
          900: '#033958',
        },
        primary: {
          DEFAULT: '#27628C',
          50: '#eff6fb',
          100: '#dceaf4',
          200: '#b9d6e8',
          300: '#8bbbd7',
          400: '#5598be',
          500: '#27628C',
          600: '#1f5378',
          700: '#1b4a6b',
          800: '#123b57',
          900: '#033958',
        },
        secondary: '#DE6129',
        ink: '#102A3A',
        muted: '#6B8192',
        surface: '#FFFFFF',
        canvas: '#F4F8FB',
        accent: '#000000',
        green: {
          500: '#4ADE80',
          900: '#1B4332',
        },
        gray: {
          25:  "#fafafa",
          50:  "#f2f2f2",
          100: "#e6e6e6",
          200: "#cccccc",
          300: "#b3b3b3",
          400: "#999999",
          500: "#808080",
          600: "#666666",
          700: "#4d4d4d",
          800: "#333333",
          900: "#1a1a1a",
          925: "#0d0d0d",
        },
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [
    plugin(function({ addUtilities }) {
      addUtilities({
        '.bg-green-striped': {
          'background-image': `linear-gradient(45deg, #0a2000 10%, transparent 10%,
            transparent 20%, #0a2000 20%, #0a2000 30%, transparent 30%, transparent 40%,
            #0a2000 40%, #0a2000 50%, transparent 50%, transparent 60%, #0a2000 60%,
            #0a2000 70%, transparent 70%, transparent 80%, #0a2000 80%, #0a2000 90%,
            transparent 90%, transparent)`,
        },
      })
    })
  ],
}