import React, { useState, useRef, useEffect } from 'react';
import './DropdownMenu.css';

const DropdownMenu = ({ onViewDocuments, onViewPolicies, onViewSettings }) => {
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

  const handleMenuClick = (action) => {
    setIsOpen(false);
    if (action === 'documents') {
      onViewDocuments();
    } else if (action === 'policies') {
      onViewPolicies();
    } else if (action === 'settings') {
      onViewSettings();
    }
  };

  return (
    <div className="dropdown-container" ref={dropdownRef}>
      <button 
        className="dropdown-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        Menu
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>
      
      {isOpen && (
        <div className="dropdown-menu">
          <div className="dropdown-section">
            <h4>Legal & Documents</h4>
            <button 
              className="dropdown-item"
              onClick={() => handleMenuClick('documents')}
            >
              📄 NIL Legal Documents
            </button>
            <button 
              className="dropdown-item"
              onClick={() => handleMenuClick('policies')}
            >
              📋 Platform Policies
            </button>
          </div>
          
          <div className="dropdown-section">
            <h4>Account</h4>
            <button 
              className="dropdown-item"
              onClick={() => handleMenuClick('settings')}
            >
              ⚙️ Settings
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DropdownMenu; 