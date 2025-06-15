import { createTheme, ThemeOptions } from '@mui/material/styles'

declare module '@mui/material/styles' {
  interface Palette {
    custom: {
      lightBlue: string
      inputBorder: string
      inputShadow: string
    }
  }
  interface PaletteOptions {
    custom?: {
      lightBlue: string
      inputBorder: string
      inputShadow: string
    }
  }
}

export const appTheme = createTheme({
  palette: {
    primary: {
      main: '#09498a',
      light: '#edf2f7',
      dark: '#122f46',
      contrastText: '#f7fafc',
    },
    secondary: {
      main: '#718096',
      light: '#cfd9e0',
      dark: '#4a5568',
      contrastText: '#ffffff',
    },
    error: {
      main: '#e53e3e',
    },
    background: {
      default: '#f7fafc',
      paper: '#f7fafc',
    },
    text: {
      primary: '#171923',
      secondary: '#718096',
    },
    divider: '#cbd5e0',
    custom: {
      lightBlue: '#ffffffb0',
      inputBorder: '#cbd5e0',
      inputShadow: '#e7ebee33',
    },
  },
  typography: {
    fontFamily: "'Poppins', 'Outfit', 'Inter', 'Helvetica', sans-serif",
    h1: {
      fontFamily: "'Outfit-SemiBold', Helvetica",
      fontSize: '40px',
      fontWeight: 600,
      lineHeight: '40px',
    },
    h2: {
      fontFamily: "'Poppins-SemiBold', Helvetica",
      fontSize: '29px',
      fontWeight: 600,
      lineHeight: '29px',
    },
    h3: {
      fontFamily: "'Outfit-SemiBold', Helvetica",
      fontSize: '21px',
      fontWeight: 600,
      lineHeight: '31.5px',
    },
    body1: {
      fontFamily: "'Poppins-Regular', Helvetica",
      fontSize: '16px',
      fontWeight: 400,
      lineHeight: '27px',
    },
    body2: {
      fontFamily: "'Outfit-Regular', Helvetica",
      fontSize: '20px',
      fontWeight: 400,
      lineHeight: '27.7px',
    },
    subtitle1: {
      fontFamily: "'Poppins-Medium', Helvetica",
      fontSize: '16px',
      fontWeight: 500,
      lineHeight: '20px',
      letterSpacing: '-0.15px',
    },
    button: {
      fontFamily: "'Poppins-SemiBold', Helvetica",
      fontSize: '20px',
      fontWeight: 600,
      lineHeight: '28px',
      textTransform: 'none',
    },
    caption: {
      fontFamily: "'Outfit-Light', Helvetica",
      fontSize: '21px',
      fontWeight: 300,
      lineHeight: '31.5px',
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: '#f7fafc',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 0,
          padding: '16px 24px',
          height: '60px',
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: ({ theme }) => ({
          backgroundColor: theme.palette.background.default,
          borderRadius: '12px',
          border: `1px solid ${theme.palette.divider}`,
          boxShadow: 'inset 0px 2px 0px rgba(231, 235, 238, 0.2)',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.divider,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.main,
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: theme.palette.primary.main,
          },
          height: '55px',
        }),
        input: {
          padding: '7px 25px',
          fontFamily: "'Poppins-Regular', Helvetica",
          fontSize: '16px',
          color: '#4a5568',
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: ({ theme }) => ({
          fontFamily: "'Poppins-Medium', Helvetica",
          fontSize: '16px',
          color: theme.palette.secondary.main,
          letterSpacing: '-0.15px',
        }),
      },
    },
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: '#718096',
        },
      },
    },
    MuiFormControlLabel: {
      styleOverrides: {
        label: {
          fontFamily: "'Poppins-Regular', Helvetica",
          fontSize: '16px',
          color: '#718096',
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          fontFamily: "'Inter-Medium', Helvetica",
          fontSize: '16px',
          fontWeight: 500,
          color: '#09498a',
          textDecoration: 'underline',
          cursor: 'pointer',
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: ({ theme }) => ({
          ...theme.typography.body1,
        }),
        head: ({ theme }) => ({
          ...theme.typography.subtitle1,
        }),
        body: ({ theme }) => ({
          ...theme.typography.body1,
        }),
      },
    },
    MuiListItemText: {
      styleOverrides: {
        primary: ({ theme }) => ({
          ...theme.typography.subtitle1,
        }),
        secondary: ({ theme }) => ({
          ...theme.typography.body1,
        }),
      },
    },
  },
} as ThemeOptions)
