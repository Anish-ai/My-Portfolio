import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px'
      }
    },
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        primary: "#1a365d",
        secondary: "#2c5282",
        accent: "#4fd1c5",
      },
      keyframes: {
        'gradient-x': {
          '0%, 100%': { backgroundSize: '200% 200%', backgroundPosition: 'left center' },
          '50%': { backgroundSize: '200% 200%', backgroundPosition: 'right center' },
        },
        'accordion-down': {
          from: {
            height: '0'
          },
          to: {
            height: 'var(--radix-accordion-content-height)'
          }
        },
        'accordion-up': {
          from: {
            height: 'var(--radix-accordion-content-height)'
          },
          to: {
            height: '0'
          }
        },
        'cursor-pulse': {
          '0%, 100%': {
            transform: 'scale(1)',
            opacity: '0.8'
          },
          '50%': {
            transform: 'scale(1.1)',
            opacity: '1'
          },
        },
        'cursor-rotate': {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        'pulse': {
          '0%, 100%': {
            transform: 'scale(0.8)',
            opacity: '0.5',
          },
          '50%': {
            transform: 'scale(1.2)',
            opacity: '1',
          }
        },
        'loadingProgress': {
          '0%': {
            width: '0%',
            transform: 'translateX(-100%)',
          },
          '50%': {
            width: '70%',
            transform: 'translateX(0)',
          },
          '100%': {
            width: '100%',
            transform: 'translateX(100%)',
          }
        }
      },
      animation: {
        'gradient-x': 'gradient-x 5s ease infinite',
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'cursor-pulse': 'cursor-pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'cursor-rotate': 'cursor-rotate 8s linear infinite',
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
