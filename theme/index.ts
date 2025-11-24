import { Dimensions } from 'react-native';

// Breakpoints for responsive design
export const breakpoints = {
  mobile: 600,
  tablet: 1000,
};

// Get current screen type
export const getScreenType = () => {
  const width = Dimensions.get('window').width;
  if (width < breakpoints.mobile) return 'mobile';
  if (width < breakpoints.tablet) return 'tablet';
  return 'desktop';
};

// Base theme structure
export interface Theme {
  colors: {
    primary: string;
    primaryDark: string;
    primaryLight: string;
    secondary: string;
    secondaryDark: string;
    secondaryLight: string;
    success: string;
    warning: string;
    error: string;
    info: string;
    background: string;
    surface: string;
    card: string;
    text: string;
    textSecondary: string;
    textDisabled: string;
    border: string;
    divider: string;
    disabled: string;
    backdrop: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
  };
  radius: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    full: number;
  };
  fontSize: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
    xxl: number;
    xxxl: number;
  };
  fontWeight: {
    light: '300';
    regular: '400';
    medium: '500';
    semibold: '600';
    bold: '700';
  };
  shadows: {
    sm: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
    md: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
    lg: {
      shadowColor: string;
      shadowOffset: { width: number; height: number };
      shadowOpacity: number;
      shadowRadius: number;
      elevation: number;
    };
  };
  breakpoints: typeof breakpoints;
}

// Light theme
export const lightTheme: Theme = {
  colors: {
    primary: '#0a7ea4',
    primaryDark: '#085a78',
    primaryLight: '#3d9fc0',
    secondary: '#6366f1',
    secondaryDark: '#4f46e5',
    secondaryLight: '#818cf8',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    background: '#ffffff',
    surface: '#f9fafb',
    card: '#ffffff',
    text: '#11181C',
    textSecondary: '#687076',
    textDisabled: '#9ca3af',
    border: '#e5e7eb',
    divider: '#e5e7eb',
    disabled: '#f3f4f6',
    backdrop: 'rgba(0, 0, 0, 0.5)',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  radius: {
    xs: 2,
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    full: 9999,
  },
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
  },
  fontWeight: {
    light: '300',
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 8,
    },
  },
  breakpoints,
};

// Dark theme
export const darkTheme: Theme = {
  ...lightTheme,
  colors: {
    primary: '#3d9fc0',
    primaryDark: '#0a7ea4',
    primaryLight: '#60b4d0',
    secondary: '#818cf8',
    secondaryDark: '#6366f1',
    secondaryLight: '#a5b4fc',
    success: '#34d399',
    warning: '#fbbf24',
    error: '#f87171',
    info: '#60a5fa',
    background: '#151718',
    surface: '#1f2937',
    card: '#1f2937',
    text: '#ECEDEE',
    textSecondary: '#9BA1A6',
    textDisabled: '#6b7280',
    border: '#374151',
    divider: '#374151',
    disabled: '#1f2937',
    backdrop: 'rgba(0, 0, 0, 0.7)',
  },
};

// Default export
export default {
  light: lightTheme,
  dark: darkTheme,
};
