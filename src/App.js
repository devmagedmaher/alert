import React from 'react'
import './App.css';
import Router from './router'
import { MantineProvider } from '@mantine/core';
import theme from './theme';

function App() {
  return (
    <React.StrictMode>
      <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
        <Router />
      </MantineProvider>
    </React.StrictMode>
  );
}

export default App;
