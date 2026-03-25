import React from 'react';

// Bokeh Particles Component
const BokehParticles = () => {
  const particles = Array.from({ length: 30 }).map((_, i) => {
    const size = Math.random() * 30 + 15; // 15px to 45px
    const left = Math.random() * 100;
    const top = Math.random() * 100;
    const delay = Math.random() * -20; // Negative delay to start mid-animation
    
    return (
      <div 
        key={i} 
        className="bokeh-particle"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          left: `${left}%`,
          top: `${top}%`,
          animationDelay: `${delay}s`
        }}
      />
    );
  });
  return <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">{particles}</div>;
};

export default BokehParticles;
