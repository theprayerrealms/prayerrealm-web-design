import { useState } from "react";
import PageHero from "@/components/PageHero";
import SectionWrapper from "@/components/SectionWrapper";
import { volunteerRoles } from "@/data/siteData";
import { CheckCircle, Upload } from "lucide-react";

const countryCodes = [
  { code: "+1", country: "US/CA" },
  { code: "+44", country: "UK" },
  { code: "+234", country: "NG" },
  { code: "+233", country: "GH" },
  { code: "+254", country: "KE" },
  { code: "+27", country: "ZA" },
  { code: "+91", country: "IN" },
  { code: "+61", country: "AU" },
  { code: "+353", country: "IE" },
  { code: "+49", country: "DE" },
  { code: "+33", country: "FR" },
  { code: "+81", country: "JP" },
  { code: "+971", country: "AE" },
];

const countries = [
  "Nigeria", "Ghana", "Kenya", "South Africa", "United States", "Canada",
  "United Kingdom", "Ireland", "Germany", "France", "India", "Australia",
  "Japan", "United Arab Emirates", "Other"
];

const Volunteer = () => {
  const [submitted, setSubmitted] = useState(false);
  const [fileName, setFileName] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

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
              <p className="text-muted-foreground">We'll be in touch soon with next steps. A confirmation email has been sent to you.</p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="card-elevated p-8 space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium mb-1.5">Full Name <span className="text-red-500">*</span></label>
                <input required type="text" placeholder="Enter your full name" className="w-full bg-secondary border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium mb-1.5">Email <span className="text-red-500">*</span></label>
                <input required type="email" placeholder="example@email.com" className="w-full bg-secondary border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium mb-1.5">Phone Number <span className="text-red-500">*</span></label>
                <div className="flex gap-2">
                  <select className="w-24 bg-secondary border border-border rounded-md px-2 py-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-accent">
                    {countryCodes.map((c) => (
                      <option key={c.code} value={c.code}>{c.code} {c.country}</option>
                    ))}
                  </select>
                  <input required type="tel" placeholder="Phone number" className="flex-1 bg-secondary border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
                </div>
              </div>

              {/* Country */}
              <div>
                <label className="block text-sm font-medium mb-1.5">Country <span className="text-red-500">*</span></label>
                <select required className="w-full bg-secondary border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent">
                  <option value="">Select your country</option>
                  {countries.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>

              {/* Preferred Role */}
              <div>
                <label className="block text-sm font-medium mb-1.5">Preferred Role <span className="text-red-500">*</span></label>
                <select required className="w-full bg-secondary border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent">
                  {volunteerRoles.map((r) => <option key={r.title} value={r.title}>{r.title}</option>)}
                </select>
              </div>

              {/* CV / Portfolio (Optional) */}
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  CV / Portfolio <span className="text-muted-foreground text-xs font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <input
                    type="file"
                    id="cv-upload"
                    accept=".pdf,.doc,.docx,.txt"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="cv-upload"
                    className="flex items-center gap-3 w-full bg-secondary border border-border border-dashed rounded-md px-4 py-3 text-sm cursor-pointer hover:border-accent transition-colors"
                  >
                    <Upload size={16} className="gold-text shrink-0" />
                    <span className={`truncate ${fileName ? "text-foreground" : "text-muted-foreground"}`}>
                      {fileName || "Upload your CV or portfolio (PDF, DOC)"}
                    </span>
                  </label>
                </div>
              </div>

              {/* Cover Letter */}
              <div>
                <label className="block text-sm font-medium mb-1.5">Cover Letter <span className="text-red-500">*</span></label>
                <textarea
                  required
                  rows={4}
                  placeholder="Tell us why you'd like to volunteer with Prayer Realm, your experience, and how you'd like to contribute..."
                  className="w-full bg-secondary border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none"
                />
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
