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
      transition={{ duration: 1, delay: 0.3 }}
    >
      {/* Gradient overlay at top */}
      <div className="h-20 bg-gradient-to-b from-background to-transparent sticky top-0 z-50" />

      <div className="max-w-4xl mx-auto px-6 pb-20">
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
