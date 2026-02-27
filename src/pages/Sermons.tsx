import { useState } from "react";
import PageHero from "@/components/PageHero";
import SectionWrapper from "@/components/SectionWrapper";
import { sermons } from "@/data/siteData";
import { motion } from "framer-motion";
import { Play, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";

const categories = ["All", "Prayer", "Devotion", "Intercession", "Faith"];

const Sermons = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeVideoId, setActiveVideoId] = useState<number | null>(null);

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
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${activeCategory === cat
                ? "btn-gold"
                : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {filtered.map((sermon) => (
            <motion.div
              key={sermon.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-elevated overflow-hidden group"
            >
              <div className="relative aspect-video bg-navy overflow-hidden">
                {activeVideoId === sermon.id ? (
                  <iframe
                    width="100%"
                    height="100%"
                    src={`https://www.youtube.com/embed/${sermon.videoId}?autoplay=1`}
                    title={sermon.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    className="w-full h-full"
                  ></iframe>
                ) : (
                  <div
                    className="relative w-full h-full cursor-pointer group"
                    onClick={() => setActiveVideoId(sermon.id)}
                  >
                    <img
                      src={`https://img.youtube.com/vi/${sermon.videoId}/maxresdefault.jpg`}
                      alt={sermon.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 opacity-60"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-primary/90 rounded-full flex items-center justify-center text-white shadow-xl transition-all group-hover:bg-primary group-hover:scale-110">
                        <Play size={32} fill="currentColor" />
                      </div>
                    </div>
                    <span className="absolute bottom-4 right-4 text-xs font-bold bg-black/60 text-white px-3 py-1.5 rounded-full backdrop-blur-sm">
                      {sermon.category}
                    </span>
                  </div>
                )}
              </div>
              <div className="p-6">
                <h3 className="font-heading text-xl font-bold mb-2 group-hover:gold-text transition-colors">{sermon.title}</h3>
                <p className="text-sm font-semibold text-primary mb-3">{sermon.speaker}</p>
                <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">{sermon.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>
    </>
  );
};

export default Sermons;
