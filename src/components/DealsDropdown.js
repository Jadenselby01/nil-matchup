import React, { useState, useRef, useEffect } from 'react';
import './DealsDropdown.css';

const DealsDropdown = ({ onViewDeals }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => { document.removeEventListener('mousedown', handleClickOutside); };
  }, []);

  const handleToggle = () => { setIsOpen(!isOpen); };
  const handleViewDeals = () => { setIsOpen(false); onViewDeals(); };

  return (
    <div className="deals-dropdown" ref={dropdownRef}>
      <button
        className="action-btn primary-btn dropdown-toggle"
        onClick={handleToggle}
      >
        Deals
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>
      {isOpen && (
        <div className="dropdown-menu">
          <button className="dropdown-item" onClick={handleViewDeals}>Deals History</button>
        </div>
      )}
    </div>
  );
};

export default DealsDropdown; 