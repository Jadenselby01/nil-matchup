import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import MessagingPage from './MessagingPage';
import PaymentPage from './PaymentPage';
import DealsPage from './DealsPage';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/messages" element={<MessagingPage />} />
        <Route path="/payment" element={<PaymentPage />} />
        <Route path="/deals" element={<DealsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
