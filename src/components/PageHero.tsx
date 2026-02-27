import { motion } from "framer-motion";
import aboutBg from "@/assets/about-bg.jpg";

interface PageHeroProps {
  title: string;
  subtitle?: string;
}

const PageHero = ({ title, subtitle }: PageHeroProps) => {
  return (
    <div className="relative h-[45vh] min-h-[350px] flex items-center justify-center overflow-hidden mesh-gradient">
      {/* Design Elements */}
      <div className="blur-orb w-[300px] h-[300px] bg-red-500 -top-20 -left-20 animate-pulse" />
      <div className="blur-orb w-[400px] h-[400px] bg-accent -bottom-20 -right-20 animate-pulse delay-700" />
      <div className="blur-orb w-[250px] h-[250px] bg-blue-500 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20" />

      <img src={aboutBg} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay" />
      <div className="gradient-navy-overlay absolute inset-0 opacity-60" />

      <div className="relative z-10 text-center px-6 py-10 max-w-4xl mx-auto">
        <div className="glass-card rounded-3xl p-8 md:p-12 mb-4">
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
            className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-4"
          >
            <span className="gold-gradient-text">{title}</span>
          </motion.h1>
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-white/80 text-lg md:text-xl font-medium tracking-wide"
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHero;
