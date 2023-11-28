/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: ['postcss-import',
    'tailwindcss/nesting',
    'tailwindcss',
    'autoprefixer'],
  purge: false,
};
