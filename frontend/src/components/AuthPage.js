"use client"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import AdminLogin from "./AdminLogin"

const AuthPage = ({ token, setToken }) => {
  const navigate = useNavigate()

  // If already logged in, redirect to dashboard
  useEffect(() => {
    if (token) {
      navigate("/admin/dashboard")
    }
  }, [token, navigate])

  return (
    <div className="auth-page">
      <AdminLogin setToken={setToken} />
    </div>
  )
}

export default AuthPage
