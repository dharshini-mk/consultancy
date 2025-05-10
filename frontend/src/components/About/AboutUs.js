import React from "react"
import { Link } from "react-router-dom"
import "./AboutUs.css"

const AboutUs = () => {
  const teamMembers = [
    {
      id: 1,
      name: "Priya Sharma",
      role: "Founder & Master Stylist",
      bio: "With over 15 years of experience in the beauty industry, Priya founded our salon with a vision to provide exceptional beauty services in a welcoming environment.",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      id: 2,
      name: "Rahul Verma",
      role: "Senior Hair Stylist",
      bio: "Rahul specializes in creative cuts and coloring techniques, having trained with top stylists in Mumbai and London.",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      id: 3,
      name: "Anjali Patel",
      role: "Makeup Artist",
      bio: "Anjali is our bridal makeup expert with a talent for creating flawless, long-lasting looks for any occasion.",
      image: "/placeholder.svg?height=300&width=300",
    },
    {
      id: 4,
      name: "Deepak Singh",
      role: "Skin Specialist",
      bio: "Deepak is certified in advanced skincare treatments and helps clients achieve their best skin ever.",
      image: "/placeholder.svg?height=300&width=300",
    },
  ]

  return (
    <div className="about-page">
      <div className="about-hero">
        <div className="about-hero-content">
          <h1>About Our Salon</h1>
          <p>Discover our story, our team, and our commitment to beauty</p>
        </div>
      </div>

      <div className="about-section">
        <div className="about-content">
          <h2>Our Story</h2>
          <p>
            Founded in 2013, our beauty parlor began with a simple mission: to provide exceptional beauty services in a
            welcoming and relaxing environment. What started as a small salon with just three chairs has grown into a
            full-service beauty destination trusted by clients throughout the city.
          </p>
          <p>
            Our founder, Priya Sharma, brought her extensive experience and passion for beauty to create a space where
            clients could feel pampered and leave looking and feeling their best. Over the years, we've expanded our
            services and team, but our commitment to quality and customer satisfaction remains unchanged.
          </p>
        </div>
        <div className="about-image">
          <img src="/placeholder.svg?height=400&width=600" alt="Our salon" />
        </div>
      </div>

      <div className="values-section">
        <h2>Our Values</h2>
        <div className="values-grid">
          <div className="value-card">
            <div className="value-icon">
              <i className="fas fa-gem"></i>
            </div>
            <h3>Quality</h3>
            <p>We use only premium products and continuously train our staff in the latest techniques.</p>
          </div>
          <div className="value-card">
            <div className="value-icon">
              <i className="fas fa-heart"></i>
            </div>
            <h3>Care</h3>
            <p>We treat each client with personalized attention and genuine care for their needs.</p>
          </div>
          <div className="value-card">
            <div className="value-icon">
              <i className="fas fa-star"></i>
            </div>
            <h3>Excellence</h3>
            <p>We strive for excellence in every service we provide, no matter how small.</p>
          </div>
          <div className="value-card">
            <div className="value-icon">
              <i className="fas fa-smile"></i>
            </div>
            <h3>Satisfaction</h3>
            <p>Your happiness is our priority, and we're not satisfied until you are.</p>
          </div>
        </div>
      </div>

      <div className="team-section">
        <h2>Meet Our Team</h2>
        <div className="team-grid">
          {teamMembers.map((member) => (
            <div className="team-card" key={member.id}>
              <div className="team-image">
                <img src={member.image || "/placeholder.svg"} alt={member.name} />
              </div>
              <div className="team-details">
                <h3>{member.name}</h3>
                <h4>{member.role}</h4>
                <p>{member.bio}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="about-cta">
        <h2>Experience Our Services</h2>
        <p>Ready to experience the best in beauty services? Book an appointment today!</p>
        <Link to="/appointment" className="about-cta-btn">
          Book an Appointment
        </Link>
      </div>
    </div>
  )
}

export default AboutUs
