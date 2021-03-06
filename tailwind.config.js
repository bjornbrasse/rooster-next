module.exports = {
  content: ['./app/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: '#3096a3',
        secondary: '#2cb64e',
        accent: '#fff453',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
