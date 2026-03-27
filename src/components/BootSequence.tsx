import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

interface BootSequenceProps {
  bootPhase: "off" | "opening" | "spinner" | "loading" | "title" | "ready";
  showContent: boolean;
}

const BootSequence = ({ bootPhase, showContent }: BootSequenceProps) => {
  const [loadProgress, setLoadProgress] = useState(0);

  useEffect(() => {
    if (bootPhase === "loading") {
      setLoadProgress(0);
      const interval = setInterval(() => {
        setLoadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 2;
        });
      }, 30);
      return () => clearInterval(interval);
    }
  }, [bootPhase]);

  if (showContent) return null;

  const isVisible = bootPhase === "spinner" || bootPhase === "loading" || bootPhase === "title";

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-30 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex flex-col items-center gap-6">
            {/* Spinner phase */}
            {bootPhase === "spinner" && (
              <motion.div
                className="w-8 h-8 border-2 border-primary/30 border-t-primary rounded-full"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                initial={{ opacity: 0 }}
              />
            )}

            {/* Loading bar phase */}
            {(bootPhase === "loading" || bootPhase === "title") && (
              <>
                {/* Circular loader icon */}
                <motion.div
                  className="w-6 h-6 border-2 border-primary/40 border-t-primary rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: "linear" }}
                  initial={{ opacity: 0, scale: 0.5 }}
                />

                {/* Progress bar */}
                <div className="w-48 h-1.5 bg-muted/30 rounded-full overflow-hidden border border-border/20">
                  <motion.div
                    className="h-full rounded-full gradient-primary"
                    style={{ width: `${loadProgress}%` }}
                    transition={{ ease: "linear" }}
                  />
                </div>
              </>
            )}

            {/* Title phase */}
            {bootPhase === "title" && (
              <motion.h1
                className="text-3xl md:text-5xl font-bold font-display tracking-wider text-foreground"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                style={{
                  textShadow:
                    "0 0 30px hsl(270 80% 65% / 0.6), 0 0 80px hsl(270 80% 65% / 0.3)",
                }}
              >
                DAVIDLOPER
              </motion.h1>
            )}

            {/* Scroll hint */}
            {bootPhase === "title" && loadProgress >= 100 && (
              <motion.p
                className="text-muted-foreground/40 text-xs font-mono mt-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 0.6, 0.2, 0.6] }}
                transition={{ delay: 0.5, duration: 2.5, repeat: Infinity }}
              >
                ↓ Scroll to enter
              </motion.p>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BootSequence;
