/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',         // for App Router pages/layouts
    './components/**/*.{js,ts,jsx,tsx}',  // shared UI components
    './constants/**/*.{js,ts,jsx,tsx}',   // any constant-based JSX/TSX
    './context/**/*.{js,ts,jsx,tsx}',     // context providers
    './hooks/**/*.{js,ts,jsx,tsx}',       // custom hooks
    './lib/**/*.{js,ts,jsx,tsx}',         // utility libraries
    './models/**/*.{js,ts,jsx,tsx}',      // database schemas (optional)
    './types/**/*.{js,ts,jsx,tsx}',       // if any TSX files here (optional)
  ],
  theme: {
    extend: {
      colors: {
        green: {
          600: '#16a34a', // for income
        },
        red: {
          600: '#dc2626', // for expenses
        },
      },
    },
  },
  plugins: [],
};
