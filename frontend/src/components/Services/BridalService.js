import { Link } from "react-router-dom"
import "./Services.css"

const BridalService = () => {
  const bridalServices = [
    {
      id: 1,
      name: "Bridal Makeup",
      description: "Complete bridal makeup using premium products for your special day.",
      price: "₹8000 - ₹15000",
      duration: "90-120 min",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 2,
      name: "Bridal Hair Styling",
      description: "Elegant and intricate hairstyling to complement your bridal look.",
      price: "₹4000 - ₹8000",
      duration: "60-90 min",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 3,
      name: "Pre-Bridal Package",
      description: "Comprehensive beauty treatments in the weeks leading up to your wedding.",
      price: "₹15000 - ₹30000",
      duration: "Multiple sessions",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 4,
      name: "Engagement Makeup",
      description: "Stunning makeup for your engagement ceremony or pre-wedding photoshoot.",
      price: "₹5000 - ₹10000",
      duration: "60-90 min",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 5,
      name: "Family Makeup Package",
      description: "Makeup services for the bride's family members and bridesmaids.",
      price: "₹3000 - ₹5000 per person",
      duration: "45-60 min per person",
      image: "/placeholder.svg?height=200&width=300",
    },
    {
      id: 6,
      name: "Destination Wedding Package",
      description: "Complete beauty services for destination weddings including travel.",
      price: "₹50000 - ₹100000",
      duration: "Custom",
      image: "/placeholder.svg?height=200&width=300",
    },
  ]

  return (
    <div className="service-page">
      <div className="service-hero bridal">
        <div className="service-hero-content">
          <h1>Bridal Services</h1>
          <p>Look stunning on your special day with our premium bridal services</p>
        </div>
      </div>

      <div className="service-intro">
        <h2>Our Bridal Services</h2>
        <p>
          Your wedding day is one of the most important days of your life, and we're here to make sure you look and feel
          your absolute best. Our bridal services are designed to create a flawless, long-lasting look that captures
          your unique style and personality.
        </p>
      </div>

      <div className="service-list">
        {bridalServices.map((service) => (
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
        <h2>Planning your wedding?</h2>
        <p>Book a consultation today to discuss your bridal beauty needs.</p>
        <Link to="/appointment" className="book-service-btn">
          Book Bridal Consultation
        </Link>
      </div>
    </div>
  )
}

export default BridalService
