import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const vantaRef = useRef(null);
  const navigate = useNavigate();

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

  console.log('LandingPage rendered');
  return (
    <div ref={vantaRef} className="landing-page">
      <div className="heading">Innovest: Get real-time insights into your stock market investments!</div>
      <button className="button" onClick={() => navigate('/home')}>Get started</button>
    </div>
  );
};

export default LandingPage;
