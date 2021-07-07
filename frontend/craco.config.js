// craco.config.js
module.exports = {
  style: {
    postcss: {
      plugins: [require('tailwindcss'), require('autoprefixer')],
    },
  },
  jest: {
    babel: {
      addPresets: true /* (default value) */,
      addPlugins: true /* (default value) */,
    },
    configure: {
      moduleDirectories: [
        'node_modules',
        __dirname, // the root directory
      ],
      setupFilesAfterEnv: [],
    },
  },
};
