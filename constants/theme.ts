import { Platform } from 'react-native';

export const Colors = {
  light: {
    primary: '#4A3728',
    secondary: '#C2A878',
    tertiary: '#8B9D83',
    neutral: '#F9F7F2',
    text: '#4A3728',
    background: '#F9F7F2',
    tint: '#4A3728',
    icon: '#8B9D83',
    tabIconDefault: '#C2A878',
    tabIconSelected: '#4A3728',
  },
  dark: {
    primary: '#D9C5B2',
    secondary: '#8C6A5D',
    tertiary: '#402E2A',
    neutral: '#12100E',
    text: '#F9F7F2',
    background: '#12100E',
    tint: '#D9C5B2',
    icon: '#8C6A5D',
    tabIconDefault: '#8C6A5D',
    tabIconSelected: '#D9C5B2',
  },
};

export const Fonts = Platform.select({
  ios: {
    headline: 'EB Garamond',
    body: 'Manrope',
    label: 'Manrope',
  },
  default: {
    headline: 'EB Garamond',
    body: 'Manrope',
    label: 'Manrope',
  },
  web: {
    headline: "'EB Garamond', Georgia, serif",
    body: "'Manrope', system-ui, sans-serif",
    label: "'Manrope', system-ui, sans-serif",
  },
});
