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
                <a href="https://www.instagram.com/thenmozhi_makeoverartistry?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw==" target="_blank" rel="noopener noreferrer">
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
                  <span> 87, Kasianna street, Nasiyanur Rd, Edayankattuvalasu, Sampath Nagar, Erode, Tamil Nadu 638011</span>
                </li>
                <li>
                  <FontAwesomeIcon icon={faPhone} />
                  <span>+91 97506 37980</span>
                </li>
                <li>
                  <FontAwesomeIcon icon={faEnvelope} />
                  <span>info@thenusmakeover.com</span>
                </li>
                <li>
                  <FontAwesomeIcon icon={faClock} />
                  <span>Mon-Sat: 10:00 AM - 7:00 PM</span>
                </li>
              </ul>
            </div>

            
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="container">
          <p>&copy; {new Date().getFullYear()} Thenu's Style Studio. All Rights Reserved.</p>
          <div className="footer-bottom-links">
            <p>Privacy Policy</p>
            <p>Terms of Service</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
