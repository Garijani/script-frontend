// module.exports = {
//   content: ["./src/**/*.{js,jsx,ts,tsx}"],
//   theme: {
//     extend: {},
//   },
//   plugins: [],
// }


/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          main: '#1976d2',
          dark: '#1565c0',
          light: '#42a5f5',
        },
        secondary: {
          main: '#9c27b0',
        },
        text: {
          primary: '#212121',
          secondary: '#757575',
        },
        grey: {
          200: '#eeeeee',
          300: '#e0e0e0',
        },
      },
      fontFamily: {
        roboto: ['Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};