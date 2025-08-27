import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './auth/AuthProvider';
import RequireAuth from './auth/RequireAuth';
import DashboardRouter from './components/DashboardRouter';
import LandingPage from './components/LandingPage';
import Login from './pages/Login';
import './App.css';

const App = () => {
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
            </Route>
            
            {/* Catch all - redirect to landing */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
};

export default App; 