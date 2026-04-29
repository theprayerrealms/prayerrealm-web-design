import { useState, useEffect } from "react";
import PageHero from "@/components/PageHero";
import SectionWrapper from "@/components/SectionWrapper";
import { events } from "@/data/siteData";
import { Calendar, Clock, MapPin, X, Send, CheckCircle2, Users, Map as MapIcon, ChevronRight, Globe, Shield, ArrowLeft } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "@/components/ui/use-toast";
import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const Events = () => {
  const [viewMode, setViewMode] = useState<'list' | 'detail'>('list');
  const [dbEvents, setDbEvents] = useState<any[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [isLoadingEvents, setIsLoadingEvents] = useState(true);
  const [isRegistering, setIsRegistering] = useState(false);
  const [formStep, setFormStep] = useState<'form' | 'success'>('form');
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    city: "",
    volunteerStatus: "NO",
    department: "",
    transportation: "NO",
    accommodation: "NO",
    wrestleVersion: "2.0",
    customAnswers: {} as Record<string, string>
  });

  useEffect(() => {
    const fetchEvents = async () => {
        try {
            const snapshot = await getDocs(collection(db, 'events'));
            if (!snapshot.empty) {
                const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() as any })).filter(d => d.status === 'ACTIVE');
                if (data.length > 0) {
                    setDbEvents(data);
                    setSelectedEvent(data[0]);
                } else {
                    setDbEvents(events);
                    setSelectedEvent(events[0]);
                }
            } else {
                setDbEvents(events);
                setSelectedEvent(events[0]);
            }
        } catch (error) {
            console.error('Error fetching events:', error);
            setDbEvents(events);
            setSelectedEvent(events[0]);
        } finally {
            setIsLoadingEvents(false);
        }
    };
    fetchEvents();
  }, []);

  // Scroll to top when switching views
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [viewMode]);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistering(true);
    
    try {
      await addDoc(collection(db, 'registrations'), {
        eventId: selectedEvent.id,
        ...formData,
        wrestleVersion: selectedEvent.wrestleVersion || "2.0",
        customAnswers: formData.customAnswers || {},
        createdAt: new Date().toISOString()
      });

      setFormStep('success');
      toast({
        title: "Registration Successful!",
        description: "Your registration has been securely logged at the Altar.",
      });
    } catch (error) {
      console.error('Error registering for event:', error);
      toast({
        title: "Error",
        description: "Something went wrong. Please try again later.",
        variant: "destructive"
      });
    } finally {
      setIsRegistering(false);
    }
  };

  const openDetail = (event: any) => {
    setSelectedEvent(event);
    setViewMode('detail');
    setFormStep('form');
  };

  return (
    <div className="min-h-screen bg-[#0a0a0c]">
      <AnimatePresence mode="wait">
        {viewMode === 'list' ? (
          <motion.div
            key="list"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
          >
            <PageHero title="Events" subtitle="Join believers worldwide in prayer and worship" />
            <SectionWrapper>
                <div className="flex flex-col gap-12">
                {isLoadingEvents ? (
                   <div className="text-center py-40"><p className="text-white/20 animate-pulse font-black italic uppercase tracking-widest">Calling the Archive...</p></div>
                ) : dbEvents.map((event, i) => (
                    <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: i * 0.1 }}
                    className="flex flex-col md:flex-row overflow-hidden rounded-3xl bg-card shadow-xl border border-border/50 hover:shadow-2xl transition-all duration-500"
                    >
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
                        <button
                            onClick={() => openDetail(event)}
                            className="btn-gold px-12 py-4 text-base font-bold italic"
                        >
                            Register At The Altar
                        </button>
                        </div>
                    </div>
                    </motion.div>
                ))}
                </div>
            </SectionWrapper>
          </motion.div>
        ) : (
          <motion.div
            key="detail"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ type: "spring", damping: 25, stiffness: 120 }}
          >
            <div className="relative h-[60vh] overflow-hidden">
                <div className="absolute top-8 left-8 z-30">
                    <button 
                        onClick={() => setViewMode('list')}
                        className="flex items-center gap-3 bg-black/40 backdrop-blur-md px-6 py-3 rounded-full text-white font-bold border border-white/20 hover:bg-black/60 transition-all group"
                    >
                        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                        Back to Events
                    </button>
                </div>
                <img src={selectedEvent.image} className="w-full h-full object-cover" alt={selectedEvent.title} />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-[#0a0a0c]/20 to-transparent" />
            </div>

            <SectionWrapper className="pt-0 -mt-32">
                <div className="grid lg:grid-cols-12 gap-10 max-w-7xl mx-auto items-start">
                    
                    {/* LEFT SIDE: Luma Content */}
                    <div className="lg:col-span-8 space-y-10">
                        <div className="glass-card p-10 md:p-14 rounded-[3rem] relative overflow-hidden">
                            <div className="blur-orb w-[400px] h-[400px] bg-red-600/5 -top-40 -right-40" />
                            
                            <div className="flex flex-wrap items-center gap-4 mb-6">
                                <span className="px-4 py-1.5 rounded-full bg-red-600/10 text-red-500 text-[11px] font-bold uppercase tracking-widest border border-red-500/20">
                                    Global Broadcast Live
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-7xl font-bold text-white mb-8 italic tracking-tighter leading-tight">
                                {selectedEvent.title}
                            </h1>

                            <div className="grid sm:grid-cols-2 gap-8 py-10 border-y border-white/10 mb-10">
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                                        <Calendar size={24} className="text-red-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-muted-foreground uppercase opacity-50 mb-0.5">Date & Time</p>
                                        <p className="text-white font-bold text-lg">{selectedEvent.date} — {selectedEvent.time}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-5">
                                    <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center border border-white/10">
                                        <MapPin size={24} className="text-red-600" />
                                    </div>
                                    <div>
                                        <p className="text-xs font-bold text-muted-foreground uppercase opacity-50 mb-0.5">Location</p>
                                        <p className="text-white font-bold text-lg">{selectedEvent.location}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="prose prose-invert max-w-none mb-14">
                                <h3 className="gold-text uppercase tracking-[0.2em] text-[10px] font-black mb-6">The Atmosphere</h3>
                                <p className="text-white/80 text-xl leading-relaxed font-light italic">
                                    {selectedEvent.description}
                                </p>
                            </div>

                            {/* Map Integration */}
                            <div className="space-y-6">
                                <h3 className="gold-text uppercase tracking-[0.2em] text-[10px] font-black">Satellite Venue View</h3>
                                <div className="relative rounded-[2.5rem] overflow-hidden border border-white/10 h-[450px] bg-white/5 group shadow-inner">
                                    <iframe 
                                        width="100%" 
                                        height="100%" 
                                        style={{ border: 0, opacity: 0.9 }}
                                        src={`https://www.google.com/maps?q=${encodeURIComponent(selectedEvent.mapSearchQuery || selectedEvent.location)}&output=embed`}
                                        allowFullScreen
                                        className="grayscale hover:grayscale-0 transition-all duration-1000"
                                    />
                                    <div className="absolute bottom-8 left-8 right-8 p-6 glass-card bg-black/80 backdrop-blur-xl rounded-[2rem] border border-white/10 flex items-center justify-between">
                                        <div>
                                            <p className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-1">Live Venue</p>
                                            <p className="text-white font-black text-xl italic">{selectedEvent.location}</p>
                                        </div>
                                        <a 
                                            href={`https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(selectedEvent.mapSearchQuery || selectedEvent.location)}`}
                                            target="_blank"
                                            className="p-4 bg-white/10 rounded-full hover:bg-white/20 transition-all border border-white/10"
                                        >
                                            <ChevronRight size={24} />
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE: Sticky Booking Console */}
                    <div className="lg:col-span-4 sticky top-10">
                        <div className="glass-card p-1 pb-1 rounded-[3rem] border border-red-600/20 shadow-2xl relative overflow-hidden overflow-y-auto">
                            <div className="p-10">
                                <div className="flex items-center gap-3 mb-8 bg-red-600/10 px-5 py-2.5 rounded-full border border-red-600/30 w-fit">
                                    <Users size={18} className="text-red-500 animate-pulse" />
                                    <span className="text-[10px] font-black text-red-500 uppercase tracking-widest italic">1.2K Believers Participating</span>
                                </div>

                                <h2 className="text-4xl font-black mb-4 uppercase italic leading-[0.9] tracking-tighter">
                                    Secure <span className="gold-text">Altar Pass</span>
                                </h2>
                                <p className="text-white/50 text-sm mb-10 font-medium">Join the move of the spirit. Register now for access.</p>

                                <form onSubmit={handleRegister} className="space-y-6">
                                    <div className="space-y-4">
                                        {/* Auto-assigned version indicator */}
                                        <div className="flex gap-4 p-4 rounded-2xl bg-white/5 border border-white/10 mb-6 justify-center items-center">
                                            <span className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em]">Encounter Version: <span className="text-white gold-text text-sm">Wrestle {selectedEvent.wrestleVersion || '2.0'}</span></span>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase text-white/40 tracking-[0.2em] ml-1">Full Name</label>
                                            <input 
                                                required type="text" placeholder="Full name"
                                                value={formData.name}
                                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 transition-all text-white"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase text-white/40 tracking-[0.2em] ml-1">Email</label>
                                                <input 
                                                    required type="email" placeholder="email@address.com"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 transition-all text-white"
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase text-white/40 tracking-[0.2em] ml-1">Phone</label>
                                                <input 
                                                    required type="text" placeholder="+123..."
                                                    value={formData.phone}
                                                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 transition-all text-white"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold uppercase text-white/40 tracking-[0.2em] ml-1">Location / City</label>
                                            <input 
                                                required type="text" placeholder="Lagos, Nigeria"
                                                value={formData.city}
                                                onChange={(e) => setFormData({...formData, city: e.target.value})}
                                                className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 transition-all text-white"
                                            />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            {selectedEvent?.formConfig?.askVolunteer !== false && (
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold uppercase text-white/40 tracking-[0.2em] ml-1">Will you Volunteer?</label>
                                                    <select 
                                                        value={formData.volunteerStatus}
                                                        onChange={(e) => setFormData({...formData, volunteerStatus: e.target.value})}
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none text-white"
                                                    >
                                                        <option value="NO" className="bg-black text-white">No</option>
                                                        <option value="YES" className="bg-black text-white">Yes</option>
                                                    </select>
                                                </div>
                                            )}
                                            {selectedEvent?.formConfig?.askTransport !== false && (
                                                <div className="space-y-2">
                                                    <label className="text-[10px] font-bold uppercase text-white/40 tracking-[0.2em] ml-1">Transportation?</label>
                                                    <select 
                                                        value={formData.transportation}
                                                        onChange={(e) => setFormData({...formData, transportation: e.target.value})}
                                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none text-white"
                                                    >
                                                        <option value="NO" className="bg-black text-white">No Need</option>
                                                        <option value="YES" className="bg-black text-white">Need It</option>
                                                    </select>
                                                </div>
                                            )}
                                        </div>

                                        {selectedEvent?.formConfig?.askVolunteer !== false && formData.volunteerStatus === 'YES' && (
                                            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase text-white/40 tracking-[0.2em] ml-1">Target Department</label>
                                                <input 
                                                    type="text" placeholder="Protocol, Choir, Ushering..."
                                                    value={formData.department}
                                                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 transition-all text-white"
                                                />
                                            </motion.div>
                                        )}

                                        {selectedEvent?.formConfig?.askAccommodation !== false && (
                                            <div className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase text-white/40 tracking-[0.2em] ml-1">Accommodation Required?</label>
                                                <select 
                                                    value={formData.accommodation}
                                                    onChange={(e) => setFormData({...formData, accommodation: e.target.value})}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none text-white"
                                                >
                                                    <option value="NO" className="bg-black text-white">No, Have Arrangement</option>
                                                    <option value="YES" className="bg-black text-white">Yes, Requesting</option>
                                                </select>
                                            </div>
                                        )}

                                        {selectedEvent?.formConfig?.customQuestions?.map((q: string, idx: number) => (
                                            <div key={idx} className="space-y-2">
                                                <label className="text-[10px] font-bold uppercase text-white/40 tracking-[0.2em] ml-1">{q}</label>
                                                <input 
                                                    required type="text" placeholder="Enter your answer"
                                                    value={formData.customAnswers[q] || ''}
                                                    onChange={(e) => setFormData({
                                                        ...formData, 
                                                        customAnswers: { ...formData.customAnswers, [q]: e.target.value }
                                                    })}
                                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-600 transition-all text-white"
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <button 
                                        disabled={isRegistering}
                                        className={`btn-gold w-full py-6 rounded-2xl text-xl font-black italic shadow-2xl flex items-center justify-center gap-3 relative overflow-hidden transition-all ${
                                            formStep === 'success' ? 'bg-green-600 border-green-500 scale-[1.02]' : 'hover:scale-[1.02]'
                                        }`}
                                    >
                                        <AnimatePresence mode="wait">
                                            {formStep === 'success' ? (
                                                <motion.span key="ok" initial={{ opacity:0 }} animate={{ opacity:1 }} className="flex items-center gap-3">
                                                    PASS SECURED <CheckCircle2 size={24} />
                                                </motion.span>
                                            ) : (
                                                <motion.span key="reg" initial={{ opacity:0 }} animate={{ opacity:1 }} className="flex items-center gap-3">
                                                    {isRegistering ? 'CONNECTING...' : 'REGISTER FOR ENCOUNTER'}
                                                    <ChevronRight size={22} className="group-hover:translate-x-1" />
                                                </motion.span>
                                            )}
                                        </AnimatePresence>
                                    </button>
                                </form>

                                <div className="mt-12 pt-8 border-t border-white/5 grid grid-cols-2 gap-6">
                                    <div className="flex flex-col gap-2">
                                        <Shield size={16} className="text-red-600" />
                                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest leading-normal">Secured Connection</p>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <Globe size={16} className="text-white" />
                                        <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest leading-normal">Global Access Pass</p>
                                    </div>
                                </div>
                            </div>
                            <div className="bg-red-600 h-2 w-full mt-auto rounded-b-full shadow-[0_0_50px_rgba(220,38,38,0.5)]" />
                        </div>
                    </div>
                </div>
            </SectionWrapper>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Events;
