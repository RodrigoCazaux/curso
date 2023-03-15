module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./nuxt.config.{js,ts}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    require('./plugins/tailwind/heading'),
    require('./plugins/tailwind/title'),
    require('./plugins/tailwind/subtitle'),
    require('./plugins/tailwind/body'),
    require('./plugins/tailwind/link'),
  ],
}
