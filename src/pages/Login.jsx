import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const role = searchParams.get('role') || 'athlete';

  const handleLogin = () => {
    navigate(`/dashboard?role=${role}`);
  };

  const title = role === 'athlete' ? 'Athlete Login' : 'Business Login';
  const subtitle = role === 'athlete' ? 'Welcome back to NIL Matchup' : 'Welcome to NIL Matchup Business Portal';

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">{title}</h1>
        <p className="login-subtitle">{subtitle}</p>
        <button onClick={handleLogin} className="btn btn-primary">LOGIN</button>
        <div className="login-footer">
          <p className="footer-text">
            Switch to: <span className="highlight" onClick={() => navigate(`/login?role=${role === 'athlete' ? 'business' : 'athlete'}`)}>
              {role === 'athlete' ? 'Business Login' : 'Athlete Login'}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}
