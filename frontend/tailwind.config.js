const colors = require('tailwindcss/colors');

module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: ['Nunito Sans', 'arial', 'sans-serif'],
      serif: ['Times New Roman', 'serif'],
    },
    colors: { ...colors, black: '#27272a' },
    extend: {},
  },
  variants: {
    extend: {
      margin: ['first'],
      opacity: ['disabled'],
      cursor: ['disabled'],
    },
  },
  plugins: [],
};
