/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f7ff',
          100: '#e7ecff',
          500: '#5b7cfa',
          700: '#3856d6',
          900: '#1e2b75'
        }
      },
      boxShadow: {
        premium: '0 18px 40px -20px rgba(17, 24, 39, 0.45)'
      }
    }
  },
  plugins: []
};
