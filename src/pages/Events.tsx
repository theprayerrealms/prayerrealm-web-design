import PageHero from "@/components/PageHero";
import SectionWrapper from "@/components/SectionWrapper";
import { events } from "@/data/siteData";
import { Calendar, Clock, MapPin } from "lucide-react";
import { motion } from "framer-motion";

const Events = () => {
  return (
    <>
      <PageHero title="Events" subtitle="Join believers worldwide in prayer and worship" />
      <SectionWrapper>
        <div className="flex flex-col gap-12">
          {events.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="flex flex-col md:flex-row overflow-hidden rounded-3xl bg-card shadow-xl border border-border/50 hover:shadow-2xl transition-all duration-500"
            >
              {/* Event Flyer / Image Side */}
              <div className="md:w-1/2 aspect-[16/10] md:aspect-auto relative overflow-hidden group">
                <img
                  src={(event as any).image}
                  alt={event.title}
                  className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60" />
                <div className="absolute top-6 left-6 bg-primary text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                  Upcoming
                </div>
              </div>

              {/* Event Details Side */}
              <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest mb-4">
                  <Calendar size={18} className="mb-0.5" />
                  {event.date}
                </div>

                <h2 className="font-heading text-3xl md:text-4xl font-bold mb-4 leading-tight">
                  {event.title}
                </h2>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <Clock size={16} />
                    </div>
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-3 text-muted-foreground">
                    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <MapPin size={16} />
                    </div>
                    <span>{event.location}</span>
                  </div>
                </div>

                <p className="text-muted-foreground text-lg leading-relaxed mb-8 line-clamp-3">
                  {event.description}
                </p>

                <div className="flex flex-wrap gap-4 mt-auto">
                  <button className="btn-gold px-8 py-4 text-base font-bold">
                    Register Now
                  </button>
                  <button className="px-8 py-4 border border-border hover:bg-muted/50 rounded-md transition-colors text-base font-medium">
                    View Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>
    </>
  );
};

export default Events;
