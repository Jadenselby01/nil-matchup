import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/AuthProvider';
import RequireAuth from './auth/RequireAuth';
import DashboardRouter from './components/DashboardRouter';
import LandingPage from './components/LandingPage';
import Login from './pages/Login';
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
            
            {/* Login page - for unauthenticated users */}
            <Route path="/login" element={<Login />} />
            
            {/* Protected routes - require authentication */}
            <Route element={<RequireAuth />}>
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