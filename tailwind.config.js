const defaultTheme = require('tailwindcss/defaultTheme')
module.exports = {
  theme: {
    extend: {
      fontFamily: {
        sans: ['Karla', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        primary:'#87020e',
        secondary: '#314467',
        secondarylight:'#a25f4b',
        background:'#f6f6f6'
      },
      spacing: {
        '128': '49rem',
      }
    },
  },
  plugins: [],
}
