import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Dashboard.css';

const AthleteDashboard = ({ onNavigate }) => {
  const { user, userProfile, signOut } = useAuth();
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Fetch athlete's deals from the database
    fetchAthleteDeals();
  }, []);

  const fetchAthleteDeals = async () => {
    try {
      setLoading(true);
      // TODO: Replace with real API call to Supabase
      // const { data, error } = await supabase
      //   .from('deals')
      //   .select('*')
      //   .eq('athlete_id', user.id)
      //   .order('created_at', { ascending: false });

      // For now, use mock data
      const mockDeals = [
        {
          id: 'deal-1',
          title: 'Social Media Campaign',
          business_name: 'Local Sports Shop',
          amount: 500,
          status: 'active',
          deadline: '2024-02-15',
          created_at: '2024-01-15'
        },
        {
          id: 'deal-2',
          title: 'Product Endorsement',
          business_name: 'Fitness Brand',
          amount: 800,
          status: 'pending',
          deadline: '2024-03-01',
          created_at: '2024-01-20'
        }
      ];

      setDeals(mockDeals);
    } catch (error) {
      console.error('Error fetching deals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleDiscoverDeals = () => {
    if (onNavigate) {
      onNavigate('deal-discovery');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'status-active';
      case 'pending': return 'status-pending';
      case 'completed': return 'status-completed';
      default: return 'status-default';
    }
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading your dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="dashboard-header-content">
          <div className="user-info">
            <div className="user-avatar">
              {userProfile?.first_name?.charAt(0) || user?.email?.charAt(0) || 'U'}
            </div>
            <div className="user-details">
              <h1>Welcome back, {userProfile?.first_name || 'Athlete'}!</h1>
              <p>{userProfile?.sport} • {userProfile?.university}</p>
            </div>
          </div>
          <button className="sign-out-btn" onClick={handleSignOut}>
            Sign Out
          </button>
        </div>
      </header>

      <div className="dashboard-content">
        <nav className="dashboard-nav">
          <button
            className={`nav-tab ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            Overview
          </button>
          <button
            className={`nav-tab ${activeTab === 'deals' ? 'active' : ''}`}
            onClick={() => setActiveTab('deals')}
          >
            My Deals
          </button>
          <button
            className={`nav-tab ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile
          </button>
          <button
            className={`nav-tab ${activeTab === 'earnings' ? 'active' : ''}`}
            onClick={() => setActiveTab('earnings')}
          >
            Earnings
          </button>
        </nav>

        <main className="dashboard-main">
          {activeTab === 'overview' && (
            <div className="overview-tab">
              <div className="stats-grid">
                <div className="stat-card">
                  <h3>Active Deals</h3>
                  <p className="stat-number">{deals.filter(d => d.status === 'active').length}</p>
                </div>
                <div className="stat-card">
                  <h3>Total Earnings</h3>
                  <p className="stat-number">${deals.reduce((sum, d) => sum + (d.status === 'completed' ? d.amount : 0), 0)}</p>
                </div>
                <div className="stat-card">
                  <h3>Pending Deals</h3>
                  <p className="stat-number">{deals.filter(d => d.status === 'pending').length}</p>
                </div>
              </div>

              <div className="recent-activity">
                <h3>Recent Activity</h3>
                <div className="activity-list">
                  {deals.slice(0, 3).map(deal => (
                    <div key={deal.id} className="activity-item">
                      <div className="activity-icon">📋</div>
                      <div className="activity-content">
                        <p><strong>{deal.title}</strong> - {deal.business_name}</p>
                        <small>${deal.amount} • {deal.status}</small>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'deals' && (
            <div className="deals-tab">
              <div className="deals-header">
                <h3>My Deals</h3>
                <button className="btn-primary" onClick={handleDiscoverDeals}>
                  Discover New Deals
                </button>
              </div>
              
              <div className="deals-list">
                {deals.map(deal => (
                  <div key={deal.id} className="deal-card">
                    <div className="deal-header">
                      <h4>{deal.title}</h4>
                      <span className={`status-badge ${getStatusColor(deal.status)}`}>
                        {deal.status}
                      </span>
                    </div>
                    <div className="deal-details">
                      <p><strong>Business:</strong> {deal.business_name}</p>
                      <p><strong>Amount:</strong> ${deal.amount}</p>
                      <p><strong>Deadline:</strong> {deal.deadline}</p>
                    </div>
                    <div className="deal-actions">
                      <button className="btn-secondary">View Details</button>
                      {deal.status === 'active' && (
                        <button className="btn-primary">Submit Work</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="profile-tab">
              <h3>Profile Information</h3>
              <div className="profile-form">
                <div className="form-group">
                  <label>First Name</label>
                  <input type="text" value={userProfile?.first_name || ''} readOnly />
                </div>
                <div className="form-group">
                  <label>Last Name</label>
                  <input type="text" value={userProfile?.last_name || ''} readOnly />
                </div>
                <div className="form-group">
                  <label>Sport</label>
                  <input type="text" value={userProfile?.sport || ''} readOnly />
                </div>
                <div className="form-group">
                  <label>University</label>
                  <input type="text" value={userProfile?.university || ''} readOnly />
                </div>
                <button className="btn-primary">Edit Profile</button>
              </div>
            </div>
          )}

          {activeTab === 'earnings' && (
            <div className="earnings-tab">
              <h3>Earnings Overview</h3>
              <div className="earnings-summary">
                <div className="earnings-card">
                  <h4>This Month</h4>
                  <p className="earnings-amount">$0</p>
                </div>
                <div className="earnings-card">
                  <h4>Total Earned</h4>
                  <p className="earnings-amount">$0</p>
                </div>
              </div>
              <p className="earnings-note">Complete deals to start earning!</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default AthleteDashboard; 