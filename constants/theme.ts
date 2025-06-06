export const theme = {
  colors: {
    primary: '#8B4513',
    secondary: '#D2691E',
    accent: '#CD853F',
    background: '#F5DEB3',
    surface: '#DEB887',
    text: '#3C2A21',
    textLight: '#8B4513',
    error: '#8B0000',
    success: '#228B22',
    warning: '#DAA520',
    white: '#FFFFFF',
    black: '#000000',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 16,
    xl: 24,
  },
  shadows: {
    small: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    medium: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
  },
  typography: {
    h1: {
      fontSize: 32,
      fontWeight: 'bold',
    },
    h2: {
      fontSize: 24,
      fontWeight: 'bold',
    },
    h3: {
      fontSize: 20,
      fontWeight: 'bold',
    },
    body: {
      fontSize: 16,
    },
    caption: {
      fontSize: 14,
    },
  },
  icons: {
    home: 'anchor',
    destinations: 'map-marker',
    itinerary: 'compass',
    photos: 'camera',
    budget: 'money',
    about: 'ship',
  } as const,
}; 