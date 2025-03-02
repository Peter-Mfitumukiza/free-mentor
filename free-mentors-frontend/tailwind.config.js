/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1A5FFF',
          light: '#4B83FF',
          dark: '#0D3B94'
        },
        secondary: {
          DEFAULT: '#F0F5FF',
          light: '#F5F9FF',
          dark: '#E6F0FF'
        },
        text: {
          primary: '#1D2939',
          secondary: '#667085',
          muted: '#98A2B3'
        }
      },
      borderRadius: {
        'custom': '8px'
      }
    },
  },
  plugins: [],
}