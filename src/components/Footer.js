import React from 'react';
import './Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>NIL Matchup</h3>
          <p>Connecting college athletes with NIL opportunities</p>
          <div className="social-links">
            <button className="social-link" aria-label="Facebook">
              <i className="fab fa-facebook"></i>
            </button>
            <button className="social-link" aria-label="Twitter">
              <i className="fab fa-twitter"></i>
            </button>
            <button className="social-link" aria-label="Instagram">
              <i className="fab fa-instagram"></i>
            </button>
            <button className="social-link" aria-label="LinkedIn">
              <i className="fab fa-linkedin"></i>
            </button>
          </div>
        </div>
        
        <div className="footer-section">
          <h4>Platform</h4>
          <ul>
            <li><button className="footer-link">For Athletes</button></li>
            <li><button className="footer-link">For Businesses</button></li>
            <li><button className="footer-link">NIL Opportunities</button></li>
            <li><button className="footer-link">Success Stories</button></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Support</h4>
          <ul>
            <li><button className="footer-link">Help Center</button></li>
            <li><button className="footer-link">FAQ</button></li>
            <li><button className="footer-link">Contact Us</button></li>
            <li><button className="footer-link">Support</button></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Legal</h4>
          <ul>
            <li>
              <a 
                href="/privacy-policy.html" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a 
                href="/terms-of-service.html" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Terms of Service
              </a>
            </li>
            <li>
              <a 
                href="/cookie-policy.html" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                Cookie Policy
              </a>
            </li>
            <li><button className="footer-link">NIL Compliance</button></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Company</h4>
          <ul>
            <li><button className="footer-link">About Us</button></li>
            <li><button className="footer-link">Careers</button></li>
            <li><button className="footer-link">Press</button></li>
            <li><button className="footer-link">Partners</button></li>
          </ul>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div className="footer-bottom-content">
          <p>&copy; {currentYear} NIL Matchup LLC. All rights reserved.</p>
          <div className="footer-bottom-links">
            <button className="footer-link">Accessibility</button>
            <span className="separator">•</span>
            <button className="footer-link">Sitemap</button>
            <span className="separator">•</span>
            <button className="footer-link">Platform Status</button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 