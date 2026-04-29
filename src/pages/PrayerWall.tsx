import { useState, useEffect } from "react";
import PageHero from "@/components/PageHero";
import SectionWrapper from "@/components/SectionWrapper";
import { prayerWallPosts as initialPosts, countries, prayerCategories } from "@/data/siteData";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Globe, Send, Shield, AlertCircle, Plus } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { collection, getDocs, addDoc, query, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const PrayerWall = () => {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [isSyncing, setIsSyncing] = useState(true);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    country: "Nigeria",
    category: "Healing",
    message: "",
    showOnWall: true,
    isUrgent: false,
    isAnonymous: false,
  });

  const fetchPrayers = async () => {
    try {
        const q = query(collection(db, 'prayers'), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
            const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() as any })).filter(d => d.status === 'APPROVED');
            setPosts(data.length > 0 ? data : initialPosts);
        } else {
            setPosts(initialPosts);
        }
    } catch (error) {
        console.error('Error fetching prayers:', error);
        setPosts(initialPosts);
    } finally {
        setIsSyncing(false);
    }
  };

  useEffect(() => {
    fetchPrayers();
  }, []);

  const handlePray = (id: string) => {
    setPosts(posts.map((p) => p.id === id ? { ...p, prayerCount: (p.prayerCount || 0) + 1 } : p));
    // Optional: Add backend increment if endpoint exists
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.message.trim() || !formData.email.trim()) {
      setError("Email and Prayer Request are required.");
      return;
    }

    setLoading(true);

    try {
        await addDoc(collection(db, 'prayers'), {
            ...formData,
            isPublic: formData.showOnWall,
            status: 'PENDING',
            prayerCount: 0,
            createdAt: new Date().toISOString()
        });
        
        setSubmitted(true);
        setTimeout(() => {
            setSubmitted(false);
            setFormData({
              name: "",
              email: "",
              country: "Nigeria",
              category: "Healing",
              message: "",
              showOnWall: true,
              isUrgent: false,
              isAnonymous: false,
            });
        }, 5000);
        fetchPrayers(); // Refresh wall
    } catch (error) {
        console.error('Error submitting prayer:', error);
        setError("Network error. Please check your connection.");
    } finally {
        setLoading(false);
    }
  };

  const topPosts = posts.slice(0, 6);
  const remainingPosts = posts.slice(6);

  return (
    <>
      <PageHero
        title="The Global Altar"
        subtitle="Submit your requests and stand in the gap for others worldwide"
      />

      {/* Section 1: Prayer Wall (Top) */}
      <SectionWrapper dark>
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-black mb-2 uppercase italic tracking-tighter">
                Active <span className="gold-text">Intercessions</span>
            </h2>
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest italic">Join the sound of heaven across the globe.</p>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-white/5 px-6 py-3 rounded-full border border-white/10 italic">
            <Globe className="text-red-600" size={16} />
            <span className="text-[10px] font-black uppercase tracking-widest">{posts.length} Believers Crying Out</span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="wait">
          {isSyncing ? (
             <div className="col-span-full py-20 text-center">
                <p className="text-white/20 animate-pulse font-black italic uppercase tracking-widest">Calling the Heavens...</p>
             </div>
          ) : (
            topPosts.map((post, i) => (
                <motion.div
                  key={post.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="glass-card p-10 flex flex-col h-full border-white/5 group hover:border-red-600/20 transition-all min-h-[300px]"
                >
                  <p className="text-white text-xl md:text-2xl leading-relaxed italic mb-10 flex-grow font-medium tracking-tight">
                    "{post.message || post.text || post.content || "Heavenly Petition..."}"
                  </p>
                  <div className="flex items-center justify-between pt-6 border-t border-white/5">
                    <div className="flex flex-col">
                      <span className="font-black text-white italic uppercase text-[10px] tracking-widest">
                        {post.isAnonymous ? "Anonymous" : (post.name || "Intercessor")}
                      </span>
                      <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-widest flex items-center gap-1">
                        <Globe size={10} className="text-red-600" /> {post.country}
                      </span>
                    </div>
                    <button
                      onClick={() => handlePray(post.id)}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 text-red-500 hover:bg-white/10 transition-all font-black text-[10px] uppercase border border-white/5"
                    >
                      <Heart size={14} fill={post.prayerCount > 0 ? "currentColor" : "none"} />
                      {post.prayerCount || 0}
                    </button>
                  </div>
                </motion.div>
              ))
          )}
          </AnimatePresence>
        </div>
      </SectionWrapper>

      {/* Section 2: Prayer Request Form */}
      <SectionWrapper dark className="relative overflow-hidden">
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-black mb-4 italic uppercase tracking-tighter">
                Ignite Your <span className="gold-text">Request</span>
            </h2>
            <p className="text-white/40 max-w-xl mx-auto font-medium uppercase tracking-[0.2em] italic text-xs leading-relaxed">
              No valley is too deep. No mountain is too high. Submit your testimony-in-waiting to the global prayer engine.
            </p>
          </div>

          <div className="glass-card rounded-[3.5rem] overflow-hidden border-white/5">
            <div className="grid md:grid-cols-5">
              <div className="md:col-span-2 bg-[#0a0a0c] p-10 md:p-14 text-white flex flex-col justify-between border-r border-white/5">
                <div>
                  <h3 className="text-2xl font-black mb-10 gold-text italic uppercase">The Altar <span className="text-white">Promise</span></h3>
                  <div className="space-y-10">
                    <FeatureItem icon={Globe} text="24/7 Global Intercessory Fire" />
                    <FeatureItem icon={Shield} text="Absolute Sanctity of Privacy" />
                    <FeatureItem icon={AlertCircle} text="Apostolic Priority for Urgent Needs" />
                  </div>
                </div>
                <div className="mt-20 pt-8 border-t border-white/10">
                  <p className="text-[9px] italic text-white/20 font-bold uppercase tracking-widest leading-loose">
                    "Again I say unto you, That if two of you shall agree on earth as touching any thing that they shall ask, it shall be done for them of my Father which is in heaven." - Matt 18:19
                  </p>
                </div>
              </div>

              <div className="md:col-span-3 p-10 md:p-14">
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="h-full flex flex-col items-center justify-center text-center py-12"
                    >
                      <div className="w-24 h-24 bg-red-600/10 rounded-full flex items-center justify-center mb-8 border border-red-600/20 shadow-2xl shadow-red-600/20">
                        <Send size={40} className="text-red-600 animate-pulse" />
                      </div>
                      <h3 className="text-3xl font-black mb-2 italic uppercase">Sent to the <span className="gold-text">Altar</span></h3>
                      <p className="text-white/40 text-xs font-bold uppercase tracking-widest italic mb-10">Heaven has heard your cry.</p>
                      <button onClick={() => setSubmitted(false)} className="btn-gold px-12 py-4 text-xs font-black italic uppercase">Submit Another Request</button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-8">
                      <div className="grid sm:grid-cols-2 gap-6">
                        <InputField label="Apostolic Name" name="name" value={formData.name} onChange={handleFormChange} placeholder="Enter your name" />
                        <InputField label="Registry Email" name="email" type="email" required value={formData.email} onChange={handleFormChange} placeholder="For confirmation" />
                      </div>

                      <div className="grid sm:grid-cols-2 gap-6">
                        <SelectField label="Station" name="country" value={formData.country} onChange={handleFormChange} options={countries} />
                        <SelectField label="Focus" name="category" value={formData.category} onChange={handleFormChange} options={prayerCategories} />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-2">Request to the Throne</label>
                        <textarea
                          name="message"
                          required
                          value={formData.message}
                          onChange={handleFormChange}
                          rows={4}
                          placeholder="Speak your petition..."
                          className="w-full bg-white/5 border border-white/10 rounded-[2rem] px-8 py-6 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 transition-all resize-none italic font-medium"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
                         <CheckboxItem label="Public Witness" sublabel="Show on Global Wall" name="showOnWall" checked={formData.showOnWall} onChange={handleFormChange} />
                         <CheckboxItem label="Anonymous Cry" sublabel="Hide name from others" name="isAnonymous" checked={formData.isAnonymous} onChange={handleFormChange} />
                      </div>

                      <button
                        disabled={loading}
                        className="btn-gold w-full py-5 text-lg font-black italic shadow-2xl flex items-center justify-center gap-4 group uppercase"
                      >
                        {loading ? "Igniting..." : (
                          <>
                            Lay Request Upon Altar
                            <Plus size={24} className="group-hover:rotate-90 transition-transform" />
                          </>
                        )}
                      </button>

                      {error && (
                        <p className="text-red-500 text-[10px] text-center font-black uppercase tracking-widest animate-pulse">{error}</p>
                      )}
                    </form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>
    </>
  );
};

// Internal Components
const FeatureItem = ({ icon: Icon, text }: any) => (
    <div className="flex gap-6 items-center">
        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 border border-white/10">
            <Icon size={20} className="text-red-600" />
        </div>
        <p className="text-sm font-bold text-white/70 italic uppercase tracking-widest">{text}</p>
    </div>
);

const InputField = ({ label, ...props }: any) => (
    <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-2">{label}</label>
        <input {...props} className="w-full bg-white/5 border border-white/10 rounded-full px-8 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 transition-all italic font-medium" />
    </div>
);

const SelectField = ({ label, options, ...props }: any) => (
    <div className="space-y-2">
        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-2">{label}</label>
        <select {...props} className="w-full bg-white/5 border border-white/10 rounded-full px-8 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 transition-all appearance-none italic font-medium">
            {options.map((o: any) => <option key={o} value={o} className="bg-[#0a0a0c]">{o}</option>)}
        </select>
    </div>
);

const CheckboxItem = ({ label, sublabel, name, checked, onChange }: any) => (
    <label className="flex items-center gap-5 p-5 bg-white/5 rounded-[1.5rem] cursor-pointer hover:bg-white/10 transition-all border border-white/5">
        <input type="checkbox" name={name} checked={checked} onChange={onChange} className="w-5 h-5 accent-red-600" />
        <div className="flex flex-col">
            <span className="text-[11px] font-black uppercase tracking-widest text-white italic">{label}</span>
            <span className="text-[9px] text-white/30 font-bold uppercase tracking-tighter">{sublabel}</span>
        </div>
    </label>
);

export default PrayerWall;
