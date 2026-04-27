/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: '#F2E8CF',
          light: '#FAF3DF',
          dark: '#EDE3C7',
        },
        sage: {
          50: '#EFF1DC',
          100: '#E2E6C5',
          200: '#D9DBB6',
          300: '#CFD4A5',
          400: '#B8C49A',
          500: '#9CAB7A',
          600: '#7A8A4F',
        },
        olive: {
          DEFAULT: '#3D4A2A',
          dark: '#2F3E1F',
          light: '#5A6B3F',
        },
        rust: {
          DEFAULT: '#9B5C3F',
          light: '#B57A5C',
          dark: '#7A4530',
        },
        tan: {
          DEFAULT: '#D9CBA1',
          light: '#E8DDB8',
          dark: '#B8A878',
        },
      },
      fontFamily: {
        serif: ['"Fraunces"', '"Playfair Display"', 'Georgia', 'serif'],
        script: ['"Caveat"', '"Dancing Script"', 'cursive'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        notebook: '0 4px 20px rgba(61, 74, 42, 0.08)',
        card: '0 2px 12px rgba(61, 74, 42, 0.06)',
      },
    },
  },
  plugins: [],
}
