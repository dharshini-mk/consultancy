import React from "react"
import { Link } from "react-router-dom"
import "./Services.css"
import s1 from "C:/Users/Admin/CSE_Projects/beauty/frontend/src/assets/images/s1.jpg";
import s2 from "C:/Users/Admin/CSE_Projects/beauty/frontend/src/assets/images/s2.jpg";
import s3 from "C:/Users/Admin/CSE_Projects/beauty/frontend/src/assets/images/s3.jpg";
import s4 from "C:/Users/Admin/CSE_Projects/beauty/frontend/src/assets/images/s4.webp";
import s5 from "C:/Users/Admin/CSE_Projects/beauty/frontend/src/assets/images/s5.jpg";
import s6 from "C:/Users/Admin/CSE_Projects/beauty/frontend/src/assets/images/s6.jpg";

const SkinService = () => {
  const skinServices = [
    {
      id: 1,
      name: "Classic Facial",
      description: "Deep cleansing facial to remove impurities and rejuvenate your skin.",
      price: "₹800 - ₹1500",
      duration: "45-60 min",
      image: s1,
    },
    {
      id: 2,
      name: "Anti-Aging Treatment",
      description: "Specialized treatment to reduce fine lines and wrinkles for youthful skin.",
      price: "₹2000 - ₹4000",
      duration: "60-90 min",
      image: s2,
    },
    {
      id: 3,
      name: "Hydrating Facial",
      description: "Intense hydration for dry and dehydrated skin types.",
      price: "₹1200 - ₹2500",
      duration: "60 min",
      image: s3,
    },
    {
      id: 4,
      name: "Acne Treatment",
      description: "Targeted treatment for acne-prone skin to reduce breakouts and inflammation.",
      price: "₹1500 - ₹3000",
      duration: "60-75 min",
      image: s4,
    },
    {
      id: 5,
      name: "Skin Brightening",
      description: "Treatment to reduce pigmentation and even out skin tone for a radiant complexion.",
      price: "₹1800 - ₹3500",
      duration: "75-90 min",
      image: s5,
    },
    {
      id: 6,
      name: "Body Polishing",
      description: "Full body exfoliation and moisturizing treatment for smooth, glowing skin.",
      price: "₹3000 - ₹6000",
      duration: "90-120 min",
      image: s6,
    },
  ]

  return (
    <div className="service-page">
      <div className="service-hero skin">
        <div className="service-hero-content">
          <h1>Skin Services</h1>
          <p>Reveal your natural radiance with our professional skin treatments</p>
        </div>
      </div>

      <div className="service-intro">
        <h2>Our Skin Services</h2>
        <p>
          Our expert estheticians use advanced techniques and high-quality products to address your specific skin
          concerns. From deep cleansing facials to specialized treatments, we're committed to helping you achieve
          healthy, glowing skin.
        </p>
      </div>

      <div className="service-list">
        {skinServices.map((service) => (
          <div className="service-card" key={service.id}>
            <div className="service-image">
              <img src={service.image || "/placeholder.svg"} alt={service.name} />
            </div>
            <div className="service-details">
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <div className="service-meta">
                <span className="service-price">{service.price}</span>
                <span className="service-duration">{service.duration}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="service-cta">
        <h2>Ready for radiant skin?</h2>
        <p>Book an appointment today and let our experts take care of your skin.</p>
        <Link to="/appointment" className="book-service-btn">
          Book Skin Service
        </Link>
      </div>
    </div>
  )
}

export default SkinService
