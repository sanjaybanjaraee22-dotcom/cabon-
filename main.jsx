import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Signup from './components/Signup'
import Login from './components/Login'
import App from './App'
import AdminPanel from './components/AdminPanel'
import LiveProject from './components/LiveProject'
import AdminLogin from './components/AdminLogin'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<App />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin" element={<AdminPanel />} />
        <Route path="/liveproject" element={<LiveProject />} />
      </Routes>
      <footer className="text-center text-white mt-10 text-sm">
        <p className="opacity-80">
          Inter-disciplinary Project created by <span className="font-semibold">TEAM - 54</span> 
        </p>
      </footer>
    </BrowserRouter>
  </React.StrictMode>
)