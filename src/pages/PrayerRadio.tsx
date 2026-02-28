import { useState, useRef } from "react";
import PageHero from "@/components/PageHero";
import SectionWrapper from "@/components/SectionWrapper";
import { Radio as RadioIcon, Volume2, Headphones, Play, Pause } from "lucide-react";
import { motion } from "framer-motion";

const PrayerRadio = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const playerRef = useRef<HTMLIFrameElement>(null);

    // YouTube Playlist ID - Update to your actual playlist
    const playlistId = "PLy7iUq_1K7Y5-rQ_9Z6gY_6n-u7n9_9z6";

    const togglePlay = () => {
        const action = isPlaying ? "pauseVideo" : "playVideo";
        playerRef.current?.contentWindow?.postMessage(
            JSON.stringify({ event: "command", func: action, args: [] }),
            "*"
        );
        setIsPlaying(!isPlaying);
    };

    return (
        <>
            <PageHero
                title="Prayer Radio"
                subtitle="Listen to continuous prayers, worship, and spiritual encouragement 24/7."
            />

            {/* Hidden YouTube Player */}
            <iframe
                ref={playerRef}
                className="hidden"
                src={`https://www.youtube.com/embed/videoseries?list=${playlistId}&enablejsapi=1&autoplay=0`}
                allow="autoplay"
            />

            <SectionWrapper>
                <div className="max-w-4xl mx-auto">
                    <div className="glass-card rounded-[2.5rem] p-8 md:p-12 text-center relative overflow-hidden">
                        {/* Design Elements */}
                        <div className="blur-orb w-[300px] h-[300px] bg-red-600/10 -top-20 -left-20" />
                        <div className="blur-orb w-[250px] h-[250px] bg-gold-500/10 -bottom-20 -right-20" />

                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            className="relative z-10"
                        >
                            <div className="w-24 h-24 bg-red-600/20 rounded-full flex items-center justify-center mx-auto mb-8 border border-red-600/30">
                                <RadioIcon size={48} className={`text-red-600 ${isPlaying ? "animate-pulse" : ""}`} />
                            </div>

                            <h2 className="font-heading text-4xl font-bold mb-4 italic">
                                Prayer Realm <span className="gold-text uppercase">Radio</span>
                            </h2>
                            <p className="text-muted-foreground mb-12 max-w-xl mx-auto">
                                Streaming atmosphere-shifting sounds and fervent prayers directly to your device. Stay connected to the altar wherever you are.
                            </p>

                            {/* Radio Player */}
                            <div className="bg-navy rounded-3xl p-8 border border-white/10 shadow-2xl">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                                    <div className="flex items-center gap-6 text-left">
                                        <div className="w-20 h-20 bg-gold-gradient rounded-xl flex items-center justify-center shrink-0 shadow-lg">
                                            <Headphones className="text-white" size={32} />
                                        </div>
                                        <div>
                                            <h3 className="text-white font-bold text-xl uppercase tracking-tighter">
                                                {isPlaying ? "Now Playing" : "Radio Standby"}
                                            </h3>
                                            <p className="gold-text font-medium text-sm">Atmosphere Shifting Prayers</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <button className="w-16 h-16 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-all border border-white/10">
                                            <Volume2 className="text-white" size={24} />
                                        </button>
                                        <button
                                            onClick={togglePlay}
                                            className="w-20 h-20 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-all shadow-xl shadow-red-600/20 group"
                                        >
                                            {isPlaying ? (
                                                <Pause className="text-white fill-current group-hover:scale-110 transition-transform" size={40} />
                                            ) : (
                                                <Play className="text-white fill-current ml-1 group-hover:scale-110 transition-transform" size={40} />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Progress Bar */}
                                <div className="mt-8 h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                                    <motion.div
                                        animate={isPlaying ? { width: ["20%", "85%", "40%"] } : { width: "0%" }}
                                        transition={{ duration: 4, repeat: Infinity, repeatType: "mirror" }}
                                        className="h-full bg-red-600"
                                    />
                                </div>
                                <div className="flex justify-between mt-2 text-[10px] uppercase font-bold text-white/40 tracking-widest">
                                    <span>{isPlaying ? "Live Stream" : "Ready to Play"}</span>
                                    <span>24/7 Global Altar</span>
                                </div>
                            </div>

                            <div className="mt-12 grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div className="bg-secondary/50 p-4 rounded-2xl border border-border">
                                    <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Listeners</p>
                                    <p className="text-2xl font-bold italic">1.2K <span className="text-red-600 text-[10px] animate-pulse">●</span></p>
                                </div>
                                <div className="bg-secondary/50 p-4 rounded-2xl border border-border">
                                    <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Quality</p>
                                    <p className="text-2xl font-bold italic">HD</p>
                                </div>
                                <div className="hidden md:block bg-secondary/50 p-4 rounded-2xl border border-border col-span-1">
                                    <p className="text-xs font-bold text-muted-foreground uppercase mb-1">Region</p>
                                    <p className="text-2xl font-bold italic">Global</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </SectionWrapper>
        </>
    );
};

export default PrayerRadio;
