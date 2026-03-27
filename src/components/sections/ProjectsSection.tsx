import { motion } from "framer-motion";
import { ExternalLink, Github } from "lucide-react";

const projects = [
  {
    title: "Nebula Dashboard",
    description: "Real-time data visualization platform with 3D charts and live WebSocket feeds.",
    tags: ["React", "Three.js", "D3"],
    color: "from-primary/30 to-accent/20",
  },
  {
    title: "SynthWave Studio",
    description: "Web-based music production tool with AI-powered beat generation and audio visualization.",
    tags: ["Web Audio", "TensorFlow", "Canvas"],
    color: "from-accent/30 to-primary/20",
  },
  {
    title: "PixelForge",
    description: "Collaborative design tool with real-time multiplayer editing and version control.",
    tags: ["WebRTC", "Canvas", "Node.js"],
    color: "from-primary/20 to-accent/30",
  },
  {
    title: "Quantum API",
    description: "High-performance REST & GraphQL API gateway with automatic documentation and testing.",
    tags: ["GraphQL", "Redis", "Docker"],
    color: "from-accent/20 to-primary/30",
  },
];

const ProjectsSection = () => {
  return (
    <motion.section
      className="py-20"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
    >
      <motion.h2
        className="text-4xl md:text-5xl font-bold font-display gradient-text mb-12"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        Projects
      </motion.h2>

      <div className="grid md:grid-cols-2 gap-6">
        {projects.map((project, i) => (
          <motion.div
            key={project.title}
            className="glass glow-box rounded-2xl p-6 cursor-pointer group relative overflow-hidden"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            whileHover={{
              scale: 1.02,
              rotateX: 2,
              rotateY: -2,
            }}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* Gradient bg */}
            <div
              className={`absolute inset-0 bg-gradient-to-br ${project.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`}
            />

            <div className="relative z-10">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-bold font-display text-foreground group-hover:text-primary transition-colors">
                  {project.title}
                </h3>
                <div className="flex gap-2 text-muted-foreground">
                  <Github size={16} className="hover:text-primary transition-colors" />
                  <ExternalLink size={16} className="hover:text-primary transition-colors" />
                </div>
              </div>

              <p className="text-secondary-foreground/60 text-sm mb-4 leading-relaxed">
                {project.description}
              </p>

              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-xs font-mono px-2 py-1 rounded-md bg-primary/10 text-primary/70"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default ProjectsSection;
