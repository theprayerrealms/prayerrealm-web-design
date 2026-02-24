import { useState } from "react";
import PageHero from "@/components/PageHero";
import SectionWrapper from "@/components/SectionWrapper";
import { countries, prayerCategories } from "@/data/siteData";
import { CheckCircle } from "lucide-react";

const PrayerRequest = () => {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <>
        <PageHero title="Prayer Request" subtitle="We stand with you in prayer" />
        <SectionWrapper>
          <div className="max-w-lg mx-auto text-center">
            <CheckCircle size={64} className="gold-text mx-auto mb-6" />
            <h2 className="font-heading text-3xl font-bold mb-4">Prayer Received</h2>
            <p className="text-muted-foreground text-lg mb-6">
              Thank you for sharing your prayer request. Our intercessory team has received it and 
              will be praying with you. God is faithful.
            </p>
            <button onClick={() => setSubmitted(false)} className="btn-gold">
              Submit Another Request
            </button>
          </div>
        </SectionWrapper>
      </>
    );
  }

  return (
    <>
      <PageHero title="Prayer Request" subtitle="Share your burden — we will carry it in prayer" />
      <SectionWrapper>
        <div className="max-w-2xl mx-auto">
          <form onSubmit={handleSubmit} className="card-elevated p-8 space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium mb-1.5">Name (optional)</label>
                <input type="text" className="w-full bg-secondary border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Email (optional)</label>
                <input type="email" className="w-full bg-secondary border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium mb-1.5">Country</label>
                <select className="w-full bg-secondary border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent">
                  <option value="">Select country</option>
                  {countries.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Category</label>
                <select className="w-full bg-secondary border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent">
                  <option value="">Select category</option>
                  {prayerCategories.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5">Your Prayer Request</label>
              <textarea
                rows={5}
                required
                className="w-full bg-secondary border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                placeholder="Share what's on your heart..."
              />
            </div>
            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" className="accent-gold rounded" />
                <span>This is urgent</span>
              </label>
              <label className="flex items-center gap-2 text-sm cursor-pointer">
                <input type="checkbox" className="accent-gold rounded" />
                <span>Keep confidential</span>
              </label>
            </div>
            <button type="submit" className="btn-gold w-full text-base py-3">
              Submit Prayer Request
            </button>
          </form>
        </div>
      </SectionWrapper>
    </>
  );
};

export default PrayerRequest;
