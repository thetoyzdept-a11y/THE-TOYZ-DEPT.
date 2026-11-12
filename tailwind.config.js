/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#191919",
          light: "#252525",
          muted: "#666666",
          soft: "#404040",
        },
        cream: {
          DEFAULT: "#F5F1E8",
          light: "#FAF7F2",
          dark: "#E8E2D5",
          darker: "#D6CEBF",
        },
        lime: {
          DEFAULT: "#D9FF43",
          light: "#E5FF75",
          dark: "#B8E619",
          darker: "#9ACB00",
        },
        coral: {
          DEFAULT: "#FF694B",
          light: "#FF8C74",
          dark: "#E64F30",
          darker: "#C83618",
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', "system-ui", "-apple-system", "sans-serif"],
        body: ["Inter", "system-ui", "-apple-system", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      boxShadow: {
        "brutal-sm": "2px 2px 0px 0px #191919",
        brutal: "3px 3px 0px 0px #191919",
        "brutal-lg": "5px 5px 0px 0px #191919",
        "brutal-xl": "7px 7px 0px 0px #191919",
        "brutal-lime": "3px 3px 0px 0px #D9FF43",
        "brutal-coral": "3px 3px 0px 0px #FF694B",
        "brutal-cream": "3px 3px 0px 0px #F5F1E8",
      },
      borderRadius: {
        brutal: "4px",
      },
      borderWidth: {
        brutal: "2px",
        "brutal-thick": "3px",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },
      animation: {
        marquee: "marquee 25s linear infinite",
      },
    },
  },
  plugins: [],
};
