import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

// Import components
import LandingPage from './components/LandingPage';
import AuthPage from './components/auth/AuthPage';
import DashboardRouter from './components/DashboardRouter';
import MessagingPage from './components/MessagingPage';
import CreateDealForm from './components/deals/CreateDealForm';
import DealDiscoveryPage from './components/deals/DealDiscoveryPage';
import DealsPage from './components/DealsPage';
import PaymentPage from './components/PaymentPage';
import PaymentProcessingPage from './components/PaymentProcessingPage';


export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="App">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/auth" element={<AuthPage />} />
            
            {/* Protected routes */}
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard/*" element={<DashboardRouter />} />
              <Route path="/create-deal" element={<CreateDealForm />} />
              <Route path="/deal-discovery" element={<DealDiscoveryPage />} />
              <Route path="/deals" element={<DealsPage />} />
              <Route path="/payment" element={<PaymentPage />} />
              <Route path="/payment-processing" element={<PaymentProcessingPage />} />
              <Route path="/messaging" element={<MessagingPage />} />

            </Route>
            
            {/* Fallback */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}