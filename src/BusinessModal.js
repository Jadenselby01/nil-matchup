import React from "react";
import "./BusinessModal.css";

function BusinessModal({ business, onClose }) {
  if (!business) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        <img src={business.image} alt={business.name} className="modal-img" />
        <h2>{business.name}</h2>
        <p className="modal-type">{business.type}</p>
        <p className="modal-location">{business.location}</p>
        <p>{business.description}</p>
        <div className="modal-details">
          <div className="detail-item">
            <strong>Partnership Type:</strong> {business.partnershipType}
          </div>
          <div className="detail-item">
            <strong>Budget Range:</strong> {business.budgetRange}
          </div>
          <div className="detail-item">
            <strong>Requirements:</strong> {business.requirements}
          </div>
        </div>
        <div className="modal-actions">
          <button className="contact-btn primary-btn">
            Contact Business
          </button>
        </div>
      </div>
    </div>
  );
}

export default BusinessModal; 