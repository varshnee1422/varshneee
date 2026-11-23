import { createTheme } from '@mui/material/styles';

export const academyTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#7A283B',
      dark: '#5C1C2B',
      light: '#9E4458',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#9A7B4F',
      dark: '#7A5F38',
      light: '#B99C72',
      contrastText: '#FFFFFF',
    },
    background: {
      default: '#FAF8F5',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#1C1917',
      secondary: '#57534E',
    },
    divider: '#E7E2DA',
  },
  shape: {
    borderRadius: 10,
  },
  typography: {
    fontFamily: '"Plus Jakarta Sans", -apple-system, BlinkMacSystemFont, sans-serif',
    h1: {
      fontFamily: '"Cormorant Garamond", Georgia, serif',
      fontWeight: 600,
      letterSpacing: '-0.02em',
      lineHeight: 1.06,
    },
    h2: {
      fontFamily: '"Cormorant Garamond", Georgia, serif',
      fontWeight: 600,
      letterSpacing: '-0.015em',
      lineHeight: 1.12,
    },
    h3: {
      fontFamily: '"Cormorant Garamond", Georgia, serif',
      fontWeight: 600,
      letterSpacing: '-0.01em',
      lineHeight: 1.2,
    },
    h4: {
      fontFamily: '"Cormorant Garamond", Georgia, serif',
      fontWeight: 600,
      lineHeight: 1.25,
    },
    h5: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 600,
    },
    h6: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 600,
    },
    button: {
      fontFamily: '"Plus Jakarta Sans", sans-serif',
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.01em',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          paddingLeft: 20,
          paddingRight: 20,
          paddingTop: 10,
          paddingBottom: 10,
          whiteSpace: 'nowrap',
          boxShadow: 'none',
          transition: 'all 180ms cubic-bezier(0.16, 1, 0.3, 1)',
          '&:hover': {
            boxShadow: 'none',
          },
          '&:focus-visible': {
            outline: '2px solid #7A283B',
            outlineOffset: '2px',
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
        },
        outlined: {
          borderColor: '#E7E2DA',
        },
      },
    },
    MuiCard: {
      defaultProps: {
        variant: 'outlined',
      },
      styleOverrides: {
        root: {
          borderColor: '#E7E2DA',
          backgroundColor: '#FFFFFF',
          boxShadow: 'none',
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          fontSize: '0.9rem',
          whiteSpace: 'nowrap',
          minHeight: 44,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: '#F3EFE9',
          color: '#1C1917',
          fontWeight: 600,
          borderBottomColor: '#E7E2DA',
        },
        body: {
          borderBottomColor: '#E7E2DA',
        },
      },
    },
  },
});
