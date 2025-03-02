import { createTheme } from '@mui/material/styles'

export const authTheme = createTheme({
  palette: {
    primary: {
      main: '#2ab3af', // Teal-like primary color
      light: '#4ecdc4',
      dark: '#1c9b98',
      contrastText: '#ffffff'
    },
    secondary: {
      main: '#ff6b6b',
      light: '#ff8787',
      dark: '#fa5252',
      contrastText: '#ffffff'
    },
    background: {
      default: '#f0f2f5',
      paper: '#ffffff'
    },
    text: {
      primary: '#1f2937',
      secondary: '#6b7280'
    }
  },
  typography: {
    fontFamily: [
      'Inter',
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif'
    ].join(','),
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
    },
    button: {
      textTransform: 'none',
      fontWeight: 600,
    }
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          '& label.Mui-focused': {
            color: '#2ab3af',
          },
          '& .MuiOutlinedInput-root': {
            '&.Mui-focused fieldset': {
              borderColor: '#2ab3af',
            },
            borderRadius: '12px',
          },
        }
      }
    },
    MuiButton: {
      styleOverrides: {
        containedPrimary: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          }
        },
        root: {
          borderRadius: '12px',
          padding: '12px 24px',
        }
      }
    }
  }
})