import React, { useEffect, useState } from 'react';
import './Notification.css';

const Notification = ({ message, type = 'success', duration = 5000, onClose }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    // Show notification
    setIsVisible(true);
    setIsAnimating(true);

    // Hide after duration
    const timer = setTimeout(() => {
      setIsAnimating(false);
      setTimeout(() => {
        setIsVisible(false);
        if (onClose) onClose();
      }, 300); // Animation duration
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'warning':
        return '⚠️';
      case 'info':
        return 'ℹ️';
      default:
        return '✅';
    }
  };

  const getTypeClass = () => {
    switch (type) {
      case 'success':
        return 'notification-success';
      case 'error':
        return 'notification-error';
      case 'warning':
        return 'notification-warning';
      case 'info':
        return 'notification-info';
      default:
        return 'notification-success';
    }
  };

  return (
    <div className={`notification ${getTypeClass()} ${isAnimating ? 'notification-show' : 'notification-hide'}`}>
      <div className="notification-content">
        <div className="notification-icon">{getIcon()}</div>
        <div className="notification-message">{message}</div>
        <button className="notification-close" onClick={() => {
          setIsAnimating(false);
          setTimeout(() => {
            setIsVisible(false);
            if (onClose) onClose();
          }, 300);
        }}>
          ×
        </button>
      </div>
    </div>
  );
};

export default Notification; 