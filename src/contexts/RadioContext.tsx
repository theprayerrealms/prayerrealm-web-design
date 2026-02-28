import { createContext, useContext, useEffect, useRef, useState } from "react";
import React from 'react';

// ==========================================
// GLOBAL RADIO ENGINE CONFIG
// ==========================================
// Set this to TRUE to make the radio behave like a real-world broadcast station.
// It will calculate where it SHOULD be in the playlist based on the current world time,
// ensuring everyone listening is hearing the exact same part of the broadcast globally.
export const GLOBAL_RADIO_ENABLED = true;

// The simulated "Start Time" of our 24/7 radio station broadcast.
// Do not change this date, it acts as the anchor point for the global time sync math.
const RADIO_EPOCH = new Date("2024-01-01T00:00:00Z").getTime();
declare global {
    interface Window {
        onYouTubeIframeAPIReady: () => void;
        YT: any;
    }
}

// Real Playlist IDs provided by user
const PLAYLISTS = {
    announcement: "PLOJOwGfk3Vb48j9lZ60aBGULy0e4hy3P-",
    prayer: "PLOJOwGfk3Vb6mpjVqfHBFo_Xnvgcj9rbE",
    sermon: "PLOJOwGfk3Vb5NL0rtqmt-El9c1tGLXKjs",
    song: "PLOJOwGfk3Vb5d4R_OKBuAm_X-wZNO2y3I"
};

// The requested rotation pattern: Song -> Announcement -> Sermon -> Announcement -> Prayer -> Announcement
// Note: To sync globally without a server, we MUST assign a fixed duration to each playlist
// or assume a fixed block length for each type. For this robust sync, we assume each "block" 
// runs for a fixed average amount of time (e.g., 30 mins) before rotating, or we just play 1 hour each.
// For smooth testing right now, we'll assign 10 minutes (600 seconds) to each block.
const BLOCK_DURATION_MS = 10 * 60 * 1000; // 10 minutes per block

const SCHEDULE = [
    { type: "song", id: PLAYLISTS.song, duration: BLOCK_DURATION_MS },
    { type: "announcement", id: PLAYLISTS.announcement, duration: BLOCK_DURATION_MS },
    { type: "sermon", id: PLAYLISTS.sermon, duration: BLOCK_DURATION_MS },
    { type: "announcement", id: PLAYLISTS.announcement, duration: BLOCK_DURATION_MS },
    { type: "prayer", id: PLAYLISTS.prayer, duration: BLOCK_DURATION_MS },
    { type: "announcement", id: PLAYLISTS.announcement, duration: BLOCK_DURATION_MS }
];

const TOTAL_SCHEDULE_DURATION = SCHEDULE.reduce((acc, val) => acc + val.duration, 0);

export const RadioContext = createContext<any>(null);

export const useRadioEngine = () => useContext(RadioContext);

export const RadioProvider = ({ children }: { children: React.ReactNode }) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [volume, setVolume] = useState(50);
    const [trackInfo, setTrackInfo] = useState({ title: "Prayer Realm Radio", artist: "Initializing Station...", type: "System" });

    // Dual players for crossfading
    const playerA = useRef<any>(null);
    const playerB = useRef<any>(null);

    // Engine State
    const activePlayer = useRef<"A" | "B">("A");
    const currentSeqIndex = useRef(0);
    const typeIndices = useRef<Record<string, number>>({
        song: 0, prayer: 0, sermon: 0, announcement: 0
    });
    const isTransitioning = useRef(false);
    const progressInterval = useRef<any>(null);

    // Fade intervals to clear them if needed
    const fadeOutInt = useRef<any>(null);
    const fadeInInt = useRef<any>(null);

    // Initial load switch
    const isReady = useRef({ A: false, B: false });
    const hasStarted = useRef(false);

    useEffect(() => {
        if (!window.YT) {
            const tag = document.createElement("script");
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName("script")[0];
            firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
            window.onYouTubeIframeAPIReady = initDualPlayers;
        } else {
            initDualPlayers();
        }

        // Auto resync every 3 hours (3 * 60 * 60 * 1000 = 10800000 ms)
        const autoSyncInterval = setInterval(() => {
            if (GLOBAL_RADIO_ENABLED) {
                console.log("[RadioEngine] Auto-resyncing global schedule...");
                syncToGlobalTime();
            }
        }, 3 * 60 * 60 * 1000);

        return () => {
            stopEngine();
            clearInterval(autoSyncInterval);
        };
    }, []);

    const initDualPlayers = () => {
        playerA.current = new window.YT.Player("radio-player-a", {
            height: "10", width: "10",
            playerVars: { autoplay: 0, controls: 0, disablekb: 1, modestbranding: 1, rel: 0 },
            events: { onReady: () => handleReady("A"), onStateChange: (e: any) => handleStateChange("A", e), onError: (e: any) => handleError(e, "A") }
        });
        playerB.current = new window.YT.Player("radio-player-b", {
            height: "10", width: "10",
            playerVars: { autoplay: 0, controls: 0, disablekb: 1, modestbranding: 1, rel: 0 },
            events: { onReady: () => handleReady("B"), onStateChange: (e: any) => handleStateChange("B", e), onError: (e: any) => handleError(e, "B") }
        });
    };

    const syncToGlobalTime = () => {
        if (!isReady.current.A || !isReady.current.B) return;

        clearInterval(fadeInInt.current);
        clearInterval(fadeOutInt.current);
        isTransitioning.current = false;

        const pA = playerA.current;
        const pB = playerB.current;
        pA?.pauseVideo();
        pB?.pauseVideo();

        if (GLOBAL_RADIO_ENABLED) {
            // Jump into the exact mathematical spot of our 24/7 global broadcast
            const now = Date.now();
            const elapsedSinceEpoch = now - RADIO_EPOCH;
            const positionInCycle = elapsedSinceEpoch % TOTAL_SCHEDULE_DURATION;

            let timeAccumulator = 0;
            let targetSeqIndex = 0;

            for (let i = 0; i < SCHEDULE.length; i++) {
                if (positionInCycle >= timeAccumulator && positionInCycle < timeAccumulator + SCHEDULE[i].duration) {
                    targetSeqIndex = i;
                    break;
                }
                timeAccumulator += SCHEDULE[i].duration;
            }

            // Set the engine to the globally calculated index
            currentSeqIndex.current = targetSeqIndex;
            const positionInBlock = (positionInCycle - timeAccumulator) / 1000; // in seconds

            // Let's assume an average video length of 4 mins (240s) to guess what index of the Youtube playlist we should be on
            const avgVideoLength = 240;
            const globalPlaylistIndex = Math.floor(positionInBlock / avgVideoLength);
            const secondOfVideo = positionInBlock % avgVideoLength;

            typeIndices.current[SCHEDULE[targetSeqIndex].type] = globalPlaylistIndex;
            activePlayer.current = "A";

            cueNextTrack("A", targetSeqIndex, secondOfVideo);

            setTimeout(() => {
                let nextSeq = targetSeqIndex + 1;
                if (nextSeq >= SCHEDULE.length) nextSeq = 0;
                cueNextTrack("B", nextSeq, 0);
                setTrackInfo({ title: "Prayer Realm Broadcast", artist: "System Synced to Live Time...", type: "Ready" });

                // If it was already playing, resume playback after syncing
                if (isPlaying) {
                    playerA.current?.playVideo();
                }
            }, 2000);
        } else {
            // Standard mode (Start from index 0)
            cueNextTrack("A", 0, 0);
            setTimeout(() => {
                cueNextTrack("B", 1, 0);
                setTrackInfo({ title: "Prayer Realm Broadcast", artist: "Ready to Play", type: "Standby" });
            }, 2000);
        }
    };

    const handleReady = (playerKey: "A" | "B") => {
        isReady.current[playerKey] = true;
        const p = playerKey === "A" ? playerA.current : playerB.current;
        p.setVolume(50);

        if (isReady.current.A && isReady.current.B && !hasStarted.current) {
            hasStarted.current = true;
            syncToGlobalTime();
        }
    };

    const handleError = (e: any, playerKey: string) => {
        console.warn(`[RadioEngine] Video error on player ${playerKey}: code ${e.data}. Skipping track.`);
        // Note: 150 = Video unavailable, 2 = invalid parameter, etc.
        // If an entire playlist is empty, YouTube might just keep looping through errors or getting stuck.
        // By forcefully incrementing the playlist sequence via forceNextTrack, we skip the bad list/video.
        if (activePlayer.current === playerKey) {
            forceNextTrack();
        }
    };

    const handleStateChange = (playerKey: "A" | "B", event: any) => {
        const player = playerKey === "A" ? playerA.current : playerB.current;
        const state = event.data;

        if (playerKey === activePlayer.current) {
            if (state === window.YT.PlayerState.PLAYING) {
                setIsPlaying(true);
                updateTrackInfo(player, SCHEDULE[currentSeqIndex.current].type);
                if (!progressInterval.current) startEngineTimer();
            } else if (state === window.YT.PlayerState.PAUSED) {
                setIsPlaying(false);
            } else if (state === window.YT.PlayerState.ENDED) {
                if (!isTransitioning.current) {
                    performTransition(); // crossfade backup
                }
            }
        }
    };

    const cueNextTrack = (targetPlayerKey: "A" | "B", seqIdx: number, startSeconds: number = 0) => {
        const item = SCHEDULE[seqIdx];
        const p = targetPlayerKey === "A" ? playerA.current : playerB.current;
        const curListIndex = typeIndices.current[item.type];

        p.cuePlaylist({
            list: item.id,
            listType: "playlist",
            index: curListIndex,
            startSeconds: startSeconds
        });
    };

    const updateTrackInfo = (player: any, type: string) => {
        const data = player.getVideoData();
        if (data && data.title !== "") {
            setTrackInfo({ title: data.title, artist: data.author, type });
        }
    };

    const startEngineTimer = () => {
        if (progressInterval.current) clearInterval(progressInterval.current);
        progressInterval.current = setInterval(() => {
            const currentP = activePlayer.current === "A" ? playerA.current : playerB.current;
            if (!currentP || typeof currentP.getCurrentTime !== 'function') return;

            const time = currentP.getCurrentTime();
            const dur = currentP.getDuration();

            // Failsafe cue update
            if (time > 2 && trackInfo.title === "Prayer Realm Broadcast") {
                updateTrackInfo(currentP, SCHEDULE[currentSeqIndex.current].type);
            }

            // Trigger seamless crossfade exactly 4 seconds before the track ends
            if (dur > 15 && dur - time <= 4 && !isTransitioning.current) {
                performTransition();
            }
        }, 500);
    };

    const stopEngine = () => {
        if (progressInterval.current) clearInterval(progressInterval.current);
    };

    const forceNextTrack = () => {
        console.log("[RadioEngine] Forcing Next Track / Recovering from stuck state...");
        // Force cleanup of any stuck transition states
        clearInterval(fadeInInt.current);
        clearInterval(fadeOutInt.current);
        isTransitioning.current = false;
        performTransition();
    };

    const performTransition = () => {
        if (isTransitioning.current) return;
        isTransitioning.current = true;

        const outgoingKey = activePlayer.current;
        const incomingKey = outgoingKey === "A" ? "B" : "A";
        const outgoingP = outgoingKey === "A" ? playerA.current : playerB.current;
        const incomingP = incomingKey === "A" ? playerA.current : playerB.current;

        // Advance Sequence
        const prevItem = SCHEDULE[currentSeqIndex.current];
        typeIndices.current[prevItem.type] += 1; // Increment the sub-index to queue next time

        let nextSeqIdx = currentSeqIndex.current + 1;
        if (nextSeqIdx >= SCHEDULE.length) nextSeqIdx = 0;
        currentSeqIndex.current = nextSeqIdx;
        const nextItem = SCHEDULE[nextSeqIdx];

        // Start incoming player (it was already cued by cueNextTrack earlier)
        if (incomingP.setVolume) incomingP.setVolume(1); // start at very low
        if (incomingP.playVideo) incomingP.playVideo();
        activePlayer.current = incomingKey;
        updateTrackInfo(incomingP, nextItem.type);

        // Perform Crossfade
        let volIn = 1;
        let volOut = isMuted ? 0 : volume;
        const maxVol = isMuted ? 0 : volume;

        fadeInInt.current = setInterval(() => {
            volIn += 5;
            if (volIn >= maxVol) {
                volIn = maxVol;
                clearInterval(fadeInInt.current);
            }
            if (incomingP?.setVolume) incomingP.setVolume(volIn);
        }, 200);

        fadeOutInt.current = setInterval(() => {
            volOut -= 5;
            if (volOut <= 0) {
                volOut = 0;
                clearInterval(fadeOutInt.current);
                if (outgoingP?.pauseVideo) outgoingP.pauseVideo();

                // Now cue the NEXT NEXT track in the outgoing player so it's ready for the next transition
                setTimeout(() => {
                    let futureSeqIdx = nextSeqIdx + 1;
                    if (futureSeqIdx >= SCHEDULE.length) futureSeqIdx = 0;
                    cueNextTrack(outgoingKey, futureSeqIdx);
                    isTransitioning.current = false;
                }, 3000); // give it time to fully stop
            }
            if (outgoingP?.setVolume) outgoingP.setVolume(volOut);
        }, 200);
    };

    const togglePlay = () => {
        const p = activePlayer.current === "A" ? playerA.current : playerB.current;
        if (!p || typeof p.getPlayerState !== 'function') return;

        // Use the React state as the primary source of truth, it's more stable
        if (isPlaying) {
            p.pauseVideo();
            setIsPlaying(false);
        } else {
            p.playVideo();
            setIsPlaying(true);
        }
    };

    const toggleMute = () => {
        const pA = playerA.current;
        const pB = playerB.current;
        const newMuted = !isMuted;

        if (newMuted) {
            if (pA?.mute) pA.mute();
            if (pB?.mute) pB.mute();
        } else {
            if (pA?.unMute) pA.unMute();
            if (pB?.unMute) pB.unMute();
        }
        setIsMuted(newMuted);
    };

    const handleVolumeChange = (newVol: number) => {
        setVolume(newVol);
        const p = activePlayer.current === "A" ? playerA.current : playerB.current;
        if (p?.setVolume) p.setVolume(newVol);
        if (newVol > 0 && isMuted) {
            toggleMute();
        }
    };

    return (
        <RadioContext.Provider value={{
            isPlaying, isMuted, volume, trackInfo,
            togglePlay, toggleMute, handleVolumeChange,
            forceNextTrack, syncToGlobalTime
        }}>
            {children}
            {/* The invisible dual-engine players. Must be technically visible to DOM to load correctly, so using opacity-0 and z-index -100 */}
            <div className="fixed overflow-hidden w-0 h-0 opacity-0 -z-[100] pointer-events-none" aria-hidden="true">
                <div id="radio-player-a"></div>
                <div id="radio-player-b"></div>
            </div>
        </RadioContext.Provider>
    );
};
