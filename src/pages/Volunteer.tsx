import { useState } from "react";
import PageHero from "@/components/PageHero";
import SectionWrapper from "@/components/SectionWrapper";
import { volunteerRoles } from "@/data/siteData";
import { CheckCircle } from "lucide-react";

const Volunteer = () => {
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      <PageHero title="Volunteer" subtitle="Use your gifts to serve God's global prayer movement" />

      {/* Why Join */}
      <SectionWrapper>
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">
              Why <span className="gold-text">Join Us</span>
            </h2>
            <p className="text-muted-foreground text-lg leading-relaxed mb-4">
              When you volunteer with Prayer Realm, you become part of a global family dedicated 
              to transforming nations through prayer. Your time, skills, and heart for service 
              can make an eternal impact.
            </p>
            <ul className="space-y-3">
              {["Make an impact across 54+ nations", "Grow in your own prayer life", "Connect with believers worldwide", "Use your unique gifts for God's kingdom"].map((item) => (
                <li key={item} className="flex items-center gap-3 text-muted-foreground">
                  <CheckCircle size={18} className="gold-text flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* Roles Grid */}
          <div className="grid grid-cols-2 gap-4">
            {volunteerRoles.map((role) => (
              <div key={role.title} className="card-elevated p-5 text-center">
                <div className="text-3xl mb-3">{role.icon}</div>
                <h3 className="font-heading font-semibold mb-2">{role.title}</h3>
                <p className="text-muted-foreground text-xs">{role.description}</p>
              </div>
            ))}
          </div>
        </div>
      </SectionWrapper>

      {/* Signup Form */}
      <SectionWrapper className="bg-secondary">
        <div className="max-w-xl mx-auto">
          <h2 className="font-heading text-3xl font-bold text-center mb-8">
            Sign Up to <span className="gold-text">Serve</span>
          </h2>
          {submitted ? (
            <div className="text-center">
              <CheckCircle size={48} className="gold-text mx-auto mb-4" />
              <h3 className="font-heading text-2xl font-bold mb-2">Thank You!</h3>
              <p className="text-muted-foreground">We'll be in touch soon with next steps.</p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="card-elevated p-8 space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Full Name</label>
                <input required type="text" className="w-full bg-secondary border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Email</label>
                <input required type="email" className="w-full bg-secondary border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Preferred Role</label>
                <select className="w-full bg-secondary border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent">
                  {volunteerRoles.map((r) => <option key={r.title} value={r.title}>{r.title}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Tell us about yourself</label>
                <textarea rows={3} className="w-full bg-secondary border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none" />
              </div>
              <button type="submit" className="btn-gold w-full py-3">Join the Team</button>
            </form>
          )}
        </div>
      </SectionWrapper>
    </>
  );
};

export default Volunteer;
