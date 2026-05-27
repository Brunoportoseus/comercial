import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  // Classes geradas dinamicamente em runtime (NotificationItem,
  // VoucherCard, TrainingCard etc.) precisam ser pré-incluídas.
  safelist: [
    ...["darka-red", "darka-orange", "darka-yellow", "darka-green", "darka-blue", "darka-purple", "darka-brand-green", "darka-brand-green-soft"].flatMap((c) => [
      `bg-${c}`, `text-${c}`, `border-${c}`,
      `bg-${c}/8`, `bg-${c}/10`, `bg-${c}/15`, `bg-${c}/20`, `bg-${c}/25`,
    ]),
  ],
  theme: {
    extend: {
      colors: {
        // Mapeia para CSS variables (definidas em globals.css) para fácil troca de paleta.
        primary: "rgb(var(--color-primary) / <alpha-value>)",
        secondary: "rgb(var(--color-secondary) / <alpha-value>)",
        accent: "rgb(var(--color-accent) / <alpha-value>)",
        background: "rgb(var(--color-background) / <alpha-value>)",
        surface: "rgb(var(--color-surface) / <alpha-value>)",
        "surface-2": "rgb(var(--color-surface-2) / <alpha-value>)",
        text: "rgb(var(--color-text) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        success: "rgb(var(--color-success) / <alpha-value>)",
        warning: "rgb(var(--color-warning) / <alpha-value>)",
        danger: "rgb(var(--color-danger) / <alpha-value>)",
        // Cores complementares Darka (espectro)
        "darka-red": "#e6342b",
        "darka-orange": "#f3742a",
        "darka-yellow": "#f0c020",
        "darka-green": "#3aa761",
        "darka-blue": "#3aa1d9",
        "darka-purple": "#5d4b9e",
        // Verde institucional da logomarca (mapeado via CSS var)
        "darka-brand-green": "rgb(var(--color-brand-green) / <alpha-value>)",
        "darka-brand-green-soft": "rgb(var(--color-brand-green-soft) / <alpha-value>)",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        xl: "14px",
        "2xl": "20px",
        "3xl": "28px",
      },
      boxShadow: {
        soft: "0 6px 24px -8px rgb(0 0 0 / 0.25)",
        glow: "0 12px 36px -10px rgb(255 61 77 / 0.5)",
      },
      backgroundImage: {
        "brand-gradient":
          "linear-gradient(135deg, rgb(var(--color-primary)), rgb(var(--color-secondary)))",
        "accent-gradient":
          "linear-gradient(135deg, rgb(var(--color-accent)), #ffb347)",
        "green-gradient":
          "linear-gradient(135deg, rgb(var(--color-brand-green)), rgb(var(--color-brand-green-soft)))",
      },
    },
  },
  plugins: [],
};

export default config;
