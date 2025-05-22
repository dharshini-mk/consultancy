"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBars, faTimes, faUser, faCalendarAlt } from "@fortawesome/free-solid-svg-icons"
import "./Navbar.css"
import logo from "../../assets/images/logo.png"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [location])

  return (
    <nav className={`navbar ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={logo || "/placeholder.svg"} alt="Thenu's Style Studio" className="logo-image" />
          <span className="logo-text">Thenu's Style Studio</span>
        </Link>

        <div className="menu-icon" onClick={() => setIsOpen(!isOpen)}>
          <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
        </div>

        <ul className={isOpen ? "nav-menu active" : "nav-menu"}>
          <li className="nav-item mobile-only">
            <Link to="/appointment" className={location.pathname === "/appointment" ? "nav-links-mobile active" : "nav-links-mobile"}>
              <FontAwesomeIcon icon={faCalendarAlt} className="nav-icon" />
              Book Now
            </Link>
          </li>
          <li className="nav-item mobile-only">
            <Link to="/admin/login" className={location.pathname === "/admin/login" ? "nav-links-mobile active" : "nav-links-mobile"}>
              <FontAwesomeIcon icon={faUser} className="nav-icon" />
              Admin Login
            </Link>
          </li>
        </ul>

        <div className="nav-buttons">
          <Link to="/appointment" className="book-now-btn">
            <FontAwesomeIcon icon={faCalendarAlt} className="btn-icon" />
            <span>Book Now</span>
          </Link>
          <Link to="/admin/login" className="admin-btn">
            <FontAwesomeIcon icon={faUser} className="btn-icon" />
          </Link>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
