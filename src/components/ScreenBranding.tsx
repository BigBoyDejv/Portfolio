import { motion } from "framer-motion";

interface ScreenBrandingProps {
  bootReady: boolean;
  scrollProgress: number;
}

const ScreenBranding = ({ bootReady, scrollProgress }: ScreenBrandingProps) => {
  if (!bootReady) return null;

  // Zoom: starts as small "screen" in center, scales to fill viewport
  // scrollProgress 0 = idle (small), 0.15+ = filling viewport
  const zoomFactor = 1 + scrollProgress * 12;
  const brandingOpacity = scrollProgress > 0.25 ? Math.max(0, 1 - (scrollProgress - 0.25) * 5) : 1;

  return (
    <motion.div
      className="fixed inset-0 z-30 flex items-center justify-center pointer-events-none"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div
        className="flex flex-col items-center justify-center"
        style={{
          transform: `scale(${zoomFactor})`,
          opacity: brandingOpacity,
          transition: "opacity 0.3s ease",
          willChange: "transform, opacity",
        }}
      >
        {/* Purple horizontal bar */}
        <motion.div
          className="w-16 h-0.5 rounded-full mb-6"
          style={{
            background: "linear-gradient(90deg, transparent, hsl(270 80% 65%), transparent)",
            boxShadow: "0 0 20px hsl(270 80% 65% / 0.6), 0 0 40px hsl(270 80% 65% / 0.3)",
          }}
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        />

        {/* DAVIDLOPER title */}
        <motion.h1
          className="text-2xl md:text-4xl font-bold font-display tracking-[0.3em] text-foreground"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          style={{
            textShadow:
              "0 0 30px hsl(270 80% 65% / 0.8), 0 0 60px hsl(270 80% 65% / 0.4), 0 0 120px hsl(270 80% 65% / 0.2)",
          }}
        >
          DAVIDLOPER
        </motion.h1>

        {/* Scroll hint */}
        <motion.p
          className="text-muted-foreground/30 text-[10px] font-mono mt-6 tracking-widest"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 0.5, 0.2, 0.5] }}
          transition={{ delay: 1.5, duration: 3, repeat: Infinity }}
        >
          ↓ SCROLL TO ENTER
        </motion.p>
      </div>
    </motion.div>
  );
};

export default ScreenBranding;
