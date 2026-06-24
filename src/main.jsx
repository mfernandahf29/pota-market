import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './index.css'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import VendorDetail from './pages/VendorDetail'
import Pedidos from './pages/Pedidos'

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/vendedor/:id" element={<VendorDetail />} />
      <Route path="/pedidos" element={<Pedidos />} />
    </Routes>
  </BrowserRouter>
)
