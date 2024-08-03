import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// Create a root for React to render the App component into
ReactDOM.createRoot(document.getElementById('root')).render(
    // Wrap the App component in React.StrictMode to highlight potential problems
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
