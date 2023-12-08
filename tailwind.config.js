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
      },
      screens: {
        'sm': '640px',
  
        'md': '768px',
  
        'lg': '1024px',
  
        'xl': '1280px',
  
        '2xl': '1536px',
      }
    },
  },
  plugins: [],
}
