import { useState } from "react";
import PageHero from "@/components/PageHero";
import SectionWrapper from "@/components/SectionWrapper";
import { sermons } from "@/data/siteData";
import { motion } from "framer-motion";
import { Play } from "lucide-react";

const categories = ["All", "Prayer", "Devotion", "Intercession", "Faith"];

const Sermons = () => {
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = activeCategory === "All"
    ? sermons
    : sermons.filter((s) => s.category === activeCategory);

  return (
    <>
      <PageHero title="Sermons" subtitle="Be strengthened by the Word of God" />
      <SectionWrapper>
        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-10">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat
                  ? "btn-gold"
                  : "bg-secondary text-muted-foreground hover:bg-secondary/80"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {filtered.map((sermon) => (
            <motion.div
              key={sermon.id}
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="card-elevated overflow-hidden"
            >
              <div className="relative aspect-video bg-navy flex items-center justify-center">
                <Play size={48} className="text-primary-foreground/40" />
                <span className="absolute bottom-2 right-2 text-xs bg-primary/80 text-primary-foreground px-2 py-1 rounded">
                  {sermon.category}
                </span>
              </div>
              <div className="p-5">
                <h3 className="font-heading text-lg font-semibold mb-1">{sermon.title}</h3>
                <p className="text-sm gold-text mb-2">{sermon.speaker}</p>
                <p className="text-muted-foreground text-sm">{sermon.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>
    </>
  );
};

export default Sermons;
