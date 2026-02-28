import { useState, useRef, useEffect } from "react";
import PageHero from "@/components/PageHero";
import SectionWrapper from "@/components/SectionWrapper";
import { Radio as RadioIcon, Volume2, VolumeX, Headphones, Play, Pause } from "lucide-react";
import { motion } from "framer-motion";

declare global {
    interface Window {
        onYouTubeIframeAPIReady: () => void;
        YT: any;
    }
}

const PrayerRadio = () => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(50);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);
    const playerRef = useRef<any>(null);
    const progressInterval = useRef<any>(null);

    // YouTube Playlist ID - Update to your actual playlist
    const playlistId = "PLy7iUq_1K7Y5-rQ_9Z6gY_6n-u7n9_9z6";

    useEffect(() => {
        // Load YouTube API
        if (!window.YT) {
            const tag = document.createElement("script");
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName("script")[0];
            firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

            window.onYouTubeIframeAPIReady = () => {
                initPlayer();
            };
        } else {
            initPlayer();
        }

        return () => {
            if (progressInterval.current) clearInterval(progressInterval.current);
        };
    }, []);

    const initPlayer = () => {
        playerRef.current = new window.YT.Player("youtube-player", {
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
                },
            },
        });
    };

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
        setCurrentTime(seekTo);
        if (playerRef.current) {
            playerRef.current.seekTo(seekTo, true);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs.toString().padStart(2, "0")}`;
    };

    return (
        <>
            <PageHero
                title="Prayer Radio"
                subtitle="Listen to continuous prayers, worship, and spiritual encouragement 24/7."
            />

            <div id="youtube-player-container" className="hidden">
                <div id="youtube-player"></div>
                <iframe
                    id="youtube-player-iframe"
                    className="hidden"
                    src={`https://www.youtube.com/embed/videoseries?list=${playlistId}&enablejsapi=1&autoplay=0`}
                />
            </div>

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
                                            <h3 className="text-white font-bold text-xl uppercase tracking-tighter">
                                                {isPlaying ? "Now Playing" : "Radio Standby"}
                                            </h3>
                                            <p className="gold-text font-medium text-sm">Atmosphere Shifting Prayers</p>
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
                                                onChange={handleVolumeChange}
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

                                {/* Main Progress Slider */}
                                <div className="space-y-2">
                                    <input
                                        type="range"
                                        min="0"
                                        max={duration || 100}
                                        value={currentTime}
                                        onChange={handleSeekChange}
                                        className="w-full h-1.5 bg-white/10 rounded-full appearance-none cursor-pointer accent-red-600 focus:outline-none"
                                        style={{
                                            background: `linear-gradient(to right, #dc2626 0%, #dc2626 ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.1) ${(currentTime / (duration || 1)) * 100}%, rgba(255,255,255,0.1) 100%)`
                                        }}
                                    />
                                    <div className="flex justify-between text-[10px] uppercase font-bold text-white/40 tracking-widest">
                                        <span>{formatTime(currentTime)}</span>
                                        <span>{isPlaying ? "Live Stream" : "Ready"}</span>
                                        <span>{formatTime(duration)}</span>
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
