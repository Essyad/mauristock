import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  direction: 'rtl',
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#dc004e',
      light: '#ff4081',
      dark: '#c51162',
    },
    white: {
      main: '#ffffff',
      contrastText: '#000000',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    gradients: {
      primary: {
        main: '#1976d2',
        state: '#064795',
      },
      secondary: {
        main: '#dc004e',
        state: '#9c0046',
      },
      info: {
        main: '#0288d1',
        state: '#01579b',
      },
      success: {
        main: '#2e7d32',
        state: '#1b5e20',
      },
      warning: {
        main: '#ed6c02',
        state: '#e65100',
      },
      error: {
        main: '#d32f2f',
        state: '#c62828',
      },
      light: {
        main: '#f5f5f5',
        state: '#eceff1',
      },
      dark: {
        main: '#212121',
        state: '#0a0a0a',
      },
    },
  },
  functions: {
    rgba: (color, opacity) => {
      return `rgba(${color}, ${opacity})`;
    },
    linearGradient: (color1, color2) => {
      return `linear-gradient(195deg, ${color1}, ${color2})`;
    },
  },
  typography: {
    fontFamily: [
      'Roboto',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Arial',
      'sans-serif',
    ].join(','),
    h1: {
      fontSize: '3rem',
      fontWeight: 700,
      lineHeight: 1.2,
    },
    h2: {
      fontSize: '2.25rem',
      fontWeight: 600,
      lineHeight: 1.3,
    },
    h3: {
      fontSize: '1.875rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.5,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.43,
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '10px',
          boxShadow: '0 8px 40px -12px rgba(0,0,0,0.3)',
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            transform: 'translateY(-5px)',
            boxShadow: '0 16px 70px -12.125px rgba(0,0,0,0.3)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '5px',
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'none',
          },
        },
      },
    },
  },
});

export default theme; 