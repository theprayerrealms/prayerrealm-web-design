import PageHero from "@/components/PageHero";
import SectionWrapper from "@/components/SectionWrapper";
import { testimonies } from "@/data/siteData";
import { motion } from "framer-motion";
import { Heart, Quote } from "lucide-react";
import { Link } from "react-router-dom";

const Testimonies = () => {
  return (
    <>
      <PageHero title="Testimonies" subtitle="See what God is doing through prayer" />
      <SectionWrapper>
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          {testimonies.map((t, i) => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card-elevated p-6 break-inside-avoid"
            >
              <Quote size={20} className="gold-text mb-3" />
              <p className="text-muted-foreground text-sm leading-relaxed italic mb-4">"{t.text}"</p>
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">
                  {t.name} <span className="text-muted-foreground">• {t.country}</span>
                </div>
                <span className="text-xs px-2 py-1 rounded-full bg-secondary text-muted-foreground">{t.category}</span>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Video testimony placeholder */}
        <div className="mt-16 text-center">
          <h2 className="font-heading text-3xl font-bold mb-4">
            Video <span className="gold-text">Testimonies</span>
          </h2>
          <p className="text-muted-foreground mb-8">Coming soon — watch real stories of answered prayer.</p>
          <div className="max-w-2xl mx-auto aspect-video bg-secondary rounded-lg flex items-center justify-center">
            <Heart size={48} className="text-muted-foreground/30" />
          </div>
        </div>

        <div className="text-center mt-12">
          <Link to="/contact" className="btn-gold">Share Your Testimony</Link>
        </div>
      </SectionWrapper>
    </>
  );
};

export default Testimonies;
