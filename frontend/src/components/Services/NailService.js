import { Link } from "react-router-dom"
import "./Services.css"

const NailService = () => {
  const nailServices = [
    {
      id: 1,
      name: "Classic Manicure",
      description: "Basic nail care including shaping, cuticle care, and polish application.",
      price: "₹500 - ₹800",
      duration: "30-45 min",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 2,
      name: "Spa Pedicure",
      description: "Luxurious foot treatment with exfoliation, massage, and polish.",
      price: "₹800 - ₹1200",
      duration: "45-60 min",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 3,
      name: "Gel Nails",
      description: "Long-lasting gel polish application for chip-free, glossy nails.",
      price: "₹1200 - ₹1800",
      duration: "45-60 min",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 4,
      name: "Nail Extensions",
      description: "Acrylic or gel extensions to add length and strength to natural nails.",
      price: "₹2000 - ₹3500",
      duration: "90-120 min",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 5,
      name: "Nail Art",
      description: "Creative designs and embellishments to personalize your manicure.",
      price: "₹500 - ₹1500 (additional)",
      duration: "15-45 min (additional)",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 6,
      name: "Mani-Pedi Combo",
      description: "Complete hand and foot care package with polish application.",
      price: "₹1200 - ₹2000",
      duration: "75-90 min",
      image: "/placeholder.svg?height=200&width=300",
    },
  ]

  return (
    <div className="service-page">
      <div className="service-hero nails">
        <div className="service-hero-content">
          <h1>Nail Services</h1>
          <p>Pamper your hands and feet with our professional nail care services</p>
        </div>
      </div>

      <div className="service-intro">
        <h2>Our Nail Services</h2>
        <p>
          From basic manicures to elaborate nail art, our nail technicians are skilled in a variety of techniques to
          keep your nails looking their best. We use quality products and maintain the highest hygiene standards for
          your safety and satisfaction.
        </p>
      </div>

      <div className="service-list">
        {nailServices.map((service) => (
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
        <h2>Ready for beautiful nails?</h2>
        <p>Book an appointment today and let our experts take care of your nails.</p>
        <Link to="/appointment" className="book-service-btn">
          Book Nail Service
        </Link>
      </div>
    </div>
  )
}

export default NailService
