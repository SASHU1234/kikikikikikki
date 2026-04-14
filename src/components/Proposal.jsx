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
    <section className="relative w-full flex flex-col items-center justify-start pt-4 pb-20 z-20">

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
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
              <div className="relative p-8 md:p-12 rounded-3xl bg-black/60 border border-neon/60 drop-shadow-[0_0_40px_rgba(255,45,85,0.5)] flex flex-col items-center gap-8 max-w-lg w-full mx-4 text-center">
                <p className="text-neon font-sans text-xl md:text-3xl tracking-wide font-medium leading-relaxed" style={{ filter: 'drop-shadow(0 0 8px rgba(255, 45, 85, 0.8))' }}>
                  NOT ALLOWED. <br /> ADHELLAM ALLOW PANNA MUDIYADHU.
                </p>
                <p className="text-silver/80 font-sans text-sm md:text-base tracking-widest uppercase mt-4">
                  Try again
                </p>
                <button
                  onClick={() => setNoMessage(false)}
                  className="mt-4 px-10 py-4 bg-transparent border border-neon rounded-full overflow-hidden transition-all hover:bg-neon/20 hover:scale-105"
                >
                  <span className="text-neon font-mono tracking-[0.3em] uppercase font-bold text-lg">Back</span>
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="relative w-full h-[80vh] flex flex-col items-center justify-center animate-in fade-in zoom-in duration-1000 gap-12">

          <div className="relative font-sans drop-shadow-[0_0_30px_rgba(255,45,85,0.2)] hover:scale-105 transition-transform duration-500">
            <img
              src="/married.png"
              alt="Married"
              className="w-72 md:w-[28rem] object-contain"
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
