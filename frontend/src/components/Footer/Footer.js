import { Link } from "react-router-dom"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faMapMarkerAlt, faPhone, faEnvelope, faClock } from "@fortawesome/free-solid-svg-icons"
import { faFacebookF, faInstagram, faTwitter, faYoutube } from "@fortawesome/free-brands-svg-icons"
import "./Footer.css"
import logo from "../../assets/images/logo.png"

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-top">
        <div className="container">
          <div className="footer-grid">
            <div className="footer-info">
              <Link to="/" className="footer-logo">
                <img src={logo || "/placeholder.svg"} alt="Thenu's Makeover" />
                <span>Thenu's</span>
              </Link>
              <p>
                Premium beauty services tailored to enhance your natural beauty. Experience luxury and excellence at
                Thenu's Makeover.
              </p>
              <div className="social-links">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faFacebookF} />
                </a>
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faInstagram} />
                </a>
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faTwitter} />
                </a>
                <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                  <FontAwesomeIcon icon={faYoutube} />
                </a>
              </div>
            </div>

            <div className="footer-links">
              <h3>Quick Links</h3>
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/about">About Us</Link>
                </li>
                <li>
                  <Link to="/services/hair">Hair Services</Link>
                </li>
                <li>
                  <Link to="/services/skin">Skin Care</Link>
                </li>
                <li>
                  <Link to="/services/bridal">Bridal Services</Link>
                </li>
                <li>
                  <Link to="/services/nails">Nail Art</Link>
                </li>
              </ul>
            </div>

            <div className="footer-contact">
              <h3>Contact Us</h3>
              <ul>
                <li>
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                  <span>123 & 124, 3rd Floor, Ispahani Centre, Nungambakkam High Rd, Chennai, Tamil Nadu 600034</span>
                </li>
                <li>
                  <FontAwesomeIcon icon={faPhone} />
                  <span>+91 90926 26262</span>
                </li>
                <li>
                  <FontAwesomeIcon icon={faEnvelope} />
                  <span>info@thenusmakeover.com</span>
                </li>
                <li>
                  <FontAwesomeIcon icon={faClock} />
                  <span>Mon-Sat: 10:00 AM - 8:00 PM</span>
                </li>
              </ul>
            </div>

            <div className="footer-newsletter">
              <h3>Newsletter</h3>
              <p>Subscribe to our newsletter for beauty tips and exclusive offers</p>
              <form className="newsletter-form">
                <input type="email" placeholder="Your Email Address" required />
                <button type="submit">Subscribe</button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Thenu's Makeover. All Rights Reserved.</p>
          <div className="footer-bottom-links">
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-of-service">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
