import React, { useState, useEffect } from 'react';
import './ComplianceMonitor.css';

const ComplianceMonitor = () => {
  const [complianceData, setComplianceData] = useState({
    criticalAlerts: 0,
    warnings: 0,
    normal: 47,
    activeUsers: 1247,
    transactions: 45230,
    documentsSigned: 89,
    pendingReviews: 12
  });

  const [alerts, setAlerts] = useState([]);
  const [reviewQueue, setReviewQueue] = useState([]);
  const [complianceRate, setComplianceRate] = useState(98.5);

  // Simulate real-time monitoring
  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate new alerts and updates
      checkForNewAlerts();
      updateComplianceMetrics();
    }, 30000); // Check every 30 seconds

    return () => clearInterval(interval);
  }, []);

  const checkForNewAlerts = () => {
    // Simulate checking for new compliance issues
    const newAlerts = [
      {
        id: Date.now(),
        type: 'warning',
        message: 'Missing FTC disclosure detected in recent post',
        timestamp: new Date(),
        priority: 'medium'
      }
    ];

    if (Math.random() > 0.8) { // 20% chance of new alert
      setAlerts(prev => [...newAlerts, ...prev.slice(0, 9)]);
      setComplianceData(prev => ({
        ...prev,
        warnings: prev.warnings + 1
      }));
    }
  };

  const updateComplianceMetrics = () => {
    // Simulate updating compliance metrics
    setComplianceData(prev => ({
      ...prev,
      activeUsers: prev.activeUsers + Math.floor(Math.random() * 5),
      transactions: prev.transactions + Math.floor(Math.random() * 100)
    }));
  };

  const handleAlertAction = (alertId, action) => {
    console.log(`Taking action ${action} on alert ${alertId}`);
    setAlerts(prev => prev.filter(alert => alert.id !== alertId));
  };

  const handleReviewAssignment = (reviewId, reviewerId) => {
    console.log(`Assigning review ${reviewId} to reviewer ${reviewerId}`);
  };

  return (
    <div className="compliance-monitor">
      <div className="compliance-header">
        <h1>🔍 NILMatch Compliance Dashboard</h1>
        <div className="compliance-status">
          <span className="status-indicator normal">✅ Normal Operation</span>
        </div>
      </div>

      {/* Real-time Metrics */}
      <div className="metrics-grid">
        <div className="metric-card critical">
          <h3>🔴 Critical Alerts</h3>
          <div className="metric-value">{complianceData.criticalAlerts}</div>
        </div>
        <div className="metric-card warning">
          <h3>⚠️ Warnings</h3>
          <div className="metric-value">{complianceData.warnings}</div>
        </div>
        <div className="metric-card normal">
          <h3>✅ Normal</h3>
          <div className="metric-value">{complianceData.normal}</div>
        </div>
        <div className="metric-card info">
          <h3>📈 Active Users</h3>
          <div className="metric-value">{complianceData.activeUsers.toLocaleString()}</div>
        </div>
        <div className="metric-card info">
          <h3>💰 Transactions</h3>
          <div className="metric-value">${complianceData.transactions.toLocaleString()}</div>
        </div>
        <div className="metric-card info">
          <h3>📄 Documents Signed</h3>
          <div className="metric-value">{complianceData.documentsSigned}</div>
        </div>
      </div>

      {/* Compliance Rate */}
      <div className="compliance-rate">
        <h2>Overall Compliance Rate</h2>
        <div className="rate-display">
          <div className="rate-circle">
            <span className="rate-value">{complianceRate}%</span>
          </div>
          <div className="rate-details">
            <p>Platform operating within compliance standards</p>
            <p>Last updated: {new Date().toLocaleTimeString()}</p>
          </div>
        </div>
      </div>

      {/* Active Alerts */}
      <div className="alerts-section">
        <h2>🚨 Active Alerts</h2>
        <div className="alerts-list">
          {alerts.length === 0 ? (
            <div className="no-alerts">
              <p>✅ No active alerts - All systems operating normally</p>
            </div>
          ) : (
            alerts.map(alert => (
              <div key={alert.id} className={`alert-item ${alert.type}`}>
                <div className="alert-content">
                  <span className="alert-message">{alert.message}</span>
                  <span className="alert-time">{alert.timestamp.toLocaleTimeString()}</span>
                </div>
                <div className="alert-actions">
                  <button 
                    className="action-btn review"
                    onClick={() => handleAlertAction(alert.id, 'review')}
                  >
                    Review
                  </button>
                  <button 
                    className="action-btn dismiss"
                    onClick={() => handleAlertAction(alert.id, 'dismiss')}
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Review Queue */}
      <div className="review-section">
        <h2>📋 Review Queue</h2>
        <div className="review-stats">
          <div className="stat-item">
            <span className="stat-label">Pending Reviews:</span>
            <span className="stat-value">{complianceData.pendingReviews}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Avg Response Time:</span>
            <span className="stat-value">2.3 hours</span>
          </div>
        </div>
        <div className="review-actions">
          <button className="action-btn primary">View All Reviews</button>
          <button className="action-btn secondary">Assign Reviews</button>
        </div>
      </div>

      {/* Monitoring Systems Status */}
      <div className="systems-status">
        <h2>🔧 Monitoring Systems Status</h2>
        <div className="systems-grid">
          <div className="system-item online">
            <h4>User Verification</h4>
            <span className="status">✅ Online</span>
          </div>
          <div className="system-item online">
            <h4>Content Moderation</h4>
            <span className="status">✅ Online</span>
          </div>
          <div className="system-item online">
            <h4>Payment Monitoring</h4>
            <span className="status">✅ Online</span>
          </div>
          <div className="system-item online">
            <h4>Legal Document Tracking</h4>
            <span className="status">✅ Online</span>
          </div>
          <div className="system-item online">
            <h4>FTC Compliance</h4>
            <span className="status">✅ Online</span>
          </div>
          <div className="system-item online">
            <h4>NCAA Compliance</h4>
            <span className="status">✅ Online</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h2>⚡ Quick Actions</h2>
        <div className="actions-grid">
          <button className="quick-action-btn">
            📊 Generate Compliance Report
          </button>
          <button className="quick-action-btn">
            🔍 Run Security Scan
          </button>
          <button className="quick-action-btn">
            Send Compliance Update
          </button>
          <button className="quick-action-btn">
            ⚙️ Update Monitoring Rules
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComplianceMonitor; 