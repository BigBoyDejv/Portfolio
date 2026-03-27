import { motion } from "framer-motion";
import { Code, Figma, Terminal, Globe, Database, Cpu } from "lucide-react";

interface FloatingIconsProps {
  scrollProgress: number;
}

const icons = [
  { Icon: Code, x: 10, y: 20, delay: 0 },
  { Icon: Figma, x: 85, y: 15, delay: 0.5 },
  { Icon: Terminal, x: 5, y: 70, delay: 1 },
  { Icon: Globe, x: 90, y: 65, delay: 1.5 },
  { Icon: Database, x: 15, y: 45, delay: 2 },
  { Icon: Cpu, x: 80, y: 40, delay: 2.5 },
];

const FloatingIcons = ({ scrollProgress }: FloatingIconsProps) => {
  const opacity = Math.max(0, 1 - scrollProgress * 3);

  return (
    <div className="fixed inset-0 pointer-events-none z-10" style={{ opacity }}>
      {icons.map(({ Icon, x, y, delay }, i) => (
        <motion.div
          key={i}
          className="absolute text-primary/20"
          style={{ left: `${x}%`, top: `${y}%` }}
          animate={{
            y: [0, -30, 0],
            rotate: [0, 10, -10, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            delay,
            ease: "easeInOut",
          }}
        >
          <Icon size={32} />
        </motion.div>
      ))}
    </div>
  );
};

export default FloatingIcons;
