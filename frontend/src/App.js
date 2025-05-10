"use client"

import { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { ToastContainer } from "react-toastify"
import axios from "axios"
import HomePage from "./components/HomePage"
import Appointment from "./components/Appointment/Appointment"
import AdminPanel from "./components/AdminPanel"
import AuthPage from "./components/AuthPage"
import ProtectedRoute from "./components/ProtectedRoute"
import HairService from "./components/Services/HairService"
import SkinService from "./components/Services/SkinService"
import BridalService from "./components/Services/BridalService"
import NailService from "./components/Services/NailService"
import AboutUs from "./components/About/AboutUs"
import AppointmentConfirmation from "./components/Appointment/AppointmentConfirmation"
import "react-toastify/dist/ReactToastify.css"
import "./App.css"

function App() {
  const [token, setToken] = useState(localStorage.getItem("adminToken"))

  // Set default base URL for axios
  useEffect(() => {
    axios.defaults.baseURL = process.env.REACT_APP_API_URL || "http://localhost:5000"
  }, [])

  return (
    <BrowserRouter>
      <div className="app">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/appointment" element={<Appointment />} />
          <Route path="/confirmation/:id" element={<AppointmentConfirmation />} />
          <Route path="/services/hair" element={<HairService />} />
          <Route path="/services/skin" element={<SkinService />} />
          <Route path="/services/bridal" element={<BridalService />} />
          <Route path="/services/nails" element={<NailService />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/admin/login" element={<AuthPage token={token} setToken={setToken} />} />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute token={token}>
                <AdminPanel token={token} setToken={setToken} />
              </ProtectedRoute>
            }
          />
        </Routes>
        <ToastContainer />
      </div>
    </BrowserRouter>
  )
}

export default App
