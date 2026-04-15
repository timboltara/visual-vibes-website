import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "vv-black": "#1c1c1c",
        "vv-white": "#ffffff",
        "vv-teal": "#bf4f1e",
        "vv-orange": "#e8622a",
        "vv-gray": "#f2f2f2",
        "vv-gray-mid": "#888888",
      },
      fontFamily: {
        heading: ["var(--font-montserrat)", "sans-serif"],
        body: ["var(--font-nunito)", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.2em",
        widest3: "0.3em",
      },
    },
  },
  plugins: [],
};
export default config;
