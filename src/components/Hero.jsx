import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

// Bokeh Particles Component
const BokehParticles = () => {
  const particles = Array.from({ length: 20 }).map((_, i) => {
    const size = Math.random() * 25 + 15; // 15px to 40px
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
  return <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">{particles}</div>;
};

// Falling Petals Component
const FallingPetals = () => {
  const petals = Array.from({ length: 45 }).map((_, i) => {
    const size = Math.random() * 20 + 20; // 20px to 40px for images
    const left = Math.random() * 100;
    const duration = Math.random() * 6 + 4;
    const delay = Math.random() * 15;
    
    return (
      <img 
        src="/white-petals.png"
        alt="Falling Petal"
        key={i} 
        className="petal z-20 pointer-events-none object-contain drop-shadow-[0_0_5px_rgba(255,255,255,0.4)]"
        style={{
          width: `${size}px`,
          height: `${size}px`,
          left: `${left}%`,
          animationDuration: `${duration}s`,
          animationDelay: `${delay}s`
        }}
      />
    );
  });
  
  return <div className="absolute inset-0 overflow-hidden pointer-events-none">{petals}</div>;
};

const Hero = () => {
  const textRef = useRef(null);

  useEffect(() => {
    // Staggered letters
    const charElements = textRef.current.querySelectorAll('.char');
    gsap.fromTo(charElements,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        stagger: 0.05,
        ease: 'power3.out',
        delay: 0.5
      }
    );
  }, []);

  const title = "HAPPY BIRTHDAY CHELLOO";

  return (
    <section className="relative w-full h-screen overflow-hidden flex flex-col items-center justify-center">

      {/* 4 Corner Roses Removed */}

      {/* Falling Swirling Petals */}
      <FallingPetals />

      {/* 2D Image Background (The Heart) with Heartbeat & Float */}
      <div className="absolute inset-0 w-full h-full z-10 flex items-center justify-center pointer-events-none overflow-hidden">
        <img
          src="/heart-bg.png"
          alt="Retro Heart Background"
          className="w-[180vw] md:w-[100vw] max-w-none object-contain opacity-90 animate-heartbeat-float"
        />
      </div>

      <div className="z-30 pointer-events-none mt-40 relative">
        <h1
          ref={textRef}
          className="text-4xl md:text-6xl lg:text-7xl text-white font-sans uppercase tracking-[0.2em] font-extrabold flex gap-[1rem] flex-wrap justify-center px-4 text-center neon-text-stack"
        >
          {title.split(" ").map((word, wIdx) => (
            <div key={wIdx} className="flex">
              {word.split("").map((char, cIdx) => (
                <span key={cIdx} className="char inline-block">{char}</span>
              ))}
            </div>
          ))}
        </h1>
      </div>
    </section>
  );
};

export default Hero;
