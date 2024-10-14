/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}",
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        orangePrimary: '#fc950d',
        orangeSecondary: '#fcaa3d',
        grayHover: '#434852',
        blue: '#344767',
        grayPrimary: '#31353D'
      }
    },
  },
  plugins: [],
}