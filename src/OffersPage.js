import React, { useState } from 'react';
import './OffersPage.css';

function OffersPage({ onBack }) {
  const [selectedOffer, setSelectedOffer] = useState(null);

  // Sample offers data - this would come from Supabase
  const [offers] = useState([
    {
      id: 1,
      businessName: "Carolina Sports Bar & Grill",
      businessImage: "https://via.placeholder.com/200x200/6f42c1/ffffff?text=CSB",
      campaignDescription: "We're launching our new game day menu and want athletes to help us promote it! Perfect opportunity for sports enthusiasts to connect with fans.",
      adTypes: {
        instagramFeed: { price: 250 },
        instagramStory: { price: 150 },
        instagramReel: { price: 400 },
        discountCode: { price: 100 }
      },
      totalValue: 900,
      createdAt: "2024-01-15T10:30:00Z"
    },
    {
      id: 2,
      businessName: "Elite Fitness Center",
      businessImage: "https://via.placeholder.com/200x200/20c997/ffffff?text=EFC",
      campaignDescription: "Looking for athletes to showcase our new HIIT training program and premium equipment. Great for fitness-focused content creators.",
      adTypes: {
        instagramFeed: { price: 300 },
        instagramStory: { price: 200 },
        instagramReel: { price: 500 },
        tiktokVideo: { price: 400 },
        youtubeReview: { price: 800 }
      },
      totalValue: 2200,
      createdAt: "2024-01-14T14:20:00Z"
    },
    {
      id: 3,
      businessName: "University Auto Service",
      businessImage: "https://via.placeholder.com/200x200/fd7e14/ffffff?text=UAS",
      campaignDescription: "Promote our student discount program! We offer 20% off for all university students. Simple social media promotion needed.",
      adTypes: {
        instagramFeed: { price: 150 },
        instagramStory: { price: 75 },
        discountCode: { price: 50 }
      },
      totalValue: 275,
      createdAt: "2024-01-13T09:15:00Z"
    },
    {
      id: 4,
      businessName: "Campus Real Estate Group",
      businessImage: "https://via.placeholder.com/200x200/e83e8c/ffffff?text=CRE",
      campaignDescription: "Help us showcase student housing options near campus. We need authentic content about campus life and housing experiences.",
      adTypes: {
        instagramFeed: { price: 400 },
        instagramReel: { price: 600 },
        tiktokVideo: { price: 500 },
        youtubeReview: { price: 1000 },
        meetGreet: { price: 300 }
      },
      totalValue: 2800,
      createdAt: "2024-01-12T16:45:00Z"
    }
  ]);

  const handleSendProposal = (offerId) => {
    // Navigate to create proposal page with offer data
    const offer = offers.find(o => o.id === offerId);
    if (offer) {
      // Store offer data for the create proposal page
      localStorage.setItem('selectedOffer', JSON.stringify(offer));
      // Navigate to create proposal page
      window.location.href = '/create-proposal';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const adTypeConfig = {
    instagramFeed: { name: "Instagram Feed Post", icon: "Instagram" },
    instagramStory: { name: "Instagram Story", icon: "Story" },
    instagramHighlight: { name: "Instagram Highlight", icon: "Highlight" },
    instagramReel: { name: "Instagram Reel", icon: "Reel" },
    instagramCollab: { name: "Instagram Collab", icon: "Collab" },
    tiktokVideo: { name: "TikTok Video", icon: "TikTok" },
    tiktokDuet: { name: "TikTok Duet", icon: "Duet" },
    youtubeMention: { name: "YouTube Mention", icon: "YouTube" },
    youtubeReview: { name: "YouTube Review", icon: "Review" },
    discountCode: { name: "Discount Code", icon: "Discount" },
    meetGreet: { name: "Meet & Greet", icon: "Event" }
  };

  return (
    <div className="offers-page">
      <div className="offers-content">
        <button 
          className="back-btn"
          onClick={onBack}
        >
          ← Back to Dashboard
        </button>
        
        <h1 className="offers-title">Available NIL Offers</h1>
        <p className="offers-subtitle">Browse and apply to opportunities from local businesses</p>
        
        <div className="offers-grid">
          {offers.map(offer => (
            <div 
              key={offer.id} 
              className="offer-card"
              onClick={() => setSelectedOffer(offer)}
            >
              <div className="offer-header">
                <img src={offer.businessImage} alt={offer.businessName} />
                <div className="offer-info">
                  <h3>{offer.businessName}</h3>
                  <p className="offer-date">Posted {formatDate(offer.createdAt)}</p>
                </div>
                <div className="offer-value">
                  <span className="value-amount">${offer.totalValue}</span>
                  <span className="value-label">Total Value</span>
                </div>
              </div>
              
              <p className="offer-description">{offer.campaignDescription}</p>
              
              <div className="offer-ad-types">
                <h4>Included Ad Types:</h4>
                <div className="ad-types-list">
                  {Object.entries(offer.adTypes).map(([key, adType]) => (
                    <div key={key} className="ad-type-item">
                      <span className="ad-type-icon">{adTypeConfig[key]?.icon}</span>
                      <span className="ad-type-name">{adTypeConfig[key]?.name}</span>
                      <span className="ad-type-price">${adType.price}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <button 
                className="view-details-btn secondary-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedOffer(offer);
                }}
              >
                View Details
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Offer Detail Modal */}
      {selectedOffer && (
        <div className="modal-backdrop" onClick={() => setSelectedOffer(null)}>
          <div className="offer-modal" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedOffer(null)}>×</button>
            
            <div className="modal-header">
              <img src={selectedOffer.businessImage} alt={selectedOffer.businessName} />
              <div>
                <h2>{selectedOffer.businessName}</h2>
                <p className="modal-date">Posted {formatDate(selectedOffer.createdAt)}</p>
              </div>
            </div>
            
            <div className="modal-content">
              <div className="campaign-section">
                <h3>Campaign Description</h3>
                <p>{selectedOffer.campaignDescription}</p>
              </div>
              
              <div className="ad-types-section">
                <h3>Ad Types & Pricing</h3>
                <div className="ad-types-grid">
                  {Object.entries(selectedOffer.adTypes).map(([key, adType]) => (
                    <div key={key} className="ad-type-detail">
                      <div className="ad-type-header">
                        <span className="ad-type-icon">{adTypeConfig[key]?.icon}</span>
                        <span className="ad-type-name">{adTypeConfig[key]?.name}</span>
                      </div>
                      <div className="ad-type-price">${adType.price}</div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="total-section">
                <div className="total-card">
                  <h3>Total Deal Value</h3>
                  <div className="total-amount">
                    <span className="currency">$</span>
                    <span className="amount">{selectedOffer.totalValue}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="modal-actions">
              <button 
                className="send-proposal-btn primary-btn"
                onClick={() => handleSendProposal(selectedOffer.id)}
              >
                Send Proposal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OffersPage; 