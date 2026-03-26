import { useState, useEffect } from "react";
import PageHero from "@/components/PageHero";
import SectionWrapper from "@/components/SectionWrapper";
import { testimonies as initialTestimonies } from "@/data/siteData";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Quote, Globe, Calendar as CalendarIcon, Plus } from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "@/components/ui/use-toast";

const Testimonies = () => {
  const [dbTestimonies, setDbTestimonies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTestimonies = async () => {
        try {
            const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
            const res = await fetch(`${API_BASE}/api/testimonies`);
            if (res.ok) {
                const data = await res.json();
                if (data.length > 0) {
                    setDbTestimonies(data);
                } else {
                    setDbTestimonies(initialTestimonies as any[]);
                }
            } else {
                setDbTestimonies(initialTestimonies as any[]);
            }
        } catch (error) {
            setDbTestimonies(initialTestimonies as any[]);
        } finally {
            setIsLoading(false);
        }
    };
    fetchTestimonies();
  }, []);

  return (
    <>
      <PageHero title="Sacred Testimonies" subtitle="Real stories of the fire and the altar" />
      <SectionWrapper dark>
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-6 space-y-6">
          <AnimatePresence mode="wait">
            {isLoading ? (
                <div className="col-span-full py-40 text-center">
                    <p className="text-white/20 animate-pulse font-black italic uppercase tracking-widest">Calling the Witness...</p>
                </div>
            ) : (
                dbTestimonies.map((t, i) => (
                    <motion.div
                      key={t.id}
                      initial={{ opacity: 0, y: 30 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="glass-card p-8 break-inside-avoid relative overflow-hidden group hover:border-red-600/20 transition-all border-white/5"
                    >
                      <div className="absolute top-0 left-0 w-24 h-24 blur-[50px] bg-red-600/5 group-hover:bg-red-600/10 transition-all" />
                      <Quote size={24} className="text-red-600 mb-6 opacity-40" />
                      
                      <p className="text-white/80 text-xl leading-relaxed italic mb-10 tracking-tight font-medium">
                        "{t.text || t.content || t.message}"
                      </p>

                      <div className="flex items-center justify-between border-t border-white/5 pt-6">
                        <div className="flex flex-col">
                            <span className="text-white font-black italic uppercase text-xs tracking-wider">{t.name}</span>
                            <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1.5 grayscale opacity-50">
                                <Globe size={10} className="text-red-500" />
                                {t.country || 'International'} • {t.category || 'Encounter'}
                            </span>
                        </div>
                        <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10 group-hover:scale-110 transition-transform">
                            <Heart size={16} className="text-red-500" />
                        </div>
                      </div>
                    </motion.div>
                ))
            )}
          </AnimatePresence>
        </div>

        <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="mt-32 p-12 glass-card rounded-[3rem] border-white/5 relative overflow-hidden text-center"
        >
          <div className="blur-orb w-[400px] h-[400px] bg-red-600/5 -top-40 -left-10" />
          <div className="relative z-10">
              <h2 className="text-4xl font-black mb-4 uppercase italic">
                Share Your <span className="gold-text">Encounter</span>
              </h2>
              <p className="text-white/40 max-w-xl mx-auto mb-10 font-medium uppercase tracking-widest italic text-xs leading-relaxed">
                Every victory at the altar is a seed for someone else. Let your testimony spark the fire across the global prayer network.
              </p>
              <Link 
                to="/contact" 
                className="btn-gold px-12 py-5 text-lg font-black italic shadow-2xl flex items-center justify-center gap-4 group w-fit mx-auto"
              >
                SEND TESTIMONY TO THE ALTAR
                <Plus size={24} className="group-hover:rotate-90 transition-transform" />
              </Link>
          </div>
        </motion.div>
      </SectionWrapper>
    </>
  );
};

export default Testimonies;
