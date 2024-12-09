/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'slide-in-from-top': {
          '0%': { transform: 'translateY(-10px)' },
          '100%': { transform: 'translateY(0)' },
        },
      },
      animation: {
        'in': 'fade-in 0.2s ease-out, slide-in-from-top 0.2s ease-out',
      },
      fontFamily: {
        yatra: ['Yatra One', 'cursive'],
      },
    },
  },
  plugins: [],
};

