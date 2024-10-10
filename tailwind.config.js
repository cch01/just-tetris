/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {}
  },
  plugins: [
    require('@xpd/tailwind-3dtransforms'),
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('tailwindcss-themer')({
      defaultTheme: {
        extend: {
          colors: {
            'bg-primary': '#051622',
            'bg-secondary': '#1C2B36',
            'bg-tertiary': '#313E48',
            'bg-tertiaryHover': '##445059',
            'bg-alternative': '#445059',
            'bg-black': 'rgba(0,0,0,0)',
            primary: '#ECA864',
            secondary: '#AB7F27',
            tertiary: '#3F3B33',
            border: '#7F7D7A',
            highlight: '#0086FF'
          }
        }
      }
      // themes: [
      //   {
      //     // name your theme anything that could be a valid css class name
      //     // remember what you named your theme because you will use it as a class to enable the theme
      //     name: 'my-theme',
      //     // put any overrides your theme has here
      //     // just as if you were to extend tailwind's theme like normal https://tailwindcss.com/docs/theme#extending-the-default-theme
      //     extend: {
      //       colors: {
      //         primary: 'blue'
      //       }
      //     }
      //   }
      // ]
    })
  ]
}
