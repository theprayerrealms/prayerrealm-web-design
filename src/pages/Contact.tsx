import { useState } from "react";
import PageHero from "@/components/PageHero";
import SectionWrapper from "@/components/SectionWrapper";
import { faqItems } from "@/data/siteData";
import { Mail, Phone, MessageCircle, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const Contact = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  return (
    <>
      <PageHero title="Contact Us" subtitle="We'd love to hear from you" />

      <SectionWrapper>
        <div className="grid lg:grid-cols-2 gap-12">
          {/* Form */}
          <div>
            <h2 className="font-heading text-2xl font-bold mb-6">Send a Message</h2>
            {submitted ? (
              <div className="card-elevated p-8 text-center">
                <Mail size={40} className="gold-text mx-auto mb-4" />
                <h3 className="font-heading text-xl font-bold mb-2">Message Sent!</h3>
                <p className="text-muted-foreground text-sm">We'll get back to you soon.</p>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4">
                <input required type="text" placeholder="Your name" className="w-full bg-secondary border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
                <input required type="email" placeholder="Your email" className="w-full bg-secondary border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
                <input type="text" placeholder="Subject" className="w-full bg-secondary border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent" />
                <textarea required rows={5} placeholder="Your message..." className="w-full bg-secondary border border-border rounded-md px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent resize-none" />
                <button type="submit" className="btn-gold w-full py-3">Send Message</button>
              </form>
            )}
          </div>

          {/* Contact Info */}
          <div>
            <h2 className="font-heading text-2xl font-bold mb-6">Get in Touch</h2>
            <div className="space-y-4 mb-10">
              <div className="flex items-center gap-3">
                <Mail size={20} className="gold-text" />
                <span className="text-muted-foreground text-sm">info@prayerrealm.org</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={20} className="gold-text" />
                <span className="text-muted-foreground text-sm">+1 (555) 000-0000</span>
              </div>
              <div className="flex items-center gap-3">
                <MessageCircle size={20} className="gold-text" />
                <span className="text-muted-foreground text-sm">WhatsApp: +1 (555) 000-0000</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex gap-4 mb-10">
              {["Facebook", "YouTube", "Instagram", "Twitter"].map((s) => (
                <span key={s} className="text-sm text-muted-foreground hover:text-accent cursor-pointer transition-colors">{s}</span>
              ))}
            </div>

            {/* FAQ */}
            <h3 className="font-heading text-xl font-bold mb-4">Frequently Asked <span className="gold-text">Questions</span></h3>
            <div className="space-y-2">
              {faqItems.map((faq, i) => (
                <div key={i} className="card-elevated overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-4 text-left text-sm font-medium"
                  >
                    {faq.question}
                    <ChevronDown
                      size={16}
                      className={`gold-text transition-transform ${openFaq === i ? "rotate-180" : ""}`}
                    />
                  </button>
                  <AnimatePresence>
                    {openFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="px-4 pb-4 text-sm text-muted-foreground">{faq.answer}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>
        </div>
      </SectionWrapper>
    </>
  );
};

export default Contact;
