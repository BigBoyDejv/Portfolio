import { motion } from "framer-motion";
import { User, MapPin, Briefcase } from "lucide-react";

const AboutSection = () => {
  return (
    <motion.section
      className="py-20"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
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
        About Me
      </motion.h2>

      <div className="grid md:grid-cols-[1fr_2fr] gap-10 items-start">
        {/* Profile image placeholder */}
        <motion.div
          className="glass glow-border rounded-2xl p-1 aspect-square max-w-[280px] mx-auto md:mx-0"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <div className="w-full h-full rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
            <User className="w-20 h-20 text-primary/40" />
          </div>
        </motion.div>

        <div className="space-y-6">
          <motion.p
            className="text-lg text-secondary-foreground/80 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            I'm a creative developer passionate about crafting immersive digital
            experiences. I blend cutting-edge technology with thoughtful design to
            build products that feel alive.
          </motion.p>

          <motion.p
            className="text-secondary-foreground/60 leading-relaxed"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            Specializing in interactive 3D experiences, creative coding, and
            full-stack development. Every project is an opportunity to push
            boundaries and create something extraordinary.
          </motion.p>

          <motion.div
            className="flex flex-wrap gap-4 pt-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {[
              { icon: MapPin, text: "Remote Worldwide" },
              { icon: Briefcase, text: "Open to Work" },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-2 glass px-4 py-2 rounded-full text-sm text-muted-foreground"
              >
                <Icon size={14} className="text-primary" />
                {text}
              </div>
            ))}
          </motion.div>

          {/* Skills */}
          <motion.div
            className="flex flex-wrap gap-2 pt-4"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            {["React", "Three.js", "TypeScript", "Node.js", "GSAP", "WebGL", "Figma", "Tailwind"].map(
              (skill, i) => (
                <motion.span
                  key={skill}
                  className="glass glow-border px-3 py-1.5 rounded-lg text-xs font-mono text-primary/80"
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7 + i * 0.05 }}
                  whileHover={{ scale: 1.1 }}
                >
                  {skill}
                </motion.span>
              )
            )}
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default AboutSection;
