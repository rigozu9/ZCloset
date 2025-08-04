import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'dark',

    // 🌿 Pääväri: luonnollinen, tummanvihreä
    primary: {
      main: '#056125', // vihreä (pääväri)
      contrastText: '#ffffff', // valkoinen teksti napissa
    },

    // 💡 Korostusväri: hillitty kirkas lime-vihreä
    secondary: {
      main: '#a8ff60', // kirkas limevihreä korostuksiin
      contrastText: '#000000',
    },

    // 🔴 Varoitukset, onnistumiset ja virheet
    error: {
      main: '#ff5252',
    },
    warning: {
      main: '#ffb74d',
    },
    info: {
      main: '#4fc3f7',
    },
    success: {
      main: '#69f0ae',
    },

    // 🧱 Taustat
    background: {
      default: '#0f0f0f', // lähes musta päätausta
      paper: '#1c1c1c',   // komponenttien tausta (kortit, lomakkeet)
    },

    // 📝 Tekstit
    text: {
      primary: '#ffffff',
      secondary: '#b0b0b0',
      disabled: '#777777',
    },
  },

  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
    fontSize: 14,
  },

  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: '8px',
        },
      },
    },
  },
});

export default theme;
