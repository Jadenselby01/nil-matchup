import React, { useState, useEffect } from 'react';
import './CreateOfferPage.css';

function CreateOfferPage({ onBack }) {
  const [campaignDescription, setCampaignDescription] = useState('');
  const [totalValue, setTotalValue] = useState(0);
  const [adTypes, setAdTypes] = useState({
    instagramFeed: { enabled: false, price: 0 },
    instagramStory: { enabled: false, price: 0 },
    instagramHighlight: { enabled: false, price: 0 },
    instagramReel: { enabled: false, price: 0 },
    instagramCollab: { enabled: false, price: 0 },
    tiktokVideo: { enabled: false, price: 0 },
    tiktokDuet: { enabled: false, price: 0 },
    youtubeMention: { enabled: false, price: 0 },
    youtubeReview: { enabled: false, price: 0 },
    discountCode: { enabled: false, price: 0 },
    meetGreet: { enabled: false, price: 0 }
  });

  // Calculate total value whenever ad types change
  useEffect(() => {
    const total = Object.values(adTypes).reduce((sum, adType) => {
      return sum + (adType.enabled ? adType.price : 0);
    }, 0);
    setTotalValue(total);
  }, [adTypes]);

  const handleAdTypeChange = (adTypeKey, field, value) => {
    setAdTypes(prev => ({
      ...prev,
      [adTypeKey]: {
        ...prev[adTypeKey],
        [field]: field === 'price' ? parseFloat(value) || 0 : value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Filter enabled ad types
    const enabledAdTypes = Object.entries(adTypes)
      .filter(([_, adType]) => adType.enabled)
      .reduce((acc, [key, adType]) => {
        acc[key] = adType;
        return acc;
      }, {});

    if (Object.keys(enabledAdTypes).length === 0) {
      alert('Please select at least one ad type');
      return;
    }

    if (!campaignDescription.trim()) {
      alert('Please provide a campaign description');
      return;
    }

    const offerData = {
      businessName: "Sample Business", // This would come from user context
      campaignDescription,
      adTypes: enabledAdTypes,
      totalValue,
      createdAt: new Date().toISOString()
    };

    try {
      // Here you would integrate with Supabase
      console.log('Submitting offer:', offerData);
      
      // For now, we'll simulate a successful submission
      alert('NIL offer created successfully!');
      onBack();
    } catch (error) {
      console.error('Error creating offer:', error);
      alert('Error creating offer. Please try again.');
    }
  };

  const adTypeConfig = {
    instagramFeed: {
      name: "Instagram Feed Post",
      description: "Standard post on Instagram feed",
              icon: "Instagram"
    },
    instagramStory: {
      name: "Instagram Story (1-3 frames)",
      description: "Story post with 1-3 frames",
      icon: "📸"
    },
    instagramHighlight: {
      name: "Instagram Story Highlight",
      description: "Permanent story highlight",
      icon: "⭐"
    },
    instagramReel: {
      name: "Instagram Reel",
      description: "Short-form video content",
      icon: "🎬"
    },
    instagramCollab: {
      name: "Instagram Collab Post",
      description: "Collaborative post with business",
      icon: "🤝"
    },
    tiktokVideo: {
      name: "TikTok Video",
      description: "Original TikTok content",
              icon: "TikTok"
    },
    tiktokDuet: {
      name: "TikTok Duet/Challenge",
      description: "Duet or challenge participation",
      icon: "🎭"
    },
    youtubeMention: {
      name: "YouTube Mention (Shoutout)",
      description: "Brief mention in YouTube content",
              icon: "YouTube"
    },
    youtubeReview: {
      name: "YouTube Integration/Review",
      description: "Full product review or integration",
      icon: "🎥"
    },
    discountCode: {
      name: "Discount Code Sharing",
      description: "Share exclusive discount codes",
      icon: "💰"
    },
    meetGreet: {
      name: "Meet-and-Greet or Event Appearance",
      description: "In-person event or appearance",
      icon: "🎪"
    }
  };

  return (
    <div className="create-offer-page">
      <div className="create-offer-content">
        <button 
          className="back-btn"
          onClick={onBack}
        >
          ← Back to Dashboard
        </button>
        
        <h1 className="create-offer-title">Create NIL Offer</h1>
        <p className="create-offer-subtitle">Design your campaign package for athletes</p>
        
        <form className="create-offer-form" onSubmit={handleSubmit}>
          <div className="campaign-section">
            <h3>Campaign Details</h3>
            <div className="form-group">
              <label>Campaign Description</label>
              <textarea 
                value={campaignDescription}
                onChange={(e) => setCampaignDescription(e.target.value)}
                placeholder="Describe your campaign, goals, and what you're looking for from athletes..."
                rows="4"
                required
              />
            </div>
          </div>

          <div className="ad-types-section">
            <h3>Select Ad Types & Pricing</h3>
            <p className="section-description">
              Toggle the ad types you want to include and set your budget for each
            </p>
            
            <div className="ad-types-grid">
              {Object.entries(adTypeConfig).map(([key, config]) => (
                <div key={key} className="ad-type-card">
                  <div className="ad-type-header">
                    <div className="ad-type-info">
                      <span className="ad-type-icon">{config.icon}</span>
                      <div>
                        <h4>{config.name}</h4>
                        <p>{config.description}</p>
                      </div>
                    </div>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={adTypes[key].enabled}
                        onChange={(e) => handleAdTypeChange(key, 'enabled', e.target.checked)}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                  
                  {adTypes[key].enabled && (
                    <div className="price-input">
                      <label>Price ($)</label>
                      <input
                        type="number"
                        min="0"
                        step="0.01"
                        value={adTypes[key].price}
                        onChange={(e) => handleAdTypeChange(key, 'price', e.target.value)}
                        placeholder="0.00"
                      />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="total-section">
            <div className="total-card">
              <h3>Total Deal Value</h3>
              <div className="total-amount">
                <span className="currency">$</span>
                <span className="amount">{totalValue.toFixed(2)}</span>
              </div>
              <p className="total-description">
                This is the total value of your NIL offer package
              </p>
            </div>
          </div>

          <div className="form-actions">
            <button type="button" className="cancel-btn secondary-btn" onClick={onBack}>
              Cancel
            </button>
            <button type="submit" className="submit-btn primary-btn">
              Create Offer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateOfferPage; 