/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary Colors from COLOR_PALETTE.md
        teal: {
          50: '#E6F7F8',
          100: '#B3E5E8',
          200: '#80D3D8',
          300: '#4DC1C8',
          400: '#1AAFB8',
          500: '#177E89', // Primary
          600: '#126A73',
          700: '#0D565D',
          800: '#084247',
          900: '#032E31',
        },
        coral: {
          50: '#FDEEE9',
          100: '#FACEC2',
          200: '#F7AE9B',
          300: '#F48E74',
          400: '#F16E4D',
          500: '#E76F51', // Warning/Urgent
          600: '#D45A3D',
          700: '#B14832',
          800: '#8E3627',
          900: '#6B241C',
        },
        navy: {
          50: '#E7ECEE',
          100: '#B8C8CC',
          200: '#89A4AA',
          300: '#5A8088',
          400: '#2B5C66',
          500: '#1A535C', // Headers
          600: '#15454C',
          700: '#10373C',
          800: '#0B292C',
          900: '#061B1C',
        },
        turquoise: {
          50: '#E9F9F8',
          100: '#C0EEEC',
          200: '#97E3E0',
          300: '#6ED8D4',
          400: '#45CDC8',
          500: '#4ECDC4', // Success
          600: '#3EB6AE',
          700: '#329991',
          800: '#267C74',
          900: '#1A5F57',
        },
        orange: {
          50: '#FEF3E9',
          100: '#FCDEC1',
          200: '#FAC999',
          300: '#F8B471',
          400: '#F6A049',
          500: '#F4A261', // Warning
          600: '#E68B45',
          700: '#C77438',
          800: '#A85D2B',
          900: '#89461E',
        },
        charcoal: {
          50: '#E9EAEC',
          100: '#C1C3C7',
          200: '#999CA2',
          300: '#71757D',
          400: '#494E58',
          500: '#2D3142', // Dark backgrounds
          600: '#252836',
          700: '#1D1F2A',
          800: '#15161E',
          900: '#0D0D12',
        },
        silver: {
          50: '#F8F8F8',
          100: '#E8E8E8',
          200: '#D8D8D8',
          300: '#C8C8C8',
          400: '#C0C0C0',
          500: '#BFC0C0', // Borders/Disabled
          600: '#A0A0A0',
          700: '#808080',
          800: '#606060',
          900: '#404040',
        },
        cream: {
          50: '#FFFFFF',
          100: '#FEFEFE',
          200: '#FCFCFB',
          300: '#FAFAF8',
          400: '#F8F8F5',
          500: '#F7F7F2', // Light backgrounds
          600: '#D4D4CF',
          700: '#B1B1AC',
          800: '#8E8E89',
          900: '#6B6B66',
        },
      },
      fontFamily: {
        sans: ['Rubik', 'Heebo', 'Assistant', 'Inter', 'Roboto', 'sans-serif'],
        hebrew: ['Rubik', 'Heebo', 'Assistant', 'sans-serif'],
        english: ['Inter', 'Roboto', 'sans-serif'],
      },
      spacing: {
        'xs': '0.25rem',   // 4px
        'sm': '0.5rem',    // 8px
        'md': '1rem',      // 16px
        'lg': '1.5rem',    // 24px
        'xl': '2rem',      // 32px
        '2xl': '3rem',     // 48px
      },
      borderRadius: {
        'sm': '4px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
        'full': '9999px',
      },
      boxShadow: {
        'sm': '0 1px 3px rgba(0, 0, 0, 0.1)',
        'md': '0 4px 6px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 20px rgba(0, 0, 0, 0.15)',
        'xl': '0 20px 40px rgba(0, 0, 0, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
