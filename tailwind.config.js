/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "day-sky": "linear-gradient(to bottom, #3B82F6, #1E40AF)",
        "night-sky": "linear-gradient(to bottom, #1E3A8A, #475569)",
      },
      colors: {
        bluesky: {
          light: "#87CEEB",
          DEFAULT: "4682B4",
          Dark: "#1E3A8A",
        },
      },
      backdropBlur: {
        sm: "4px",
        md: "10px",
        lg: "20px",
      },
      boxShadow: {
        glass: "0 4px 10px rgba(0, 0, 0, 0.1)"
      },
      fontFamily: {
        Inter: ["Inter", "sans-serif"]
      }
    },
  },
  plugins: [
    require("tailwind-scrollbar"),
  ],
}