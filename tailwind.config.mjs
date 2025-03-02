/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'bright-blue': '#0079FF',
        'teal-green': '#00DFA2',
        'light-yellow': '#F6FA70',
        'vibrant-pink': '#FF0060',
      },
    },
  },
  plugins: [],
};
