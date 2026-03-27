import { useState, useEffect, useCallback } from "react";
import LaptopScene from "@/components/LaptopScene";
import BootSequence from "@/components/BootSequence";
import ScreenContent from "@/components/ScreenContent";
import Particles from "@/components/Particles";

type BootPhase = "off" | "opening" | "spinner" | "loading" | "title" | "ready";

const Index = () => {
  const [bootPhase, setBootPhase] = useState<BootPhase>("off");
  const [lidOpenProgress, setLidOpenProgress] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);

    // Boot timeline
    const t1 = setTimeout(() => {
      setBootPhase("opening");
      // Animate lid open over 2 seconds
      const startTime = Date.now();
      const duration = 2000;
      const animateLid = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        // Ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        setLidOpenProgress(eased);
        if (progress < 1) {
          requestAnimationFrame(animateLid);
        }
      };
      requestAnimationFrame(animateLid);
    }, 1500);

    const t2 = setTimeout(() => setBootPhase("spinner"), 3000);
    const t3 = setTimeout(() => setBootPhase("loading"), 4200);
    const t4 = setTimeout(() => setBootPhase("title"), 6000);
    const t5 = setTimeout(() => setBootPhase("ready"), 7500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
      clearTimeout(t5);
    };
  }, []);

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollTop / docHeight : 0;
    setScrollProgress(Math.min(progress, 1));

    if (progress > 0.2) {
      setShowContent(true);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Fade + blur out the 3D scene as we transition
  const sceneOpacity = showContent ? Math.max(0, 1 - (scrollProgress - 0.2) * 4) : 1;
  const sceneBlur = showContent ? Math.min((scrollProgress - 0.2) * 30, 10) : 0;

  return (
    <div className="min-h-[500vh] bg-background relative">
      <Particles />

      {/* 3D Scene */}
      {!isMobile && (
        <div
          className="fixed inset-0 z-20"
          style={{
            opacity: sceneOpacity,
            filter: sceneBlur > 0 ? `blur(${sceneBlur}px)` : "none",
            pointerEvents: showContent ? "none" : "auto",
          }}
        >
          <LaptopScene scrollProgress={scrollProgress} lidOpenProgress={lidOpenProgress} />
        </div>
      )}

      {/* Mobile fallback */}
      {isMobile && (
        <div className="fixed inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="text-center px-6">
            <h1
              className="text-4xl font-bold font-display mb-3 text-foreground"
              style={{
                textShadow:
                  "0 0 30px hsl(270 80% 65% / 0.6), 0 0 80px hsl(270 80% 65% / 0.3)",
              }}
            >
              DAVIDLOPER
            </h1>
            <p className="text-muted-foreground text-sm font-mono">
              Creative Developer & Designer
            </p>
            <p className="text-muted-foreground/40 text-xs mt-6 font-mono animate-pulse-glow">
              ↓ Scroll to explore
            </p>
          </div>
        </div>
      )}

      {/* Boot overlay */}
      <BootSequence bootPhase={bootPhase} showContent={showContent} />

      {/* Main content */}
      <ScreenContent visible={showContent || isMobile} />
    </div>
  );
};

export default Index;
