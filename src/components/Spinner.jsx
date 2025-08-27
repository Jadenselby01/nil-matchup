import React from 'react';
import './Spinner.css';

const Spinner = ({ size = 'medium', text = 'Loading...' }) => {
  return (
    <div className={`spinner-container spinner-${size}`}>
      <div className="spinner"></div>
      {text && <p className="spinner-text">{text}</p>}
    </div>
  );
};

export default Spinner; 