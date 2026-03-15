export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  corePlugins: {
    preflight: false, // disables Tailwind's default CSS reset
  },
  theme: {
    extend: {},
  },
  plugins: [],
}