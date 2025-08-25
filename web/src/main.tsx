import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.tsx'
import './index.css'
import { initializeTestData } from './lib/testData'
import './utils/performance'

// Initialize test data if not already present
if (!localStorage.getItem('cheforg_users')) {
  initializeTestData();
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
) 