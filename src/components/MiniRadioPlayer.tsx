import { useState } from "react";
import { Play, Pause, Volume2, VolumeX, Radio, RefreshCw } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRadioEngine } from "../contexts/RadioContext";

const MiniRadioPlayer = () => {
    const {
        isPlaying, isMuted, volume, trackInfo,
        togglePlay, toggleMute, handleVolumeChange, syncToGlobalTime
    } = useRadioEngine();

    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="fixed bottom-[104px] right-6 z-[60] flex items-end flex-col gap-3">

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8, x: 20 }}
                        className="bg-[#0a0a0c] backdrop-blur-2xl rounded-[1.5rem] p-5 mb-2 shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] border border-white/10 w-80"
                    >
                        <div className="flex items-center gap-4 mb-5">
                            <div className="w-12 h-12 bg-red-600/20 rounded-xl flex items-center justify-center shrink-0 border border-red-600/30">
                                <Radio className="text-red-600 animate-pulse" size={20} />
                            </div>
                            <div className="flex-grow overflow-hidden text-left">
                                <span className="inline-block px-1.5 py-0.5 rounded bg-red-600/10 border border-red-600/20 text-[8px] font-black text-red-500 uppercase tracking-widest leading-none mb-1.5 opacity-90">
                                    {trackInfo.type}
                                </span>
                                <h4 className="text-white font-bold text-xs truncate uppercase tracking-tight leading-tight mb-0.5 line-clamp-1">
                                    {trackInfo.title}
                                </h4>
                                <p className="gold-text text-[10px] font-medium opacity-70 line-clamp-1">{trackInfo.artist}</p>
                            </div>
                        </div>

                        {/* Live Radio Visualizer */}
                        <div className="mb-5 flex items-center justify-between px-2">
                            <div className="flex items-end gap-[3px] h-6">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <motion.div
                                        key={i}
                                        animate={{ height: isPlaying ? ["20%", "100%", "40%", "80%", "20%"] : "20%" }}
                                        transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.1, ease: "easeInOut" }}
                                        className="w-1.5 bg-red-600 rounded-full"
                                    />
                                ))}
                            </div>
                            <button
                                onClick={syncToGlobalTime}
                                title="Resync Live Radio Feed"
                                className="flex items-center gap-2 bg-red-600/10 hover:bg-red-600/20 px-3 py-1 rounded-full border border-red-600/20 transition-colors cursor-pointer"
                            >
                                <span className="w-2 h-2 rounded-full bg-red-600 animate-pulse" />
                                <span className="text-[9px] font-black text-red-500 uppercase tracking-widest">Live Stream</span>
                            </button>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-2 flex-grow">
                                <button
                                    onClick={toggleMute}
                                    className="shrink-0 hover:opacity-80 transition-opacity"
                                >
                                    {isMuted || volume === 0 ? (
                                        <VolumeX size={14} className="text-red-500" />
                                    ) : (
                                        <Volume2 size={14} className="text-white/40" />
                                    )}
                                </button>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={isMuted ? 0 : volume}
                                    onChange={(e) => handleVolumeChange(parseInt(e.target.value))}
                                    className="w-16 h-0.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-red-600 outline-none"
                                    style={{
                                        background: `linear-gradient(to right, #dc2626 0%, #dc2626 ${isMuted ? 0 : volume}%, rgba(255,255,255,0.1) ${isMuted ? 0 : volume}%, rgba(255,255,255,0.1) 100%)`
                                    }}
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={togglePlay}
                                    className="w-8 h-8 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-all shadow-lg shadow-red-600/20 shrink-0"
                                >
                                    {isPlaying ? <Pause size={14} className="text-white fill-current" /> : <Play size={14} className="text-white fill-current ml-0.5" />}
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                    y: [0, -12, 0],
                }}
                transition={{
                    duration: 4,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-14 h-14 bg-navy hover:bg-black rounded-full shadow-2xl flex items-center justify-center border border-white/10 relative group"
            >
                <div className="absolute inset-0 bg-red-600/20 rounded-full animate-ping opacity-20 group-hover:opacity-40" />
                <Radio size={24} className={`${isPlaying ? "text-red-600 animate-pulse" : "text-white"}`} />
            </motion.button>
        </div>
    );
};

export default MiniRadioPlayer;
