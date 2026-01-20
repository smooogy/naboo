import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    fontWeight: {
      normal: '500',
      medium: '500',
      bold: '600',
      semibold: '600',
    },
    extend: {
      colors: {
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
          light: '#dde08a',
          lighter: '#f5f6e8',
        },
        black: '#212724',
        white: '#ffffff',
        grey: {
          DEFAULT: '#737876',
          dark: '#8a8a8a',
          light: '#f1f1f1',
          lighter: '#eff1f3',
          lighterGrey: '#F9F9F9',
        },
        border: '#e0e0e0',
        info: {
          DEFAULT: '#3452bd',
          light: 'rgba(52,82,189,0.1)',
        },
        background: {
          default: '#fdfdfd',
          secondary: '#f9f9f9',
          tertiary: '#f5f5f5',
        },
      },
      fontFamily: {
        sans: ['Google Sans', 'system-ui', 'sans-serif'],
        display: ['TT Hoves Pro Trial Variable', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        xxs: ['10px', { lineHeight: '12px' }],
        xs: ['12px', { lineHeight: '16px' }],
        sm: ['14px', { lineHeight: '20px' }],
        base: ['15px', { lineHeight: '20px' }],
        lg: ['18px', { lineHeight: '24px' }],
        xl: ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }],
        '3xl': ['28px', { lineHeight: '36px' }],
        '4xl': ['44px', { lineHeight: '52px' }],
        '5xl': ['58px', { lineHeight: '68px' }],
      },
      letterSpacing: {
        tighter: '-0.48px',
        tight: '-0.36px',
        normal: '-0.3px',
        wide: '-0.28px',
        wider: '-0.15px',
      },
      borderRadius: {
        DEFAULT: '4px',
        sm: '2px',
        full: '9999px',
      },
      boxShadow: {
        sm: '0px 0px 1px 0px rgba(0,0,0,0.03), 0px 1px 28px 0px rgba(0,0,0,0.07)',
        base: '0px 4px 8px 0px rgba(0,0,0,0.01), 0px 1px 1px 0px rgba(0,0,0,0.02)',
        md: '0px 1px 8px 0px rgba(0,0,0,0.02), 0px 2px 8px 0px rgba(0,0,0,0.03), 0px 1px 1px 0px rgba(0,0,0,0.02)',
      },
    },
  },
  plugins: [],
}
export default config

