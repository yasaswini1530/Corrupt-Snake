import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, Music, Volume2 } from 'lucide-react';

interface Track {
  id: string;
  title: string;
  artist: string;
  duration: number;
  color: string;
}

const DUMMY_TRACKS: Track[] = [
  { id: '1', title: 'Neon Pulse', artist: 'Zenith.AI', duration: 145, color: '#00f3ff' },
  { id: '2', title: 'Cyber Drift', artist: 'Flux Core', duration: 182, color: '#ff00ff' },
  { id: '3', title: 'Synth Protocol', artist: 'Neural Network', duration: 160, color: '#00ff00' },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const track = DUMMY_TRACKS[currentTrackIndex];

  useEffect(() => {
    let interval: number;
    if (isPlaying) {
      interval = window.setInterval(() => {
        setProgress((prev) => {
          if (prev >= track.duration) {
            handleNext();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, track.duration, currentTrackIndex]);

  const handleNext = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const handlePrev = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setProgress(0);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="w-full max-w-2xl bg-black border-4 border-magenta-500 p-6 relative overflow-hidden">
      {/* Glitch Overlay */}
      <div className="absolute top-0 left-0 w-full h-full bg-cyan-500/5 pointer-events-none animate-tear" />
      
      <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
        {/* Diagnostic Art */}
        <div className="w-32 h-32 border-4 border-white flex items-center justify-center bg-[#111] shrink-0 relative">
          <div className="text-magenta-500 font-mono text-[10px] absolute top-1 left-1">_ART_DUMP</div>
          <Music className="w-16 h-16 text-cyan-400 chromatic-aberration animate-pulse" />
          {isPlaying && (
            <div className="absolute inset-0 flex items-center justify-around px-2">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  animate={{ height: [10, 40, 10] }}
                  transition={{ duration: 0.3, repeat: Infinity, delay: i * 0.05 }}
                  className="w-2 bg-white"
                />
              ))}
            </div>
          )}
        </div>

        {/* Channel Info */}
        <div className="flex-1 min-w-0 w-full">
          <div className="flex items-center justify-between mb-2">
             <span className="text-xs bg-white text-black px-2 py-0.5 uppercase font-bold">Channel_0{track.id}</span>
             <span className="text-xs border border-white text-white px-2 py-0.5 uppercase font-mono">Bit_Rate: 1411_KBPS</span>
          </div>
          
          <motion.h3 
            key={track.title}
            className="text-white font-black text-4xl truncate uppercase italic tracking-tighter glitch-text"
          >
            {track.title}
          </motion.h3>
          <motion.p 
            key={track.artist}
            className="text-cyan-400 text-sm font-mono uppercase tracking-[0.3em]"
          >
            S_PROX: {track.artist}
          </motion.p>

          {/* Machine Controls */}
          <div className="flex items-center gap-4 mt-6">
            <button 
              onClick={handlePrev}
              className="w-12 h-12 bg-white text-black flex items-center justify-center hover:bg-magenta-500 hover:text-white transition-colors"
            >
              <SkipBack size={24} strokeWidth={3} />
            </button>
            <button 
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex-1 h-12 bg-magenta-500 text-black flex items-center justify-center gap-2 font-black uppercase text-xl hover:bg-cyan-400 transition-colors"
            >
              {isPlaying ? <Pause strokeWidth={3} /> : <Play fill="currentColor" strokeWidth={3} />}
              <span>{isPlaying ? 'PAUSE_BIT' : 'EXECUTE_AUDIO'}</span>
            </button>
            <button 
              onClick={handleNext}
              className="w-12 h-12 bg-white text-black flex items-center justify-center hover:bg-magenta-500 hover:text-white transition-colors"
            >
              <SkipForward size={24} strokeWidth={3} />
            </button>
          </div>
        </div>
      </div>

      {/* Bit Stream Progress */}
      <div className="mt-8 border-2 border-white bg-black h-4 relative overflow-hidden">
        <motion.div 
          className="absolute left-0 top-0 bottom-0 bg-cyan-500"
          initial={false}
          animate={{ width: `${(progress / track.duration) * 100}%` }}
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-[10px] text-white font-mono mix-blend-difference uppercase">streaming_binary_data... {Math.floor((progress / track.duration) * 100)}%</div>
        </div>
      </div>
      <div className="flex justify-between mt-1 font-mono text-[10px] text-white/50 uppercase italic">
        <span>STRT_{formatTime(progress)}</span>
        <span>TERM_{formatTime(track.duration)}</span>
      </div>
    </div>
  );
}
