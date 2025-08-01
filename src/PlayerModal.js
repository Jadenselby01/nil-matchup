import React from "react";
import "./PlayerModal.css";

function PlayerModal({ player, onClose }) {
  if (!player) return null;
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>×</button>
        <img src={player.image} alt={player.name} className="modal-img" />
        <h2>{player.name}</h2>
        <p>{player.bio}</p>
        {player.website && (
          <div className="website-link">
            <a href={player.website} target="_blank" rel="noopener noreferrer">
              Visit Website
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default PlayerModal; 