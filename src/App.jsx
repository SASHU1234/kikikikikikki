import React from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import CosmicGallery from './components/CosmicGallery';
import HiddenMessage from './components/HiddenMessage';
import Proposal from './components/Proposal';
import BokehParticles from './components/BokehParticles';

function App() {
  return (
    <div className="relative w-full bg-obsidian text-silver overflow-x-hidden">
      {/* Global Environmental Effects */}
      <div className="fixed inset-0 z-0 bg-[radial-gradient(circle_at_center,_#2D0A1F_0%,_transparent_70%)] opacity-80 pointer-events-none mix-blend-screen"></div>
      <BokehParticles />

      <Nav />
      <Hero />
      <div id="memories">
        <CosmicGallery />
      </div>
      <HiddenMessage />
      <div id="proposal">
        <Proposal />
      </div>
    </div>
  );
}

export default App;
