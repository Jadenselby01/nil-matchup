import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/AuthProvider';
import RequireAuth from './routes/RequireAuth';
import './App.css';

// Import components
import AuthPage from './components/auth/AuthPage';
import AthleteDashboard from './components/dashboard/AthleteDashboard';
import BusinessDashboard from './components/dashboard/BusinessDashboard';
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
            <Route path="/" element={<AuthPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/create-account" element={<AuthPage />} />
            <Route path="/athlete-dashboard" element={
              <RequireAuth>
                <AthleteDashboard />
              </RequireAuth>
            } />
            <Route path="/business-dashboard" element={
              <RequireAuth>
                <BusinessDashboard />
              </RequireAuth>
            } />
            <Route path="/create-deal" element={
              <RequireAuth>
                <CreateDealForm />
              </RequireAuth>
            } />
            <Route path="/deal-discovery" element={
              <RequireAuth>
                <DealDiscoveryPage />
              </RequireAuth>
            } />
            <Route path="/deals" element={
              <RequireAuth>
                <DealsPage />
              </RequireAuth>
            } />
            <Route path="/payment" element={
              <RequireAuth>
                <PaymentPage />
              </RequireAuth>
            } />
            <Route path="/payment-processing" element={
              <RequireAuth>
                <PaymentProcessingPage />
              </RequireAuth>
            } />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}