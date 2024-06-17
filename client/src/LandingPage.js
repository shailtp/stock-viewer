import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      <div className="heading">Innovest: Get real-time insights into your stock market investments!</div>
      <button className="button" onClick={() => navigate('/home')}>Get started</button>
    </div>
  );
};

export default LandingPage;
