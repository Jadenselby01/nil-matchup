import React from 'react';
import './ProfileTemplates.css';

const ProfileTemplates = ({ userType, onSelectTemplate, onClose }) => {
  const athleteTemplates = [
    {
      id: 'football-star',
      name: 'Football Star',
      description: 'Perfect for quarterbacks, running backs, and defensive players',
      icon: '🏈',
      fields: {
        sport: 'Football',
        bio: 'Elite football player with exceptional athleticism and leadership skills. Known for clutch performances and team-first mentality.',
        instagram: 'https://instagram.com/yourusername',
        twitter: 'https://twitter.com/yourusername',
        tiktok: 'https://tiktok.com/@yourusername'
      }
    },
    {
      id: 'basketball-pro',
      name: 'Basketball Pro',
      description: 'Ideal for guards, forwards, and centers',
      icon: '🏀',
      fields: {
        sport: 'Basketball',
        bio: 'Dynamic basketball player with incredible court vision and scoring ability. Team captain and academic standout.',
        instagram: 'https://instagram.com/yourusername',
        twitter: 'https://twitter.com/yourusername',
        tiktok: 'https://tiktok.com/@yourusername'
      }
    },
    {
      id: 'soccer-champion',
      name: 'Soccer Champion',
      description: 'Great for midfielders, forwards, and defenders',
      icon: '⚽',
      fields: {
        sport: 'Soccer',
        bio: 'Skilled soccer player with excellent ball control and tactical awareness. International experience and community leader.',
        instagram: 'https://instagram.com/yourusername',
        twitter: 'https://twitter.com/yourusername',
        tiktok: 'https://tiktok.com/@yourusername'
      }
    },
    {
      id: 'track-star',
      name: 'Track Star',
      description: 'Perfect for sprinters, distance runners, and field athletes',
      icon: '🏃',
      fields: {
        sport: 'Track & Field',
        bio: 'Elite track and field athlete specializing in speed and endurance events. Multiple conference champion and record holder.',
        instagram: 'https://instagram.com/yourusername',
        twitter: 'https://twitter.com/yourusername',
        tiktok: 'https://tiktok.com/@yourusername'
      }
    }
  ];

  const businessTemplates = [
    {
      id: 'restaurant',
      name: 'Local Restaurant',
      description: 'Perfect for sports bars, cafes, and dining establishments',
      icon: '🍔',
      fields: {
        businessType: 'Restaurant',
        description: 'Local restaurant serving delicious food and creating memorable dining experiences for our community.',
        partnershipType: 'Event Appearances',
        budgetRange: '$500 - $1,000',
        requirements: 'Looking for athletes to make appearances during game days and special events.'
      }
    },
    {
      id: 'fitness',
      name: 'Fitness Center',
      description: 'Ideal for gyms, wellness centers, and training facilities',
      icon: '💪',
      fields: {
        businessType: 'Fitness & Wellness',
        description: 'Premium fitness facility offering personal training, group classes, and state-of-the-art equipment.',
        partnershipType: 'Brand Ambassador',
        budgetRange: '$1,000 - $5,000',
        requirements: 'Seeking athletes to promote our facility and create fitness content.'
      }
    },
    {
      id: 'retail',
      name: 'Retail Store',
      description: 'Great for clothing stores, sports equipment, and retail businesses',
      icon: '🛍️',
      fields: {
        businessType: 'Retail',
        description: 'Trendy retail store offering the latest fashion and lifestyle products for students and athletes.',
        partnershipType: 'Social Media Promotion',
        budgetRange: '$0 - $500',
        requirements: 'Need athletes to promote our products and student discounts on social media.'
      }
    },
    {
      id: 'automotive',
      name: 'Auto Service',
      description: 'Perfect for car dealerships, repair shops, and automotive services',
      icon: '🚗',
      fields: {
        businessType: 'Automotive',
        description: 'Trusted automotive service center providing maintenance and repairs for students and faculty.',
        partnershipType: 'Social Media Promotion',
        budgetRange: '$0 - $500',
        requirements: 'Need athletes to promote our student discount program on social media.'
      }
    }
  ];

  const templates = userType === 'athlete' ? athleteTemplates : businessTemplates;

  return (
    <div className="templates-overlay">
      <div className="templates-modal">
        <div className="templates-header">
          <h2>🎯 Choose a Template</h2>
          <p>Quick start with a pre-filled profile template</p>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="templates-grid">
          {templates.map(template => (
            <div 
              key={template.id}
              className="template-card"
              onClick={() => onSelectTemplate(template)}
            >
              <div className="template-icon">{template.icon}</div>
              <h3>{template.name}</h3>
              <p>{template.description}</p>
              <button className="use-template-btn">Use This Template</button>
            </div>
          ))}
        </div>

        <div className="templates-footer">
          <button className="start-blank-btn" onClick={() => onSelectTemplate(null)}>
            Start from Scratch
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileTemplates; 