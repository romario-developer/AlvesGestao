/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: 'var(--color-primary, #0f766e)',
          secondary: 'var(--color-secondary, #0ea5e9)',
          background: 'var(--color-background, #0b1727)',
        },
      },
    },
  },
  plugins: [],
};
