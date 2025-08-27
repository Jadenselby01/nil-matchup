import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import './Dashboard.css';

const AthleteDashboard = () => {
  const { profile, signOut } = useAuth();
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalDeals: 0,
    activeDeals: 0,
    totalEarnings: 0,
    pendingPayments: 0
  });

  useEffect(() => {
    loadAthleteData();
  }, []);

  const loadAthleteData = async () => {
    try {
      setLoading(true);
      
      // Load deals for this athlete
      const { data: dealsData, error: dealsError } = await supabase
        .from('deals')
        .select('*')
        .eq('athlete_id', profile?.id)
        .order('created_at', { ascending: false });

      if (dealsError) {
        console.error('Error loading deals:', dealsError);
      } else {
        setDeals(dealsData || []);
      }

      // Calculate stats
      const totalDeals = dealsData?.length || 0;
      const activeDeals = dealsData?.filter(d => d.status === 'active').length || 0;
      const totalEarnings = dealsData?.reduce((sum, d) => sum + (d.amount || 0), 0) || 0;
      const pendingPayments = dealsData?.filter(d => d.status === 'pending_payment').length || 0;

      setStats({
        totalDeals,
        activeDeals,
        totalEarnings,
        pendingPayments
      });

    } catch (error) {
      console.error('Error loading athlete data:', error);
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
        <p>Loading your athlete dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard athlete-dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {profile?.display_name || profile?.full_name || 'Athlete'}!</h1>
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
          <h3>Total Earnings</h3>
          <p className="stat-number">${stats.totalEarnings.toLocaleString()}</p>
        </div>
        <div className="stat-card">
          <h3>Pending Payments</h3>
          <p className="stat-number">{stats.pendingPayments}</p>
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
          <p className="no-data">No deals yet. Start exploring opportunities!</p>
        )}
      </div>

      <div className="dashboard-actions">
        <button className="action-button primary">Browse Deals</button>
        <button className="action-button secondary">View Messages</button>
        <button className="action-button secondary">Payment History</button>
      </div>
    </div>
  );
};

export default AthleteDashboard; 