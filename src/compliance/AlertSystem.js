import React, { useState, useEffect } from 'react';
import './AlertSystem.css';

const AlertSystem = () => {
  const [alerts, setAlerts] = useState([]);
  const [alertSettings, setAlertSettings] = useState({
    criticalAlerts: true,
    warningAlerts: true,
    infoAlerts: false,
    emailNotifications: true,
    smsNotifications: false,
    slackNotifications: true
  });

  // Simulate real-time alert generation
  useEffect(() => {
    const alertTypes = [
      {
        type: 'critical',
        title: 'Underage Registration Attempt',
        message: 'User under 13 attempting to register',
        priority: 'immediate',
        category: 'user_verification'
      },
      {
        type: 'critical',
        title: 'NCAA Eligibility Violation',
        message: 'Potential amateur status violation detected',
        priority: 'immediate',
        category: 'ncaa_compliance'
      },
      {
        type: 'warning',
        title: 'Missing FTC Disclosure',
        message: 'Post detected without #ad or #sponsored tag',
        priority: 'high',
        category: 'ftc_compliance'
      },
      {
        type: 'warning',
        title: 'Suspicious Transaction',
        message: 'Unusual payment pattern detected',
        priority: 'high',
        category: 'payment_monitoring'
      },
      {
        type: 'info',
        title: 'Document Expiring Soon',
        message: 'Legal document will expire in 7 days',
        priority: 'medium',
        category: 'document_management'
      }
    ];

    const generateRandomAlert = () => {
      const randomAlert = alertTypes[Math.floor(Math.random() * alertTypes.length)];
      return {
        id: Date.now() + Math.random(),
        ...randomAlert,
        timestamp: new Date(),
        status: 'new',
        assignedTo: null,
        notes: ''
      };
    };

    // Generate alerts every 30 seconds (for demo purposes)
    const interval = setInterval(() => {
      if (Math.random() > 0.7) { // 30% chance of new alert
        const newAlert = generateRandomAlert();
        setAlerts(prev => [newAlert, ...prev.slice(0, 19)]); // Keep last 20 alerts
        
        // Send notifications based on settings
        if (alertSettings.emailNotifications) {
          sendEmailNotification(newAlert);
        }
        if (alertSettings.smsNotifications) {
          sendSMSNotification(newAlert);
        }
        if (alertSettings.slackNotifications) {
          sendSlackNotification(newAlert);
        }
      }
    }, 30000);

    return () => clearInterval(interval);
  }, [alertSettings]);

  const sendEmailNotification = (alert) => {
    console.log(`Email notification sent for alert: ${alert.title}`);
    // Implementation would send actual email
  };

  const sendSMSNotification = (alert) => {
    console.log(`SMS notification sent for alert: ${alert.title}`);
    // Implementation would send actual SMS
  };

  const sendSlackNotification = (alert) => {
    console.log(`Slack notification sent for alert: ${alert.title}`);
    // Implementation would send actual Slack message
  };

  const handleAlertAction = (alertId, action) => {
    setAlerts(prev => prev.map(alert => {
      if (alert.id === alertId) {
        return {
          ...alert,
          status: action === 'acknowledge' ? 'acknowledged' : 
                  action === 'resolve' ? 'resolved' : 'dismissed',
          resolvedAt: action === 'resolve' ? new Date() : alert.resolvedAt,
          acknowledgedAt: action === 'acknowledge' ? new Date() : alert.acknowledgedAt
        };
      }
      return alert;
    }));
  };

  const handleAlertAssignment = (alertId, assignee) => {
    setAlerts(prev => prev.map(alert => {
      if (alert.id === alertId) {
        return {
          ...alert,
          assignedTo: assignee,
          assignedAt: new Date()
        };
      }
      return alert;
    }));
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'critical': return '🔴';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      default: return '📋';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'immediate': return '#dc3545';
      case 'high': return '#ffc107';
      case 'medium': return '#17a2b8';
      case 'low': return '#6c757d';
      default: return '#6c757d';
    }
  };

  const filteredAlerts = alerts.filter(alert => {
    if (alert.type === 'critical' && !alertSettings.criticalAlerts) return false;
    if (alert.type === 'warning' && !alertSettings.warningAlerts) return false;
    if (alert.type === 'info' && !alertSettings.infoAlerts) return false;
    return true;
  });

  const alertStats = {
    total: alerts.length,
    critical: alerts.filter(a => a.type === 'critical').length,
    warning: alerts.filter(a => a.type === 'warning').length,
    info: alerts.filter(a => a.type === 'info').length,
    resolved: alerts.filter(a => a.status === 'resolved').length,
    pending: alerts.filter(a => a.status === 'new' || a.status === 'acknowledged').length
  };

  return (
    <div className="alert-system">
      <div className="alert-header">
        <h2>🚨 Alert Management System</h2>
        <div className="alert-stats">
          <div className="stat-item">
            <span className="stat-label">Total Alerts:</span>
            <span className="stat-value">{alertStats.total}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Pending:</span>
            <span className="stat-value">{alertStats.pending}</span>
          </div>
          <div className="stat-item">
            <span className="stat-label">Resolved:</span>
            <span className="stat-value">{alertStats.resolved}</span>
          </div>
        </div>
      </div>

      {/* Alert Settings */}
      <div className="alert-settings">
        <h3>⚙️ Alert Settings</h3>
        <div className="settings-grid">
          <div className="setting-group">
            <h4>Alert Types</h4>
            <label className="setting-item">
              <input
                type="checkbox"
                checked={alertSettings.criticalAlerts}
                onChange={(e) => setAlertSettings(prev => ({
                  ...prev,
                  criticalAlerts: e.target.checked
                }))}
              />
              Critical Alerts
            </label>
            <label className="setting-item">
              <input
                type="checkbox"
                checked={alertSettings.warningAlerts}
                onChange={(e) => setAlertSettings(prev => ({
                  ...prev,
                  warningAlerts: e.target.checked
                }))}
              />
              Warning Alerts
            </label>
            <label className="setting-item">
              <input
                type="checkbox"
                checked={alertSettings.infoAlerts}
                onChange={(e) => setAlertSettings(prev => ({
                  ...prev,
                  infoAlerts: e.target.checked
                }))}
              />
              Info Alerts
            </label>
          </div>
          <div className="setting-group">
            <h4>Notifications</h4>
            <label className="setting-item">
              <input
                type="checkbox"
                checked={alertSettings.emailNotifications}
                onChange={(e) => setAlertSettings(prev => ({
                  ...prev,
                  emailNotifications: e.target.checked
                }))}
              />
              Email Notifications
            </label>
            <label className="setting-item">
              <input
                type="checkbox"
                checked={alertSettings.smsNotifications}
                onChange={(e) => setAlertSettings(prev => ({
                  ...prev,
                  smsNotifications: e.target.checked
                }))}
              />
              SMS Notifications
            </label>
            <label className="setting-item">
              <input
                type="checkbox"
                checked={alertSettings.slackNotifications}
                onChange={(e) => setAlertSettings(prev => ({
                  ...prev,
                  slackNotifications: e.target.checked
                }))}
              />
              Slack Notifications
            </label>
          </div>
        </div>
      </div>

      {/* Alert Categories */}
      <div className="alert-categories">
        <div className="category-stats">
          <div className="category-item critical">
            <span className="category-icon">🔴</span>
            <span className="category-label">Critical</span>
            <span className="category-count">{alertStats.critical}</span>
          </div>
          <div className="category-item warning">
            <span className="category-icon">⚠️</span>
            <span className="category-label">Warning</span>
            <span className="category-count">{alertStats.warning}</span>
          </div>
          <div className="category-item info">
            <span className="category-icon">ℹ️</span>
            <span className="category-label">Info</span>
            <span className="category-count">{alertStats.info}</span>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="alerts-container">
        <h3>📋 Active Alerts</h3>
        <div className="alerts-list">
          {filteredAlerts.length === 0 ? (
            <div className="no-alerts">
              <p>✅ No active alerts - All systems operating normally</p>
            </div>
          ) : (
            filteredAlerts.map(alert => (
              <div key={alert.id} className={`alert-item ${alert.type} ${alert.status}`}>
                <div className="alert-header-row">
                  <div className="alert-title">
                    <span className="alert-icon">{getAlertIcon(alert.type)}</span>
                    <span className="alert-title-text">{alert.title}</span>
                    <span 
                      className="priority-badge"
                      style={{ backgroundColor: getPriorityColor(alert.priority) }}
                    >
                      {alert.priority}
                    </span>
                  </div>
                  <div className="alert-time">
                    {alert.timestamp.toLocaleTimeString()}
                  </div>
                </div>
                
                <div className="alert-message">
                  {alert.message}
                </div>
                
                <div className="alert-meta">
                  <span className="alert-category">{alert.category}</span>
                  {alert.assignedTo && (
                    <span className="alert-assignee">Assigned to: {alert.assignedTo}</span>
                  )}
                </div>
                
                <div className="alert-actions">
                  {alert.status === 'new' && (
                    <>
                      <button 
                        className="action-btn acknowledge"
                        onClick={() => handleAlertAction(alert.id, 'acknowledge')}
                      >
                        Acknowledge
                      </button>
                      <button 
                        className="action-btn assign"
                        onClick={() => handleAlertAssignment(alert.id, 'Admin User')}
                      >
                        Assign
                      </button>
                    </>
                  )}
                  <button 
                    className="action-btn resolve"
                    onClick={() => handleAlertAction(alert.id, 'resolve')}
                  >
                    Resolve
                  </button>
                  <button 
                    className="action-btn dismiss"
                    onClick={() => handleAlertAction(alert.id, 'dismiss')}
                  >
                    Dismiss
                  </button>
                </div>
                
                {alert.status !== 'new' && (
                  <div className="alert-status">
                    Status: {alert.status}
                    {alert.acknowledgedAt && (
                      <span> • Acknowledged: {alert.acknowledgedAt.toLocaleTimeString()}</span>
                    )}
                    {alert.resolvedAt && (
                      <span> • Resolved: {alert.resolvedAt.toLocaleTimeString()}</span>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Alert History */}
      <div className="alert-history">
        <h3>📊 Alert History</h3>
        <div className="history-stats">
          <div className="history-chart">
            <div className="chart-bar">
              <div className="bar-label">Critical</div>
              <div className="bar-container">
                <div 
                  className="bar critical" 
                  style={{ width: `${(alertStats.critical / Math.max(alertStats.total, 1)) * 100}%` }}
                ></div>
              </div>
              <div className="bar-value">{alertStats.critical}</div>
            </div>
            <div className="chart-bar">
              <div className="bar-label">Warning</div>
              <div className="bar-container">
                <div 
                  className="bar warning" 
                  style={{ width: `${(alertStats.warning / Math.max(alertStats.total, 1)) * 100}%` }}
                ></div>
              </div>
              <div className="bar-value">{alertStats.warning}</div>
            </div>
            <div className="chart-bar">
              <div className="bar-label">Info</div>
              <div className="bar-container">
                <div 
                  className="bar info" 
                  style={{ width: `${(alertStats.info / Math.max(alertStats.total, 1)) * 100}%` }}
                ></div>
              </div>
              <div className="bar-value">{alertStats.info}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AlertSystem; 