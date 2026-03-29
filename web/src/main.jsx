import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { DoctorProvider } from './contexts/DoctorContext';
import { SessionProvider } from './contexts/SessionContext';
import { ThemeProvider } from './contexts/ThemeContext';
import './index.css';
import App from './App.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <DoctorProvider>
        <SessionProvider>
          <ThemeProvider>
            <App />
          </ThemeProvider>
        </SessionProvider>
      </DoctorProvider>
    </BrowserRouter>
  </StrictMode>,
);
