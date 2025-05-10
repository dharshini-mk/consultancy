"use client"
import { motion } from "framer-motion"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faStar, faQuoteLeft } from "@fortawesome/free-solid-svg-icons"
import "./TestimonialCard.css"

const TestimonialCard = ({ testimonial }) => {
  return (
    <motion.div
      className="testimonial-card"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
    >
      <div className="quote-icon">
        <FontAwesomeIcon icon={faQuoteLeft} />
      </div>
      <div className="testimonial-content">
        <p>{testimonial.content}</p>
      </div>
      <div className="testimonial-rating">
        {[...Array(5)].map((_, i) => (
          <FontAwesomeIcon key={i} icon={faStar} className={i < testimonial.rating ? "star active" : "star"} />
        ))}
      </div>
      <div className="testimonial-author">
        <div className="author-image">
          <img src={testimonial.image || "/placeholder.svg"} alt={testimonial.name} />
        </div>
        <div className="author-info">
          <h4>{testimonial.name}</h4>
          <p>{testimonial.role}</p>
        </div>
      </div>
    </motion.div>
  )
}

export default TestimonialCard
