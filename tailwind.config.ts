import type { Config } from 'tailwindcss'

const config: Config = {
  darkMode: 'class',
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Light Mode Colors
        light: {
          base: '#FFFFFF',
          'icy-blue': '#F4F9FF',
          'neutral-grey': '#E9EFF5',
        },
        // Dark Mode Colors
        dark: {
          base: '#0A0F16',
          'deep-blue': '#0F1724',
          panel: '#1B2433',
        },
        // Text Colors
        text: {
          // Light mode text
          primary: '#0F1A2A',
          secondary: '#4B637D',
          muted: '#5C6E80', // Darkened from #8DA1B5 for WCAG AA compliance (4.5:1 contrast on white)
          // Dark mode text
          'dark-primary': '#F2F6FF',
          'dark-secondary': '#C1CCDD',
          'dark-muted': '#8A96AA',
        },
        // Accent Colors (shared between modes)
        accent: {
          primary: '#3B82F6',
          secondary: '#06B6D4',
          'secondary-dark': '#38BDF8',
          success: '#10B981',
          'success-dark': '#34D399',
          warning: '#F59E0B',
          'warning-dark': '#FBBF24',
          error: '#EF4444',
          'error-dark': '#F87171',
        },
        // Border Colors
        border: {
          light: '#DCE3EC',
          dark: '#233044',
        },
        // Project Category Colors
        category: {
          pharma: '#10B981',
          coding: '#3B82F6',
          research: '#8B5CF6',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-cal-sans)', 'var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-jetbrains-mono)', 'monospace'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1.16' }],
        '6xl': ['3.75rem', { lineHeight: '1.1' }],
        '7xl': ['4.5rem', { lineHeight: '1.05' }],
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      boxShadow: {
        'light': '0 4px 6px -1px rgba(15, 26, 42, 0.08), 0 2px 4px -1px rgba(15, 26, 42, 0.04)',
        'glow': '0 0 20px rgba(59, 130, 246, 0.25)',
        'glow-lg': '0 0 40px rgba(59, 130, 246, 0.3)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'slide-in-left': 'slideInLeft 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'spin-slow': 'spin 3s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInLeft: {
          '0%': { opacity: '0', transform: 'translateX(-20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: '65ch',
            color: 'var(--tw-prose-body)',
            a: {
              color: '#3B82F6',
              textDecoration: 'underline',
              fontWeight: '500',
              '&:hover': {
                color: '#2563EB',
              },
            },
            'code::before': {
              content: '""',
            },
            'code::after': {
              content: '""',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

export default config
