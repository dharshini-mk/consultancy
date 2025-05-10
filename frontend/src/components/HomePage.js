"use client"

import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import { motion } from "framer-motion"
import { Swiper, SwiperSlide } from "swiper/react"
import { Autoplay, Pagination, EffectFade } from "swiper/modules"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
  faCalendarCheck,
  faCut,
  faSpa,
  faGem,
  faPaintBrush,
  faUserFriends,
  faAward,
  faClock,
} from "@fortawesome/free-solid-svg-icons"
import AOS from "aos"
import Navbar from "./Navbar/Navbar"
import Footer from "./Footer/Footer"
import TestimonialCard from "./TestimonialCard"
import ServiceCard from "./ServiceCard"
import "swiper/css"
import "swiper/css/pagination"
import "swiper/css/effect-fade"
import "aos/dist/aos.css"
import "../styles/home.css"

// Import images
import hero1 from "../assets/images/hero1.jpg"
import hero2 from "../assets/images/hero2.jpg"
import hero3 from "../assets/images/hero3.jpg"
import aboutImg from "../assets/images/about-section.jpg"
import hairService from "../assets/images/hair-service.jpg"
import skinService from "../assets/images/skin-service.jpg"
import bridalService from "../assets/images/bridal-service.jpg"
import nailsService from "../assets/images/nails-service.jpg"

const HomePage = () => {
  const [activeTab, setActiveTab] = useState("Hair Style")

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    })
  }, [])

  const tabContent = {
    "Hair Style": {
      description:
        "Transform your tresses with expert cuts, styling, and color at Thenu's Makeover! From trendy layers to nourishing treatments, we bring out the best in your hair.",
      image: hairService,
    },
    "Skin Care": {
      description:
        "Rejuvenate your skin with our premium facials and treatments. Our skilled estheticians use high-quality products to give you that perfect glow.",
      image: skinService,
    },
    Bridal: {
      description:
        "Make your special day unforgettable with our comprehensive bridal packages. From makeup to hair styling, we ensure you look nothing short of perfect.",
      image: bridalService,
    },
    "Nail Art": {
      description:
        "Express yourself through our creative nail art services. Our nail technicians are skilled in the latest trends and techniques for beautiful, long-lasting results.",
      image: nailsService,
    },
  }

  const testimonials = [
    {
      id: 1,
      name: "Priya Sharma",
      role: "Regular Client",
      image: "https://randomuser.me/api/portraits/women/44.jpg",
      content:
        "I've been coming to Thenu's for over 2 years now and I'm always impressed with their service. The staff is professional and the ambiance is so relaxing. Highly recommend their hair treatments!",
      rating: 5,
    },
    {
      id: 2,
      name: "Anjali Patel",
      role: "Bridal Client",
      image: "https://randomuser.me/api/portraits/women/68.jpg",
      content:
        "My bridal makeup and hair was absolutely perfect! Everyone at the wedding was asking who did my makeup. Thank you Thenu's team for making me look and feel beautiful on my special day!",
      rating: 5,
    },
    {
      id: 3,
      name: "Riya Kapoor",
      role: "New Client",
      image: "https://randomuser.me/api/portraits/women/63.jpg",
      content:
        "First time at Thenu's and I'm already planning my next visit! The facial I got was so relaxing and my skin is glowing. The staff was attentive and made sure I was comfortable throughout.",
      rating: 4,
    },
    {
      id: 4,
      name: "Neha Singh",
      role: "Regular Client",
      image: "https://randomuser.me/api/portraits/women/26.jpg",
      content:
        "The nail art at Thenu's is exceptional! The technicians are so creative and detailed. I always get compliments on my nails after visiting. The salon atmosphere is luxurious and the staff makes you feel like royalty.",
      rating: 5,
    },
  ]

  const services = [
    {
      id: 1,
      title: "Hair Services",
      icon: faCut,
      description: "Expert haircuts, styling, coloring, and treatments for all hair types.",
      image: hairService,
      link: "/services/hair",
    },
    {
      id: 2,
      title: "Skin Care",
      icon: faSpa,
      description: "Rejuvenating facials, clean-ups, and advanced skin treatments.",
      image: skinService,
      link: "/services/skin",
    },
    {
      id: 3,
      title: "Bridal Services",
      icon: faGem,
      description: "Complete bridal packages for your special day.",
      image: bridalService,
      link: "/services/bridal",
    },
    {
      id: 4,
      title: "Nail Art",
      icon: faPaintBrush,
      description: "Manicures, pedicures, and creative nail art designs.",
      image: nailsService,
      link: "/services/nails",
    },
  ]

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3,
      },
    },
  }

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5,
      },
    },
  }

  return (
    <>
      <Navbar />
      <div className="home-page">
        {/* Hero Section */}
        <section className="hero-section">
          <Swiper
            modules={[Autoplay, Pagination, EffectFade]}
            effect="fade"
            pagination={{ clickable: true }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            loop={true}
            className="hero-swiper"
          >
            <SwiperSlide>
              <div className="hero-slide" style={{ backgroundImage: `url(${hero1})` }}>
                <div className="hero-content">
                  <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                  >
                    Beauty & Elegance
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    Experience premium beauty services tailored just for you
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    <Link to="/appointment" className="btn btn-primary hero-btn">
                      <FontAwesomeIcon icon={faCalendarCheck} className="btn-icon" />
                      Book Appointment
                    </Link>
                  </motion.div>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="hero-slide" style={{ backgroundImage: `url(${hero2})` }}>
                <div className="hero-content">
                  <h1>Luxury Treatments</h1>
                  <p>Indulge in our premium beauty and wellness services</p>
                  <Link to="/services/skin" className="btn btn-primary hero-btn">
                    <FontAwesomeIcon icon={faSpa} className="btn-icon" />
                    Explore Services
                  </Link>
                </div>
              </div>
            </SwiperSlide>
            <SwiperSlide>
              <div className="hero-slide" style={{ backgroundImage: `url(${hero3})` }}>
                <div className="hero-content">
                  <h1>Bridal Perfection</h1>
                  <p>Make your special day unforgettable with our bridal packages</p>
                  <Link to="/services/bridal" className="btn btn-primary hero-btn">
                    <FontAwesomeIcon icon={faGem} className="btn-icon" />
                    Bridal Services
                  </Link>
                </div>
              </div>
            </SwiperSlide>
          </Swiper>
        </section>

        {/* Services Preview Section */}
        <section className="section services-preview">
          <div className="container">
            <h2 className="section-title" data-aos="fade-up">
              Our Premium Services
            </h2>
            <p className="section-subtitle" data-aos="fade-up" data-aos-delay="100">
              Discover our range of luxury beauty services designed to enhance your natural beauty
            </p>

            <motion.div
              className="services-grid"
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              {services.map((service) => (
                <motion.div key={service.id} variants={itemVariants}>
                  <ServiceCard service={service} />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* About Section */}
        <section className="section about-section">
          <div className="container">
            <div className="about-grid">
              <div className="about-image" data-aos="fade-right">
                <img src={aboutImg || "/placeholder.svg"} alt="About Thenu's Makeover" />
                <div className="experience-badge">
                  <span className="years">10+</span>
                  <span className="text">Years of Excellence</span>
                </div>
              </div>
              <div className="about-content" data-aos="fade-left">
                <h2 className="section-title text-left">About Thenu's Makeover</h2>
                <p className="about-description">
                  Founded in 2010, Thenu's Makeover has established itself as a premier beauty destination, offering
                  exceptional services in a luxurious and welcoming environment.
                </p>
                <p className="about-description">
                  Our team of skilled professionals is dedicated to enhancing your natural beauty and providing a
                  personalized experience that exceeds your expectations.
                </p>
                <div className="features-grid">
                  <div className="feature-item">
                    <div className="feature-icon">
                      <FontAwesomeIcon icon={faUserFriends} />
                    </div>
                    <div className="feature-text">
                      <h4>Expert Team</h4>
                      <p>Skilled professionals with years of experience</p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <div className="feature-icon">
                      <FontAwesomeIcon icon={faAward} />
                    </div>
                    <div className="feature-text">
                      <h4>Premium Products</h4>
                      <p>Using only high-quality beauty products</p>
                    </div>
                  </div>
                  <div className="feature-item">
                    <div className="feature-icon">
                      <FontAwesomeIcon icon={faClock} />
                    </div>
                    <div className="feature-text">
                      <h4>Convenient Hours</h4>
                      <p>Open 7 days a week for your convenience</p>
                    </div>
                  </div>
                </div>
                <Link to="/about" className="btn btn-outline about-btn">
                  Learn More About Us
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Services Tabs Section */}
        <section className="section services-tabs">
          <div className="container">
            <h2 className="section-title" data-aos="fade-up">
              Our Signature Services
            </h2>
            <p className="section-subtitle" data-aos="fade-up" data-aos-delay="100">
              Explore our most popular beauty treatments and services
            </p>

            <div className="tabs-container" data-aos="fade-up" data-aos-delay="200">
              <div className="tabs">
                {Object.keys(tabContent).map((tab) => (
                  <div
                    key={tab}
                    className={`tab ${activeTab === tab ? "active" : ""}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab}
                    {activeTab === tab && <div className="tab-indicator"></div>}
                  </div>
                ))}
              </div>

              <div className="tab-content">
                <div className="tab-text">
                  <h3>{activeTab}</h3>
                  <p>{tabContent[activeTab].description}</p>
                  <Link
                    to={`/services/${activeTab === "Hair Style" ? "hair" : activeTab === "Skin Care" ? "skin" : activeTab === "Bridal" ? "bridal" : "nails"}`}
                    className="btn btn-primary tab-btn"
                  >
                    Learn More
                  </Link>
                </div>
                <div className="tab-image">
                  <img src={tabContent[activeTab].image || "/placeholder.svg"} alt={activeTab} />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="section testimonials-section">
          <div className="container">
            <h2 className="section-title" data-aos="fade-up">
              What Our Clients Say
            </h2>
            <p className="section-subtitle" data-aos="fade-up" data-aos-delay="100">
              Read what our satisfied clients have to say about their experience at Thenu's Makeover
            </p>

            <div className="testimonials-container" data-aos="fade-up" data-aos-delay="200">
              <Swiper
                modules={[Pagination, Autoplay]}
                pagination={{ clickable: true }}
                autoplay={{ delay: 5000, disableOnInteraction: false }}
                breakpoints={{
                  640: {
                    slidesPerView: 1,
                    spaceBetween: 20,
                  },
                  768: {
                    slidesPerView: 2,
                    spaceBetween: 30,
                  },
                  1024: {
                    slidesPerView: 3,
                    spaceBetween: 30,
                  },
                }}
                className="testimonials-swiper"
              >
                {testimonials.map((testimonial) => (
                  <SwiperSlide key={testimonial.id}>
                    <TestimonialCard testimonial={testimonial} />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="section cta-section">
          <div className="container">
            <div className="cta-content" data-aos="fade-up">
              <h2>Ready to Experience Premium Beauty Services?</h2>
              <p>Book your appointment today and let our experts take care of you</p>
              <Link to="/appointment" className="btn btn-primary cta-btn">
                <FontAwesomeIcon icon={faCalendarCheck} className="btn-icon" />
                Book Your Appointment
              </Link>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  )
}

export default HomePage
