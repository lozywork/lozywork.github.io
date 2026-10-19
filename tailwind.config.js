/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './pluginfs/**/*.{js,ts}',
    './app.vue',
    './error.vue',
  ],
  theme: {
    extend: {},
  },
  // The site's own reset in assets/css/main.scss replaces Tailwind's.
  corePlugins: {
    preflight: false,
  },
  plugins: [],
};