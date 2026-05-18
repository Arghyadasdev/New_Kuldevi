/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      scale: {
        '115': '1.15',
        '103': '1.03',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      colors: {
        // Deep Indian red / crimson
        primary: {
          50:  '#fff5f4',
          100: '#ffe0dd',
          200: '#ffc4bd',
          300: '#ff9b90',
          400: '#ff6555',
          500: '#e83520',
          600: '#c2200e',
          700: '#9c180a',
          800: '#7c1509',
          900: '#5f1208',
          950: '#3c0704',
        },
        // Saffron / Indian yellow
        gold: {
          50:  '#fffbeb',
          100: '#fff3c4',
          200: '#ffe680',
          300: '#ffd43b',
          400: '#ffc114',
          500: '#ff9933',
          600: '#e07800',
          700: '#b85c00',
          800: '#924500',
          900: '#783900',
        },
        accent: {
          light: '#fff3e0',
          DEFAULT: '#ff9933',
          dark: '#c2200e',
        }
      },
      fontFamily: {
        display: ['Playfair Display', 'Noto Sans Devanagari', 'serif'],
        body: ['Poppins', 'Noto Sans Devanagari', 'sans-serif'],
        devanagari: ['Noto Sans Devanagari', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s infinite',
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
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
