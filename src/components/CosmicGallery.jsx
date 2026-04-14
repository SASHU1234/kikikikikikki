import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

// =========================================================================
// IMAGE SLOTS — Replace these URLs with your own images
// =========================================================================
const pictureSlots = [
  "/kiki/1.jpg",
  "/kiki/2.jpg",
  "/kiki/3.png",
  "/kiki/4.png",
  "/kiki/5.png",
  "/kiki/6.png",
  "/kiki/7.png",
  "/kiki/8.png",
  "/kiki/9.png",
  "/kiki/10.png",
];

// Cover + 10 pictures + End page = 12 total
const TOTAL_PAGES = 12;

// Snap transition — fast and decisive, no lingering easing
const SNAP_TRANSITION = 'transform 0.35s cubic-bezier(0.4, 0, 0.2, 1)';

// =========================================================================
// Page Content Definitions — hoisted outside for stable React.memo refs
// =========================================================================
const INITIAL_PAGE_CONTENTS = [
  // Page 0: Cover
  <div key="cover" className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#111] via-[#09090b] to-[#040405] relative cursor-default">
    <h2 className="text-4xl sm:text-5xl md:text-7xl font-sans tracking-[0.2em] font-extrabold text-[#f3f3f3] uppercase drop-shadow-[0_0_20px_rgba(255,255,255,0.3)]">
      KIKI <span className="text-[#FF2D55] ml-2 drop-shadow-[0_0_25px_rgba(255,45,85,0.6)]">🖤</span>
    </h2>
    <div className="absolute bottom-8 sm:bottom-12 flex flex-col items-center gap-2">
      <p className="text-white/40 tracking-[0.2em] text-[9px] sm:text-xs md:text-sm uppercase animate-pulse">Drag Up to Open</p>
    </div>
  </div>,

  // Pages 1–10: Pictures
  ...pictureSlots.map((src, i) => (
    <img
      key={`pic-${i}`}
      src={src}
      alt={`Pic ${i + 1}`}
      draggable="false"
      decoding="async"
      className="w-full h-full object-cover select-none"
    />
  )),

  // Page 11: End
  <div key="end" className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-br from-[#111] via-[#09090b] to-[#040405] relative select-none">
    <h2 className="text-xl md:text-3xl font-mono tracking-widest text-[#FF2D55] uppercase drop-shadow-[0_0_15px_rgba(255,45,85,0.4)] opacity-80">
      Nandri Vanakkam
    </h2>
    <div className="mt-4 md:mt-6 w-12 md:w-16 h-[2px] bg-white/10 rounded-full" />
  </div>
];

// =========================================================================
// Page Component — Single-face, GPU-composited, React.memo'd
//
// backfaceVisibility:hidden on the OUTER wrapper means once a page
// rotates past -90deg it simply disappears — no back-face element needed.
// This eliminates the glitchy dual-layer rendering entirely.
// =========================================================================
const Page = React.memo(React.forwardRef(({ index, isFlipped, isCurrent, isPrev, isBeingDragged, content }, ref) => {
  const rotation = isFlipped ? -180 : 0;

  let zIndex;
  if (isBeingDragged) zIndex = 200;
  else if (isPrev) zIndex = 99;
  else if (isCurrent) zIndex = 100;
  else if (isFlipped) zIndex = index;
  else zIndex = (TOTAL_PAGES + 1) - index;

  return (
    <div
      ref={ref}
      className="absolute inset-0 w-full h-full"
      style={{
        transformOrigin: '50% 0%',
        transform: `rotateX(${rotation}deg) translateZ(0)`,
        zIndex,
        transition: SNAP_TRANSITION,
        willChange: 'transform',
        backfaceVisibility: 'hidden',
        WebkitBackfaceVisibility: 'hidden',
      }}
    >
      <div className="absolute inset-0 w-full h-full overflow-hidden rounded-lg md:rounded-xl bg-[#0e0e10] shadow-2xl border border-white/[0.06]">
        <div
          className="dynamic-shadow-top absolute inset-0 pointer-events-none z-20"
          style={{ opacity: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.9), transparent 45%)' }}
        />
        <div
          className="dynamic-shadow-bottom absolute inset-0 pointer-events-none z-20"
          style={{ opacity: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.75), transparent 55%)' }}
        />
        {content}
      </div>
    </div>
  );
}));

// =========================================================================
// Main Component
// =========================================================================
const CosmicGallery = () => {
  const containerRef = useRef(null);
  const pageRefs = useRef([]);

  const [currentPage, setCurrentPage] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [draggingIndex, setDraggingIndex] = useState(null);

  // Ref-based page tracker so pointer handlers never have stale closures
  const currentPageRef = useRef(0);
  useEffect(() => { currentPageRef.current = currentPage; }, [currentPage]);

  // Debounce lock to prevent rapid-fire flips from wheel events
  const flipLockRef = useRef(false);

  // Physics state — lives outside React to avoid re-render lag
  const physicsData = useRef({
    active: false,
    targetIndex: null,
    direction: null,
    directionLocked: false,
    startY: 0,
    currentY: 0,
    containerHeight: 500,
    animationFrameId: null,
    currentPageSnapshot: 0,
  });

  // Measure container on resize
  useEffect(() => {
    const measure = () => {
      if (containerRef.current) {
        physicsData.current.containerHeight = containerRef.current.getBoundingClientRect().height;
      }
    };
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // =================================================================
  // 60fps rAF Physics Loop — Direct DOM Mutation (drag only)
  // =================================================================
  const renderPhysicsFrame = useCallback(() => {
    const data = physicsData.current;
    if (!data.active || data.targetIndex === null) return;

    const pageRef = pageRefs.current[data.targetIndex];
    if (!pageRef) return;

    let deltaY = data.currentY - data.startY;
    const H = data.containerHeight;
    let rotation = 0;

    if (data.direction === 'forward') {
      if (deltaY > 0) deltaY = 0;
      const clamped = Math.max(-H, Math.min(0, deltaY));
      rotation = (clamped / H) * 180;
    } else if (data.direction === 'backward') {
      if (deltaY < 0) deltaY = 0;
      const clamped = Math.max(0, Math.min(H, deltaY));
      rotation = -180 + (clamped / H) * 180;
    }

    pageRef.style.transform = `rotateX(${rotation}deg) translateZ(0)`;

    // Shadow physics
    const progress = Math.abs(rotation) / 180;
    const intensity = Math.sin(progress * Math.PI) * 0.65;

    const shadowTops = pageRef.querySelectorAll('.dynamic-shadow-top');
    const shadowBottoms = pageRef.querySelectorAll('.dynamic-shadow-bottom');

    if (data.direction === 'forward') {
      shadowTops.forEach(el => { el.style.opacity = intensity; });
      shadowBottoms.forEach(el => { el.style.opacity = 0; });
    } else {
      shadowTops.forEach(el => { el.style.opacity = 0; });
      shadowBottoms.forEach(el => { el.style.opacity = intensity; });
    }

    data.animationFrameId = requestAnimationFrame(renderPhysicsFrame);
  }, []);

  // =================================================================
  // Pointer Handlers — Drag-to-flip
  // =================================================================
  const handlePointerDown = (e) => {
    const isLeftClick = e.button === 0;
    const isTouch = e.pointerType === 'touch';
    if (!isLeftClick && !isTouch) return;

    const rect = containerRef.current.getBoundingClientRect();

    setIsDragging(true);
    try { e.target.setPointerCapture(e.pointerId); } catch (_) { }

    physicsData.current = {
      active: true,
      targetIndex: null,
      direction: null,
      directionLocked: false,
      startY: e.clientY,
      currentY: e.clientY,
      containerHeight: rect.height,
      animationFrameId: null,
      currentPageSnapshot: currentPageRef.current,
    };

    physicsData.current.animationFrameId = requestAnimationFrame(renderPhysicsFrame);
  };

  const handlePointerMove = (e) => {
    const data = physicsData.current;
    if (!data.active) return;
    e.preventDefault();
    data.currentY = e.clientY;

    if (!data.directionLocked) {
      const delta = e.clientY - data.startY;
      if (Math.abs(delta) > 5) {
        const cp = data.currentPageSnapshot;
        if (delta < 0 && cp < TOTAL_PAGES - 1) {
          data.direction = 'forward';
          data.targetIndex = cp;
        } else if (delta > 0 && cp > 0) {
          data.direction = 'backward';
          data.targetIndex = cp - 1;
        } else {
          return;
        }
        data.directionLocked = true;
        setDraggingIndex(data.targetIndex);

        const targetRef = pageRefs.current[data.targetIndex];
        if (targetRef) {
          targetRef.style.transition = 'none';
          targetRef.style.willChange = 'transform';
          targetRef.querySelectorAll('.dynamic-shadow-top, .dynamic-shadow-bottom')
            .forEach(el => { el.style.transition = 'none'; });
        }
      }
    }
  };

  const finalizeDrag = (e) => {
    const data = physicsData.current;
    if (!data.active) return;

    data.active = false;
    if (e) {
      try { e.target.releasePointerCapture(e.pointerId); } catch (_) { }
    }
    if (data.animationFrameId) cancelAnimationFrame(data.animationFrameId);

    const pageRef = data.targetIndex !== null ? pageRefs.current[data.targetIndex] : null;
    const cp = data.currentPageSnapshot;

    const threshold = data.containerHeight * 0.3;
    const deltaY = data.currentY - data.startY;
    let nextPage = cp;

    if (data.direction === 'forward' && deltaY < -threshold) {
      nextPage = cp + 1;
    } else if (data.direction === 'backward' && deltaY > threshold) {
      nextPage = cp - 1;
    }

    if (pageRef) {
      pageRef.style.transition = SNAP_TRANSITION;
      pageRef.style.transform = '';
      pageRef.style.willChange = '';

      pageRef.querySelectorAll('.dynamic-shadow-top, .dynamic-shadow-bottom')
        .forEach(el => {
          el.style.transition = 'opacity 0.35s ease-out';
          el.style.opacity = '0';
        });
    }

    setIsDragging(false);
    setDraggingIndex(null);
    if (nextPage !== cp) {
      setCurrentPage(nextPage);
    }
  };

  // =================================================================
  // Wheel handler — instant page flip on scroll wheel
  // =================================================================
  const handleWheel = useCallback((e) => {
    // Only respond if the wheel event is on the gallery container
    e.preventDefault();

    if (flipLockRef.current) return;
    flipLockRef.current = true;

    const cp = currentPageRef.current;
    if (e.deltaY > 0 && cp < TOTAL_PAGES - 1) {
      setCurrentPage(cp + 1);
    } else if (e.deltaY < 0 && cp > 0) {
      setCurrentPage(cp - 1);
    }

    // Short cooldown to prevent scroll wheel spam
    setTimeout(() => { flipLockRef.current = false; }, 350);
  }, []);

  // Attach wheel listener (needs { passive: false } to preventDefault)
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  // Button navigation — immediate
  const flipNext = () => {
    const cp = currentPageRef.current;
    if (cp < TOTAL_PAGES - 1) setCurrentPage(cp + 1);
  };
  const flipPrev = () => {
    const cp = currentPageRef.current;
    if (cp > 0) setCurrentPage(cp - 1);
  };

  // Reset all shadows on page change
  useEffect(() => {
    pageRefs.current.forEach(ref => {
      if (ref) {
        ref.querySelectorAll('.dynamic-shadow-top, .dynamic-shadow-bottom')
          .forEach(el => { el.style.opacity = '0'; });
      }
    });
  }, [currentPage]);

  // Cleanup rAF on unmount
  useEffect(() => {
    return () => {
      if (physicsData.current.animationFrameId) {
        cancelAnimationFrame(physicsData.current.animationFrameId);
      }
    };
  }, []);

  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center py-16 md:py-20 overflow-hidden select-none">

      <div className="z-10 text-center mb-8 md:mb-14 px-4">
        <h2 className="text-3xl md:text-5xl text-silver/90 font-mono mb-4 md:mb-6 uppercase tracking-[0.3em] font-light">The Memory Logs</h2>
        <div className="h-[2px] w-12 md:w-16 bg-[#FF2D55] mx-auto rounded-full shadow-[0_0_10px_#FF2D55]" />
      </div>

      <div className="relative w-full flex flex-col items-center z-10 px-4">

        {/* 16:9 landscape container — overflow-hidden prevents page leaking */}
        <div
          ref={containerRef}
          className="relative w-full max-w-[360px] sm:max-w-[560px] md:max-w-[768px] lg:max-w-[960px] xl:max-w-[1100px] aspect-video z-20 touch-none rounded-lg md:rounded-xl overflow-hidden shadow-[0_20px_80px_rgba(0,0,0,0.7)]"
          style={{
            perspective: '1800px',
            cursor: isDragging ? 'grabbing' : 'grab',
          }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={finalizeDrag}
          onPointerCancel={finalizeDrag}
          onContextMenu={(e) => e.preventDefault()}
        >
          {/* Hinge shadow */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-b from-black/50 to-transparent z-[300] pointer-events-none rounded-t-lg md:rounded-t-xl" />

          <div className="relative w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
            {INITIAL_PAGE_CONTENTS.map((content, idx) => {
              const isFlipped = currentPage > idx;
              const isCurrent = currentPage === idx;
              const isPrev = currentPage - 1 === idx;
              const isBeingDragged = draggingIndex === idx;

              return (
                <Page
                  key={idx}
                  ref={(el) => (pageRefs.current[idx] = el)}
                  index={idx}
                  isFlipped={isFlipped}
                  isCurrent={isCurrent}
                  isPrev={isPrev}
                  isBeingDragged={isBeingDragged}
                  content={content}
                />
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-center mt-10 md:mt-16 gap-8 z-30 relative pointer-events-auto">
          <button
            onClick={flipPrev}
            disabled={currentPage === 0}
            className="p-3 md:p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 transition-all outline-none disabled:opacity-20 disabled:cursor-not-allowed group active:scale-95"
            aria-label="Previous page"
          >
            <ChevronDown className="text-white w-5 h-5 md:w-6 md:h-6 group-hover:translate-y-0.5 transition-transform" />
          </button>

          <div className="flex flex-col items-center w-24 md:w-32">
            <span className="font-mono text-silver/60 text-xs md:text-sm tracking-widest font-bold mb-3">
              {currentPage + 1} / {TOTAL_PAGES}
            </span>
            <div className="w-full h-[3px] bg-white/10 rounded-full overflow-hidden flex shadow-inner">
              <div
                className="h-full bg-[#FF2D55] transition-all duration-300 ease-out rounded-full shadow-[0_0_10px_#FF2D55]"
                style={{ width: `${(currentPage / (TOTAL_PAGES - 1)) * 100}%` }}
              />
            </div>
          </div>

          <button
            onClick={flipNext}
            disabled={currentPage === TOTAL_PAGES - 1}
            className="p-3 md:p-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/15 transition-all outline-none disabled:opacity-20 disabled:cursor-not-allowed group active:scale-95"
            aria-label="Next page"
          >
            <ChevronUp className="text-white w-5 h-5 md:w-6 md:h-6 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>

      </div>
    </section>
  );
};

export default CosmicGallery;
