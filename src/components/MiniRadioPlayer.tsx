import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, Radio } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MiniRadioPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const playerRef = useRef<HTMLIFrameElement>(null);

    // YouTube Playlist ID - Replace with actual playlist ID
    const playlistId = "PLy7iUq_1K7Y5-rQ_9Z6gY_6n-u7n9_9z6"; // Placeholder

    const togglePlay = () => {
        const action = isPlaying ? "pauseVideo" : "playVideo";
        playerRef.current?.contentWindow?.postMessage(
            JSON.stringify({ event: "command", func: action, args: [] }),
            "*"
        );
        setIsPlaying(!isPlaying);
    };

    return (
        <div className="fixed bottom-6 right-6 z-[60] flex items-end flex-col gap-3">
            {/* Hidden YouTube Player */}
            <iframe
                ref={playerRef}
                className="hidden"
                src={`https://www.youtube.com/embed/videoseries?list=${playlistId}&enablejsapi=1&autoplay=0`}
                allow="autoplay"
            />

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8, x: 20 }}
                        className="glass-card rounded-2xl p-4 mb-2 shadow-2xl border-white/20 w-64"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center shrink-0">
                                <Radio className="text-white animate-pulse" size={20} />
                            </div>
                            <div className="flex-grow overflow-hidden">
                                <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest leading-none mb-1">Live Altar</p>
                                <h4 className="text-white font-bold text-sm truncate uppercase tracking-tighter">Prayer Radio</h4>
                            </div>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Volume2 size={16} className="text-white/40" />
                                <div className="h-1 w-20 bg-white/10 rounded-full overflow-hidden">
                                    <div className="h-full bg-red-600 w-2/3" />
                                </div>
                            </div>
                            <button
                                onClick={togglePlay}
                                className="w-10 h-10 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-all shadow-lg shadow-red-600/20"
                            >
                                {isPlaying ? <Pause size={18} className="text-white fill-current" /> : <Play size={18} className="text-white fill-current ml-0.5" />}
                            </button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
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
