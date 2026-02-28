import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Radio } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MiniRadioPlayer = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(50);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const [isExpanded, setIsExpanded] = useState(false);
    const playerRef = useRef<any>(null);
    const progressInterval = useRef<any>(null);

    // YouTube Playlist ID - Replace with actual playlist ID
    const playlistId = "PLOJOwGfk3Vb5d4R_OKBuAm_X-wZNO2y3I&si=H3L8oZvG2qDzUgZ_"; // Placeholder

    useEffect(() => {
        const initMiniPlayer = () => {
            if (window.YT && window.YT.Player) {
                playerRef.current = new window.YT.Player("mini-player-iframe", {
                    height: "0",
                    width: "0",
                    playerVars: {
                        listType: "playlist",
                        list: playlistId,
                        enablejsapi: 1,
                        autoplay: 0,
                    },
                    events: {
                        onReady: (event: any) => {
                            event.target.setVolume(volume);
                            setDuration(event.target.getDuration());
                        },
                        onStateChange: (event: any) => {
                            if (event.data === window.YT.PlayerState.PLAYING) {
                                setIsPlaying(true);
                                setDuration(event.target.getDuration());
                                startProgressTimer();
                            } else {
                                setIsPlaying(false);
                                stopProgressTimer();
                            }
                        }
                    }
                });
            } else {
                setTimeout(initMiniPlayer, 500);
            }
        };

        if (window.YT) {
            initMiniPlayer();
        } else {
            const tag = document.createElement("script");
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName("script")[0];
            firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
            window.onYouTubeIframeAPIReady = () => initMiniPlayer();
        }

        return () => stopProgressTimer();
    }, []);

    const startProgressTimer = () => {
        if (progressInterval.current) clearInterval(progressInterval.current);
        progressInterval.current = setInterval(() => {
            if (playerRef.current && playerRef.current.getCurrentTime) {
                setCurrentTime(playerRef.current.getCurrentTime());
            }
        }, 1000);
    };

    const stopProgressTimer = () => {
        if (progressInterval.current) clearInterval(progressInterval.current);
    };

    const togglePlay = () => {
        if (!playerRef.current) return;
        if (isPlaying) {
            playerRef.current.pauseVideo();
        } else {
            playerRef.current.playVideo();
        }
    };

    const toggleMute = () => {
        if (!playerRef.current) return;
        if (isMuted) {
            playerRef.current.unMute();
            setIsMuted(false);
        } else {
            playerRef.current.mute();
            setIsMuted(true);
        }
    };

    const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseInt(e.target.value);
        setVolume(newVolume);
        if (playerRef.current) {
            playerRef.current.setVolume(newVolume);
            if (newVolume > 0 && isMuted) {
                toggleMute();
            }
        }
    };

    const handleSeekChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const seekTo = parseFloat(e.target.value);
        if (playerRef.current) {
            playerRef.current.seekTo(seekTo, true);
        }
        setCurrentTime(seekTo);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <div className="fixed bottom-[104px] right-6 z-[60] flex items-end flex-col gap-3">
            {/* YouTube Player placeholder for API */}
            <div className="hidden" aria-hidden="true">
                <div id="mini-player-iframe"></div>
            </div>

            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, x: 20 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.8, x: 20 }}
                        className="glass-card rounded-2xl p-4 mb-2 shadow-2xl border-white/20 w-72"
                    >
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center shrink-0">
                                <Radio className="text-white animate-pulse" size={18} />
                            </div>
                            <div className="flex-grow overflow-hidden text-left">
                                <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest leading-none mb-1">Live Altar</p>
                                <h4 className="text-white font-bold text-xs truncate uppercase tracking-tighter">Prayer Radio</h4>
                            </div>
                        </div>

                        {/* Progress Slider */}
                        <div className="mb-4">
                            <input
                                type="range"
                                min="0"
                                max={duration || 100}
                                value={currentTime}
                                onChange={handleSeekChange}
                                className="w-full h-1 bg-white/10 rounded-full appearance-none cursor-pointer accent-red-600 outline-none"
                                style={{
                                    background: `linear-gradient(to right, #dc2626 0%, #dc2626 ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.1) ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.1) 100%)`
                                }}
                            />
                            <div className="flex justify-between text-[8px] uppercase font-bold text-white/30 tracking-widest mt-1">
                                <span>{formatTime(currentTime)}</span>
                                <span>{formatTime(duration)}</span>
                            </div>
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
                                    onChange={handleVolumeChange}
                                    className="w-20 h-0.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-red-600 outline-none"
                                    style={{
                                        background: `linear-gradient(to right, #dc2626 0%, #dc2626 ${isMuted ? 0 : volume}%, rgba(255,255,255,0.1) ${isMuted ? 0 : volume}%, rgba(255,255,255,0.1) 100%)`
                                    }}
                                />
                            </div>
                            <button
                                onClick={togglePlay}
                                className="w-8 h-8 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center transition-all shadow-lg shadow-red-600/20 shrink-0"
                            >
                                {isPlaying ? <Pause size={14} className="text-white fill-current" /> : <Play size={14} className="text-white fill-current ml-0.5" />}
                            </button>
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
