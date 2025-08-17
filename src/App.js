import React, { useState, useEffect } from 'react';
import './App.css';
import AuthService from './services/authService';
import { SecurityProvider } from './contexts/SecurityContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Notification from './components/Notification';
import MessagingPage from './MessagingPage';
import PaymentPage from './PaymentPage';
import PaymentProcessingPage from './PaymentProcessingPage';
import DocumentSigningPage from './components/DocumentSigningPage';
import CreateProposalPage from './CreateProposalPage';
import DealsPage from './DealsPage';
import Footer from './components/Footer';
import { PrivacyPolicy, TermsOfService, CookiePolicy } from './components/LegalPages';
import AuthPage from './components/auth/AuthPage';
import AthleteDashboard from './components/dashboard/AthleteDashboard';
import BusinessDashboard from './components/dashboard/BusinessDashboard';
import CreateDealForm from './components/deals/CreateDealForm';
import DealDiscoveryPage from './components/deals/DealDiscoveryPage';

// DropdownMenu Component
const DropdownMenu = ({ onViewDocuments, onViewPolicies, onViewSettings }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="dropdown-menu">
      <button 
        className="dropdown-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        ⚙️ Settings
      </button>
      {isOpen && (
        <div className="dropdown-content">
          <button onClick={onViewDocuments}>📄 Legal Documents</button>
          <button onClick={onViewPolicies}>📋 Policies</button>
          <button onClick={onViewSettings}>⚙️ Settings</button>
        </div>
      )}
    </div>
  );
};

// PlayerModal Component
const PlayerModal = ({ player, onClose }) => {
  if (!player) return null;
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <img src={player.image} alt={player.name} />
        <h2>{player.name}</h2>
        <p><strong>Sport:</strong> {player.sport}</p>
        <p><strong>University:</strong> {player.university}</p>
        <p><strong>Age:</strong> {player.age} years old</p>
        <p><strong>Bio:</strong> {player.bio}</p>
      </div>
    </div>
  );
};

// BusinessModal Component
const BusinessModal = ({ business, onClose }) => {
  if (!business) return null;
  
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>
        <img src={business.image} alt={business.name} />
        <h2>{business.name}</h2>
        <p><strong>Type:</strong> {business.type}</p>
        <p><strong>Location:</strong> {business.location}</p>
        <p><strong>Partnership Type:</strong> {business.partnershipType}</p>
        <p><strong>Budget Range:</strong> {business.budgetRange}</p>
        <p><strong>Description:</strong> {business.description}</p>
      </div>
    </div>
  );
};

// LegalDocumentsModal Component
const LegalDocumentsModal = ({ onClose }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-content" onClick={e => e.stopPropagation()}>
      <button className="modal-close" onClick={onClose}>×</button>
      <h2>Legal Documents</h2>
      <p>Legal documents content would go here.</p>
    </div>
  </div>
);

// PoliciesModal Component
const PoliciesModal = ({ onClose }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-content" onClick={e => e.stopPropagation()}>
      <button className="modal-close" onClick={onClose}>×</button>
      <h2>Policies</h2>
      <p>Policies content would go here.</p>
    </div>
  </div>
);

// SettingsModal Component
const SettingsModal = ({ onClose }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-content" onClick={e => e.stopPropagation()}>
      <button className="modal-close" onClick={onClose}>×</button>
      <h2>Settings</h2>
      <p>Settings content would go here.</p>
    </div>
  </div>
);

// SmartDealTemplates Component
const SmartDealTemplates = ({ onClose, onTemplateCreated }) => {
  const [templateData, setTemplateData] = useState({
    title: '',
    description: '',
    category: 'social_media',
    budget: '',
    duration: '',
    requirements: '',
    targetAudience: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (field, value) => {
    setTemplateData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      if (onTemplateCreated) {
        onTemplateCreated(templateData);
      }
      onClose();
    }, 2000);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content smart-template-modal" onClick={e => e.stopPropagation()} style={{ color: '#333' }}>
        <button className="modal-close" onClick={onClose}>×</button>
        <h2 style={{ color: '#333' }}>Create Smart Deal Template</h2>
        <p className="modal-subtitle" style={{ color: '#666' }}>Create a template that athletes can use to propose deals to your business</p>
        
        <form onSubmit={handleSubmit} className="smart-template-form" style={{ color: '#333' }}>
          <div className="form-group">
            <label htmlFor="title" style={{ color: '#333' }}>Template Title *</label>
            <input
              type="text"
              id="title"
              value={templateData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="e.g., Social Media Promotion Campaign"
              required
              style={{ color: '#333', backgroundColor: 'white', border: '2px solid #007bff', borderRadius: '8px' }}
            />
          </div>

          <div className="form-group">
            <label htmlFor="description" style={{ color: '#333' }}>Description *</label>
            <textarea
              id="description"
              value={templateData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              placeholder="Describe what you're looking for from athletes..."
              rows="3"
              required
              style={{ color: '#333', backgroundColor: 'white', border: '2px solid #007bff', borderRadius: '8px' }}
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="category" style={{ color: '#333' }}>Category *</label>
              <select
                id="category"
                value={templateData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                required
                style={{ color: '#333', backgroundColor: 'white', border: '2px solid #007bff', borderRadius: '8px' }}
              >
                <option value="social_media">Social Media</option>
                <option value="content_creation">Content Creation</option>
                <option value="product_review">Product Review</option>
                <option value="event_promotion">Event Promotion</option>
                <option value="brand_campaign">Brand Campaign</option>
                <option value="ambassador">Brand Ambassador</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="budget" style={{ color: '#333' }}>Budget Range *</label>
              <input
                type="text"
                id="budget"
                value={templateData.budget}
                onChange={(e) => handleInputChange('budget', e.target.value)}
                placeholder="e.g., $500-$2000"
                required
                style={{ color: '#333', backgroundColor: 'white', border: '2px solid #007bff', borderRadius: '8px' }}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="duration" style={{ color: '#333' }}>Duration *</label>
              <input
                type="text"
                id="duration"
                value={templateData.duration}
                onChange={(e) => handleInputChange('duration', e.target.value)}
                placeholder="e.g., 2 weeks, 1 month"
                required
                style={{ color: '#333', backgroundColor: 'white', border: '2px solid #007bff', borderRadius: '8px' }}
              />
            </div>

            <div className="form-group">
              <label htmlFor="targetAudience" style={{ color: '#333' }}>Target Audience</label>
              <input
                type="text"
                id="targetAudience"
                value={templateData.targetAudience}
                onChange={(e) => handleInputChange('targetAudience', e.target.value)}
                placeholder="e.g., College students, Sports fans"
                style={{ color: '#333', backgroundColor: 'white', border: '2px solid #007bff', borderRadius: '8px' }}
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="requirements" style={{ color: '#333' }}>Specific Requirements</label>
            <textarea
              id="requirements"
              value={templateData.requirements}
              onChange={(e) => handleInputChange('requirements', e.target.value)}
              placeholder="List any specific requirements, deliverables, or guidelines..."
              rows="3"
              style={{ color: '#333', backgroundColor: 'white', border: '2px solid #007bff', borderRadius: '8px' }}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onClose} style={{ color: '#333' }}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={isSubmitting}>
              {isSubmitting ? 'Creating Template...' : 'Create Template'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// AutoAdProofTool Component
const AutoAdProofTool = ({ onClose }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-content" onClick={e => e.stopPropagation()}>
      <button className="modal-close" onClick={onClose}>×</button>
      <h2>Auto Ad Proof Tool</h2>
      <p>Auto ad proof tool content would go here.</p>
    </div>
  </div>
);

// MicroCoachingCarousel Component
const MicroCoachingCarousel = ({ onClose }) => (
  <div className="modal-overlay" onClick={onClose}>
    <div className="modal-content" onClick={e => e.stopPropagation()}>
      <button className="modal-close" onClick={onClose}>×</button>
      <h2>Micro Coaching</h2>
      <p>Micro coaching content would go here.</p>
    </div>
  </div>
);

// CreateOfferPage Component
const CreateOfferPage = ({ onBack }) => (
  <div className="page-container">
    <header className="page-header">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <h1>Create Offer</h1>
    </header>
    <main className="page-content">
      <p>Create offer functionality would go here.</p>
    </main>
  </div>
);

// OffersPage Component
const OffersPage = ({ onBack, setCurrentPage }) => {
  const businessDeals = [
    {
      id: 1,
      business: {
        name: "TechStart Inc.",
        industry: "Technology",
        logo: "https://via.placeholder.com/50x50/007bff/ffffff?text=T"
      },
      title: "Social Media Promotion Campaign",
      description: "Help us promote our new mobile app through your social media presence",
      tiers: [
        {
          type: "Instagram Story",
          price: 150,
          description: "One story post featuring our app",
          duration: "24 hours"
        },
        {
          type: "Instagram Post",
          price: 300,
          description: "One feed post with caption and hashtags",
          duration: "1 week"
        },
        {
          type: "Instagram Reel",
          price: 500,
          description: "One creative reel showcasing app features",
          duration: "2 weeks"
        },
        {
          type: "TikTok Video",
          price: 400,
          description: "One TikTok video with trending audio",
          duration: "1 week"
        }
      ],
      requirements: "Must be tech-savvy and active on social media",
      targetAudience: "Students, young professionals"
    },
    {
      id: 2,
      business: {
        name: "Local Fitness Center",
        industry: "Health & Fitness",
        logo: "https://via.placeholder.com/50x50/28a745/ffffff?text=F"
      },
      title: "Fitness Influencer Partnership",
      description: "Promote our gym and fitness programs to your audience",
      tiers: [
        {
          type: "Gym Tour Video",
          price: 200,
          description: "Tour video of our facilities",
          duration: "1 week"
        },
        {
          type: "Workout Session",
          price: 350,
          description: "Record a workout session at our gym",
          duration: "2 weeks"
        },
        {
          type: "Before/After Story",
          price: 250,
          description: "Share your fitness journey with our gym",
          duration: "1 week"
        }
      ],
      requirements: "Must be fitness-focused and have active followers",
      targetAudience: "Fitness enthusiasts, students"
    }
  ];

  const handleProposeDeal = (deal, tier) => {
    // Navigate to create proposal page with deal details
    setCurrentPage('create-proposal');
  };

  return (
    <div className="offers-page">
      <header className="page-header">
        <button onClick={onBack} className="back-button">
          ← Back to Dashboard
        </button>
        <h1>NIL Opportunities</h1>
        <p>Browse available deals from local businesses</p>
      </header>

      <div className="deals-grid">
        {businessDeals.map(deal => (
          <div key={deal.id} className="deal-card">
            <div className="deal-header">
              <div className="business-info">
                <img src={deal.business.logo} alt={deal.business.name} className="business-logo" />
                <div>
                  <h3>{deal.business.name}</h3>
                  <span className="industry-tag">{deal.business.industry}</span>
                </div>
              </div>
            </div>

            <div className="deal-content">
              <h4>{deal.title}</h4>
              <p className="deal-description">{deal.description}</p>
              
              <div className="pricing-tiers">
                <h5>Available Packages:</h5>
                {deal.tiers.map((tier, index) => (
                  <div key={index} className="tier-card">
                    <div className="tier-header">
                      <h6>{tier.type}</h6>
                      <span className="tier-price">${tier.price}</span>
                    </div>
                    <p className="tier-description">{tier.description}</p>
                    <div className="tier-details">
                      <span className="duration">Duration: {tier.duration}</span>
                    </div>
                    <button 
                      className="propose-btn"
                      onClick={() => handleProposeDeal(deal, tier)}
                    >
                      Propose Deal
                    </button>
                  </div>
                ))}
              </div>

              <div className="deal-requirements">
                <h5>Requirements:</h5>
                <p>{deal.requirements}</p>
              </div>

              <div className="target-audience">
                <h5>Target Audience:</h5>
                <p>{deal.targetAudience}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

function App() {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [currentPage, setCurrentPage] = useState('landing');
  const [currentDeal, setCurrentDeal] = useState(null);
  const [showLegalDocuments, setShowLegalDocuments] = useState(false);
  const [showPolicies, setShowPolicies] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  
  // UX Overhaul State Variables
  const [showSmartDealTemplates, setShowSmartDealTemplates] = useState(false);
  const [showAutoAdProofTool, setShowAutoAdProofTool] = useState(false);
  const [showMicroCoaching, setShowMicroCoaching] = useState(false);

  // Notification state
  const [notification, setNotification] = useState(null);

  // Get authentication context
  const { user, userProfile, loading: authLoading } = useAuth();

  // Redirect based on authentication status
  useEffect(() => {
    if (!authLoading) {
      if (user && userProfile) {
        // User is authenticated, redirect to appropriate dashboard
        setCurrentPage(userProfile.user_type === 'athlete' ? 'athlete-dashboard' : 'business-dashboard');
      } else {
        // User is not authenticated, stay on landing page
        setCurrentPage('landing');
      }
    }
  }, [user, userProfile, authLoading]);

  // Handle authentication success
  const handleAuthSuccess = (user) => {
    // This will be handled by the AuthContext automatically
    setNotification({
      message: `Welcome to NIL Matchup, ${user.first_name || user.email}!`,
      type: 'success',
      duration: 3000
    });
  };

  // Handle sign out
  const handleSignOut = () => {
    // This will be handled by the AuthContext automatically
    setCurrentPage('landing');
    setNotification({
      message: 'You have been signed out successfully',
      type: 'info',
      duration: 3000
    });
  };

  // Show loading screen while checking authentication
  if (authLoading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading...</p>
      </div>
    );
  }

  // Landing page component - redirects to auth if not logged in
  const LandingPage = () => (
    <div className="landing-page">
      <div className="landing-content">
        <h1 className="landing-title">NIL Matchup</h1>
        <p className="landing-subtitle">NIL for all</p>
        <p className="landing-description">
          Connecting college athletes with local businesses for meaningful partnerships.
        </p>
        
        <div className="landing-buttons">
          <button 
            className="landing-btn primary-btn"
            onClick={() => setCurrentPage('auth')}
          >
            Get Started
          </button>
          <button 
            className="landing-btn secondary-btn"
            onClick={() => setCurrentPage('auth')}
          >
            Sign In
          </button>
        </div>
      </div>
    </div>
  );

  // Render different pages based on currentPage state
  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage />;
      case 'auth':
        return <AuthPage onAuthSuccess={handleAuthSuccess} />;
      case 'athlete-dashboard':
        return <AthleteDashboard onNavigate={setCurrentPage} />;
      case 'business-dashboard':
        return <BusinessDashboard onNavigate={setCurrentPage} />;
      case 'create-deal':
        return <CreateDealForm 
          onDealCreated={(newDeal) => {
            setCurrentDeal(newDeal);
            setCurrentPage('business-dashboard');
            setNotification({
              message: '✅ Deal created successfully! Athletes can now discover and apply.',
              type: 'success',
              duration: 5000
            });
          }}
          onCancel={() => setCurrentPage('business-dashboard')}
        />;
      case 'deal-discovery':
        return <DealDiscoveryPage 
          onBack={() => setCurrentPage('athlete-dashboard')}
          onDealSelected={(deal) => {
            setCurrentDeal(deal);
            setCurrentPage('deal-details');
          }}
        />;
      case 'deals':
        return <DealsPage 
          currentUser={userProfile}
          onBack={() => setCurrentPage(userProfile?.user_type === 'athlete' ? 'athlete-dashboard' : 'business-dashboard')}
        />;
      case 'payment':
        return <PaymentPage 
          currentUser={userProfile}
          onBack={() => setCurrentPage(userProfile?.user_type === 'athlete' ? 'athlete-dashboard' : 'business-dashboard')}
        />;
      case 'payment-processing':
        return <PaymentProcessingPage 
          dealId={currentDeal?.id}
          onComplete={(completedDeal) => {
            setCurrentDeal(completedDeal);
            setCurrentPage(userProfile?.user_type === 'athlete' ? 'athlete-dashboard' : 'business-dashboard');
            alert('✅ Payment processing completed! Your deal is now active.');
          }}
          onBack={() => setCurrentPage(userProfile?.user_type === 'athlete' ? 'athlete-dashboard' : 'business-dashboard')}
        />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <AuthProvider>
      <SecurityProvider>
        <div className="App">
          {renderPage()}
          
          <PlayerModal 
            player={selectedPlayer} 
            onClose={() => setSelectedPlayer(null)} 
          />
          
          <BusinessModal 
            business={selectedBusiness} 
            onClose={() => setSelectedBusiness(null)} 
          />



          {/* Other Modals */}
          {showLegalDocuments && (
            <LegalDocumentsModal onClose={() => setShowLegalDocuments(false)} />
          )}
          
          {showPolicies && (
            <PoliciesModal onClose={() => setShowPolicies(false)} />
          )}
          
          {showSettings && (
            <SettingsModal 
              onClose={() => setShowSettings(false)} 
              currentUser={userProfile}
            />
          )}

          {/* UX Overhaul Components */}

          {showSmartDealTemplates && (
            <SmartDealTemplates
              onClose={() => setShowSmartDealTemplates(false)}
              onTemplateCreated={handleTemplateCreated}
            />
          )}

          {showAutoAdProofTool && (
            <AutoAdProofTool
              deal={null}
              onVerificationComplete={handleAdProofComplete}
              onClose={() => setShowAutoAdProofTool(false)}
            />
          )}

          {showMicroCoaching && (
            <MicroCoachingCarousel
              onComplete={handleMicroCoachingComplete}
              onClose={() => setShowMicroCoaching(false)}
            />
          )}

          {/* Notification */}
          {notification && (
            <Notification
              message={notification.message}
              type={notification.type}
              duration={notification.duration}
              onClose={clearNotification}
            />
          )}

          {/* Footer */}
          <Footer />

        </div>
      </SecurityProvider>
    </AuthProvider>
  );
}

export default App;