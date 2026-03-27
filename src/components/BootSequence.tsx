import { motion, AnimatePresence } from "framer-motion";

interface BootSequenceProps {
  isBooted: boolean;
  showContent: boolean;
}

const BootSequence = ({ isBooted, showContent }: BootSequenceProps) => {
  if (showContent) return null;

  return (
    <AnimatePresence>
      {isBooted && (
        <motion.div
          className="fixed inset-0 z-30 flex items-center justify-center pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="text-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <motion.h1
              className="text-5xl md:text-7xl font-bold font-display glow-text gradient-text mb-4"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              Davidloper
            </motion.h1>
            <motion.p
              className="text-muted-foreground text-lg font-mono"
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              Creative Developer & Designer
            </motion.p>
            <motion.div
              className="mt-8 text-muted-foreground/50 text-sm font-mono"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0, 1] }}
              transition={{ delay: 1.5, duration: 2, repeat: Infinity }}
            >
              ↓ Scroll to explore
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BootSequence;
