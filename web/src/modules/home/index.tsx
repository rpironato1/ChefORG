import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HeroSection } from './components/HeroSection';
import { FeaturesSection } from './components/FeaturesSection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { ContactSection } from './components/ContactSection';
import { SwipeGestureDemo } from '../../mobile/components/gestures/SwipeGestureDemo';

export const ModularHomePage: React.FC = () => {
  const navigate = useNavigate();

  const handleReserveClick = () => {
    navigate('/reserva');
  };

  const handleMenuClick = () => {
    navigate('/menu');
  };

  return (
    <div className="min-h-screen">
      <HeroSection 
        onReserveClick={handleReserveClick}
        onMenuClick={handleMenuClick}
      />
      <FeaturesSection />
      <TestimonialsSection />
      <ContactSection 
        onReserveClick={handleReserveClick}
        onMenuClick={handleMenuClick}
      />
      
      {/* Sprint 2: Mobile Gesture Demo - Only show on mobile */}
      <div className="block md:hidden">
        <SwipeGestureDemo />
      </div>
    </div>
  );
};