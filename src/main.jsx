import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter as Router } from 'react-router-dom'

import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from './store'
import { Toaster } from 'react-hot-toast'

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";


import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ThemeProvider } from './context/ThemeContext.jsx'
const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  
    <ThemeProvider>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>          
          <Toaster toastOptions={{ style: { background: 'var(--color-surface-elevated)', color: 'var(--color-text-primary)', border: '1px solid var(--color-border)', borderRadius: '12px', boxShadow: 'var(--shadow-medium)' }, success: { iconTheme: { primary: 'var(--color-success)', secondary: 'var(--color-surface)' } }, error: { iconTheme: { primary: 'var(--color-danger)', secondary: 'var(--color-surface)' } } }} />
        </Router>
      </PersistGate>
    </Provider>
    </ThemeProvider>
  
)
