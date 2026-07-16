/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",   // ✅ IMPORTANT
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        tap: "tap 0.2s ease-in-out",
        fadeIn: "fadeIn 0.7s ease-out",
        float: "float 3s ease-in-out infinite",
        popupIn: "popupIn 0.25s ease-out",
        fadeUp: "fadeUp 0.4s ease-out",
      },
      keyframes: {
        tap: {
           "0%": { transform: "scale(1)" },
           "50%": { transform: "scale(0.7)" },
           "100%": { transform: "scale(1)" },
             },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        popupIn: {
    "0%": { opacity: "0", transform: "scale(0.9)" },
    "100%": { opacity: "1", transform: "scale(1)" },
       },
       fadeUp: {
    "0%": { opacity: "0", transform: "translateY(10px)" },
    "100%": { opacity: "1", transform: "translateY(0)" },
  },
      },
    },
  },
  plugins: [],
}