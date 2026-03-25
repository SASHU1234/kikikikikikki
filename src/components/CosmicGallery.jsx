import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const photos = [
  { id: 1, src: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=500&q=80", caption: "First contact", rotation: -5, xOff: -100, yOff: 100 },
  { id: 2, src: "https://images.unsplash.com/photo-1465101162946-4377e57745c3?w=500&q=80", caption: "Orbital drift", rotation: 8, xOff: 150, yOff: -50 },
  { id: 3, src: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=500&q=80", caption: "Zero gravity", rotation: -12, xOff: -50, yOff: -150 },
  { id: 4, src: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=500&q=80", caption: "Nebula nights", rotation: 5, xOff: 100, yOff: 150 },
  { id: 5, src: "https://images.unsplash.com/photo-1543722530-d2c3201371e7?w=500&q=80", caption: "Our constellation", rotation: 0, xOff: 0, yOff: 0 },
];

const CosmicGallery = () => {
  const containerRef = useRef(null);
  const polaroidsRef = useRef([]);

  useEffect(() => {
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      // Step 1: Set epic cinematic initial placements (wide but hardware-accelerated)
      polaroidsRef.current.forEach((el, index) => {
        const data = photos[index];
        gsap.set(el, { 
          opacity: 0,
          scale: 0.4, 
          x: data.xOff * 4, // Dramatic horizontal spread
          y: (data.yOff || 50) * 4 + 300, // Deep drop from below
          rotation: data.rotation * 3,
          force3D: true // Hardware acceleration
        });
      });

      // Step 2: Unified cinematic timeline triggered purely on view
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 65%", // Triggers right as the section enters focus
          toggleActions: "play none none none", // Only play once to prevent reverse-scroll stutter
        }
      });

      // Step 3: Buttery smooth staggered entrance
      polaroidsRef.current.forEach((el, index) => {
        const data = photos[index];
        tl.to(el, {
          opacity: 1,
          scale: 1,
          x: 0,
          y: 0,
          rotation: data.rotation,
          duration: 1.6,
          ease: "power4.out", // Epic swooping deceleration
          force3D: true
        }, index * 0.15); // Dramatic stagger
      });
    });

    return () => mm.revert();
  }, []);

  const handleMouseEnter = (e, baseRotation) => {
    gsap.to(e.currentTarget, { 
      scale: 1.1, 
      rotation: 0, // Straighten out on hover
      zIndex: 60,
      duration: 0.4, 
      ease: 'back.out(1.5)',
      force3D: true
    });
  };

  const handleMouseLeave = (e, baseRotation) => {
    gsap.to(e.currentTarget, { 
      scale: 1, 
      rotation: baseRotation, 
      zIndex: 10,
      duration: 0.4, 
      ease: 'power2.out',
      force3D: true
    });
  };

  return (
    <section ref={containerRef} className="relative w-full min-h-screen flex flex-col items-center py-20">
      <div className="z-10 text-center mb-20 mt-10">
        <h2 className="text-4xl md:text-6xl text-silver font-mono mb-6 uppercase tracking-widest text-glow">The Memory Logs</h2>
        <div className="h-1 w-24 bg-neon mx-auto rounded-full border-glow"></div>
      </div>

      <div className="relative w-full max-w-6xl mx-auto flex flex-wrap justify-center gap-10 z-10 mt-10">
        {photos.map((photo, i) => (
          <div 
            key={photo.id}
            ref={el => polaroidsRef.current[i] = el}
            onMouseEnter={(e) => handleMouseEnter(e, photo.rotation)}
            onMouseLeave={(e) => handleMouseLeave(e, photo.rotation)}
            className="glass-panel p-4 pb-12 w-64 md:w-80 flex flex-col items-center cursor-pointer will-change-transform"
            style={{ 
              borderRadius: '2px', // Polaroid style
            }}
          >
            <div className="w-full h-64 md:h-80 overflow-hidden bg-obsidian mb-4 rounded-sm">
              <img src={photo.src} alt={photo.caption} className="w-full h-full object-cover opacity-80" />
            </div>
            <p className="font-mono text-silver text-xl">{photo.caption}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default CosmicGallery;
