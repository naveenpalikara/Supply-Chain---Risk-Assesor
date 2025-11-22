/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'risk-critical': '#DC2626',
        'risk-high': '#EA580C',
        'risk-medium': '#F59E0B',
        'risk-low': '#10B981',
        'primary': '#3B82F6',
        'background': '#F9FAFB',
      }
    },
  },
  plugins: [],
}
