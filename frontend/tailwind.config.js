/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
  // If you disabled preflight earlier, try enabling it again to fix spacing
  // corePlugins: { preflight: false }, <--- Remove or comment this out if enabled
}