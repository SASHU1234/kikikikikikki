import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const HiddenMessage = () => {
  const containerRef = useRef(null);
  const textRef = useRef(null);

  useEffect(() => {
    gsap.set(textRef.current, { opacity: 0, scale: 0.8, filter: 'blur(10px)' });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: containerRef.current,
        start: 'top 60%',
        end: 'bottom 80%',
        scrub: 1, // Smooth reveal on scroll
      }
    });

    // Reveal the text heavily glowing
    tl.to(textRef.current, { opacity: 1, scale: 1, filter: 'blur(0px)', duration: 1.5, ease: 'power2.out' });

  }, []);

  return (
    <section ref={containerRef} className="relative w-full min-h-[60vh] flex justify-center items-center overflow-hidden py-20">
       
       <div className="relative w-full max-w-4xl aspect-[4/2] flex justify-center items-center">
          <svg className="w-full h-full" viewBox="0 0 800 400" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* The Text Revealed */}
            <text 
              ref={textRef}
              x="50%" 
              y="50%" 
              dominantBaseline="middle" 
              textAnchor="middle" 
              fill="#ffffff" 
              fontSize="44"
              className="font-mono font-bold uppercase tracking-[0.2em]"
              style={{ filter: 'drop-shadow(0 0 5px #FF2D55) drop-shadow(0 0 15px #FF2D55) drop-shadow(0 0 30px #FF2D55) drop-shadow(0 0 60px #FF2D55)' }}
            >
              Happy birthday chello
            </text>
          </svg>
       </div>
    </section>
  );
};

export default HiddenMessage;
