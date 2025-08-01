import React, { useState } from 'react';
import './MicroCoachingCarousel.css';

const MicroCoachingCarousel = ({ onComplete, onClose }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const coachingSlides = [
    {
      id: 1,
      title: 'Creating Great NIL Posts',
      icon: '📸',
      content: [
        'Use high-quality photos and videos',
        'Show genuine enthusiasm for the brand',
        'Include your personal story or experience',
        'Make it authentic and relatable',
        'Engage with your audience in comments'
      ],
      tip: '💡 Pro tip: Natural, authentic content performs better than overly promotional posts!'
    },
    {
      id: 2,
      title: 'FTC Compliance Rules',
      icon: '⚖️',
      content: [
        'Always include #ad or #sponsored',
        'Make disclosure clear and visible',
        'Don\'t hide disclosure in hashtag lists',
        'Use disclosure even for gifted products',
        'Be transparent about partnerships'
      ],
      tip: '⚠️ Important: FTC violations can result in fines and legal issues!'
    },
    {
      id: 3,
      title: 'Upload & Get Paid Fast',
      icon: '💰',
      content: [
        'Upload your post URL immediately',
        'Ensure all requirements are met',
        'Wait for admin verification',
        'Payment is released automatically',
        'Track your earnings in dashboard'
      ],
      tip: '🚀 Quick uploads = faster payments!'
    }
  ];

  const handleNext = () => {
    if (currentSlide < coachingSlides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      onComplete();
    }
  };

  const handlePrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const handleSkip = () => {
    onComplete();
  };

  const currentSlideData = coachingSlides[currentSlide];

  return (
    <div className="coaching-overlay">
      <div className="coaching-modal">
        <div className="coaching-header">
          <div className="progress-indicator">
            <span className="slide-counter">
              {currentSlide + 1} of {coachingSlides.length}
            </span>
            <div className="progress-dots">
              {coachingSlides.map((_, index) => (
                <div
                  key={index}
                  className={`progress-dot ${index === currentSlide ? 'active' : ''}`}
                />
              ))}
            </div>
          </div>
          <button className="skip-btn" onClick={handleSkip}>
            Skip Tutorial
          </button>
        </div>

        <div className="coaching-content">
          <div className="slide-content">
            <div className="slide-icon">
              {currentSlideData.icon}
            </div>
            
            <h2>{currentSlideData.title}</h2>
            
            <div className="slide-list">
              {currentSlideData.content.map((item, index) => (
                <div key={index} className="list-item">
                  <span className="list-bullet">•</span>
                  <span className="list-text">{item}</span>
                </div>
              ))}
            </div>
            
            <div className="slide-tip">
              <p>{currentSlideData.tip}</p>
            </div>
          </div>
        </div>

        <div className="coaching-actions">
          <button 
            className="prev-btn"
            onClick={handlePrevious}
            disabled={currentSlide === 0}
          >
            ← Previous
          </button>
          
          <button 
            className="next-btn"
            onClick={handleNext}
          >
            {currentSlide === coachingSlides.length - 1 ? 'Get Started!' : 'Next →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default MicroCoachingCarousel; 