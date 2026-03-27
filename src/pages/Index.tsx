import { useState, useEffect, useCallback } from "react";
import LaptopScene from "@/components/LaptopScene";
import BootSequence from "@/components/BootSequence";
import ScreenContent from "@/components/ScreenContent";
import Particles from "@/components/Particles";
import FloatingIcons from "@/components/FloatingIcons";

const Index = () => {
  const [isBooted, setIsBooted] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showContent, setShowContent] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const timer = setTimeout(() => setIsBooted(true), 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleScroll = useCallback(() => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? scrollTop / docHeight : 0;
    setScrollProgress(Math.min(progress, 1));

    // Show content when zoomed in enough
    if (progress > 0.15) {
      setShowContent(true);
    }
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  // Fade out 3D scene as content appears
  const sceneOpacity = showContent ? Math.max(0, 1 - (scrollProgress - 0.15) * 5) : 1;

  return (
    <div className="min-h-[400vh] bg-background relative">
      <Particles />
      <FloatingIcons scrollProgress={scrollProgress} />

      {/* 3D Scene */}
      {!isMobile && (
        <div
          className="fixed inset-0 z-20"
          style={{ opacity: sceneOpacity, pointerEvents: showContent ? "none" : "auto" }}
        >
          <LaptopScene scrollProgress={scrollProgress} isBooted={isBooted} />
        </div>
      )}

      {/* Mobile fallback */}
      {isMobile && (
        <div className="fixed inset-0 z-20 flex items-center justify-center pointer-events-none">
          <div className="text-center px-6">
            <h1 className="text-4xl font-bold font-display glow-text gradient-text mb-3">
              Davidloper
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

      {/* Boot overlay text */}
      <BootSequence isBooted={isBooted} showContent={showContent} />

      {/* Main content */}
      <ScreenContent visible={showContent || isMobile} />
    </div>
  );
};

export default Index;
