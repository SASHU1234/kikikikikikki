import React, { useRef } from 'react';
import { gsap } from 'gsap';

const avatars = [
  { id: 1, name: "Kiki", color: "bg-purple-500", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kiki" },
  { id: 2, name: "Pav", color: "bg-blue-500", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Pav" },
  { id: 3, name: "Sashu", color: "bg-pink-500", img: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sashu" }
];

const Sidebar = () => {
  const handleMouseEnter = (e) => {
    gsap.to(e.currentTarget, { scale: 1.15, duration: 0.3, ease: 'back.out(2)' });
  };
  const handleMouseLeave = (e) => {
    gsap.to(e.currentTarget, { scale: 1, duration: 0.3, ease: 'power2.out' });
  };

  return (
    <div className="fixed left-6 top-1/2 -translate-y-1/2 z-[70] flex flex-col gap-6">
      {avatars.map((av) => (
        <div 
          key={av.id} 
          className="group relative flex items-center cursor-pointer"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Avatar Graphic */}
          <div className="w-10 h-10 rounded-full bg-obsidian border border-silver/30 overflow-hidden drop-shadow-[0_0_8px_rgba(255,255,255,0.1)] transition-colors group-hover:border-neon">
            <img src={av.img} alt={av.name} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
          </div>

          {/* Micro-Tooltip */}
          <div className="absolute left-14 px-3 py-1.5 rounded bg-white/10 backdrop-blur-md border border-white/20 text-silver font-sans text-xs tracking-widest uppercase opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300 pointer-events-none whitespace-nowrap">
            {av.name}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
