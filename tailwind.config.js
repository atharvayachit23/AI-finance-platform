/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // High-end Dark Theme Colors
        background: "#050505", // Deep obsidian
        foreground: "#f8fafc",
        card: {
          DEFAULT: "#0f0f0f", // Slightly lighter than background for depth
          foreground: "#f8fafc"
        },
        primary: {
          DEFAULT: "#00f59b", // Cyber Emerald
          foreground: "#000000"
        },
        secondary: {
          DEFAULT: "#1e293b",
          foreground: "#f8fafc"
        },
        accent: {
          DEFAULT: "#7c3aed", // Electric Violet
          foreground: "#ffffff"
        },
        muted: {
          DEFAULT: "#1a1a1a",
          foreground: "#a1a1aa"
        },
        border: "#262626", // Subtler borders for glassmorphism
        input: "#1a1a1a",
        ring: "#00f59b",
        chart: {
          '1': '#00f59b', // Emerald
          '2': '#7c3aed', // Violet
          '3': '#3b82f6', // Blue
          '4': '#f59e0b', // Amber
          '5': '#ef4444'  // Rose
        }
      },
      borderRadius: {
        lg: '1.25rem', // Slightly more rounded for a modern feel
        md: '1rem',
        sm: '0.75rem'
      },
      // Added a custom glow effect for that "AI" feel
      boxShadow: {
        'glow': '0 0 20px -5px rgba(0, 245, 155, 0.3)',
      }
    }
  },
  plugins: [require("tailwindcss-animate")],
};