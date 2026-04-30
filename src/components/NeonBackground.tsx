import React from 'react';

export default function NeonBackground() {
  return (
    <div className="fixed inset-0 z-[-1] bg-[#020202] overflow-hidden">
      {/* Brutalist Grid */}
      <div className="absolute inset-0">
        <div 
          className="absolute inset-0 h-full w-full opacity-20"
          style={{
            backgroundImage: `linear-gradient(rgba(0, 243, 255, 0.4) 2px, transparent 2px), linear-gradient(90deg, rgba(0, 243, 255, 0.4) 2px, transparent 2px)`,
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      {/* Screen Tearing Artifacts */}
      <div className="absolute top-1/4 left-0 w-full h-[2px] bg-magenta-500/30 animate-tear opacity-50" />
      <div className="absolute top-3/4 left-0 w-full h-[1px] bg-cyan-500/30 animate-tear opacity-50 [animation-delay:1.5s]" />
      
      {/* Static Noise */}
      <div className="absolute inset-0 opacity-[0.08] pointer-events-none mix-blend-screen overflow-hidden">
        <div className="absolute inset-[-100%] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] animate-[noise_0.2s_steps(2)_infinite]" />
      </div>

      {/* Heavy Scanlines */}
      <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_2px]" />
      
      <style>{`
        @keyframes noise {
          0% { transform: translate(0, 0); }
          10% { transform: translate(-5%, -5%); }
          20% { transform: translate(-10%, 5%); }
          30% { transform: translate(5%, -10%); }
          40% { transform: translate(-5%, 15%); }
          50% { transform: translate(-10%, 5%); }
          60% { transform: translate(15%, 0); }
          70% { transform: translate(0, 10%); }
          80% { transform: translate(-15%, 0); }
          90% { transform: translate(10%, 5%); }
          100% { transform: translate(5%, 0); }
        }
      `}</style>
    </div>
  );
}
