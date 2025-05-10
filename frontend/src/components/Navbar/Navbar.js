"use client"

import { useState, useEffect } from "react"
import { Link, useLocation } from "react-router-dom"
import { motion, AnimatePresence } from "framer-motion"
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
      if (window.scrollY > 50) {
        setScrolled(true)
      } else {
        setScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false)
  }, [location])

  const navVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
      },
    },
  }

  const menuVariants = {
    closed: {
      opacity: 0,
      x: "100%",
      transition: {
        duration: 0.5,
        ease: "easeInOut",
        staggerChildren: 0.1,
        staggerDirection: -1,
      },
    },
    open: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.5,
        ease: "easeInOut",
        staggerChildren: 0.1,
        delayChildren: 0.2,
      },
    },
  }

  const itemVariants = {
    closed: { opacity: 0, x: 20 },
    open: { opacity: 1, x: 0 },
  }

  return (
    <motion.nav
      className={`navbar ${scrolled ? "scrolled" : ""}`}
      initial="hidden"
      animate="visible"
      variants={navVariants}
    >
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={logo || "/placeholder.svg"} alt="Thenu's Makeover" className="logo-image" />
          <span className="logo-text">Thenu's</span>
        </Link>

        <div className="menu-icon" onClick={() => setIsOpen(!isOpen)}>
          <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
        </div>

        <AnimatePresence>
          <motion.ul
            className={isOpen ? "nav-menu active" : "nav-menu"}
            initial="closed"
            animate={isOpen ? "open" : "closed"}
            variants={menuVariants}
          >
            <motion.li className="nav-item" variants={itemVariants}>
              <Link to="/" className={location.pathname === "/" ? "nav-links active" : "nav-links"}>
                Home
              </Link>
            </motion.li>
            <motion.li className="nav-item" variants={itemVariants}>
              <Link
                to="/services/hair"
                className={location.pathname === "/services/hair" ? "nav-links active" : "nav-links"}
              >
                Hair
              </Link>
            </motion.li>
            <motion.li className="nav-item" variants={itemVariants}>
              <Link
                to="/services/skin"
                className={location.pathname === "/services/skin" ? "nav-links active" : "nav-links"}
              >
                Skin
              </Link>
            </motion.li>
            <motion.li className="nav-item" variants={itemVariants}>
              <Link
                to="/services/bridal"
                className={location.pathname === "/services/bridal" ? "nav-links active" : "nav-links"}
              >
                Bridal
              </Link>
            </motion.li>
            <motion.li className="nav-item" variants={itemVariants}>
              <Link
                to="/services/nails"
                className={location.pathname === "/services/nails" ? "nav-links active" : "nav-links"}
              >
                Nails
              </Link>
            </motion.li>
            <motion.li className="nav-item" variants={itemVariants}>
              <Link to="/about" className={location.pathname === "/about" ? "nav-links active" : "nav-links"}>
                About Us
              </Link>
            </motion.li>
            <motion.li className="nav-item mobile-only" variants={itemVariants}>
              <Link
                to="/appointment"
                className={location.pathname === "/appointment" ? "nav-links-mobile active" : "nav-links-mobile"}
              >
                <FontAwesomeIcon icon={faCalendarAlt} className="nav-icon" />
                Book Now
              </Link>
            </motion.li>
            <motion.li className="nav-item mobile-only" variants={itemVariants}>
              <Link
                to="/admin/login"
                className={location.pathname === "/admin/login" ? "nav-links-mobile active" : "nav-links-mobile"}
              >
                <FontAwesomeIcon icon={faUser} className="nav-icon" />
                Admin Login
              </Link>
            </motion.li>
          </motion.ul>
        </AnimatePresence>

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
    </motion.nav>
  )
}

export default Navbar
