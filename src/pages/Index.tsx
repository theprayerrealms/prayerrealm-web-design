import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import heroBg from "@/assets/hero-bg.jpg";
import SectionWrapper from "@/components/SectionWrapper";
import AnimatedCounter from "@/components/AnimatedCounter";
import { impactStats, events, testimonies } from "@/data/siteData";
import { Calendar, Heart, Globe, ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <img src={heroBg} alt="Global prayer gathering" className="absolute inset-0 w-full h-full object-cover" />
        <div className="gradient-navy-overlay absolute inset-0" />
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="gold-text font-medium tracking-widest uppercase text-sm mb-4"
          >
            Raising Global Altars of Prayer
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight mb-6"
          >
            Connecting Nations Through the{" "}
            <span className="gold-gradient-text">Power of Prayer</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-primary-foreground/70 text-lg md:text-xl mb-10 max-w-2xl mx-auto"
          >
            Join thousands of believers worldwide in fervent prayer. Together, we are building spiritual altars that shift atmospheres and transform nations.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <Link to="/prayer-request" className="btn-gold text-base">
              Submit Prayer Request
            </Link>
            <Link to="/events" className="btn-outline-light text-base">
              Join Live Prayer
            </Link>
            <Link to="/give" className="btn-outline-light text-base">
              Give Now
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Mission Preview */}
      <SectionWrapper>
        <div className="text-center max-w-3xl mx-auto">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-6">
            Our <span className="gold-text">Mission</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Prayer Realm is an international, non-denominational prayer ministry dedicated to raising up prayer warriors 
            across the globe. We believe that when believers unite in prayer, heaven responds. Our mission is to provide 
            a platform where people from every nation can request prayer, intercede for others, and experience the 
            transformative power of communal prayer.
          </p>
          <Link to="/about" className="inline-flex items-center gap-2 gold-text font-medium mt-6 hover:gap-3 transition-all">
            Learn more about us <ArrowRight size={18} />
          </Link>
        </div>
      </SectionWrapper>

      {/* Impact Stats */}
      <SectionWrapper dark>
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-12">
          Global <span className="gold-gradient-text">Impact</span>
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {impactStats.map((stat) => (
            <AnimatedCounter key={stat.label} value={stat.value} suffix={stat.suffix} label={stat.label} />
          ))}
        </div>
      </SectionWrapper>

      {/* Upcoming Events Preview */}
      <SectionWrapper>
        <div className="flex items-center justify-between mb-10">
          <h2 className="font-heading text-3xl md:text-4xl font-bold">
            Upcoming <span className="gold-text">Events</span>
          </h2>
          <Link to="/events" className="hidden sm:inline-flex items-center gap-2 gold-text font-medium hover:gap-3 transition-all">
            View all <ArrowRight size={18} />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {events.slice(0, 3).map((event) => (
            <motion.div
              key={event.id}
              whileHover={{ y: -4 }}
              className="card-elevated p-6"
            >
              <div className="flex items-center gap-2 gold-text text-sm font-medium mb-3">
                <Calendar size={16} />
                {event.date}
              </div>
              <h3 className="font-heading text-xl font-semibold mb-2">{event.title}</h3>
              <p className="text-muted-foreground text-sm mb-1">{event.time} • {event.location}</p>
              <p className="text-muted-foreground text-sm mt-3">{event.description}</p>
            </motion.div>
          ))}
        </div>
        <Link to="/events" className="sm:hidden inline-flex items-center gap-2 gold-text font-medium mt-6 hover:gap-3 transition-all">
          View all events <ArrowRight size={18} />
        </Link>
      </SectionWrapper>

      {/* Testimonies Preview */}
      <SectionWrapper className="bg-secondary">
        <h2 className="font-heading text-3xl md:text-4xl font-bold text-center mb-10">
          What God is <span className="gold-text">Doing</span>
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          {testimonies.slice(0, 3).map((t) => (
            <motion.div key={t.id} whileHover={{ y: -4 }} className="bg-card rounded-lg p-6 shadow-sm">
              <Heart size={24} className="gold-text mb-4" />
              <p className="text-muted-foreground text-sm leading-relaxed italic mb-4">"{t.text}"</p>
              <div className="text-sm font-medium">
                {t.name} <span className="text-muted-foreground">• {t.country}</span>
              </div>
            </motion.div>
          ))}
        </div>
        <div className="text-center mt-8">
          <Link to="/testimonies" className="inline-flex items-center gap-2 gold-text font-medium hover:gap-3 transition-all">
            Read more testimonies <ArrowRight size={18} />
          </Link>
        </div>
      </SectionWrapper>

      {/* World Map Section */}
      <SectionWrapper dark>
        <div className="text-center">
          <Globe size={48} className="gold-text mx-auto mb-6" />
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Praying Across the <span className="gold-gradient-text">Globe</span>
          </h2>
          <p className="text-primary-foreground/60 max-w-2xl mx-auto mb-8">
            Our prayer network spans over 54 nations, with intercessors standing in the gap for every continent. 
            From Asia to Africa, Europe to the Americas — the altar of prayer is being raised.
          </p>
          <div className="text-6xl md:text-8xl opacity-30">🌍</div>
        </div>
      </SectionWrapper>

      {/* Volunteer CTA */}
      <SectionWrapper>
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Join the <span className="gold-text">Movement</span>
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            We need prayer warriors, translators, media experts, and administrators to expand this global ministry. Your gifts matter.
          </p>
          <Link to="/volunteer" className="btn-gold text-base">
            Become a Volunteer
          </Link>
        </div>
      </SectionWrapper>

      {/* Newsletter */}
      <SectionWrapper className="bg-secondary">
        <div className="text-center max-w-xl mx-auto">
          <h2 className="font-heading text-3xl font-bold mb-4">Stay Connected</h2>
          <p className="text-muted-foreground mb-6">
            Receive prayer updates, event announcements, and weekly encouragement from Prayer Realm.
          </p>
          <form className="flex gap-3" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-card border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button type="submit" className="btn-gold whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>
      </SectionWrapper>
    </>
  );
};

export default Index;
