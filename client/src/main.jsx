import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';

import './i18n/index.js';
import './styles/index.css';

import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import App from './App.jsx';

// index.html's fallback head tags give way to each page's own <SEO> tags.
document.querySelectorAll('head [data-default]').forEach((el) => el.remove());

// A prerendered snapshot (scripts/prerender.js) serves crawlers and no-JS
// visitors; the app renders from scratch over it, exactly as without one.
const container = document.getElementById('root');
if (container.hasAttribute('data-prerendered')) {
  container.textContent = '';
  container.removeAttribute('data-prerendered');
}

createRoot(container).render(
  <StrictMode>
    <BrowserRouter>
      <HelmetProvider>
        <ThemeProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ThemeProvider>
      </HelmetProvider>
    </BrowserRouter>
  </StrictMode>
);
