import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
      <GoogleOAuthProvider clientId="874708372734-1vc6chkretu2t8rmfji6jeffe5hrbpjp.apps.googleusercontent.com">
          <App />
      </GoogleOAuthProvider>
  </StrictMode>,
)
