import React, { useState, useRef, useEffect } from 'react';
import './ProposalDropdown.css';

const ProposalDropdown = ({ onViewProposals, onCreateProposal }) => {
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

  const handleViewProposals = () => {
    setIsOpen(false);
    onViewProposals();
  };

  const handleCreateProposal = () => {
    setIsOpen(false);
    onCreateProposal();
  };

  return (
    <div className="proposal-dropdown" ref={dropdownRef}>
      <button 
        className="action-btn primary-btn dropdown-toggle"
        onClick={handleToggle}
      >
        Proposals
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </button>
      
      {isOpen && (
        <div className="dropdown-menu">
          <button 
            className="dropdown-item"
            onClick={handleViewProposals}
          >
            My Proposals
          </button>
          <button 
            className="dropdown-item"
            onClick={handleCreateProposal}
          >
            Send New Proposal
          </button>
        </div>
      )}
    </div>
  );
};

export default ProposalDropdown; 