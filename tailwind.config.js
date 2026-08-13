/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class", // ✅ IMPORTANT
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        "pulse-soft": "pulseSoft 2s ease-in-out infinite",
        "spin-slow": "spin 20s linear infinite",
        "ping-slow": "pingSlow 2.5s cubic-bezier(0, 0, 0.2, 1) infinite",
        "scale-in": "scaleIn 0.3s ease-out",
        "fade-in-up": "fadeInUp 0.5s ease-out forwards",
        "pulse-urgent": "pulseUrgent 1s ease-in-out infinite",
        "pulse-border": "pulseBorder 0.8s ease-in-out infinite",
        "wiggle-urgent": "wiggleUrgent 0.5s ease-in-out infinite",
        blink: "blink 0.8s ease-in-out infinite",
        "wave-expand": "waveExpand 2s ease-out infinite",
        "progress-bar": "progressBar 3s linear forwards",
        "float-up": "floatUp 2s ease-out infinite",
        "fade-in": "fadeIn 0.5s ease-in",
        "slide-in-right": "slideInRight 0.3s ease-out",
        // Animations légères
        shimmer: "shimmer 3s ease-in-out infinite",
        "gradient-x": "gradient-x 3s ease infinite",
        "bounce-slow": "bounce 3s ease-in-out infinite",
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "pulse-fast": "pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        wiggle: "wiggle 2s ease-in-out infinite",
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
        pulseSoft: {
          "0%, 100%": { opacity: "0.4", transform: "scale(1)" },
          "50%": { opacity: "0.7", transform: "scale(1.05)" },
        },
        pingSlow: {
          "0%": { transform: "scale(1)", opacity: "1" },
          "75%, 100%": { transform: "scale(1.5)", opacity: "0" },
        },
        scaleIn: {
          "0%": { transform: "scale(0) rotate(-180deg)", opacity: "0" },
          "100%": { transform: "scale(1) rotate(0deg)", opacity: "1" },
        },
        fadeInUp: {
          "0%": {
            opacity: "0",
            transform: "translateY(20px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
          pulseUrgent: {
            "0%, 100%": {
              opacity: "0.4",
              transform: "scale(1)",
            },
            "50%": {
              opacity: "0.8",
              transform: "scale(1.3)",
            },
          },
          pulseBorder: {
            "0%, 100%": { opacity: "0.3" },
            "50%": { opacity: "1" },
          },
          wiggleUrgent: {
            "0%, 100%": { transform: "rotate(0deg)" },
            "25%": { transform: "rotate(15deg) scale(1.1)" },
            "75%": { transform: "rotate(-15deg) scale(1.1)" },
          },
          blink: {
            "0%, 100%": { opacity: "1" },
            "50%": { opacity: "0.3" },
          },
          waveExpand: {
            "0%": {
              transform: "scale(1)",
              opacity: "0.6",
            },
            "100%": {
              transform: "scale(2.5)",
              opacity: "0",
            },
          },
          progressBar: {
            "0%": { width: "100%" },
            "100%": { width: "0%" },
          },
          pingSlow: {
            "0%": {
              transform: "scale(1)",
              opacity: "1",
            },
            "75%, 100%": {
              transform: "scale(1.5)",
              opacity: "0",
            },
          },
          floatUp: {
            "0%": {
              transform: "translateY(0)",
              opacity: "0",
            },
            "50%": {
              opacity: "1",
            },
            "100%": {
              transform: "translateY(-60px)",
              opacity: "0",
            },
          },
          fadeIn: {
            "0%": {
              opacity: "0",
              transform: "translateY(-10px)",
            },
            "100%": {
              opacity: "1",
              transform: "translateY(0)",
            },
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
            shimmer: {
              "0%": { transform: "translateX(-100%)" },
              "100%": { transform: "translateX(100%)" },
            },
            "gradient-x": {
              "0%, 100%": { backgroundPosition: "0% 50%" },
              "50%": { backgroundPosition: "100% 50%" },
            },
            wiggle: {
              "0%, 100%": { transform: "rotate(0deg)" },
              "25%": { transform: "rotate(10deg)" },
              "75%": { transform: "rotate(-10deg)" },
            },
            slideInRight: {
              "0%": {
                transform: "translateX(100%)",
                opacity: "0",
              },
              "100%": {
                transform: "translateX(0)",
                opacity: "1",
              },
            },
            progressBar: {
              "0%": { width: "100%" },
              "100%": { width: "0%" },
            },
          },
        },
      },
    },
  },
  plugins: [],
};