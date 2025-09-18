import React from "react";
import { useNavigate } from "react-router-dom";
import "./LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleAthleteClick = () => {
    navigate("/dashboard?role=athlete");
  };

  const handleBusinessClick = () => {
    navigate("/dashboard?role=business");
  };

  return (
    <div className="landing-page">
      <div className="landing-card">
        <h1 className="landing-title">NIL Matchup</h1>
        <div className="landing-separator"></div>
        <p className="landing-tagline">NIL for all</p>
        <p className="landing-description">
          Connecting college athletes with local businesses for meaningful partnerships.
        </p>
        <div className="demo-badge"> DEMO MODE</div>
        <div className="landing-buttons">
          <button className="btn-athlete" onClick={handleAthleteClick}>
            ATHLETE DEMO
          </button>
          <button className="btn-business" onClick={handleBusinessClick}>
            BUSINESS DEMO
          </button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
