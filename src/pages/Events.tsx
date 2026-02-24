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
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event, i) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="card-elevated p-6 flex flex-col"
            >
              <div className="flex items-center gap-2 gold-text text-sm font-medium mb-3">
                <Calendar size={16} />
                {event.date}
              </div>
              <h3 className="font-heading text-xl font-semibold mb-2">{event.title}</h3>
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-1">
                <Clock size={14} /> {event.time}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
                <MapPin size={14} /> {event.location}
              </div>
              <p className="text-muted-foreground text-sm flex-1">{event.description}</p>
              <button className="btn-gold mt-6 text-sm">Register Now</button>
            </motion.div>
          ))}
        </div>
      </SectionWrapper>
    </>
  );
};

export default Events;
