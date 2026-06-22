import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/admin/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/admin/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/ui/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  corePlugins: {
    // Disable preflight to avoid breaking the Vanilla CSS storefront
    preflight: false,
  },
  plugins: [],
};
export default config;
