/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  safelist: [
    'bg-gray-50',
    'bg-nerdLime',
    'bg-nerdBlue',
    'bg-nerdWhite',
    'bg-nerdGray',
    'bg-nerdRed',
    'bg-blue-50/50',
    'bg-nerdLime/5',
    'bg-orange-50/50',
    'bg-purple-50/50',
    'bg-emerald-50/50',
    'bg-sky-50/50',
    'bg-white',
  ],
  theme: {
    extend: {
      colors: {
        nerdLime: '#9BE600',
        nerdBlue: '#00308F',
        nerdWhite: '#FFFFFF',
        nerdDark: '#001a4d',
        nerdGray: '#F3F4F6',
        nerdRed: '#FF4444',
      },
      fontFamily: {
        sans: ['Outfit', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
        roboto: ['Roboto', 'sans-serif', 'system-ui'],
      },
      boxShadow: {
        'hard': '6px 6px 0px 0px #00308F',
        'hard-lime': '6px 6px 0px 0px #9BE600',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'scroll': 'scroll 30s linear infinite',
        'gallery-scroll': 'scroll 40s linear infinite',
        'fade-in': 'fadeIn 0.3s ease-out forwards',
        'blink': 'blink 1s step-end infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        }
      }
    },
  },
  plugins: [],
}
