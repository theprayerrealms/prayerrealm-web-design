import PageHero from "@/components/PageHero";
import SectionWrapper from "@/components/SectionWrapper";
import { Radio as RadioIcon, Volume2, VolumeX, Headphones, Play, Pause } from "lucide-react";
import { motion } from "framer-motion";
import { useRadioEngine } from "../contexts/RadioContext";

const PrayerRadio = () => {
    const {
        isPlaying, isMuted, volume, trackInfo,
        togglePlay, toggleMute, handleVolumeChange, syncToGlobalTime
    } = useRadioEngine();

    return (
        <>
            <PageHero
                title="Prayer Radio"
                subtitle="Listen to continuous prayers, worship, and spiritual encouragement 24/7."
            />

            <SectionWrapper>
                <div className="max-w-4xl mx-auto">
                    <div className="glass-card rounded-[2.5rem] p-8 md:p-12 text-center relative overflow-hidden">
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

                            <div className="bg-navy rounded-3xl p-8 border border-white/10 shadow-2xl">
                                <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-8">
                                    <div className="flex items-center gap-6 text-left">
                                        <div className="w-20 h-20 bg-gold-gradient rounded-xl flex items-center justify-center shrink-0 shadow-lg">
                                            <Headphones className="text-white" size={32} />
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest bg-red-500/10 px-2 py-0.5 rounded border border-red-500/20">
                                                    {trackInfo.type}
                                                </span>
                                            </div>
                                            <h3 className="text-white font-bold text-xl uppercase tracking-tighter line-clamp-1">
                                                {trackInfo.title}
                                            </h3>
                                            <p className="gold-text font-medium text-sm line-clamp-1">{trackInfo.artist}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="flex flex-col items-center gap-2">
                                            <button
                                                onClick={toggleMute}
                                                className="w-12 h-12 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center transition-all border border-white/10"
                                            >
                                                {isMuted || volume === 0 ? <VolumeX className="text-red-500" size={20} /> : <Volume2 className="text-white" size={20} />}
                                            </button>
                                            <input
                                                type="range"
                                                min="0"
                                                max="100"
                                                value={isMuted ? 0 : volume}
                                                onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                                                className="w-24 h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-red-600"
                                                style={{
                                                    background: `linear-gradient(to right, #dc2626 0%, #dc2626 ${isMuted ? 0 : volume}%, rgba(255,255,255,0.1) ${isMuted ? 0 : volume}%, rgba(255,255,255,0.1) 100%)`
                                                }}
                                            />
                                        </div>
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

                                {/* Live Radio Visualizer */}
                                <div className="mt-8 bg-black/20 rounded-2xl p-4 md:px-8 border border-white/5 flex items-center justify-between">
                                    <button
                                        onClick={syncToGlobalTime}
                                        title="Resync Live Radio Feed"
                                        className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
                                    >
                                        <span className="relative flex h-3 w-3">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
                                        </span>
                                        <span className="text-xs font-bold text-red-500 uppercase tracking-widest bg-red-500/10 px-3 py-1.5 rounded-full border border-red-500/20 hover:bg-red-500/20">Live Broadcast</span>
                                    </button>

                                    <div className="flex items-end gap-[4px] h-10">
                                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
                                            <motion.div
                                                key={i}
                                                animate={{ height: isPlaying ? ["20%", "100%", "40%", "80%", "20%"] : "20%" }}
                                                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
                                                className="w-2 md:w-2.5 bg-red-600 rounded-full opacity-80"
                                            />
                                        ))}
                                    </div>
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
