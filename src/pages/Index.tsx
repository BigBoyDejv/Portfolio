import { useState, useEffect, useCallback } from "react";
import LaptopScene from "@/components/LaptopScene";
import BootSequence from "@/components/BootSequence";
import ScreenBranding from "@/components/ScreenBranding";
import ScreenContent from "@/components/ScreenContent";
import Particles from "@/components/Particles";

type BootPhase = "off" | "opening" | "spinner" | "loading" | "title" | "ready";

const Index = () => {
  const [bootPhase, setBootPhase] = useState<BootPhase>("off");
  const [lidOpenProgress, setLidOpenProgress] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  const bootReady = bootPhase === "ready";
  const showContent = scrollProgress > 0.2;

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);

    const t1 = setTimeout(() => {
      setBootPhase("opening");
      const startTime = Date.now();
      const duration = 2000;
      const animateLid = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        setLidOpenProgress(eased);
        if (progress < 1) requestAnimationFrame(animateLid);
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
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // 3D scene fades as branding zooms in
  const sceneOpacity = scrollProgress > 0.05
    ? Math.max(0, 1 - (scrollProgress - 0.05) * 6)
    : 1;
  const sceneBlur = scrollProgress > 0.05
    ? Math.min((scrollProgress - 0.05) * 40, 12)
    : 0;

  // Content fades in after zoom passes threshold
  const contentOpacity = scrollProgress > 0.3
    ? Math.min((scrollProgress - 0.3) * 4, 1)
    : 0;

  return (
    <div className="min-h-[500vh] bg-background relative">
      <Particles />

      {/* 3D Laptop Scene */}
      {!isMobile && (
        <div
          className="fixed inset-0 z-20"
          style={{
            opacity: sceneOpacity,
            filter: sceneBlur > 0 ? `blur(${sceneBlur}px)` : "none",
            pointerEvents: "none",
          }}
        >
          <LaptopScene scrollProgress={scrollProgress} lidOpenProgress={lidOpenProgress} />
        </div>
      )}

      {/* Mobile fallback */}
      {isMobile && bootReady && (
        <div
          className="fixed inset-0 z-20 flex items-center justify-center pointer-events-none"
          style={{ opacity: scrollProgress > 0.1 ? Math.max(0, 1 - scrollProgress * 3) : 1 }}
        >
          <div className="text-center px-6">
            <div
              className="w-12 h-0.5 rounded-full mx-auto mb-4"
              style={{
                background: "linear-gradient(90deg, transparent, hsl(270 80% 65%), transparent)",
                boxShadow: "0 0 15px hsl(270 80% 65% / 0.5)",
              }}
            />
            <h1
              className="text-3xl font-bold font-display tracking-[0.3em] text-foreground mb-2"
              style={{
                textShadow: "0 0 30px hsl(270 80% 65% / 0.6), 0 0 80px hsl(270 80% 65% / 0.3)",
              }}
            >
              DAVIDLOPER
            </h1>
            <p className="text-muted-foreground/30 text-xs font-mono animate-pulse-glow">
              ↓ Scroll to explore
            </p>
          </div>
        </div>
      )}

      {/* Boot overlay (spinner, progress bar) */}
      <BootSequence bootPhase={bootPhase} showContent={showContent} />

      {/* Screen branding - zooms on scroll */}
      <ScreenBranding bootReady={bootReady} scrollProgress={scrollProgress} />

      {/* Main website content - fades in after zoom */}
      <div
        className="fixed inset-0 z-40 overflow-y-auto"
        style={{
          opacity: contentOpacity,
          pointerEvents: contentOpacity > 0.1 ? "auto" : "none",
        }}
      >
        <ScreenContent visible={contentOpacity > 0} />
      </div>
    </div>
  );
};

export default Index;
