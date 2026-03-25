import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Rocket } from 'lucide-react';
import { gsap } from 'gsap';

const Proposal = () => {
  const [isRevealed, setIsRevealed] = useState(false);
  const [noMessage, setNoMessage] = useState(false);

  const handleInitiate = (e) => {
    setIsRevealed(true);
    
    // Confetti explosion using custom pink/silver colors matching theme
    const colors = ['#FF2D55', '#E0E0E0', '#ffffff'];

    // Burst 1
    confetti({
      particleCount: 150,
      spread: 100,
      origin: { y: 0.6 },
      colors: colors,
      disableForReducedMotion: true
    });

    // Burst 2 - Stars
    setTimeout(() => {
      confetti({
        particleCount: 80,
        spread: 120,
        origin: { y: 0.5 },
        colors: colors,
        shapes: ['star']
      });
    }, 250);
  };

  return (
    <section className="relative w-full h-screen flex flex-col items-center justify-center z-20">
      
      {!isRevealed ? (
        <div className="flex flex-col items-center gap-12">
           <img 
             src="/bear-proposal.png" 
             alt="Proposal Bear" 
             className="w-64 md:w-96 object-contain drop-shadow-[0_0_15px_rgba(255,45,85,0.3)] hover:scale-105 transition-transform"
           />
           
           <div className="flex gap-6 items-center">
             <button 
               onClick={handleInitiate}
               className="group relative px-12 py-6 bg-transparent border border-neon rounded-full overflow-hidden transition-all hover:border-glow hover:scale-110"
             >
                <div className="absolute inset-0 bg-neon opacity-10 group-hover:opacity-20 transition-opacity"></div>
                <div className="relative flex items-center justify-center gap-3">
                  <span className="text-neon font-mono tracking-[0.3em] uppercase font-bold text-3xl text-glow">Yes</span>
                </div>
             </button>

             <button 
               onClick={() => setNoMessage(true)}
               className="group relative px-8 py-4 bg-transparent border border-silver/40 rounded-full overflow-hidden transition-all hover:border-silver/80 hover:scale-95"
             >
                <div className="absolute inset-0 bg-silver opacity-0 group-hover:opacity-10 transition-opacity"></div>
                <div className="relative flex items-center justify-center gap-3">
                  <span className="text-silver/60 group-hover:text-silver font-mono tracking-[0.2em] uppercase font-bold text-xl">No</span>
                </div>
             </button>
           </div>

           {noMessage && (
             <div className="absolute bottom-20 text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
               <p className="text-neon font-mono text-xl tracking-widest uppercase text-glow">
                 That was never an option<br/>Try again
               </p>
             </div>
           )}
         </div>
      ) : (
        <div className="relative w-full h-[80vh] flex flex-col items-center justify-center animate-in fade-in zoom-in duration-1000 gap-12">
           
           <div className="relative p-2 md:p-4 rounded-xl glass-panel border border-neon/50 drop-shadow-[0_0_30px_rgba(255,45,85,0.3)]">
             <img 
               src="/married.png" 
               alt="Married" 
               className="w-72 md:w-[28rem] rounded-lg object-contain" 
             />
           </div>
           
           <h3 className="text-3xl md:text-5xl font-mono text-neon text-glow uppercase tracking-[0.4em] text-center">
             Could Be Us
           </h3>
           
        </div>
      )}
      
    </section>
  );
};

export default Proposal;
