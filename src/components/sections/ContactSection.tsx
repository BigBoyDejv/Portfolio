import { motion } from "framer-motion";
import { Send, Mail, MessageSquare } from "lucide-react";
import { useState } from "react";

const ContactSection = () => {
  const [focused, setFocused] = useState<string | null>(null);

  return (
    <motion.section
      className="py-20"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8 }}
    >
      <motion.h2
        className="text-4xl md:text-5xl font-bold font-display gradient-text mb-4"
        initial={{ opacity: 0, x: -20 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        Get In Touch
      </motion.h2>

      <motion.p
        className="text-muted-foreground mb-12 max-w-lg"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2 }}
      >
        Have a project in mind? Let's create something extraordinary together.
      </motion.p>

      <motion.form
        className="max-w-lg space-y-5"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.3 }}
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="relative">
          <Mail
            size={16}
            className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
              focused === "name" ? "text-primary" : "text-muted-foreground/40"
            }`}
          />
          <input
            type="text"
            placeholder="Your Name"
            className="neon-input w-full pl-10"
            onFocus={() => setFocused("name")}
            onBlur={() => setFocused(null)}
          />
        </div>

        <div className="relative">
          <Mail
            size={16}
            className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${
              focused === "email" ? "text-primary" : "text-muted-foreground/40"
            }`}
          />
          <input
            type="email"
            placeholder="your@email.com"
            className="neon-input w-full pl-10"
            onFocus={() => setFocused("email")}
            onBlur={() => setFocused(null)}
          />
        </div>

        <div className="relative">
          <MessageSquare
            size={16}
            className={`absolute left-4 top-4 transition-colors ${
              focused === "message" ? "text-primary" : "text-muted-foreground/40"
            }`}
          />
          <textarea
            rows={5}
            placeholder="Tell me about your project..."
            className="neon-input w-full pl-10 resize-none"
            onFocus={() => setFocused("message")}
            onBlur={() => setFocused(null)}
          />
        </div>

        <motion.button
          type="submit"
          className="gradient-primary px-8 py-3 rounded-lg font-display font-semibold text-primary-foreground flex items-center gap-2 glow-box"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <Send size={16} />
          Send Message
        </motion.button>
      </motion.form>
    </motion.section>
  );
};

export default ContactSection;
