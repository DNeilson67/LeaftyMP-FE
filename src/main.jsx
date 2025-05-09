import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './style/index.css'
import './style/font.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import axios from 'axios'
import { AuthProvider } from './context/AuthContext.jsx'
import { AuthRegisterProvider } from './context/AuthRegisterContext.jsx'

axios.defaults.withCredentials = true;

ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <AuthRegisterProvider>
      <App />
    </AuthRegisterProvider>
  </AuthProvider>
)
