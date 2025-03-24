'use client';
import { useAuth } from '@/context/AuthContext';
import '@/styles/footer.css';
import { faFacebook, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Link from 'next/link';

const Footer = () => {
  const { isAuthenticated } = useAuth();

  return (
    <footer className="footer">
      <div className="footer-content">
        {/* Quick Links */}
        <div className="footer-section">
          <h3>Quick Links</h3>
          <ul className="list">
            <li><Link className="link" href="/homepage">Home</Link></li>
            <li><Link className="link" href="/shop/prducts">Shop</Link></li>
            <li><Link className="link" href="/navigation/about">About</Link></li>
            <li><Link className="link" href="/navigation/contact">Contact us</Link></li>
          </ul>
        </div>

        {/* Policies */}
        <div className="footer-section">
          <h3>Policies</h3>
          <ul className="list">
            <li><Link className="link" href="/other/policy">Privacy Policy</Link></li>
            <li><Link className="link" href="/other/terms">Terms and Conditions</Link></li>
            {isAuthenticated && <li><Link className="link" href="/account/dashboard">My Account</Link></li>}
            <li><Link className="link" href="/other/faq">FAQ</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="footer-section">
          <h3>Contact Us</h3>
          <ul className="list">
            <li>
              <FontAwesomeIcon className="social-icon" icon={faEnvelope} />
              <a href="mailto:Contact@cuvvahairfibers.com">Contact@crownhairfibers.com</a>
            </li>
            <li>
              <FontAwesomeIcon className="social-icon" icon={faFacebook} />
              <a href="https://www.facebook.com/crownhairsouthafrica/">Crown Hair Fibers</a>
            </li>
            <li>
              <FontAwesomeIcon className="social-icon" icon={faInstagram} />
              <a href="https://www.instagram.com/crownhairsolutions/">Crown Hair Fibers</a>
            </li>
          </ul>
        </div>
      </div>

      {/* Copyright */}
      <div className="footer-bottom">
        <p>**Disclaimer**</p>
        <p>Results may vary depending on thickness and amount of existing hair. Fibers will not work on completely bald areas.</p>
        <p>CUVVA is solely a hair loss concealer. We do not claim to affect the rate of hair loss or growth.</p>
        <p>Site content depicts real characters battling with thin hair and hair loss.</p>
        <p>© {new Date().getFullYear()} Little Brand Box. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;