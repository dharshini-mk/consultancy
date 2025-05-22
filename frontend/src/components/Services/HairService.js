import React from "react"
import { Link } from "react-router-dom"
import "./Services.css"
import h1 from "C:/Users/Admin/CSE_Projects/beauty/frontend/src/assets/images/h1.jpg";
import h2 from "C:/Users/Admin/CSE_Projects/beauty/frontend/src/assets/images/h2.jpeg";
import h3 from "C:/Users/Admin/CSE_Projects/beauty/frontend/src/assets/images/h3.jpg";
import h4 from "C:/Users/Admin/CSE_Projects/beauty/frontend/src/assets/images/h4.jpg";
import h5 from "C:/Users/Admin/CSE_Projects/beauty/frontend/src/assets/images/h5.jpeg";
import h6 from "C:/Users/Admin/CSE_Projects/beauty/frontend/src/assets/images/h6.jpg";

const HairService = () => {
  const hairServices = [
    {
      id: 1,
      name: "Haircut & Styling",
      description: "Professional haircut and styling tailored to your face shape and preferences.",
      price: "₹500 - ₹1500",
      duration: "45-60 min",
      image: h1,
    },
    {
      id: 2,
      name: "Hair Coloring",
      description: "Full hair coloring with premium products for vibrant, long-lasting results.",
      price: "₹1500 - ₹4000",
      duration: "90-120 min",
      image: h2,
    },
    {
      id: 3,
      name: "Highlights & Lowlights",
      description: "Add dimension to your hair with expertly placed highlights and lowlights.",
      price: "₹2000 - ₹5000",
      duration: "120-180 min",
      image: h3,
    },
    {
      id: 4,
      name: "Hair Treatments",
      description: "Nourishing treatments to repair damaged hair and restore shine and health.",
      price: "₹1000 - ₹3000",
      duration: "45-60 min",
      image: h4,
    },
    {
      id: 5,
      name: "Hair Extensions",
      description: "Quality hair extensions for added length and volume.",
      price: "₹5000 - ₹15000",
      duration: "180-240 min",
      image: h5,
    },
    {
      id: 6,
      name: "Keratin Treatment",
      description: "Smoothing keratin treatment to eliminate frizz and add shine.",
      price: "₹4000 - ₹8000",
      duration: "120-180 min",
      image: h6,
    },
  ]

  return (
    <div className="service-page">
      <div className="service-hero hair">
        <div className="service-hero-content">
          <h1>Hair Services</h1>
          <p>Transform your look with our professional hair services</p>
        </div>
      </div>

      <div className="service-intro">
        <h2>Our Hair Services</h2>
        <p>
          Our skilled stylists are trained in the latest techniques and use premium products to ensure you leave our
          salon looking and feeling your best. From trendy cuts to vibrant colors, we offer a wide range of hair
          services to meet your needs.
        </p>
      </div>

      <div className="service-list">
        {hairServices.map((service) => (
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
        <h2>Ready to transform your hair?</h2>
        <p>Book an appointment today and let our experts take care of you.</p>
        <Link to="/appointment" className="book-service-btn">
          Book Hair Service
        </Link>
      </div>
    </div>
  )
}

export default HairService
