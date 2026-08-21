import '@fontsource-variable/montserrat'
import './styles/globals.css'

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'

import { QueryProvider } from '@/lib/tanstack'
import { AuthProvider } from '@/lib/auth'

import App from './App'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <QueryProvider>
          <Toaster />
          <App />
        </QueryProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>,
)
