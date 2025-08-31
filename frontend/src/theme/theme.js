import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: { main: '#c5d2c7', contrastText: '#0f1311' },   // sage vaalea
    secondary: { main: '#e3caa5', contrastText: '#0f1311' }, // lämmin hiekka
    error: { main: '#e57373' },
    warning: { main: '#ffb74d' },
    info: { main: '#81d4fa' },
    success: { main: '#a5d6a7' },
    background: { default: '#0f1311', paper: '#161b19' },
    text: { primary: '#e9f0ea', secondary: '#b6c2ba', disabled: '#7f8c86' },
    divider: 'rgba(233,240,234,0.08)',
  },
  typography: {
    fontFamily: 'Inter, Roboto, Arial, sans-serif',
    fontSize: 14,
  },
  components: {
    MuiButton: { styleOverrides: { root: { textTransform: 'none', borderRadius: 10 } } },
    MuiPaper: { styleOverrides: { root: { borderRadius: 14, backdropFilter: 'saturate(120%) blur(2px)' } } },
  },
});

export default theme;
