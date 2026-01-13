/**
 * Typography tokens extracted from Figma design system
 */
export const typography = {
  fontFamily: {
    sans: ['TWK Lausanne', 'system-ui', 'sans-serif'],
    display: ['TT Hoves Pro Trial Variable', 'system-ui', 'sans-serif'],
    mono: ['Roboto', 'monospace'],
  },
  
  fontSize: {
    xxs: '10px',
    xs: '12px',
    sm: '14px',
    base: '15px',
    lg: '18px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '28px',
    '4xl': '44px',
    '5xl': '58px',
  },
  
  fontWeight: {
    normal: 400,
    medium: 400,
    semibold: 400,
  },
  
  lineHeight: {
    tight: 1.2,
    normal: 1.4,
    relaxed: 1.5,
  },
  
  letterSpacing: {
    tighter: '-0.48px',
    tight: '-0.36px',
    normal: '-0.3px',
    wide: '-0.28px',
    wider: '-0.15px',
  },
} as const;



