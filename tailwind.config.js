/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontSize: {
        sm: '0.9rem',
        base: '1rem',
        xl: '1.25rem',
        '2xl': '1.563rem',
        '3xl': '1.953rem',
        '4xl': '2.441rem',
        '5xl': '3.052rem',
      },
      fontWeight: {
        hairline: '100',
        extralight: '200',
        light: '300',
        normal: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        'extra-bold': '800',
        black: '900',
      },
      colors: {
        blue: '#344767',
        'orange-900': '#fc950d',
        'orange-800': '#fc9f25',
        'orange-700': '#fcaa3d',
        'orange-600': '#fcb455',
        'orange-500': '#fdbf6d',
        'gray-main': '#31353D',
        'gray-hover': '#434852',
        'zinc-800': '#27272a'
      }
    },
  },
  plugins: [],
}