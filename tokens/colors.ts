/**
 * Color tokens extracted from Figma design system
 * Based on Naboo design variables
 */
export const colors = {
  // Primary brand color
  primary: {
    DEFAULT: '#D3D676',
    light: '#dde08a',
    lighter: '#f5f6e8',
    20: 'rgba(211,214,118,0.2)',
    22: 'rgba(211,214,118,0.22)',
    23: 'rgba(211,214,118,0.23)',
  },
  
  // Neutral colors
  black: '#212724',
  white: '#ffffff',
  
  // Grey scale
  grey: {
    DEFAULT: '#737876',
    dark: '#8a8a8a',
    light: '#f1f1f1',
    lighter: '#eff1f3',
  },
  
  // Border color
  border: '#e0e0e0',
  
  // Semantic colors
  info: {
    DEFAULT: '#3452bd',
    light: 'rgba(52,82,189,0.1)',
  },
  
  // Background colors
  background: {
    default: '#fdfdfd',
    secondary: '#f9f9f9',
    tertiary: '#f5f5f5',
  },
} as const;

export type ColorKey = keyof typeof colors;



