import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const vantaRef = useRef(null);

  useEffect(() => {
    const VANTA = window.VANTA;
    const vantaEffect = VANTA.GLOBE({
      el: vantaRef.current,
      mouseControls: true,
      touchControls: true,
      gyroControls: false,
      minHeight: 200.00,
      minWidth: 200.00,
      scale: 1.00,
      scaleMobile: 1.00,
      color: 0x1f1f1f,
      backgroundColor: 0x000000
    });
    
    return () => {
      if (vantaEffect) vantaEffect.destroy();
    };
  }, []);

  return (
    <div ref={vantaRef} className="landing-page">
      <div className="heading bubble-text">Innovest</div>
      <div className="subheading">Get real-time insights into your stock market investments!</div>
      <div className="button-container">
        <button className="button" onClick={() => navigate('/home')}>Get Started</button>
      </div>
    </div>
  );
};

export default LandingPage;
