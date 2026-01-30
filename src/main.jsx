import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

import { BrowserRouter } from 'react-router-dom' // Muhim import

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* Butun ilovani BrowserRouter ichiga olamiz */}
    <BrowserRouter>
      <App />
      
    </BrowserRouter>
  </React.StrictMode>,
)