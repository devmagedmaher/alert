import React from 'react'
import './App.css';
import Router from './router'
import { MantineProvider } from '@mantine/core';

function App() {
  return (
    <React.StrictMode>
      <MantineProvider withGlobalStyles withNormalizeCSS>
        <Router />
      </MantineProvider>
    </React.StrictMode>
  );
}

export default App;
