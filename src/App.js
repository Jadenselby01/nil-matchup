import React, { useState, useEffect } from 'react';
import './App.css';
import AuthService from './services/authService';
import { SecurityProvider } from './contexts/SecurityContext';
import Notification from './components/Notification';
import DealsDropdown from './components/DealsDropdown';
import CommunicationDropdown from './components/CommunicationDropdown';
import MessagingPage from './MessagingPage';
import PaymentPage from './PaymentPage';
import PaymentProcessingPage from './PaymentProcessingPage';
import DocumentSigningPage from './components/DocumentSigningPage';
import CreateProposalPage from './CreateProposalPage';
import DealsPage from './DealsPage';
import Footer from './components/Footer';

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
const OffersPage = ({ onBack }) => (
  <div className="page-container">
    <header className="page-header">
      <button className="back-btn" onClick={onBack}>← Back</button>
      <h1>Offers</h1>
    </header>
    <main className="page-content">
      <p>Offers list would go here.</p>
    </main>
  </div>
);

function App() {
  const [selectedPlayer, setSelectedPlayer] = useState(null);
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [currentPage, setCurrentPage] = useState('landing'); // 'landing', 'players', 'athlete-login', 'athlete-signup', 'business-login', 'business-signup', 'athlete-profile', 'business-profile', 'athlete-dashboard', 'business-dashboard', 'create-offer', 'offers', 'messaging', 'payment', 'payment-history'
  const [userType, setUserType] = useState(''); // 'athlete' or 'business'
  const [currentUser, setCurrentUser] = useState(null); // For messaging system
  // const [paymentData, setPaymentData] = useState(null); // For payment processing
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authLoading, setAuthLoading] = useState(false);
  const [showLegalDocuments, setShowLegalDocuments] = useState(false);
  const [showPolicies, setShowPolicies] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  // const [legalDocumentsCompleted, setLegalDocumentsCompleted] = useState(false);
  
  // UX Overhaul State Variables
  const [showSmartDealTemplates, setShowSmartDealTemplates] = useState(false);
  const [showAutoAdProofTool, setShowAutoAdProofTool] = useState(false);
  const [showMicroCoaching, setShowMicroCoaching] = useState(false);
  const [currentDeal, setCurrentDeal] = useState(null);
  const [showPaymentProcessing, setShowPaymentProcessing] = useState(false);

  // Notification state
  const [notification, setNotification] = useState(null);

  // Clean up corrupted localStorage data on app start
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('currentUser');
      if (savedUser && savedUser.includes('[object Object]')) {
        // Clear corrupted data
        localStorage.removeItem('currentUser');
        localStorage.removeItem('profileCompleted');
        localStorage.removeItem('isNewUser');
        console.log('Cleared corrupted localStorage data');
      }
    } catch (error) {
      console.error('Error cleaning localStorage:', error);
    }
  }, []);

  // Check for existing authentication and redirect to dashboard
  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser && currentPage === 'landing') {
      try {
        const user = JSON.parse(savedUser);
        if (user && typeof user === 'object' && user.type) {
          setCurrentUser(user);
          setUserType(user.type);
          setIsAuthenticated(true);
          setCurrentPage(user.type === 'athlete' ? 'athlete-dashboard' : 'business-dashboard');
        } else {
          // Invalid user data, clear it
          localStorage.removeItem('currentUser');
        }
      } catch (error) {
        // Invalid JSON, clear the corrupted data
        console.error('Error parsing saved user data:', error);
        localStorage.removeItem('currentUser');
      }
    }
  }, [currentPage]);



  // Sample athlete data
  const athletes = [
    {
      id: 1,
      name: "Michael Johnson",
      image: "https://via.placeholder.com/200x200/007bff/ffffff?text=MJ",
      bio: "Star quarterback with incredible passing accuracy and leadership skills. Known for clutch performances in big games.",
      sport: "Football",
      university: "University of North Carolina",
      age: 20,
      instagram: "https://instagram.com/michaeljohnson",
      twitter: "https://twitter.com/michaeljohnson",
      tiktok: "https://tiktok.com/@michaeljohnson"
    },
    {
      id: 2,
      name: "Sarah Williams",
      image: "https://via.placeholder.com/200x200/28a745/ffffff?text=SW",
      bio: "Elite basketball player with exceptional shooting range and defensive prowess. Team captain and academic standout.",
      sport: "Basketball",
      university: "Duke University",
      age: 21,
      instagram: "https://instagram.com/sarahwilliams",
      twitter: "https://twitter.com/sarahwilliams",
      tiktok: "https://tiktok.com/@sarahwilliams"
    },
    {
      id: 3,
      name: "David Chen",
      image: "https://via.placeholder.com/200x200/dc3545/ffffff?text=DC",
      bio: "Dynamic soccer midfielder with incredible ball control and vision. International experience and community leader.",
      sport: "Soccer",
      university: "NC State University",
      age: 19,
      instagram: "https://instagram.com/davidchen",
      twitter: "https://twitter.com/davidchen",
      tiktok: "https://tiktok.com/@davidchen"
    },
    {
      id: 4,
      name: "Emma Rodriguez",
      image: "https://via.placeholder.com/200x200/ffc107/ffffff?text=ER",
      bio: "Track and field star specializing in sprint events. Multiple conference champion and record holder.",
      sport: "Track & Field",
      university: "Wake Forest University",
      age: 22,
      instagram: "https://instagram.com/emmarodriguez",
      twitter: "https://twitter.com/emmarodriguez",
      tiktok: "https://tiktok.com/@emmarodriguez"
    },
    {
      id: 5,
      name: "Marcus Thompson",
      image: "https://via.placeholder.com/200x200/17a2b8/ffffff?text=MT",
      bio: "Elite swimmer with multiple NCAA records. Olympic hopeful and academic all-American.",
      sport: "Swimming",
      university: "University of Virginia",
      age: 20,
      instagram: "https://instagram.com/marcusthompson",
      twitter: "https://twitter.com/marcusthompson",
      tiktok: "https://tiktok.com/@marcusthompson"
    },
    {
      id: 6,
      name: "Jessica Kim",
      image: "https://via.placeholder.com/200x200/6f42c1/ffffff?text=JK",
      bio: "Tennis prodigy with exceptional court coverage and powerful serve. Ranked top 10 nationally.",
      sport: "Tennis",
      university: "Clemson University",
      age: 19,
      instagram: "https://instagram.com/jessicakim",
      twitter: "https://twitter.com/jessicakim",
      tiktok: "https://tiktok.com/@jessicakim"
    },
    {
      id: 7,
      name: "Alex Rivera",
      image: "https://via.placeholder.com/200x200/dc3545/ffffff?text=AR",
      bio: "Baseball pitcher with a 95mph fastball and devastating curveball. MLB draft prospect.",
      sport: "Baseball",
      university: "Georgia Tech",
      age: 21,
      instagram: "https://instagram.com/alexrivera",
      twitter: "https://twitter.com/alexrivera",
      tiktok: "https://tiktok.com/@alexrivera"
    },
    {
      id: 8,
      name: "Taylor Wilson",
      image: "https://via.placeholder.com/200x200/28a745/ffffff?text=TW",
      bio: "Volleyball setter with incredible court vision and leadership skills. Team captain and community volunteer.",
      sport: "Volleyball",
      university: "University of Miami",
      age: 20,
      instagram: "https://instagram.com/taylorwilson",
      twitter: "https://twitter.com/taylorwilson",
      tiktok: "https://tiktok.com/@taylorwilson"
    }
  ];

  // Sample business data
  const businesses = [
    {
      id: 1,
      name: "Carolina Sports Bar & Grill",
      image: "https://via.placeholder.com/200x200/6f42c1/ffffff?text=CSB",
      description: "Local sports bar serving the best wings and burgers in Chapel Hill. Perfect venue for athlete appearances and events.",
      type: "Restaurant",
      location: "Chapel Hill, NC",
      partnershipType: "Event Appearances",
      budgetRange: "$500 - $1,000",
      requirements: "Looking for athletes to make appearances during game days and special events."
    },
    {
      id: 2,
      name: "Elite Fitness Center",
      image: "https://via.placeholder.com/200x200/20c997/ffffff?text=EFC",
      description: "Premium fitness facility offering personal training, group classes, and state-of-the-art equipment.",
      type: "Fitness & Wellness",
      location: "Durham, NC",
      partnershipType: "Brand Ambassador",
      budgetRange: "$1,000 - $5,000",
      requirements: "Seeking athletes to promote our facility and create fitness content."
    },
    {
      id: 3,
      name: "University Auto Service",
      image: "https://via.placeholder.com/200x200/fd7e14/ffffff?text=UAS",
      description: "Trusted automotive service center providing maintenance and repairs for students and faculty.",
      type: "Automotive",
      location: "Raleigh, NC",
      partnershipType: "Social Media Promotion",
      budgetRange: "$0 - $500",
      requirements: "Need athletes to promote our student discount program on social media."
    },
    {
      id: 4,
      name: "Campus Real Estate Group",
      image: "https://via.placeholder.com/200x200/e83e8c/ffffff?text=CRE",
      description: "Specializing in student housing and investment properties near university campuses.",
      type: "Real Estate",
      location: "Chapel Hill, NC",
      partnershipType: "Content Creation",
      budgetRange: "$5,000 - $10,000",
      requirements: "Looking for athletes to create content about student housing options and campus life."
    },
    {
      id: 5,
      name: "Durham Coffee Roasters",
      image: "https://via.placeholder.com/200x200/6f42c1/ffffff?text=DCR",
      description: "Artisan coffee roastery serving specialty coffee and pastries. Popular student hangout spot.",
      type: "Restaurant",
      location: "Durham, NC",
      partnershipType: "Social Media Promotion",
      budgetRange: "$150 - $250",
      requirements: "Need athletes to promote our seasonal blends and student discount program."
    },
    {
      id: 6,
      name: "UNC Bookstore",
      image: "https://via.placeholder.com/200x200/17a2b8/ffffff?text=UNB",
      description: "Official university bookstore offering textbooks, apparel, and school supplies.",
      type: "Retail",
      location: "Chapel Hill, NC",
      partnershipType: "Social Media Promotion",
      budgetRange: "$200 - $400",
      requirements: "Seeking athletes to promote back-to-school deals and university merchandise."
    },
    {
      id: 7,
      name: "Chapel Hill Pizza Co.",
      image: "https://via.placeholder.com/200x200/ff6b6b/ffffff?text=CHP",
      description: "Local pizza restaurant serving authentic Italian-style pizzas and craft beer.",
      type: "Restaurant",
      location: "Chapel Hill, NC",
      partnershipType: "Content Creation",
      budgetRange: "$400 - $600",
      requirements: "Looking for athletes to create content about our new menu items and delivery service."
    },
    {
      id: 8,
      name: "Raleigh Tech Solutions",
      image: "https://via.placeholder.com/200x200/20c997/ffffff?text=RTS",
      description: "Technology consulting firm specializing in student software and app development.",
      type: "Professional Services",
      location: "Raleigh, NC",
      partnershipType: "Brand Ambassador",
      budgetRange: "$1,000 - $3,000",
      requirements: "Need athletes to represent our brand and promote student-focused tech solutions."
    }
  ];

  // Image upload handler
  const handleImageUpload = (event, setImageFunction) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setImageFunction(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // UX Overhaul Handler Functions

  const handleDealCreate = (dealData) => {
    setShowSmartDealTemplates(false);
    // Create the deal using the template data
    console.log('Creating deal:', dealData);
    // In a real app, this would save to the database
    alert('Deal created successfully!');
  };

  const handleAdProofComplete = (verificationData) => {
    setShowAutoAdProofTool(false);
    console.log('Ad proof verification:', verificationData);
    alert('Post verification completed!');
  };

  const handleMicroCoachingComplete = () => {
    setShowMicroCoaching(false);
    alert('✅ Coaching completed! You\'re ready to create amazing NIL content.');
  };

  const handleProcessPayment = (deal) => {
    setCurrentDeal(deal);
    setCurrentPage('payment-processing');
  };

  const handleTemplateCreated = (templateData) => {
    showNotification(
      `✅ Smart template "${templateData.title}" created successfully! Athletes can now see and propose deals based on this template.`,
      'success',
      5000
    );
  };

  // Show notification function
  const showNotification = (message, type = 'success', duration = 5000) => {
    setNotification({ message, type, duration });
  };

  // Clear notification function
  const clearNotification = () => {
    setNotification(null);
  };


  // Landing page component
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
            onClick={() => {
              setUserType('athlete');
              setCurrentPage('athlete-login');
            }}
          >
            Athlete
          </button>
          <button 
            className="landing-btn secondary-btn"
            onClick={() => {
              setUserType('business');
              setCurrentPage('business-login');
            }}
          >
            Business
          </button>

        </div>
      </div>
    </div>
  );

  // Login page component
  const LoginPage = ({ type }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
      e.preventDefault();
      setAuthLoading(true);
      setError('');

      try {
        const { data, error } = await AuthService.signIn(email, password, type);
        
        if (error) {
          setError(error.message);
        } else {
          setCurrentUser(data.user);
          setIsAuthenticated(true);
          localStorage.setItem('currentUser', JSON.stringify(data.user));
          // Check if user has completed profile
          const hasProfile = localStorage.getItem('profileCompleted');
          
          setCurrentPage(type === 'athlete' ? 'athlete-dashboard' : 'business-dashboard');
        }
      } catch (err) {
        setError('Login failed. Please try again.');
      } finally {
        setAuthLoading(false);
      }
    };

    return (
      <div className="auth-page">
        <div className="auth-content">
          <button 
            className="back-btn"
            onClick={() => setCurrentPage('landing')}
          >
            ← Back to Home
          </button>
          
          <h1 className="auth-title">{type === 'athlete' ? 'Athlete' : 'Business'} Login</h1>
          <p className="auth-subtitle">Welcome back to NIL Matchup</p>
          
          <form className="auth-form" onSubmit={handleSubmit}>
            {error && <div className="error-message">{error}</div>}
            
            <div className="form-group">
              <label>Email</label>
              <input 
                type="email" 
                placeholder="Enter your email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <input 
                type="password" 
                placeholder="Enter your password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required 
              />
            </div>
            
            <button 
              type="submit" 
              className="auth-btn primary-btn"
              disabled={authLoading}
            >
              {authLoading ? 'Logging in...' : 'Login'}
            </button>
            

          </form>
          
          <div className="auth-footer">
            <p>Don't have an account? 
              <button 
                className="link-btn"
                onClick={() => setCurrentPage(type === 'athlete' ? 'athlete-signup' : 'business-signup')}
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Comprehensive Signup & Profile Creation page component
  const SignupPage = ({ type }) => {
    const [formData, setFormData] = useState({
      profileImage: null,
      name: '',
      email: '',
      password: '',
      sport: '',
      businessType: '',
      age: '',
      university: '',
      bio: '',
      location: '',
      businessDescription: '',
      partnershipType: '',
      budgetRange: '',
      additionalRequirements: '',
      phone: '',
      instagram: '',
      twitter: '',
      tiktok: '',
      linkedin: '',
      legalSigned: false
    });

    const handleInputChange = (field, value) => {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    };

    const handleImageUpload = (event) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          handleInputChange('profileImage', e.target.result);
        };
        reader.readAsDataURL(file);
      }
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      
      // Create user object with all profile data
      const user = {
        id: type === 'athlete' ? 1 : 101,
        name: formData.name,
        email: formData.email,
        type: type,
        image: formData.profileImage || (type === 'athlete' ? athletes[0].image : businesses[0].image),
        ...formData
      };
      
      // Mark profile as completed and store user data
      localStorage.setItem('profileCompleted', 'true');
      localStorage.removeItem('isNewUser');
      localStorage.setItem('currentUser', JSON.stringify(user));
      setCurrentUser(user);
      setUserType(type);
      
      // Navigate to document signing page
      setCurrentPage('document-signing');
    };

    return (
      <div className="auth-page comprehensive-signup">
        <div className="auth-content">
          <button 
            className="back-btn"
            onClick={() => setCurrentPage(type === 'athlete' ? 'athlete-login' : 'business-login')}
          >
            ← Back to Login
          </button>
          
          <h1 className="auth-title">{type === 'athlete' ? 'Athlete' : 'Business'} Sign Up</h1>
          <p className="auth-subtitle">Create your account and complete your profile</p>
          
          <form className="auth-form comprehensive-form" onSubmit={handleSubmit}>
            {/* Profile Image Section */}
            <div className="form-section">
              <h3>Profile Photo</h3>
              <div className="image-upload-section">
                {formData.profileImage ? (
                  <div className="image-preview">
                    <img src={formData.profileImage} alt="Profile preview" />
                    <button 
                      type="button" 
                      className="change-image-btn"
                      onClick={() => document.getElementById('profile-image-input').click()}
                    >
                      Change Photo
                    </button>
                  </div>
                ) : (
                  <div className="upload-placeholder">
                    <div className="upload-icon">{type === 'athlete' ? 'Photo' : 'Logo'}</div>
                    <p>Click to upload your {type === 'athlete' ? 'photo' : 'logo'}</p>
                    <small>JPG, PNG up to 5MB</small>
                    <input
                      id="profile-image-input"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      style={{ display: 'none' }}
                    />
                    <button 
                      type="button"
                      className="upload-btn"
                      onClick={() => document.getElementById('profile-image-input').click()}
                    >
                      Choose {type === 'athlete' ? 'Photo' : 'Logo'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Account Information Section */}
            <div className="form-section">
              <h3>Account Information</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>{type === 'athlete' ? 'Full Name' : 'Business Name'}</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder={type === 'athlete' ? 'Michael Johnson' : 'Carolina Sports Bar & Grill'}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    placeholder="Create a password"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', e.target.value)}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Basic Information Section */}
            <div className="form-section">
              <h3>Basic Information</h3>
              {type === 'athlete' ? (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Age</label>
                      <input
                        type="number"
                        value={formData.age}
                        onChange={(e) => handleInputChange('age', e.target.value)}
                        placeholder="Enter your age"
                        min="16"
                        max="30"
                        required
                      />
                    </div>
                    
                    <div className="form-group">
                      <label>Sport</label>
                      <select
                        value={formData.sport}
                        onChange={(e) => handleInputChange('sport', e.target.value)}
                        required
                      >
                        <option value="">Select your sport</option>
                        <option value="football">Football</option>
                        <option value="basketball">Basketball</option>
                        <option value="soccer">Soccer</option>
                        <option value="baseball">Baseball</option>
                        <option value="tennis">Tennis</option>
                        <option value="swimming">Swimming</option>
                        <option value="track">Track & Field</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>School/University</label>
                    <input
                      type="text"
                      value={formData.university}
                      onChange={(e) => handleInputChange('university', e.target.value)}
                      placeholder="Enter your school or university"
                      required
                    />
                  </div>
                  
                  <div className="form-group">
                    <label>Bio</label>
                    <textarea
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      placeholder="Tell businesses about yourself, your achievements, and what makes you unique..."
                      rows="4"
                      required
                    />
                  </div>
                </>
              ) : (
                <>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Business Type</label>
                      <select
                        value={formData.businessType}
                        onChange={(e) => handleInputChange('businessType', e.target.value)}
                        required
                      >
                        <option value="">Select business type</option>
                        <option value="restaurant">Restaurant</option>
                        <option value="retail">Retail</option>
                        <option value="fitness">Fitness & Wellness</option>
                        <option value="automotive">Automotive</option>
                        <option value="real-estate">Real Estate</option>
                        <option value="professional-services">Professional Services</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label>Location</label>
                      <input
                        type="text"
                        value={formData.location}
                        onChange={(e) => handleInputChange('location', e.target.value)}
                        placeholder="Enter your business address"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="form-group">
                    <label>Business Description</label>
                    <textarea
                      value={formData.businessDescription}
                      onChange={(e) => handleInputChange('businessDescription', e.target.value)}
                      placeholder="Tell athletes about your business, what you offer, and why they should partner with you..."
                      rows="4"
                      required
                    />
                  </div>
                </>
              )}
            </div>

            {/* Social Media Section */}
            <div className="form-section">
              <h3>Social Media Links</h3>
              <div className="form-row">
                <div className="form-group">
                  <label>Instagram</label>
                  <input
                    type="url"
                    value={formData.instagram}
                    onChange={(e) => handleInputChange('instagram', e.target.value)}
                    placeholder="https://instagram.com/yourusername"
                  />
                </div>
                
                <div className="form-group">
                  <label>Twitter/X</label>
                  <input
                    type="url"
                    value={formData.twitter}
                    onChange={(e) => handleInputChange('twitter', e.target.value)}
                    placeholder="https://twitter.com/yourusername"
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>TikTok</label>
                  <input
                    type="url"
                    value={formData.tiktok}
                    onChange={(e) => handleInputChange('tiktok', e.target.value)}
                    placeholder="https://tiktok.com/@yourusername"
                  />
                </div>
                
                <div className="form-group">
                  <label>LinkedIn</label>
                  <input
                    type="url"
                    value={formData.linkedin}
                    onChange={(e) => handleInputChange('linkedin', e.target.value)}
                    placeholder="https://linkedin.com/in/yourprofile"
                  />
                </div>
              </div>
              
              <div className="social-tip">
                <p>💡 <strong>Tip:</strong> Connected social accounts help {type === 'athlete' ? 'businesses' : 'athletes'} find you and create better deals!</p>
              </div>
            </div>

            {/* Business-specific Partnership Section */}
            {type === 'business' && (
              <div className="form-section">
                <h3>Partnership Requests</h3>
                <div className="form-group">
                  <label>What type of partnerships are you looking for?</label>
                  <select
                    value={formData.partnershipType}
                    onChange={(e) => handleInputChange('partnershipType', e.target.value)}
                    required
                  >
                    <option value="">Select partnership type</option>
                    <option value="social-media">Social Media Promotion</option>
                    <option value="events">Event Appearances</option>
                    <option value="endorsements">Product Endorsements</option>
                    <option value="content">Content Creation</option>
                    <option value="ambassador">Brand Ambassador</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Budget Range</label>
                  <select
                    value={formData.budgetRange}
                    onChange={(e) => handleInputChange('budgetRange', e.target.value)}
                    required
                  >
                    <option value="">Select budget range</option>
                    <option value="0-500">$0 - $500</option>
                    <option value="500-1000">$500 - $1,000</option>
                    <option value="1000-5000">$1,000 - $5,000</option>
                    <option value="5000-10000">$5,000 - $10,000</option>
                    <option value="10000+">$10,000+</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Additional Requirements</label>
                  <textarea
                    value={formData.additionalRequirements}
                    onChange={(e) => handleInputChange('additionalRequirements', e.target.value)}
                    placeholder="Any specific requirements or preferences for athlete partnerships..."
                    rows="3"
                  />
                </div>
              </div>
            )}

            {/* Legal Agreement Section */}
            <div className="form-section">
              <h3>Legal Agreements</h3>
              <div className="legal-section">
                <div className="legal-card">
                  <div className="legal-header">
                    <h4>NIL Platform Agreement</h4>
                    <span className="legal-badge">Required</span>
                  </div>
                  <p>Standard terms for using NILMatch platform</p>
                  <button 
                    type="button"
                    className="sign-btn"
                    onClick={() => handleInputChange('legalSigned', true)}
                  >
                    {formData.legalSigned ? '✅ Signed' : 'Sign Agreement'}
                  </button>
                </div>
                
                <div className="legal-tip">
                  <p>🔒 <strong>Secure:</strong> Your information is protected and agreements are legally binding</p>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="form-actions">
              <button 
                type="submit" 
                className="auth-btn primary-btn complete-btn"
                disabled={!formData.name || !formData.email || !formData.password || 
                         (type === 'athlete' && !formData.sport) || 
                         (type === 'business' && !formData.businessType)}
              >
                Create Account & Complete Profile
              </button>
            </div>
          </form>
          
          <div className="auth-footer">
            <p>Already have an account? 
              <button 
                className="link-btn"
                onClick={() => setCurrentPage(type === 'athlete' ? 'athlete-login' : 'business-login')}
              >
                Login
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  };



  // Athlete Dashboard - View Businesses
  const AthleteDashboard = () => {
    const handleLogout = async () => {
      await AuthService.signOut();
      setCurrentUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('currentUser');
      localStorage.removeItem('profileCompleted');
      localStorage.removeItem('legalDocumentsCompleted');
      localStorage.removeItem('isNewUser');
      setCurrentPage('landing');
    };

    return (
      <>
        <header className="App-header">
          <div className="header-top">
            <div className="dashboard-actions">
              <DropdownMenu
                onViewDocuments={() => setShowLegalDocuments(true)}
                onViewPolicies={() => setShowPolicies(true)}
                onViewSettings={() => setShowSettings(true)}
              />
              <button 
                className="logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
          <h1>{currentUser?.name || 'Athlete'}'s Dashboard</h1>
          <p>Welcome back, {currentUser?.name || 'Athlete'}!</p>
        <div className="dashboard-actions centered">
          <button 
            className="action-btn primary-btn"
            onClick={() => setCurrentPage('offers')}
          >
            NIL Opportunities
          </button>
          <DealsDropdown
            onViewDeals={() => setCurrentPage('deals')}
          />
          <CommunicationDropdown
            onMessages={() => setCurrentPage('messaging')}
            onDeals={() => setCurrentPage('deals')}
            onPayments={() => setCurrentPage('payment')}
          />
        </div>
      </header>

      <main className="explore-grid">
        {businesses.map(business => (
          <div
            key={business.id}
            className="business-card"
            onClick={() => setSelectedBusiness(business)}
          >
            <img src={business.image} alt={business.name} />
            <h3>{business.name}</h3>
            <p className="business-type">{business.type}</p>
            <p className="business-location">{business.location}</p>
            <p className="business-description">{business.description}</p>
            <div className="business-tags">
              <span className="tag partnership">{business.partnershipType}</span>
              <span className="tag budget">{business.budgetRange}</span>
            </div>
          </div>
        ))}
      </main>
    </>
    );
  };

  // Business Dashboard - View Athletes
  const BusinessDashboard = () => {
    const handleLogout = async () => {
      await AuthService.signOut();
      setCurrentUser(null);
      setIsAuthenticated(false);
      localStorage.removeItem('currentUser');
      localStorage.removeItem('profileCompleted');
      localStorage.removeItem('legalDocumentsCompleted');
      localStorage.removeItem('isNewUser');
      setCurrentPage('landing');
    };

    return (
      <>
        <header className="App-header">
          <div className="header-top">
            <div className="dashboard-actions">
              <button 
                className="settings-btn"
                onClick={() => setShowSettings(true)}
              >
                Settings
              </button>
              <button 
                className="logout-btn"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
          <h1>{currentUser?.name || 'Business'}'s Dashboard</h1>
          <p>Welcome back, {currentUser?.name || 'Business'}!</p>
        </header>

        <main className="dashboard-main">
          <div className="dashboard-buttons">
            <button 
              className="action-btn primary-btn"
              onClick={() => setCurrentPage('explore')}
            >
              NIL Opportunities
            </button>
            <button 
              className="action-btn primary-btn"
              onClick={() => setCurrentPage('deals')}
            >
              Deals
            </button>
            <button 
              className="action-btn primary-btn"
              onClick={() => setCurrentPage('messaging')}
            >
              Messages
            </button>
            <button 
              className="action-btn primary-btn"
              onClick={() => setCurrentPage('payment')}
            >
              Payment
            </button>
            <button 
              className="action-btn primary-btn"
              onClick={() => setShowSmartDealTemplates(true)}
            >
              Smart Templates
            </button>
          </div>

          <div className="athletes-preview">
            <h2>Available Athletes</h2>
            <div className="explore-grid">
              {athletes.slice(0, 3).map(athlete => (
                <div
                  key={athlete.id}
                  className="athlete-card"
                  onClick={() => setSelectedPlayer(athlete)}
                >
                  <img src={athlete.image} alt={athlete.name} />
                  <h3>{athlete.name}</h3>
                  <p className="athlete-sport">{athlete.sport}</p>
                  <p className="athlete-university">{athlete.university}</p>
                  <p className="athlete-bio">{athlete.bio}</p>
                  <div className="athlete-tags">
                    <span className="tag age">{athlete.age} years old</span>
                    <span className="tag sport">{athlete.sport}</span>
                  </div>
                </div>
              ))}
            </div>
            <button 
              className="action-btn secondary-btn"
              onClick={() => setCurrentPage('explore')}
            >
              View All Athletes
            </button>
          </div>
        </main>
      </>
    );
  };

  // Explore component - shows users based on user type
  const ExplorePage = () => {
    return (
      <>
        <header className="App-header">
          <div className="header-top">
            <button 
              className="back-btn"
              onClick={() => setCurrentPage(userType === 'athlete' ? 'athlete-dashboard' : 'business-dashboard')}
            >
              ← Back to Dashboard
            </button>
            <div className="dashboard-actions">
              <DropdownMenu
                onViewDocuments={() => setShowLegalDocuments(true)}
                onViewPolicies={() => setShowPolicies(true)}
                onViewSettings={() => setShowSettings(true)}
              />
              <button 
                className="logout-btn"
                onClick={async () => {
                  await AuthService.signOut();
                  setCurrentUser(null);
                  setIsAuthenticated(false);
                  localStorage.removeItem('currentUser');
                  localStorage.removeItem('profileCompleted');
                  localStorage.removeItem('legalDocumentsCompleted');
                  localStorage.removeItem('isNewUser');
                  setCurrentPage('landing');
                }}
              >
                Logout
              </button>
            </div>
          </div>
          <h1>Explore</h1>
          <p>Discover {userType === 'athlete' ? 'businesses' : 'athletes'} to connect with</p>
        </header>
        
        <main className="explore-grid">
          {userType === 'athlete' ? (
            // Athletes see businesses
            businesses.map(business => (
              <div 
                key={business.id} 
                className="business-card"
                onClick={() => setSelectedBusiness(business)}
              >
                <img src={business.image} alt={business.name} />
                <h3>{business.name}</h3>
                <p className="business-type">{business.type}</p>
                <p className="business-location">{business.location}</p>
                <p className="business-description">{business.description}</p>
                <div className="business-tags">
                  <span className="tag partnership">{business.partnershipType}</span>
                  <span className="tag budget">{business.budgetRange}</span>
                </div>
              </div>
            ))
          ) : (
            // Businesses see athletes
            athletes.map(athlete => (
              <div 
                key={athlete.id} 
                className="athlete-card"
                onClick={() => setSelectedPlayer(athlete)}
              >
                <img src={athlete.image} alt={athlete.name} />
                <h3>{athlete.name}</h3>
                <p className="athlete-sport">{athlete.sport}</p>
                <p className="athlete-university">{athlete.university}</p>
                <p className="athlete-bio">{athlete.bio}</p>
                <div className="athlete-tags">
                  <span className="tag age">{athlete.age} years old</span>
                  <span className="tag sport">{athlete.sport}</span>
                </div>
              </div>
            ))
          )}
        </main>
      </>
    );
  };

  // Players page component (legacy)
  const PlayersPage = () => (
    <>
      <header className="App-header">
        <button 
          className="back-btn"
          onClick={() => setCurrentPage('landing')}
        >
          ← Back to Home
        </button>
        <h1>NIL Matchup</h1>
        <p>NIL for all</p>
      </header>
      
      <main className="players-grid">
        {athletes.map(athlete => (
          <div 
            key={athlete.id} 
            className="player-card"
            onClick={() => setSelectedPlayer(athlete)}
          >
            <img src={athlete.image} alt={athlete.name} />
            <h3>{athlete.name}</h3>
            <p>Click to learn more</p>
          </div>
        ))}
      </main>
    </>
  );

  // Render different pages based on currentPage state
  const renderPage = () => {
    switch (currentPage) {
      case 'landing':
        return <LandingPage />;
      case 'players':
        return <PlayersPage />;
      case 'athlete-login':
        return <LoginPage type="athlete" />;
      case 'athlete-signup':
        return <SignupPage type="athlete" />;
      case 'business-login':
        return <LoginPage type="business" />;
      case 'business-signup':
        return <SignupPage type="business" />;

      case 'athlete-dashboard':
        return <AthleteDashboard />;
      case 'business-dashboard':
        return <BusinessDashboard />;
      case 'explore':
        return <ExplorePage />;
      case 'create-offer':
        return <CreateOfferPage onBack={() => setCurrentPage('business-dashboard')} />;
      case 'offers':
        return <OffersPage onBack={() => setCurrentPage('athlete-dashboard')} />;

      case 'deals':
        return <DealsPage 
          currentUser={currentUser}
          onBack={() => setCurrentPage(userType === 'athlete' ? 'athlete-dashboard' : 'business-dashboard')}
        />;

      case 'create-proposal':
        return <CreateProposalPage 
          currentUser={currentUser}
          userType={userType}
          onBack={() => setCurrentPage(userType === 'athlete' ? 'athlete-dashboard' : 'business-dashboard')}
          onProposalSent={(proposalData) => {
            showNotification(
              `🎉 Proposal sent successfully to ${proposalData.targetName}! They will be notified and can review your offer.`,
              'success',
              5000
            );
            setCurrentPage(userType === 'athlete' ? 'athlete-dashboard' : 'business-dashboard');
          }}
        />;

      case 'messaging':
        return <MessagingPage 
          currentUser={currentUser} 
          onBack={() => setCurrentPage(userType === 'athlete' ? 'athlete-dashboard' : 'business-dashboard')} 
        />;
      case 'payment':
        return <PaymentPage 
          paymentData={null}
          onBack={() => setCurrentPage(userType === 'athlete' ? 'athlete-dashboard' : 'business-dashboard')}
          onSuccess={() => {
            alert('Payment successful! Your transaction has been completed.');
            setCurrentPage(userType === 'athlete' ? 'athlete-dashboard' : 'business-dashboard');
          }}
        />;

      case 'payment-processing':
        return <PaymentProcessingPage 
          dealId={currentDeal?.id}
          onComplete={(completedDeal) => {
            setShowPaymentProcessing(false);
            setCurrentDeal(completedDeal);
            setCurrentPage(userType === 'athlete' ? 'athlete-dashboard' : 'business-dashboard');
            alert('✅ Payment processing completed! Your deal is now active.');
          }}
          onBack={() => setCurrentPage(userType === 'athlete' ? 'athlete-dashboard' : 'business-dashboard')}
        />;

      case 'document-signing':
        return <DocumentSigningPage 
          user={currentUser}
          userType={userType}
          onComplete={(signedDocs) => {
            localStorage.setItem('legalDocumentsCompleted', 'true');
            setCurrentPage(userType === 'athlete' ? 'athlete-dashboard' : 'business-dashboard');
            alert(`✅ ${userType === 'athlete' ? 'NIL' : 'Business'} documents signed successfully! Your profile is now active.`);
          }}
          onClose={() => {
            // Allow bypass for testing
            if (window.confirm('Skip document signing for now?')) {
              localStorage.setItem('legalDocumentsCompleted', 'true');
              setCurrentPage(userType === 'athlete' ? 'athlete-dashboard' : 'business-dashboard');
            }
          }}
        />;

      default:
        return <LandingPage />;
    }
  };

  return (
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
            currentUser={currentUser}
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
  );
}

export default App; 