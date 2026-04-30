import React, { useState } from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import NeonBackground from './components/NeonBackground';
import { motion } from 'motion/react';
import { Trophy, Activity, Terminal } from 'lucide-react';

export default function App() {
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(true);

  return (
    <div className="min-h-screen text-white font-digital selection:bg-magenta-500/50 cursor-crosshair">
      <NeonBackground />
      
      <main className="container mx-auto px-4 py-8 min-h-screen flex flex-col items-center justify-between gap-8 relative">
        
        {/* Machine Status Bar */}
        <header className="w-full max-w-5xl flex flex-col md:flex-row items-center justify-between gap-4 p-4 border-2 border-cyan-500 bg-black relative group">
          {/* Glitch overlays for header */}
          <div className="absolute inset-0 bg-magenta-500/5 opacity-0 group-hover:opacity-100 animate-tear pointer-events-none" />
          
          <div className="flex items-center gap-4 relative">
            <div className="w-12 h-12 bg-cyan-500 flex items-center justify-center text-black">
              <Terminal size={28} strokeWidth={3} />
            </div>
            <div>
              <h1 className="text-3xl font-black uppercase italic tracking-tighter text-cyan-400 leading-none glitch-text">
                CORRUPT_SNAKE.EXE
              </h1>
              <p className="text-xs text-magenta-400 font-mono mt-1 animate-pulse">
                _ROOT_ACCESS_GRANTED // UID: {Math.random().toString(16).slice(2, 8).toUpperCase()}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-8">
            <div className="flex flex-col items-end">
              <span className="text-xs text-white/40 uppercase tracking-widest font-bold font-mono">_ACCUMULATED_DATA</span>
              <div className="flex items-center gap-3">
                <span className="text-6xl text-magenta-500 leading-none glitch-text chromatic-aberration">
                  {score.toString().padStart(5, '0')}
                </span>
              </div>
            </div>
            
            <button 
              onClick={() => setIsPaused(!isPaused)}
              className={`h-16 px-10 border-4 font-black uppercase text-xl transition-all relative overflow-hidden ${
                isPaused 
                ? 'border-cyan-500 bg-cyan-500 text-black hover:bg-white hover:border-white animate-pulse' 
                : 'border-magenta-500 bg-black text-magenta-500 hover:bg-magenta-500 hover:text-black'
              }`}
            >
              {isPaused ? 'BOOT_SEQUENCE' : 'HALT_EXECUTION'}
            </button>
          </div>
        </header>

        {/* Neural Grid */}
        <div className="flex-1 flex items-center justify-center w-full">
          <div className="glitch-border bg-black p-1 relative">
            <SnakeGame 
              onScoreChange={setScore} 
              isPaused={isPaused} 
            />
            
            {/* Crude UI Tags */}
            <div className="absolute -top-6 left-0 text-[10px] font-mono text-cyan-400/50">GRID_COORD: 20x20_BIT</div>
            <div className="absolute -bottom-6 right-0 text-[10px] font-mono text-magenta-400/50">MEM_DUMP: {score * 128}KB</div>
          </div>
        </div>

        {/* Audio Protocol */}
        <footer className="w-full flex justify-center pb-8">
          <MusicPlayer />
        </footer>

        {/* System Logs */}
        <div className="fixed bottom-4 left-4 flex flex-col gap-0.5 pointer-events-none opacity-40 font-mono text-[8px] uppercase">
            <div className="bg-cyan-500 text-black px-1">SYS: OVERHEAT_WARNING</div>
            <div className="bg-magenta-500 text-white px-1">NET: ENCRYPTED_12%</div>
            <div className="bg-white text-black px-1">DEV: AI_NODE_ID_09</div>
        </div>

      </main>
    </div>
  );
}
