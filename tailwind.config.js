/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Bleus (pro + accent)
        'mimprep-blue': {
          50: '#eff6ff',
          100: '#dbeafe',
          200: '#bfdbfe',
          300: '#93c5fd',
          400: '#60a5fa',
          500: '#457cf0',
          600: '#1378d1',
          700: '#1140a4',
          800: '#1e3a8a',
          900: '#1e40af',
        },
        // Neutres (fond + texte)
        'mimprep-neutral': {
          50: '#f5f7fb',
          100: '#e5e7eb',
          200: '#d1d5db',
          300: '#9b9b9b',
          400: '#6b7280',
          500: '#686b6d',
          600: '#4b5563',
          700: '#374151',
          800: '#202b38',
          900: '#0f141c',
        },
        // Couleurs de score
        'score-red': '#F04438',
        'score-yellow': '#F59E0B',
        'score-green': '#10B981',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.4s ease-out',
        'pulse-glow': 'pulseGlow 0.8s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.98)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        pulseGlow: {
          '0%': { opacity: '0' },
          '50%': { opacity: '0.2' },
          '100%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
}

