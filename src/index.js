// // frontend/src/index.js
// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import App from './App';
// import { ThemeProvider } from '@mui/material/styles';
// import CssBaseline from '@mui/material/CssBaseline';
// import theme from './theme';

// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <ThemeProvider theme={theme}>
//     <CssBaseline />
//     <App />
//   </ThemeProvider>
// );


// frontend/src/index.js
// import React from 'react';
// import { createRoot } from 'react-dom/client';
// import App from './App';
// import { ThemeProvider, createTheme } from '@mui/material/styles';
// import CssBaseline from '@mui/material/CssBaseline';

// const darkTheme = createTheme({
//   palette: { mode: 'dark' },
// });

// // createRoot is the new API in React 18+
// const container = document.getElementById('root');
// const root = createRoot(container);
// root.render(
//   <ThemeProvider theme={darkTheme}>
//     <CssBaseline />
//     <App />
//   </ThemeProvider>
// );



import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);