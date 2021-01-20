module.exports = {
  purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: ['Nunito Sans', 'arial', 'sans-serif'],
      serif: ['Times New Roman', 'serif'],
    },
    extend: {},
  },
  variants: {
    extend: {
      margin: ['first'],
    },
  },
  plugins: [],
};
