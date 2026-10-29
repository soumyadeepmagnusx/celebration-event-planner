/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#fdf4f8',
          100: '#fce7f2',
          200: '#f9cfe4',
          300: '#f5a7ce',
          400: '#ee70ad',
          500: '#e2428f',
          600: '#cd2572',
          700: '#b01859',
          800: '#911749',
          900: '#791840',
        },
      },
    },
  },
  plugins: [],
};
