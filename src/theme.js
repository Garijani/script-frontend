// frontend/src/theme.js
import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: { main: '#0366d6' }, // Accent blue inspired by Click-Up
    background: {
      default: '#f5f7fa', // Light background
      paper: '#ffffff'
    },
    text: { primary: '#24292e' }
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif'
  },
  shape: {
    borderRadius: 8 // Rounded corners
  }
});

export default theme;
