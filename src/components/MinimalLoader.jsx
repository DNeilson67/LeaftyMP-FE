// MinimalLoader.jsx - A subtle loader for page transitions
import React from 'react';

function MinimalLoader() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-1 bg-transparent">
      <div className="h-full bg-gradient-to-r from-[#94C3B3] via-[#0F7275] to-[#94C3B3] animate-pulse" 
           style={{ 
             width: '30%',
             animation: 'slide 1s ease-in-out infinite',
           }}>
      </div>
      <style>{`
        @keyframes slide {
          0% { margin-left: 0%; }
          50% { margin-left: 70%; }
          100% { margin-left: 0%; }
        }
      `}</style>
    </div>
  );
}

export default MinimalLoader;
