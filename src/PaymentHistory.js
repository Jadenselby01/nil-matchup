import React, { useState, useEffect } from 'react';
import './PaymentHistory.css';

function PaymentHistory({ onBack }) {
  const [payments, setPayments] = useState([]);
  const [filteredPayments, setFilteredPayments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Sample payment history data
  const samplePayments = [
    {
      id: 'pi_1234567890',
      amount: 500,
      currency: 'USD',
      status: 'completed',
      paymentMethod: 'card',
      businessName: 'Carolina Sports Bar & Grill',
      athleteName: 'Michael Johnson',
      description: 'Instagram Feed Post & Story Promotion',
      createdAt: '2024-01-15T14:30:00Z',
      completedAt: '2024-01-15T14:32:15Z',
      receiptUrl: 'https://receipt.stripe.com/123456',
      offerId: 'offer_123',
      businessId: 'business_101',
      athleteId: 'athlete_1',
      cardLast4: '4242',
      email: 'michael@example.com'
    },
    {
      id: 'pi_0987654321',
      amount: 1200,
      currency: 'USD',
      status: 'completed',
      paymentMethod: 'paypal',
      businessName: 'Elite Fitness Center',
      athleteName: 'Michael Johnson',
      description: 'HIIT Workout Video Series',
      createdAt: '2024-01-10T09:15:00Z',
      completedAt: '2024-01-10T09:17:30Z',
      receiptUrl: 'https://paypal.com/receipt/123456',
      offerId: 'offer_456',
      businessId: 'business_102',
      athleteId: 'athlete_1',
      email: 'michael@example.com'
    },
    {
      id: 'pi_555666777',
      amount: 750,
      currency: 'USD',
      status: 'pending',
      paymentMethod: 'card',
      businessName: 'University Auto Service',
      athleteName: 'Michael Johnson',
      description: 'Student Discount Promotion',
      createdAt: '2024-01-12T16:45:00Z',
      completedAt: null,
      receiptUrl: null,
      offerId: 'offer_789',
      businessId: 'business_103',
      athleteId: 'athlete_1',
      cardLast4: '1234',
      email: 'michael@example.com'
    },
    {
      id: 'pi_111222333',
      amount: 2500,
      currency: 'USD',
      status: 'failed',
      paymentMethod: 'card',
      businessName: 'Campus Real Estate Group',
      athleteName: 'Michael Johnson',
      description: 'Student Housing Content Creation',
      createdAt: '2024-01-08T11:20:00Z',
      completedAt: null,
      receiptUrl: null,
      offerId: 'offer_101',
      businessId: 'business_104',
      athleteId: 'athlete_1',
      cardLast4: '5678',
      email: 'michael@example.com',
      failureReason: 'Insufficient funds'
    }
  ];

  useEffect(() => {
    // Simulate loading payment history from API
    setTimeout(() => {
      setPayments(samplePayments);
      setFilteredPayments(samplePayments);
      setIsLoading(false);
    }, 1000);
  }, [samplePayments]);

  const filterPayments = () => {
    let filtered = payments;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(payment =>
        payment.businessName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(payment => payment.status === statusFilter);
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'today':
          filterDate.setHours(0, 0, 0, 0);
          filtered = filtered.filter(payment => 
            new Date(payment.createdAt) >= filterDate
          );
          break;
        case 'week':
          filterDate.setDate(now.getDate() - 7);
          filtered = filtered.filter(payment => 
            new Date(payment.createdAt) >= filterDate
          );
          break;
        case 'month':
          filterDate.setMonth(now.getMonth() - 1);
          filtered = filtered.filter(payment => 
            new Date(payment.createdAt) >= filterDate
          );
          break;
        case 'year':
          filterDate.setFullYear(now.getFullYear() - 1);
          filtered = filtered.filter(payment => 
            new Date(payment.createdAt) >= filterDate
          );
          break;
        default:
          // No additional filtering for 'all' or unknown values
          break;
      }
    }

    setFilteredPayments(filtered);
  };

  useEffect(() => {
    filterPayments();
  }, [payments, searchQuery, statusFilter, dateFilter]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount / 100); // Assuming amount is in cents
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#64ffda';
      case 'pending':
        return '#ffc107';
      case 'failed':
        return '#ff6b6b';
      default:
        return '#ffffff';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return '✅';
      case 'pending':
        return '⏳';
      case 'failed':
        return '❌';
      default:
        return '❓';
    }
  };

  const getPaymentMethodIcon = (method) => {
    switch (method) {
      case 'card':
        return '💳';
      case 'paypal':
        return '🅿️';
      case 'applepay':
        return '🍎';
      default:
        return '💰';
    }
  };

  const downloadReceipt = (payment) => {
    if (payment.receiptUrl) {
      window.open(payment.receiptUrl, '_blank');
    } else {
      alert('Receipt not available for this payment.');
    }
  };

  const retryPayment = (payment) => {
    if (window.confirm('Retry this payment?')) {
      // This would redirect to payment page with payment data
      alert('Redirecting to payment page...');
    }
  };

  if (isLoading) {
    return (
      <div className="payment-history-page">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading payment history...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="payment-history-page">
      <div className="history-container">
        <button className="back-btn" onClick={onBack}>
          ← Back
        </button>

        <div className="history-header">
          <h1>Payment History</h1>
          <p>Track all your NIL partnership payments</p>
        </div>

        <div className="filters-section">
          <div className="search-filter">
            <input
              type="text"
              placeholder="Search payments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="search-input"
            />
          </div>

          <div className="filter-controls">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="failed">Failed</option>
            </select>

            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="year">Last Year</option>
            </select>
          </div>
        </div>

        <div className="payments-list">
          {filteredPayments.length === 0 ? (
            <div className="no-payments">
              <span className="no-payments-icon">📊</span>
              <h3>No payments found</h3>
              <p>Try adjusting your search or filters</p>
            </div>
          ) : (
            filteredPayments.map(payment => (
              <div
                key={payment.id}
                className="payment-item"
                onClick={() => setSelectedPayment(payment)}
              >
                <div className="payment-header">
                  <div className="payment-info">
                    <h3>{payment.businessName}</h3>
                    <p className="payment-description">{payment.description}</p>
                    <p className="payment-date">{formatDate(payment.createdAt)}</p>
                  </div>
                  
                  <div className="payment-amount">
                    <span className="amount">{formatAmount(payment.amount, payment.currency)}</span>
                    <div className="payment-meta">
                      <span 
                        className="status-badge"
                        style={{ color: getStatusColor(payment.status) }}
                      >
                        {getStatusIcon(payment.status)} {payment.status}
                      </span>
                      <span className="payment-method">
                        {getPaymentMethodIcon(payment.paymentMethod)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="summary-stats">
          <div className="stat-card">
            <span className="stat-label">Total Payments</span>
            <span className="stat-value">{filteredPayments.length}</span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Total Amount</span>
            <span className="stat-value">
              {formatAmount(
                filteredPayments.reduce((sum, p) => sum + p.amount, 0),
                'USD'
              )}
            </span>
          </div>
          <div className="stat-card">
            <span className="stat-label">Completed</span>
            <span className="stat-value">
              {filteredPayments.filter(p => p.status === 'completed').length}
            </span>
          </div>
        </div>
      </div>

      {/* Payment Detail Modal */}
      {selectedPayment && (
        <div className="modal-backdrop" onClick={() => setSelectedPayment(null)}>
          <div className="payment-modal" onClick={e => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelectedPayment(null)}>×</button>
            
            <div className="modal-header">
              <div className="payment-status">
                <span 
                  className="status-icon"
                  style={{ color: getStatusColor(selectedPayment.status) }}
                >
                  {getStatusIcon(selectedPayment.status)}
                </span>
                <div>
                  <h2>{selectedPayment.businessName}</h2>
                  <p className="payment-id">Payment ID: {selectedPayment.id}</p>
                </div>
              </div>
            </div>
            
            <div className="modal-content">
              <div className="detail-section">
                <h3>Payment Details</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span>Amount:</span>
                    <span>{formatAmount(selectedPayment.amount, selectedPayment.currency)}</span>
                  </div>
                  <div className="detail-item">
                    <span>Status:</span>
                    <span className="status-text" style={{ color: getStatusColor(selectedPayment.status) }}>
                      {selectedPayment.status}
                    </span>
                  </div>
                  <div className="detail-item">
                    <span>Payment Method:</span>
                    <span>{getPaymentMethodIcon(selectedPayment.paymentMethod)} {selectedPayment.paymentMethod}</span>
                  </div>
                  <div className="detail-item">
                    <span>Created:</span>
                    <span>{formatDate(selectedPayment.createdAt)}</span>
                  </div>
                  {selectedPayment.completedAt && (
                    <div className="detail-item">
                      <span>Completed:</span>
                      <span>{formatDate(selectedPayment.completedAt)}</span>
                    </div>
                  )}
                  {selectedPayment.cardLast4 && (
                    <div className="detail-item">
                      <span>Card:</span>
                      <span>•••• {selectedPayment.cardLast4}</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="detail-section">
                <h3>Partnership Details</h3>
                <div className="detail-grid">
                  <div className="detail-item">
                    <span>Description:</span>
                    <span>{selectedPayment.description}</span>
                  </div>
                  <div className="detail-item">
                    <span>Business:</span>
                    <span>{selectedPayment.businessName}</span>
                  </div>
                  <div className="detail-item">
                    <span>Athlete:</span>
                    <span>{selectedPayment.athleteName}</span>
                  </div>
                  <div className="detail-item">
                    <span>Email:</span>
                    <span>{selectedPayment.email}</span>
                  </div>
                </div>
              </div>

              {selectedPayment.failureReason && (
                <div className="detail-section">
                  <h3>Failure Reason</h3>
                  <p className="failure-reason">{selectedPayment.failureReason}</p>
                </div>
              )}
            </div>
            
            <div className="modal-actions">
              {selectedPayment.receiptUrl && (
                <button 
                  className="download-receipt-btn secondary-btn"
                  onClick={() => downloadReceipt(selectedPayment)}
                >
                  📄 Download Receipt
                </button>
              )}
              
              {selectedPayment.status === 'failed' && (
                <button 
                  className="retry-payment-btn primary-btn"
                  onClick={() => retryPayment(selectedPayment)}
                >
                  🔄 Retry Payment
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaymentHistory; 