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
    <section ref={containerRef} className="relative w-full flex justify-center items-center overflow-hidden py-12 md:py-20 lg:py-28">
      <div className="relative w-full max-w-4xl flex justify-center items-center px-6 md:px-12">
        <div
          ref={textRef}
          className="text-[#FFEDED] text-center font-sans flex flex-col gap-8 md:gap-12"
          style={{ filter: 'drop-shadow(0 0 10px rgba(255, 45, 85, 0.3))' }}
        >
          <p className="text-base sm:text-lg md:text-2xl lg:text-3xl leading-relaxed md:leading-loose font-medium tracking-wide">
            Happiest birthday ml 💗 . Ur 20 now . It’s been hardly 3 months since I met u but I have to say that u play an important role in my life now . As someone who never lets anybody into my comfort zone easily I still wonder how u broke that habit of mine 🤍. Ik I’m not perfect I have my own flaws but when it’s with u I wanna change myself .Once again happiest birthday ML. I didnt know how to convey this to u and couldnt think of a gift I could give u.
          </p>
          <p className="text-base sm:text-lg md:text-2xl lg:text-3xl leading-relaxed md:leading-loose font-medium tracking-wide">
            I was thinking of when and how to convey this to u and I thought that it would be the best if I did it on ur birthday and here u are reading it . I’m not someone who takes the first move but here I am.
          </p>
          <p className="text-xl sm:text-2xl md:text-4xl lg:text-5xl text-white font-sans uppercase tracking-[0.1em] sm:tracking-[0.15em] font-extrabold neon-text-stack mt-8 break-words leading-tight">
            Do u wanna be my forever??
          </p>
        </div>
      </div>
    </section>
  );
};

export default HiddenMessage;
