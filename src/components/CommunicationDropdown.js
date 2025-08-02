import React, { useState, useRef, useEffect } from 'react';
import './CommunicationDropdown.css';

const CommunicationDropdown = ({ onMessages, onDeals, onPayments }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleToggle = () => {
    setIsOpen(!isOpen);
  };

  const handleMessages = () => {
    setIsOpen(false);
    onMessages();
  };

  const handleDeals = () => {
    setIsOpen(false);
    onDeals();
  };

  const handlePayments = () => {
    setIsOpen(false);
    onPayments();
  };

  return (
    <div className="communication-dropdown" ref={dropdownRef}>
      <button 
        className="action-btn primary-btn dropdown-toggle"
        onClick={handleToggle}
      >
        Communication
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>
      
      {isOpen && (
        <div className="dropdown-menu">
          <button 
            className="dropdown-item"
            onClick={handleMessages}
          >
            Messages
          </button>
          <button 
            className="dropdown-item"
            onClick={handleDeals}
          >
            Deals
          </button>
          <button 
            className="dropdown-item"
            onClick={handlePayments}
          >
            Payments
          </button>
        </div>
      )}
    </div>
  );
};

export default CommunicationDropdown; 