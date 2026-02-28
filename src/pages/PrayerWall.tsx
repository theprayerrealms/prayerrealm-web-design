import { useState } from "react";
import PageHero from "@/components/PageHero";
import SectionWrapper from "@/components/SectionWrapper";
import { prayerWallPosts, countries, prayerCategories } from "@/data/siteData";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Globe, Send, Shield, AlertCircle, Plus } from "lucide-react";
import MiniRadioPlayer from "@/components/MiniRadioPlayer";

const PrayerWall = () => {
  const [posts, setPosts] = useState(prayerWallPosts);
  const [loading, setLoading] = useState(false);
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

  const handlePray = (id: number) => {
    setPosts(posts.map((p) => p.id === id ? { ...p, prayerCount: p.prayerCount + 1 } : p));
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const val = type === "checkbox" ? (e.target as HTMLInputElement).checked : value;
    setFormData((prev) => ({ ...prev, [name]: val }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.message.trim() || !formData.email.trim()) {
      setError("Email and Prayer Request are required.");
      return;
    }

    setLoading(true);

    // Simulate API Call
    setTimeout(() => {
      if (formData.showOnWall) {
        const newPost = {
          id: Date.now(),
          message: formData.message,
          anonymous: formData.isAnonymous,
          name: formData.isAnonymous ? "" : (formData.name || "A Believer"),
          country: formData.country,
          prayerCount: 0,
          createdAt: new Date().toISOString().split("T")[0],
        };
        setPosts([newPost, ...posts]);
      }

      setLoading(false);
      setSubmitted(true);

      // Reset form after 3 seconds or show success
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
    }, 2000);
  };

  const topPosts = posts.slice(0, 6);
  const remainingPosts = posts.slice(6);

  return (
    <>
      <PageHero
        title="Prayer Altar"
        subtitle="Submit your requests and stand in the gap for others worldwide"
      />

      {/* Section 1: Prayer Wall (Top) */}
      <SectionWrapper>
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="font-heading text-3xl font-bold mb-2">Faith in <span className="gold-text">Action</span></h2>
            <p className="text-muted-foreground text-sm">Join thousands in lifting these active requests.</p>
          </div>
          <div className="hidden md:flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-full border border-border">
            <Globe className="gold-text" size={16} />
            <span className="text-xs font-semibold">{posts.length} Active Prayers</span>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {topPosts.map((post) => (
            <motion.div
              key={post.id}
              layout
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-elevated p-6 flex flex-col h-full bg-card/50 backdrop-blur-sm"
            >
              <p className="text-foreground leading-relaxed italic mb-6 flex-grow">"{post.message}"</p>
              <div className="flex items-center justify-between pt-4 border-t border-border/50 text-xs">
                <div className="flex flex-col">
                  <span className="font-bold text-foreground">
                    {post.anonymous ? "Anonymous" : post.name}
                  </span>
                  <span className="text-muted-foreground">{post.country}</span>
                </div>
                <button
                  onClick={() => handlePray(post.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-accent/10 gold-text hover:bg-accent/20 transition-all font-bold"
                >
                  <Heart size={14} fill={post.prayerCount > 0 ? "currentColor" : "none"} />
                  {post.prayerCount}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      {/* Section 2: Prayer Request Form */}
      <SectionWrapper className="bg-secondary/30 relative overflow-hidden">
        <div className="blur-orb w-[400px] h-[400px] bg-red-500/10 -top-20 -right-20" />
        <div className="blur-orb w-[300px] h-[300px] bg-gold-500/10 -bottom-20 -left-20" />

        <div className="max-w-4xl mx-auto relative z-10">
          <div className="text-center mb-10">
            <h2 className="font-heading text-4xl font-bold mb-4 italic">Submit Your <span className="gold-gradient-text uppercase">Request</span></h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              Our global intercessory team is ready to stand with you. Whether private or shared, no request is too small for God.
            </p>
          </div>

          <div className="glass-card rounded-[2rem] overflow-hidden">
            <div className="grid md:grid-cols-5">
              {/* Form Info Side */}
              <div className="md:col-span-2 bg-navy p-8 md:p-12 text-white flex flex-col justify-between">
                <div>
                  <h3 className="text-2xl font-bold mb-6 gold-text">Why Pray With Us?</h3>
                  <div className="space-y-6">
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                        <Globe size={18} className="gold-text" />
                      </div>
                      <p className="text-sm text-white/70 leading-relaxed">Global network of intercessors across 50+ nations.</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                        <Shield size={18} className="gold-text" />
                      </div>
                      <p className="text-sm text-white/70 leading-relaxed">Confidential requests are handled with maximum privacy.</p>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                        <AlertCircle size={18} className="gold-text" />
                      </div>
                      <p className="text-sm text-white/70 leading-relaxed">Urgent requests are prioritized by our 24/7 prayer team.</p>
                    </div>
                  </div>
                </div>
                <div className="mt-12 pt-8 border-t border-white/10">
                  <p className="text-xs italic text-white/40">"For where two or three are gathered together in my name, there am I in the midst of them." - Matthew 18:20</p>
                </div>
              </div>

              {/* Form Side */}
              <div className="md:col-span-3 p-8 md:p-12">
                <AnimatePresence mode="wait">
                  {submitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="h-full flex flex-col items-center justify-center text-center py-12"
                    >
                      <div className="w-20 h-20 bg-accent/20 rounded-full flex items-center justify-center mb-6">
                        <Send size={40} className="gold-text" />
                      </div>
                      <h3 className="font-heading text-2xl font-bold mb-2">Request Uplifted!</h3>
                      <p className="text-muted-foreground mb-6">Our intercessors have been notified and it has been added to the altar.</p>
                      <button onClick={() => setSubmitted(false)} className="btn-gold px-8 italic">Submit Another</button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Your Name</label>
                          <input
                            name="name"
                            value={formData.name}
                            onChange={handleFormChange}
                            placeholder="Optional"
                            className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Email <span className="text-red-500">*</span></label>
                          <input
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleFormChange}
                            placeholder="For confirmation"
                            className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-all"
                          />
                        </div>
                      </div>

                      <div className="grid sm:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Country</label>
                          <select
                            name="country"
                            value={formData.country}
                            onChange={handleFormChange}
                            className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-all appearance-none"
                          >
                            {countries.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Category</label>
                          <select
                            name="category"
                            value={formData.category}
                            onChange={handleFormChange}
                            className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-all appearance-none"
                          >
                            {prayerCategories.map(c => <option key={c} value={c}>{c}</option>)}
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1.5">Prayer Request <span className="text-red-500">*</span></label>
                        <textarea
                          name="message"
                          required
                          value={formData.message}
                          onChange={handleFormChange}
                          rows={4}
                          placeholder="What would you like us to pray for?"
                          className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-all resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                        <label className="flex items-center gap-3 p-3 bg-secondary/30 rounded-xl cursor-pointer hover:bg-secondary/50 transition-colors">
                          <input
                            type="checkbox"
                            name="showOnWall"
                            checked={formData.showOnWall}
                            onChange={handleFormChange}
                            className="w-4 h-4 accent-gold"
                          />
                          <div className="flex flex-col">
                            <span className="text-sm font-bold">Show on Prayer Wall</span>
                            <span className="text-[10px] text-muted-foreground uppercase">Let others pray with you</span>
                          </div>
                        </label>

                        <label className="flex items-center gap-3 p-3 bg-secondary/30 rounded-xl cursor-pointer hover:bg-secondary/50 transition-colors">
                          <input
                            type="checkbox"
                            name="isAnonymous"
                            checked={formData.isAnonymous}
                            onChange={handleFormChange}
                            className="w-4 h-4 accent-gold"
                          />
                          <div className="flex flex-col">
                            <span className="text-sm font-bold">Post Anonymously</span>
                            <span className="text-[10px] text-muted-foreground uppercase">Hide your name from wall</span>
                          </div>
                        </label>
                      </div>

                      <button
                        disabled={loading}
                        className="btn-gold w-full py-4 text-lg font-bold shadow-xl shadow-red-600/10 flex items-center justify-center gap-2 group italic underline-offset-4 hover:underline"
                      >
                        {loading ? "Igniting Prayers..." : (
                          <>
                            Submit At Altar
                            <Plus size={20} className="group-hover:rotate-90 transition-transform" />
                          </>
                        )}
                      </button>

                      {error && (
                        <p className="text-red-500 text-xs text-center font-bold animate-pulse">{error}</p>
                      )}
                    </form>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </SectionWrapper>

      {/* Section 3: Remaining Wall Posts */}
      {remainingPosts.length > 0 && (
        <SectionWrapper>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {remainingPosts.map((post) => (
              <motion.div
                key={post.id}
                layout
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="card-elevated p-6 bg-card/40 border-dashed border-border/60"
              >
                <p className="text-muted-foreground text-sm leading-relaxed italic mb-4">"{post.message}"</p>
                <div className="flex items-center justify-between text-[10px] uppercase font-bold tracking-widest text-muted-foreground/60">
                  <span>{post.anonymous ? "Anonymous" : post.name} • {post.country}</span>
                  <div className="flex items-center gap-1">
                    <Heart size={12} />
                    {post.prayerCount}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </SectionWrapper>
      )}

      <MiniRadioPlayer />
    </>
  );
};

export default PrayerWall;
