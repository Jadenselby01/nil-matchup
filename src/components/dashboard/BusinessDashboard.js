import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Dashboard.css';

const BusinessDashboard = ({ onNavigate }) => {
  const { user, userProfile, signOut } = useAuth();
  const [deals, setDeals] = useState([]);
  const [athletes, setAthletes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    // Fetch business data
    fetchBusinessData();
  }, []);

  const fetchBusinessData = async () => {
    try {
      setLoading(true);
      
      // Mock data for now - replace with real Supabase calls
      const mockDeals = [
        {
          id: 'deal-1',
          title: 'Social Media Campaign',
          athlete_name: 'Michael Johnson',
          athlete_sport: 'Football',
          amount: 500,
          status: 'active',
          deadline: '2024-02-15',
          created_at: '2024-01-15'
        },
        {
          id: 'deal-2',
          title: 'Product Endorsement',
          athlete_name: 'Sarah Williams',
          athlete_sport: 'Basketball',
          amount: 800,
          status: 'pending',
          deadline: '2024-03-01',
          created_at: '2024-01-20'
        }
      ];

      const mockAthletes = [
        {
          id: 'athlete-1',
          name: 'Michael Johnson',
          sport: 'Football',
          university: 'UNC Chapel Hill',
          followers: 2500,
          engagement_rate: 4.2,
          image: 'https://via.placeholder.com/100x100/007bff/ffffff?text=MJ'
        },
        {
          id: 'athlete-2',
          name: 'Sarah Williams',
          sport: 'Basketball',
          university: 'Duke University',
          followers: 3200,
          engagement_rate: 5.1,
          image: 'https://via.placeholder.com/100x100/28a745/ffffff?text=SW'
        }
      ];

      setDeals(mockDeals);
      setAthletes(mockAthletes);
    } catch (error) {
      console.error('Error fetching business data:', error);
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

  const handleCreateDeal = () => {
    if (onNavigate) {
      onNavigate('create-deal');
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
            <div className="user-avatar business">
              {userProfile?.company_name?.charAt(0) || userProfile?.first_name?.charAt(0) || user?.email?.charAt(0) || 'B'}
            </div>
            <div className="user-details">
              <h1>Welcome back, {userProfile?.company_name || userProfile?.first_name || 'Business'}!</h1>
              <p>{userProfile?.company_type || 'Business Partner'}</p>
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
            className={`nav-tab ${activeTab === 'athletes' ? 'active' : ''}`}
            onClick={() => setActiveTab('athletes')}
          >
            Discover Athletes
          </button>
          <button
            className={`nav-tab ${activeTab === 'create' ? 'active' : ''}`}
            onClick={() => setActiveTab('create')}
          >
            Create Deal
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
                  <h3>Total Spent</h3>
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
                        <p><strong>{deal.title}</strong> - {deal.athlete_name}</p>
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
                <button className="btn-primary" onClick={handleCreateDeal}>
                  Create New Deal
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
                      <p><strong>Athlete:</strong> {deal.athlete_name} ({deal.athlete_sport})</p>
                      <p><strong>Amount:</strong> ${deal.amount}</p>
                      <p><strong>Deadline:</strong> {deal.deadline}</p>
                    </div>
                    <div className="deal-actions">
                      <button className="btn-secondary">View Details</button>
                      {deal.status === 'pending' && (
                        <button className="btn-primary">Review Work</button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'athletes' && (
            <div className="athletes-tab">
              <h3>Discover Athletes</h3>
              <div className="athletes-grid">
                {athletes.map(athlete => (
                  <div key={athlete.id} className="athlete-card">
                    <img src={athlete.image} alt={athlete.name} className="athlete-image" />
                    <div className="athlete-info">
                      <h4>{athlete.name}</h4>
                      <p className="athlete-sport">{athlete.sport}</p>
                      <p className="athlete-university">{athlete.university}</p>
                      <div className="athlete-stats">
                        <span>{athlete.followers.toLocaleString()} followers</span>
                        <span>{athlete.engagement_rate}% engagement</span>
                      </div>
                    </div>
                    <div className="athlete-actions">
                      <button className="btn-primary">View Profile</button>
                      <button className="btn-secondary">Contact</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'create' && (
            <div className="create-deal-tab">
              <h3>Create New Deal</h3>
              <p>Click the "Create New Deal" button in the Deals tab to get started.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default BusinessDashboard; 