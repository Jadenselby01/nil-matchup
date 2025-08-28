import React, { useState, useEffect } from 'react';
import { useAuth } from '../../auth/AuthProvider';
import './Deals.css';

const DealDiscoveryPage = ({ onBack, onDealSelected }) => {
  const { userProfile } = useAuth();
  const [deals, setDeals] = useState([]);
  const [filteredDeals, setFilteredDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: '',
    sport: '',
    budgetMin: '',
    budgetMax: '',
    location: '',
    isRemote: false
  });

  useEffect(() => {
    fetchAvailableDeals();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [deals, filters]);

  const fetchAvailableDeals = async () => {
    try {
      setLoading(true);
      
      // TODO: Replace with real Supabase call
      // const { data, error } = await supabase
      //   .from('deals')
      //   .select('*')
      //   .eq('status', 'open')
      //   .order('created_at', { ascending: false });

      // Mock data for now
      const mockDeals = [
        {
          // id will come from database
          business_name: 'Local Sports Shop',
          title: 'Social Media Campaign for New Equipment Line',
          description: 'Promote our latest sports equipment on Instagram and TikTok. Looking for athletes with strong social media presence.',
          category: 'social_media',
          budget_min: 500,
          budget_max: 1000,
          deliverables: '3 Instagram posts, 2 TikTok videos, 5 stories',
          deadline: '2024-03-01',
          location: 'Chapel Hill, NC',
          is_remote: true,
          athlete_preferences: {
            sport: 'Basketball',
            university: 'UNC Chapel Hill',
            min_followers: 1000,
            engagement_rate: 3.0
          },
          created_at: '2024-01-15'
        },
        {
          // id will come from database
          business_name: 'Fitness Brand Co.',
          title: 'Product Endorsement Campaign',
          description: 'Feature our new fitness apparel in your workout content. Perfect for athletes who love fitness and fashion.',
          category: 'brand_campaign',
          budget_min: 800,
          budget_max: 1500,
          deliverables: '4 Instagram posts, 2 YouTube shorts, product review',
          deadline: '2024-03-15',
          location: 'Remote',
          is_remote: true,
          athlete_preferences: {
            sport: 'Any',
            university: 'Any',
            min_followers: 2000,
            engagement_rate: 4.0
          },
          created_at: '2024-01-20'
        },
        {
          // id will come from database
          business_name: 'Local Restaurant',
          title: 'Food Review and Promotion',
          description: 'Visit our restaurant and create content about your experience. Share on social media with your followers.',
          category: 'content_creation',
          budget_min: 300,
          budget_max: 600,
          deliverables: '1 Instagram post, 1 TikTok video, 3 stories',
          deadline: '2024-02-28',
          location: 'Durham, NC',
          is_remote: false,
          athlete_preferences: {
            sport: 'Any',
            university: 'Duke University',
            min_followers: 500,
            engagement_rate: 2.5
          },
          created_at: '2024-01-25'
        }
      ];

      setDeals(mockDeals);
    } catch (error) {
      console.error('Error fetching deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...deals];

    if (filters.category) {
      filtered = filtered.filter(deal => deal.category === filters.category);
    }

    if (filters.sport) {
      filtered = filtered.filter(deal => 
        deal.athlete_preferences?.sport === filters.sport || 
        deal.athlete_preferences?.sport === 'Any'
      );
    }

    if (filters.budgetMin) {
      filtered = filtered.filter(deal => deal.budget_max >= parseFloat(filters.budgetMin));
    }

    if (filters.budgetMax) {
      filtered = filtered.filter(deal => deal.budget_min <= parseFloat(filters.budgetMax));
    }

    if (filters.location) {
      filtered = filtered.filter(deal => 
        deal.location.toLowerCase().includes(filters.location.toLowerCase()) ||
        deal.is_remote
      );
    }

    if (filters.isRemote) {
      filtered = filtered.filter(deal => deal.is_remote);
    }

    setFilteredDeals(filtered);
  };

  const handleFilterChange = (field, value) => {
    setFilters(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleDealClick = (deal) => {
    if (onDealSelected) {
      onDealSelected(deal);
    }
  };

  const getCategoryLabel = (category) => {
    const labels = {
      'social_media': 'Social Media',
      'content_creation': 'Content Creation',
      'product_review': 'Product Review',
      'event_promotion': 'Event Promotion',
      'brand_campaign': 'Brand Campaign',
      'ambassador': 'Brand Ambassador',
      'appearance': 'Personal Appearance',
      'other': 'Other'
    };
    return labels[category] || category;
  };

  const formatBudget = (min, max) => {
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  };

  const checkEligibility = (deal) => {
    if (!userProfile) return false;
    
    const preferences = deal.athlete_preferences;
    
    // Check sport preference
    if (preferences.sport && preferences.sport !== 'Any' && preferences.sport !== userProfile.sport) {
      return false;
    }
    
    // Check university preference
    if (preferences.university && preferences.university !== 'Any' && preferences.university !== userProfile.university) {
      return false;
    }
    
    return true;
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading available deals...</p>
      </div>
    );
  }

  return (
    <div className="deal-discovery-page">
      <header className="page-header">
        <button className="back-btn" onClick={onBack}>
          ← Back to Dashboard
        </button>
        <h1>Discover NIL Opportunities</h1>
        <p>Find deals that match your skills and interests</p>
      </header>

      <div className="deals-filters">
        <div className="filters-header">
          <h3>Filters</h3>
          <button 
            className="btn-secondary"
            onClick={() => setFilters({
              category: '',
              sport: '',
              budgetMin: '',
              budgetMax: '',
              location: '',
              isRemote: false
            })}
          >
            Clear All
          </button>
        </div>
        
        <div className="filters-form">
          <div className="filter-group">
            <label>Category</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
            >
              <option value="">All Categories</option>
              <option value="social_media">Social Media</option>
              <option value="content_creation">Content Creation</option>
              <option value="product_review">Product Review</option>
              <option value="event_promotion">Event Promotion</option>
              <option value="brand_campaign">Brand Campaign</option>
              <option value="ambassador">Brand Ambassador</option>
              <option value="appearance">Personal Appearance</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Sport</label>
            <select
              value={filters.sport}
              onChange={(e) => handleFilterChange('sport', e.target.value)}
            >
              <option value="">All Sports</option>
              <option value="Basketball">Basketball</option>
              <option value="Football">Football</option>
              <option value="Baseball">Baseball</option>
              <option value="Soccer">Soccer</option>
              <option value="Tennis">Tennis</option>
              <option value="Golf">Golf</option>
              <option value="Swimming">Swimming</option>
              <option value="Track & Field">Track & Field</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Min Budget</label>
            <input
              type="number"
              placeholder="Min amount"
              value={filters.budgetMin}
              onChange={(e) => handleFilterChange('budgetMin', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Max Budget</label>
            <input
              type="number"
              placeholder="Max amount"
              value={filters.budgetMax}
              onChange={(e) => handleFilterChange('budgetMax', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label>Location</label>
            <input
              type="text"
              placeholder="City, State"
              value={filters.location}
              onChange={(e) => handleFilterChange('location', e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={filters.isRemote}
                onChange={(e) => handleFilterChange('isRemote', e.target.checked)}
              />
              Remote only
            </label>
          </div>
        </div>
      </div>

      <div className="deals-results">
        <div className="results-header">
          <h3>Available Deals ({filteredDeals.length})</h3>
        </div>

        {filteredDeals.length === 0 ? (
          <div className="no-deals">
            <p>No deals match your current filters. Try adjusting your search criteria.</p>
          </div>
        ) : (
          <div className="deals-grid">
            {filteredDeals.map(deal => (
              <div 
                key={deal.id} 
                className={`deal-card ${!checkEligibility(deal) ? 'ineligible' : ''}`}
                onClick={() => handleDealClick(deal)}
              >
                <div className="deal-header">
                  <h4 className="deal-title">{deal.title}</h4>
                  <span className="deal-category">
                    {getCategoryLabel(deal.category)}
                  </span>
                </div>

                <p className="deal-business">{deal.business_name}</p>
                
                <p className="deal-description">{deal.description}</p>

                <div className="deal-budget">
                  {formatBudget(deal.budget_min, deal.budget_max)}
                </div>

                <div className="deal-details">
                  <div className="detail-item">
                    <span className="detail-label">Deliverables</span>
                    <span className="detail-value">{deal.deliverables}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Deadline</span>
                    <span className="detail-value">{deal.deadline}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Location</span>
                    <span className="detail-value">
                      {deal.is_remote ? 'Remote' : deal.location}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Preferred Sport</span>
                    <span className="detail-value">
                      {deal.athlete_preferences?.sport || 'Any'}
                    </span>
                  </div>
                </div>

                {!checkEligibility(deal) && (
                  <div className="eligibility-warning">
                    ⚠️ This deal may not be a perfect match for your profile
                  </div>
                )}

                <div className="deal-actions">
                  <button className="btn-primary">View Details</button>
                  <button className="btn-secondary">Apply Now</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DealDiscoveryPage; 