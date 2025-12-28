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
const queryClient = new QueryClient()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <QueryClientProvider client={queryClient}>
            <App />
          </QueryClientProvider>          
          <Toaster />
        </Router>
      </PersistGate>
    </Provider>
  </StrictMode>,
)
