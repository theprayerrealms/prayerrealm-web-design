import { motion } from "framer-motion";
import { ReactNode } from "react";

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  id?: string;
  dark?: boolean;
}

const SectionWrapper = ({ children, className = "", id, dark = false }: SectionWrapperProps) => {
  return (
    <motion.section
      id={id}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, ease: "easeOut" }}
      className={`section-padding ${dark ? "gradient-navy text-primary-foreground" : ""} ${className}`}
    >
      <div className="container-narrow">{children}</div>
    </motion.section>
  );
};

export default SectionWrapper;
