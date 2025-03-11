import { createTheme } from '@mui/material/styles';

// Define the color palette
const colors = {
  primary: {
    main: '#1976d2',
    light: '#42a5f5',
    dark: '#1565c0',
    contrastText: '#fff',
  },
  secondary: {
    main: '#388e3c',
    light: '#4caf50',
    dark: '#2e7d32',
    contrastText: '#fff',
  },
  error: {
    main: '#d32f2f',
    light: '#ef5350',
    dark: '#c62828',
    contrastText: '#fff',
  },
  warning: {
    main: '#ff9800',
    light: '#ffb74d',
    dark: '#f57c00',
    contrastText: '#fff',
  },
  info: {
    main: '#0288d1',
    light: '#03a9f4',
    dark: '#01579b',
    contrastText: '#fff',
  },
  success: {
    main: '#388e3c',
    light: '#4caf50',
    dark: '#2e7d32',
    contrastText: '#fff',
  },
  background: {
    default: '#f5f5f5',
    paper: '#fff',
  },
  text: {
    primary: '#212121',
    secondary: '#757575',
    disabled: '#9e9e9e',
  },
};

// Create the theme
const AppTheme = createTheme({
  palette: {
    primary: colors.primary,
    secondary: colors.secondary,
    error: colors.error,
    warning: colors.warning,
    info: colors.info,
    success: colors.success,
    background: colors.background,
    text: {
      primary: colors.text.primary,
      secondary: colors.text.secondary,
      disabled: colors.text.disabled,
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 500,
      marginBottom: '1rem',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 500,
      marginBottom: '1rem',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 500,
      marginBottom: '0.75rem',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 500,
      marginBottom: '0.75rem',
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 500,
      marginBottom: '0.5rem',
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 500,
      marginBottom: '0.5rem',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '4px',
          padding: '8px 16px',
          fontWeight: 500,
        },
        contained: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
          },
        },
      },
      defaultProps: {
        disableElevation: true,
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          padding: '12px 16px',
        },
        head: {
          fontWeight: 700,
          backgroundColor: '#f5f5f5',
        },
      },
    },
    MuiTablePagination: {
      defaultProps: {
        labelRowsPerPage: 'Linhas por página:',
        labelDisplayedRows: ({ from, to, count }) =>
          `${from}-${to} de ${count !== -1 ? count : `mais de ${to}`}`,
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '8px',
        },
      },
    },
  },
});

export default AppTheme; 