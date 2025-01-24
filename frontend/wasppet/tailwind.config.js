/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        'primary-color': '#ffbf00',
        'secondary-color': '#dfa600',
        'primary-background': '#1e1e1e',
        'secondary-background': '#ffffff',
        'tertiary-background': '#ededed',
        'fourth-background': '#303030',
        'primary-font-color': '#ffffff',
        'secondary-font-color': '#f5f5f5',
        'custom-light-gray': '#d3d3d3',
        'custom-light-gray-2': '#a2a2a2',
        'custom-light-gray-3': '#747474',
        'alert-color': '#ff7557',
        'shading-50': 'rgba(0, 0, 0, 0.5)',
      },
      fontSize: {
        'title': '40px',
        'subtitle': '30px',
      },
      fontFamily: {
        'opensans': ['"opensans"', 'sans-serif'],
      },
      boxShadow: {
        'custom-1': '0px 2px 3px rgba(0, 0, 0, 30%)',
        'custom-inner-1': 'inset 1px 1px 3px rgba(0, 0, 0, 0.3)',
        'custom-inner-2': 'inset 1px 2px 6px rgba(0, 0, 0, 1)',
      },
      transitionProperty: {
        'left': 'left',
        'sm-left': 'left',
      }
    },
  },
  plugins: [],
}

