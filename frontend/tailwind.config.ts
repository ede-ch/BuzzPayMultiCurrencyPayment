import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0b0708",
        buzz: {
          red: "#C60402",
          bright: "#ef2630",
          deep: "#c4151b",
        },
        divider: {
          red: "#d8201f",
        },
        coin: {
          yellow: "#f2a900",
          orange: "#ee7a17",
          red: "#e0231f",
        },
        muted: {
          DEFAULT: "#a39a9c",
          dark: "#b7afb1",
        },
      },
      fontFamily: {
        sans: ["var(--font-manrope)", "system-ui", "sans-serif"],
        manrope: ["var(--font-manrope)", "sans-serif"],
        mono: ["var(--font-jetbrains)", "monospace"],
      },
      keyframes: {
        twinkle: {
          "0%, 100%": { opacity: "0.35", transform: "scale(0.85) rotate(0deg)" },
          "50%": { opacity: "1", transform: "scale(1.1) rotate(15deg)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "dash-flow": {
          "0%": { strokeDashoffset: "0" },
          "100%": { strokeDashoffset: "52" },
        },
        "pulse-ring": {
          "0%": { transform: "scale(0.8)", opacity: "0.7" },
          "100%": { transform: "scale(2.4)", opacity: "0" },
        },
      },
      animation: {
        twinkle: "twinkle 4s ease-in-out infinite",
        float: "float 6s ease-in-out infinite",
        "spin-slow": "spin-slow 7s linear infinite",
        "dash-flow": "dash-flow 3s linear infinite",
        "pulse-ring": "pulse-ring 2.5s ease-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;