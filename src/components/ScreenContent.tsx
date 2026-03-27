import { motion } from "framer-motion";
import AboutSection from "./sections/AboutSection";
import ProjectsSection from "./sections/ProjectsSection";
import ContactSection from "./sections/ContactSection";

interface ScreenContentProps {
  visible: boolean;
}

const ScreenContent = ({ visible }: ScreenContentProps) => {
  if (!visible) return null;

  return (
    <motion.div
      className="fixed inset-0 z-40 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2, delay: 0.3 }}
    >
      {/* Top gradient fade */}
      <div className="h-24 bg-gradient-to-b from-background via-background/80 to-transparent sticky top-0 z-50" />

      <div className="max-w-4xl mx-auto px-6 pb-20">
        {/* Hero inside content */}
        <motion.div
          className="text-center py-16 mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <h1
            className="text-5xl md:text-7xl font-bold font-display tracking-wider text-foreground mb-4"
            style={{
              textShadow:
                "0 0 40px hsl(270 80% 65% / 0.5), 0 0 100px hsl(270 80% 65% / 0.2)",
            }}
          >
            DAVIDLOPER
          </h1>
          <p className="text-muted-foreground text-lg font-mono">
            Creative Developer & Designer
          </p>
        </motion.div>

        <AboutSection />
        <ProjectsSection />
        <ContactSection />

        {/* Footer */}
        <motion.footer
          className="text-center py-12 mt-20 border-t border-border/30"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-muted-foreground text-sm font-mono">
            © Davidloper. All rights reserved.
          </p>
        </motion.footer>
      </div>
    </motion.div>
  );
};

export default ScreenContent;
