import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

/* Global stylesheet import order matters:
   tokens → typography → animations → responsive utils → base/reset. */
import '@/styles/variables.css';
import '@/styles/typography.css';
import '@/styles/animations.css';
import '@/styles/responsive.css';
import '@/styles/globals.css';

import { App } from './App';

const container = document.getElementById('root');
if (!container) throw new Error('Root element #root not found');

createRoot(container).render(
  <StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>,
);
