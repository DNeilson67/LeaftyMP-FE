import React from 'react';
import Centra from "@assets/centra.svg";

const OverlappingAvatars = ({ centras, maxDisplay = 3 }) => {
  const displayCentras = centras.slice(0, maxDisplay);
  const remainingCount = Math.max(0, centras.length - maxDisplay);

  // Colors for different avatars
  const colors = ['#C0CD30', '#79B2B7', '#94C3B3', '#0F7275', '#A0C2B5'];

  return (
    <div className="flex items-center">
      {/* Overlapping Avatars */}
      <div className="flex -space-x-2">
        {displayCentras.map((centra, index) => (
          <div
            key={centra.SubTransactionID}
            className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center relative z-10"
            style={{ 
              backgroundColor: colors[index % colors.length],
              zIndex: displayCentras.length - index 
            }}
            title={centra.CentraUsername}
          >
            <img src={Centra} className="w-6 h-6" alt="Centra Icon" />
          </div>
        ))}
        
        {/* Show +X if there are more centras */}
        {remainingCount > 0 && (
          <div
            className="w-10 h-10 rounded-full border-2 border-white bg-gray-400 text-white text-xs font-bold flex items-center justify-center relative"
            style={{ zIndex: 0 }}
          >
            +{remainingCount}
          </div>
        )}
      </div>
      
      {/* Centras text */}
      <div className="ml-3">
        <span className="font-semibold text-xl">
          {centras.length === 1 
            ? centras[0].CentraUsername 
            : `${centras.length} centras`
          }
        </span>
      </div>
    </div>
  );
};

export default OverlappingAvatars;