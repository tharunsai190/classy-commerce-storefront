
import type { Config } from "tailwindcss";

export default {
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
      colors: {
        primary: {
          DEFAULT: '#8A3FFC', // Deep Purple
          50: '#E6E0FF',
          100: '#C6B1FF',
          200: '#A687FF',
          300: '#8A3FFC',
          400: '#6E19D3',
        },
        secondary: {
          DEFAULT: '#FF3D7F', // Hot Pink
          50: '#FFE0E9',
          100: '#FF9CB8',
          200: '#FF3D7F',
          300: '#E61A5F',
        },
        accent: {
          DEFAULT: '#1BD4C4', // Teal
          50: '#E0F8F6',
          100: '#A6F0E8',
          200: '#1BD4C4',
          300: '#01A89E',
        },
        categories: {
          electronics: '#FF3D7F',   // Hot Pink
          clothing: '#8A3FFC',      // Deep Purple
          homeKitchen: '#2196F3',   // Blue
          beauty: '#4CAF50',        // Green
        },
        gradient: {
          start: '#8A3FFC',   // Deep Purple
          middle: '#FF3D7F',  // Hot Pink
          end: '#FFC107',     // Yellow
        }
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(135deg, #8A3FFC 0%, #FF3D7F 50%, #FFC107 100%)',
      },
      boxShadow: {
        'category-card': '0 10px 15px -3px rgba(138, 63, 252, 0.2), 0 4px 6px -2px rgba(138, 63, 252, 0.1)',
      },
      keyframes: {
        gradientAnimation: {
          '0%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
          '100%': { backgroundPosition: '0% 50%' },
        }
      },
      animation: {
        gradientBG: 'gradientAnimation 10s ease infinite',
      }
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

