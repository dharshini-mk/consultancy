"use client"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import "./ServiceCard.css"

const ServiceCard = ({ service }) => {
  return (
    <motion.div className="service-card" whileHover={{ y: -10 }} transition={{ duration: 0.3 }}>
      <div className="service-image">
        <img src={service.image || "/placeholder.svg"} alt={service.title} />
        <div className="service-overlay">
          <FontAwesomeIcon icon={service.icon} className="service-icon" />
        </div>
      </div>
      <div className="service-content">
        <h3>{service.title}</h3>
        <p>{service.description}</p>
        <Link to={service.link} className="service-link">
          Learn More
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14"></path>
            <path d="M12 5l7 7-7 7"></path>
          </svg>
        </Link>
      </div>
    </motion.div>
  )
}

export default ServiceCard
