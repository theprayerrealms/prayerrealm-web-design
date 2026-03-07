import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import SectionWrapper from "@/components/SectionWrapper";
import AnimatedCounter from "@/components/AnimatedCounter";
import { impactStats, events, testimonies } from "@/data/siteData";
import { Calendar, Heart, Globe, ArrowRight, ChevronLeft, ChevronRight, Instagram, Send } from "lucide-react";
import { useLiveStatus } from "@/hooks/useLiveStatus";

// Import local hero images
// Using the existing hero-bg.jpg for the first one.
import heroBg1 from "@/assets/1.jpg";
// Note: Please add your 5 custom images into the 'src/assets/hero-images' folder 
// named 'hero-2.jpg', 'hero-3.jpg', etc., or change these imports to match your filenames!
import heroBg2 from "@/assets/2.jpg"; // Placeholder, replace with "@/assets/hero-images/hero-2.jpg"
import heroBg3 from "@/assets/3.jpg"; // Placeholder, replace with "@/assets/hero-images/hero-3.jpg"
import heroBg4 from "@/assets/4.jpg"; // Placeholder, replace with "@/assets/hero-images/hero-4.jpg"
import heroBg5 from "@/assets/5.jpg"; // Placeholder, replace with "@/assets/hero-images/hero-5.jpg"
import heroBg6 from "@/assets/6.jpg"; // Placeholder, replace with "@/assets/hero-images/hero-6.jpg"
import heroBg7 from "@/assets/7.jpg"; // Placeholder, replace with "@/assets/hero-images/hero-6.jpg"
import heroBg8 from "@/assets/8.jpg"; // Placeholder, replace with "@/assets/hero-images/hero-6.jpg"
import heroBg9 from "@/assets/9.jpg"; // Placeholder, replace with "@/assets/hero-images/hero-6.jpg"
const heroImages = [
  heroBg1,
  heroBg2,
  heroBg3,
  heroBg4,
  heroBg5,
  heroBg6,
  heroBg7,
  heroBg8,
  heroBg9
];

const Index = () => {
  const isLive = useLiveStatus();
  const telegramLink = "https://t.me/theprayerrealms"; // Replace with actual link
  const [currentIdx, setCurrentIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIdx((prev) => (prev + 1) % heroImages.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrentIdx((prev) => (prev + 1) % heroImages.length);
  const prevSlide = () => setCurrentIdx((prev) => (prev - 1 + heroImages.length) % heroImages.length);

  return (
    <>
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden group">
        <AnimatePresence mode="popLayout">
          <motion.img
            key={currentIdx}
            src={heroImages[currentIdx]}
            alt={`Global prayer gathering ${currentIdx + 1}`}
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
            className="absolute inset-0 w-full h-full object-cover"
          />
        </AnimatePresence>
        <div className="gradient-navy-overlay absolute inset-0 z-10" />

        {/* Slider Controls */}
        <button
          onClick={prevSlide}
          className="absolute left-4 md:left-8 z-30 p-2 md:p-3 rounded-full bg-black/20 text-white/70 hover:bg-black/60 hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-md"
          aria-label="Previous slide"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 md:right-8 z-30 p-2 md:p-3 rounded-full bg-black/20 text-white/70 hover:bg-black/60 hover:text-white opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-md"
          aria-label="Next slide"
        >
          <ChevronRight size={24} />
        </button>

        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-0 right-0 z-30 flex justify-center gap-3">
          {heroImages.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIdx(idx)}
              className={`h-2 rounded-full transition-all duration-500 ${idx === currentIdx ? "bg-red-600 w-8" : "bg-white/50 hover:bg-white/80 w-2"
                }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto mt-12">
          {isLive && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600/20 border border-red-600/50 mb-6 backdrop-blur-sm"
            >
              <div className="live-indicator" />
              <span className="text-red-500 font-bold text-xs uppercase tracking-widest animate-pulse">Live Prayer Session On</span>
            </motion.div>
          )}
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
            className="font-heading text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight mb-6"
          >
            Connecting Nations Through the{" "}
            <span className="gold-gradient-text">Power of Prayer</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-white/70 text-lg md:text-xl mb-10 max-w-2xl mx-auto"
          >
            Join thousands of believers worldwide in fervent prayer. Together, we are building spiritual altars that shift atmospheres and transform nations.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.45 }}
            className="flex flex-wrap justify-center gap-4"
          >
            <a href={telegramLink} target="_blank" rel="noopener noreferrer" className="btn-gold text-base animate-pulse hover:animate-none">
              Join our Telegram channel now
            </a>
            {isLive ? (
              <a
                href={telegramLink}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-gold text-base bg-red-600 hover:bg-red-700 border-none animate-bounce"
              >
                Join Live Prayer
              </a>
            ) : (
              <Link to="/radio" className="btn-outline-light text-base">
                Join Live Prayer
              </Link>
            )}
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
            Our <span className="text-black">Mission</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Prayer Realm is an international, non-denominational prayer ministry dedicated to raising up prayer warriors
            across the globe. We believe that when believers unite in prayer, heaven responds. Our mission is to provide
            a platform where people from every nation can request prayer, intercede for others, and experience the
            transformative power of communal prayer.
          </p>
          <Link to="/about" className="inline-flex items-center gap-2 text-red-600 font-medium mt-6 hover:gap-3 transition-all">
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
            Upcoming <span className="text-black">Events</span>
          </h2>
          <Link to="/events" className="hidden sm:inline-flex items-center gap-2 text-red-600 font-medium hover:gap-3 transition-all">
            View all <ArrowRight size={18} />
          </Link>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {events.slice(0, 3).map((event) => (
            <motion.div
              key={event.id}
              whileHover={{ y: -4 }}
              className="card-elevated overflow-hidden flex flex-col"
            >
              {/* Event Image */}
              <div className="h-48 overflow-hidden bg-muted relative">
                {event.image ? (
                  <img src={event.image} alt={event.title} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-muted-foreground/50">
                    <Calendar size={48} />
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  {event.date.split(',')[0]} {/* Extracts just Month & Day usually */}
                </div>
              </div>

              {/* Event Content */}
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="font-heading text-xl font-semibold mb-2 line-clamp-1">{event.title}</h3>
                <div className="flex flex-col gap-1 mb-3">
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Calendar size={14} className="text-red-500" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground text-sm">
                    <Globe size={14} className="text-red-500" />
                    <span className="line-clamp-1">{event.location}</span>
                  </div>
                </div>
                <p className="text-muted-foreground text-sm mt-1 mb-4 line-clamp-3 flex-1">{event.description}</p>

                <Link to="/events" className="mt-auto text-red-600 font-medium text-sm inline-flex items-center gap-1 hover:gap-2 transition-all">
                  Event Details <ArrowRight size={14} />
                </Link>
              </div>
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
          What God is <span className="text-black">Doing</span>
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

      {/* Social Media Section */}
      <SectionWrapper dark>
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex justify-center gap-6 mb-8">
            <div className="bg-white/5 p-4 rounded-full border border-white/10 hover:bg-white/10 transition-colors">
              <Send size={40} className="text-[#0088cc]" />
            </div>
            <div className="bg-white/5 p-4 rounded-full border border-white/10 hover:bg-white/10 transition-colors">
              <Instagram size={40} className="text-[#E1306C]" />
            </div>
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4">
            Connect With Us On <span className="gold-gradient-text">Social Media</span>
          </h2>
          <p className="text-primary-foreground/60 max-w-2xl mx-auto mb-8">
            Join our vibrant community online! Follow our Instagram for daily encouragement, live updates, and testimonies. Join our Telegram channel to participate in our live global prayer sessions and receive immediate updates.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <a href="https://t.me/theprayerrealms" target="_blank" rel="noopener noreferrer" className="btn-gold text-base flex items-center gap-2">
              <Send size={18} /> Join Telegram
            </a>
            <a href="https://www.instagram.com/prayerrealms/" target="_blank" rel="noopener noreferrer" className="btn-outline-light text-base flex items-center gap-2">
              <Instagram size={18} /> Follow Instagram
            </a>
          </div>
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
          <h2 className="font-heading text-3xl font-bold mb-4 text-white">Stay Connected</h2>
          <p className="text-white/90 mb-6">
            Receive prayer updates, event announcements, and weekly encouragement from Prayer Realm.
          </p>
          <form className="flex gap-3" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="Enter your email"
              className="flex-1 bg-card border border-border rounded-md px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
            <button type="submit" className="bg-white text-red-600 hover:bg-white/90 font-medium px-6 py-3 rounded-md transition-all whitespace-nowrap">
              Subscribe
            </button>
          </form>
        </div>
      </SectionWrapper>
    </>
  );
};

export default Index;
