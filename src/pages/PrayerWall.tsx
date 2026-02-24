import { useState } from "react";
import PageHero from "@/components/PageHero";
import SectionWrapper from "@/components/SectionWrapper";
import { prayerWallPosts } from "@/data/siteData";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Plus, X, Globe } from "lucide-react";

const PrayerWall = () => {
  const [posts, setPosts] = useState(prayerWallPosts);
  const [showModal, setShowModal] = useState(false);
  const [newPrayer, setNewPrayer] = useState("");
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [name, setName] = useState("");

  const handlePray = (id: number) => {
    setPosts(posts.map((p) => p.id === id ? { ...p, prayerCount: p.prayerCount + 1 } : p));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPrayer.trim()) return;
    const newPost = {
      id: Date.now(),
      message: newPrayer,
      anonymous: isAnonymous,
      name: isAnonymous ? "" : name,
      country: "Global",
      prayerCount: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setPosts([newPost, ...posts]);
    setNewPrayer("");
    setName("");
    setShowModal(false);
  };

  return (
    <>
      <PageHero title="Prayer Wall" subtitle="A community united in prayer — lift one another up" />
      <SectionWrapper>
        <div className="flex justify-between items-center mb-10">
          <p className="text-muted-foreground">
            <Globe size={18} className="inline mr-2 gold-text" />
            {posts.length} active prayer requests
          </p>
          <button onClick={() => setShowModal(true)} className="btn-gold flex items-center gap-2 text-sm">
            <Plus size={16} /> Add Prayer
          </button>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {posts.map((post) => (
            <motion.div
              key={post.id}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="card-elevated p-5"
            >
              <p className="text-sm text-foreground leading-relaxed mb-4">{post.message}</p>
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{post.anonymous ? "Anonymous" : post.name} • {post.country}</span>
                <button
                  onClick={() => handlePray(post.id)}
                  className="flex items-center gap-1 gold-text hover:scale-105 transition-transform"
                >
                  <Heart size={14} />
                  {post.prayerCount} prayed
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-foreground/50 flex items-center justify-center p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-card rounded-xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-heading text-xl font-bold">Share a Prayer</h3>
                <button onClick={() => setShowModal(false)} className="text-muted-foreground hover:text-foreground">
                  <X size={20} />
                </button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="checkbox" checked={isAnonymous} onChange={(e) => setIsAnonymous(e.target.checked)} className="accent-gold" />
                  Post anonymously
                </label>
                {!isAnonymous && (
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Your name"
                    className="w-full bg-secondary border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
                  />
                )}
                <textarea
                  value={newPrayer}
                  onChange={(e) => setNewPrayer(e.target.value)}
                  required
                  rows={4}
                  placeholder="Share your prayer request..."
                  className="w-full bg-secondary border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                />
                <button type="submit" className="btn-gold w-full py-3">Post to Prayer Wall</button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default PrayerWall;
