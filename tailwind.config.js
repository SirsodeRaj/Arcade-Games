/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        arcade: ['"Exo 2"', '"Share Tech Mono"', "monospace"],
      },
      colors: {
        neon: {
          yellow: "#ffe66d",
          red: "#ff6b6b",
          teal: "#4ecdc4",
          purple: "#a29bfe",
          pink: "#fd79a8",
          green: "#00b894",
          blue: "#74b9ff",
          orange: "#fd9644",
        },
      },
      animation: {
        "pulse-fast": "pulse 0.8s cubic-bezier(0.4,0,0.6,1) infinite",
      },
    },
  },
  plugins: [],
};
