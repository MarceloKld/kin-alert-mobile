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
        slideIn: "slideIn 0.3s ease-out",
        statusChange: "statusChange 0.4s ease-out",
        bounceOnce: "bounceOnce 0.4s ease",
        pulseGlow: "pulseGlow 2s infinite",
      },
      keyframes: {
        bounceOnce: {
    "0%": { transform: "scale(1)" },
    "50%": { transform: "scale(1.2)" },
    "100%": { transform: "scale(1)" },
  },
        statusChange: {
    "0%": { transform: "scale(0.9)", opacity: "0.5" },
    "100%": { transform: "scale(1)", opacity: "1" },
  },
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

  slideIn: {
      "0%": { opacity: "0", transform: "translateY(-20px)" },
      "100%": { opacity: "1", transform: "translateY(0)" },
    },
    // <-- AJOUTE CE BLOC ICI :
  pulseGlow: {
    "0%, 100%": { boxShadow: "0 0 30px rgba(255,140,0,0.5)" },
    "50%": { boxShadow: "0 0 60px rgba(255,140,0,1)" },
  },



  
      },
    },
  },
  plugins: [],
}