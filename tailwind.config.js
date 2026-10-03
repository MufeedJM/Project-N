/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        agro: {
          50: '#f2f8f4',
          100: '#e1efe6',
          200: '#c4e0ce',
          300: '#99cbab',
          400: '#67b084',
          500: '#409462',
          600: '#2f764c',
          700: '#265e3e',
          800: '#214c33',
          900: '#1b402c',
          950: '#0e2318',
        },
        earth: {
          50: '#fbf9f5',
          100: '#f6f2e9',
          200: '#ebe2d0',
          300: '#dcceb1',
          400: '#cab68f',
          500: '#bb9f71',
          600: '#ab895e',
          700: '#8e6f4c',
          800: '#745a40',
          900: '#604a37',
        },
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        charcoal: {
          800: '#1e2421',
          900: '#131915',
          950: '#0b100d',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Outfit"', '"Plus Jakarta Sans"', 'sans-serif'],
        serif: ['"Playfair Display"', 'serif'],
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(14, 35, 24, 0.06), 0 2px 6px -1px rgba(14, 35, 24, 0.04)',
        'soft-lg': '0 10px 30px -4px rgba(14, 35, 24, 0.08), 0 4px 12px -2px rgba(14, 35, 24, 0.04)',
        'soft-xl': '0 20px 40px -6px rgba(14, 35, 24, 0.12), 0 8px 16px -4px rgba(14, 35, 24, 0.06)',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      }
    },
  },
  plugins: [],
}
