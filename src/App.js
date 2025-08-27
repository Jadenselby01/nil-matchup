import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardRouter from './components/DashboardRouter';
import LandingPage from './components/LandingPage';
import AuthPage from './components/auth/AuthPage';
import CreateDealForm from './components/deals/CreateDealForm';
import DealDiscoveryPage from './components/deals/DealDiscoveryPage';
import DealsPage from './components/DealsPage';
import PaymentPage from './components/PaymentPage';
import PaymentProcessingPage from './components/PaymentProcessingPage';
import MessagingPage from './components/MessagingPage';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Routes>
            {/* Landing page - redirects authenticated users to dashboard */}
            <Route path="/" element={<LandingPage />} />
            
            {/* Auth page - for unauthenticated users */}
            <Route path="/auth" element={<AuthPage />} />
            
            {/* Protected routes - require authentication */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard/*" element={<DashboardRouter />} />
              <Route path="/create-deal" element={<CreateDealForm />} />
              <Route path="/deal-discovery" element={<DealDiscoveryPage />} />
              <Route path="/deals" element={<DealsPage />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/payment-processing" element={<PaymentProcessingPage />} />
              <Route path="/messaging" element={<MessagingPage />} />
            </Route>
            
            {/* Catch all - redirect to landing */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;