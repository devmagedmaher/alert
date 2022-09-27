import React from 'react'
import './App.css';
import Router from './router'
import { MantineProvider } from '@mantine/core';

function App() {
  return (
    <React.StrictMode>
      <MantineProvider theme={{ colorScheme: 'dark' }} withGlobalStyles withNormalizeCSS>
        <Router />
      </MantineProvider>
    </React.StrictMode>
  );
}

export default App;
