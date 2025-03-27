/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      colors: {
        'primary-color': 'var(--background-navbar)',
        'background-navbar2': 'var(--background-navbar2)',
        'secondary-color': 'var(--secondary-color)',
        'card-background-color': 'var(--card-background-color)'
      }
    }
  },
  plugins: []
};