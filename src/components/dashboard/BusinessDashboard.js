import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import './Dashboard.css';

const BusinessDashboard = () => {
  const { profile, signOut } = useAuth();
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDeals: 0,
    activeDeals: 0,
    totalSpent: 0,
    pendingDeals: 0
  });

  useEffect(() => {
    loadBusinessData();
  }, []);

  const loadBusinessData = async () => {
    try {
      setLoading(true);
      
      // Load deals created by this business
      const { data: dealsData, error: dealsError } = await supabase
        .from('deals')
        .select('*')
        .eq('business_id', profile?.id)
        .order('created_at', { ascending: false });

      if (dealsError) {
        console.error('Error loading deals:', dealsError);
      } else {
        setDeals(dealsData || []);
      }

      // Calculate stats
      const totalDeals = dealsData?.length || 0;
      const activeDeals = dealsData?.filter(d => d.status === 'active').length || 0;
      const totalSpent = dealsData?.reduce((sum, d) => sum + (d.amount || 0), 0) || 0;
      const pendingDeals = dealsData?.filter(d => d.status === 'pending').length || 0;

      setStats({
        totalDeals,
        activeDeals,
        totalSpent,
        pendingDeals
      });

    } catch (error) {
      console.error('Error loading business data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="spinner"></div>
        <p>Loading your business dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard business-dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {profile?.display_name || profile?.company_name || 'Business'}!</h1>
        <button onClick={handleSignOut} className="signout-button">Sign Out</button>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Deals</h3>
          <p className="stat-number">{stats.totalDeals}</p>
        </div>
        <div className="stat-card">
          <h3>Active Deals</h3>
          <p className="stat-number">{stats.activeDeals}</p>
        </div>
        <div className="stat-card">
          <h3>Total Spent</h3>
          <p className="stat-number">${stats.totalSpent.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <h3>Pending Deals</h3>
          <p className="stat-number">{stats.pendingDeals}</p>
        </div>
      </div>

      <div className="dashboard-section">
        <h2>Recent Deals</h2>
        {deals.length > 0 ? (
          <div className="deals-list">
            {deals.slice(0, 5).map((deal) => (
              <div key={deal.id} className="deal-card">
                <h4>{deal.title}</h4>
                <p>{deal.description}</p>
                <div className="deal-meta">
                  <span className="deal-amount">${deal.amount}</span>
                  <span className={`deal-status deal-${deal.status}`}>{deal.status}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="no-data">No deals created yet. Start posting opportunities!</p>
        )}
      </div>

      <div className="dashboard-actions">
        <button className="action-button primary">Create New Deal</button>
        <button className="action-button secondary">View Messages</button>
        <button className="action-button secondary">Manage Deals</button>
      </div>
    </div>
  );
};

export default BusinessDashboard; 