import React, { useState, useEffect } from 'react';

const Nav = () => {
  const [activeSection, setActiveSection] = useState('home');

  useEffect(() => {
    const handleScroll = () => {
      const scrollPos = window.scrollY + window.innerHeight / 3;
      
      // Fallbacks in case explicit IDs aren't set on the sections
      const proposalEl = document.getElementById('proposal') || document.querySelector('.proposal-section, section:last-of-type');
      const memoriesEl = document.getElementById('memories') || document.querySelector('.bg-obsidian.relative');
      
      if (proposalEl && scrollPos >= proposalEl.offsetTop) {
        setActiveSection('mission');
      } else if (memoriesEl && scrollPos >= memoriesEl.offsetTop) {
        setActiveSection('memories');
      } else {
        setActiveSection('home');
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className="fixed top-0 left-0 w-full px-6 py-8 z-50 flex flex-col md:flex-row justify-between items-center gap-6 mix-blend-difference top-nav bg-gradient-to-b from-obsidian/80 to-transparent pointer-events-none">
      <div className="text-silver font-mono text-2xl tracking-[0.4em] uppercase font-bold text-glow pointer-events-auto">Sashanth</div>
      
      <ul className="flex gap-6 md:gap-12 text-silver font-sans uppercase tracking-[0.2em] text-xs md:text-sm font-bold pointer-events-auto">
        <li 
          className={`cursor-pointer transition-all duration-300 relative flex flex-col items-center ${activeSection === 'home' ? 'text-white' : 'hover:text-white/80'}`}
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <span>Home</span>
          {activeSection === 'home' && <div className="absolute -bottom-2 w-1 h-1 bg-[#ff1493] rounded-full animate-pulse shadow-[0_0_8px_#ff1493]"></div>}
        </li>
        <li 
          className={`cursor-pointer transition-all duration-300 relative flex flex-col items-center ${activeSection === 'memories' ? 'text-white' : 'hover:text-white/80'}`}
          onClick={() => {
            const el = document.getElementById('memories') || document.querySelectorAll('section')[1];
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <span>Memories</span>
          {activeSection === 'memories' && <div className="absolute -bottom-2 w-1 h-1 bg-[#ff1493] rounded-full animate-pulse shadow-[0_0_8px_#ff1493]"></div>}
        </li>
        <li 
          className={`cursor-pointer transition-all duration-300 hidden sm:flex flex-col items-center relative ${activeSection === 'mission' ? 'text-white' : 'hover:text-white/80'}`}
          onClick={() => {
            const el = document.getElementById('proposal') || document.querySelectorAll('section')[2];
            el?.scrollIntoView({ behavior: 'smooth' });
          }}
        >
          <span>Mission</span>
          {activeSection === 'mission' && <div className="absolute -bottom-2 w-1 h-1 bg-[#ff1493] rounded-full animate-pulse shadow-[0_0_8px_#ff1493]"></div>}
        </li>
      </ul>
    </nav>
  );
};

export default Nav;
