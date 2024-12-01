/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      backgroundImage: {
        bgtest: ({ opacityValue }) => {
          if (opacityValue) {
            return `var(--background-image),${opacityValue}`;
          }
          return "var(--background-image)";
        },
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        theme: {
          primary: "var(--background-primary)",
          secondary: "var(--background-secondary)",
          themeText: "var(--theme-text-color)",
        },

        background: "var(--background-primary)",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "var(--theme-text-color)",
          foreground: "var(--theme-text-color)",
        },
        secondary: {
          DEFAULT: "var(--background-primary)",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          // DEFAULT: "var(--theme-text-color)",
          // foreground: "var(--theme-text-color)",
        },
        accent: {
          DEFAULT: "var(--background-primary)",
          foreground: "var(--theme-text-color)",
        },
        popover: {
          DEFAULT: "var(--background-secondary)",
          foreground: "var(--theme-text-color)",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        hello: "var(--hello-color)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  // eslint-disable-next-line no-undef
  plugins: [require("tailwindcss-animate")],
};
