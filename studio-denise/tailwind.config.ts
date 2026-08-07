import type { Config } from "tailwindcss";

/**
 * Paleta provisória — neutra, sofisticada e feminina, sem excesso de rosa.
 * Todas as cores derivam de CSS variables (src/app/globals.css) para que a
 * identidade oficial do Studio Denise de Paula possa ser trocada sem tocar
 * nos componentes.
 */
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        "primary-soft": "rgb(var(--color-primary-soft) / <alpha-value>)",
        secondary: "rgb(var(--color-secondary) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        background: "rgb(var(--color-background) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        "surface-2": "rgb(var(--color-surface-2) / <alpha-value>)",
        text: "rgb(var(--color-text) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        line: "rgb(var(--color-line) / <alpha-value>)",
        success: "rgb(var(--color-success) / <alpha-value>)",
        warning: "rgb(var(--color-warning) / <alpha-value>)",
        danger: "rgb(var(--color-danger) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "Georgia", "serif"],
      },
      borderRadius: {
        xl: "14px",
        "2xl": "20px",
        "3xl": "28px",
      },
      boxShadow: {
        soft: "0 10px 40px -18px rgb(60 46 38 / 0.35)",
        card: "0 2px 14px -6px rgb(60 46 38 / 0.18)",
        glow: "0 16px 48px -18px rgb(var(--color-primary) / 0.45)",
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(135deg, rgb(var(--color-primary)), rgb(var(--color-secondary)))",
        "accent-gradient":
          "linear-gradient(135deg, rgb(var(--color-accent)), rgb(var(--color-primary-soft)))",
      },
    },
  },
  plugins: [],
};

export default config;
