import React, { useState } from 'react';
import './QuickMatch.css';

const QuickMatch = ({ userType, onMatch, onClose }) => {
  const [preferences, setPreferences] = useState({
    sport: '',
    location: '',
    budget: '',
    partnershipType: '',
    availability: '',
    timeline: ''
  });

  const [isMatching, setIsMatching] = useState(false);

  const handleQuickMatch = async () => {
    setIsMatching(true);
    
    // Simulate matching algorithm
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Generate mock matches based on preferences
    const matches = generateMatches(preferences, userType);
    
    setIsMatching(false);
    onMatch(matches);
  };

  const generateMatches = (prefs, type) => {
    if (type === 'athlete') {
      return [
        {
          id: 1,
          name: "Carolina Sports Bar & Grill",
          type: "Restaurant",
          location: "Chapel Hill, NC",
          budget: "$500 - $1,000",
          partnershipType: "Event Appearances",
          matchScore: 95,
          image: "https://via.placeholder.com/100x100/6f42c1/ffffff?text=CSB"
        },
        {
          id: 2,
          name: "Elite Fitness Center",
          type: "Fitness & Wellness",
          location: "Durham, NC",
          budget: "$1,000 - $5,000",
          partnershipType: "Brand Ambassador",
          matchScore: 88,
          image: "https://via.placeholder.com/100x100/20c997/ffffff?text=EFC"
        }
      ];
    } else {
      return [
        {
          id: 1,
          name: "Michael Johnson",
          sport: "Football",
          university: "University of North Carolina",
          followers: "15K",
          matchScore: 92,
          image: "https://via.placeholder.com/100x100/007bff/ffffff?text=MJ"
        },
        {
          id: 2,
          name: "Sarah Williams",
          sport: "Basketball",
          university: "Duke University",
          followers: "12K",
          matchScore: 87,
          image: "https://via.placeholder.com/100x100/28a745/ffffff?text=SW"
        }
      ];
    }
  };

  return (
    <div className="quick-match-overlay">
      <div className="quick-match-modal">
        <div className="quick-match-header">
          <h2>⚡ Quick Match</h2>
          <p>Find your perfect {userType === 'athlete' ? 'business partner' : 'athlete'} in seconds!</p>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="quick-match-form">
          {userType === 'athlete' ? (
            <>
              <div className="form-group">
                <label>What sport do you play?</label>
                <select 
                  value={preferences.sport}
                  onChange={(e) => setPreferences({...preferences, sport: e.target.value})}
                >
                  <option value="">Select your sport</option>
                  <option value="football">Football</option>
                  <option value="basketball">Basketball</option>
                  <option value="soccer">Soccer</option>
                  <option value="baseball">Baseball</option>
                  <option value="tennis">Tennis</option>
                  <option value="track">Track & Field</option>
                </select>
              </div>

              <div className="form-group">
                <label>Preferred location?</label>
                <select 
                  value={preferences.location}
                  onChange={(e) => setPreferences({...preferences, location: e.target.value})}
                >
                  <option value="">Any location</option>
                  <option value="chapel-hill">Chapel Hill</option>
                  <option value="durham">Durham</option>
                  <option value="raleigh">Raleigh</option>
                  <option value="remote">Remote/Online</option>
                </select>
              </div>

              <div className="form-group">
                <label>What type of partnership?</label>
                <select 
                  value={preferences.partnershipType}
                  onChange={(e) => setPreferences({...preferences, partnershipType: e.target.value})}
                >
                  <option value="">Any type</option>
                  <option value="social-media">Social Media Promotion</option>
                  <option value="events">Event Appearances</option>
                  <option value="endorsements">Product Endorsements</option>
                  <option value="content">Content Creation</option>
                </select>
              </div>
            </>
          ) : (
            <>
              <div className="form-group">
                <label>What sport are you looking for?</label>
                <select 
                  value={preferences.sport}
                  onChange={(e) => setPreferences({...preferences, sport: e.target.value})}
                >
                  <option value="">Any sport</option>
                  <option value="football">Football</option>
                  <option value="basketball">Basketball</option>
                  <option value="soccer">Soccer</option>
                  <option value="baseball">Baseball</option>
                  <option value="tennis">Tennis</option>
                  <option value="track">Track & Field</option>
                </select>
              </div>

              <div className="form-group">
                <label>Budget range?</label>
                <select 
                  value={preferences.budget}
                  onChange={(e) => setPreferences({...preferences, budget: e.target.value})}
                >
                  <option value="">Any budget</option>
                  <option value="0-500">$0 - $500</option>
                  <option value="500-1000">$500 - $1,000</option>
                  <option value="1000-5000">$1,000 - $5,000</option>
                  <option value="5000+">$5,000+</option>
                </select>
              </div>

              <div className="form-group">
                <label>Timeline needed?</label>
                <select 
                  value={preferences.timeline}
                  onChange={(e) => setPreferences({...preferences, timeline: e.target.value})}
                >
                  <option value="">Flexible</option>
                  <option value="immediate">Immediate</option>
                  <option value="1-2-weeks">1-2 weeks</option>
                  <option value="1-month">1 month</option>
                  <option value="ongoing">Ongoing partnership</option>
                </select>
              </div>
            </>
          )}

          <button 
            className="quick-match-btn"
            onClick={handleQuickMatch}
            disabled={isMatching}
          >
            {isMatching ? 'Finding Matches...' : '⚡ Find Matches Now'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuickMatch; 