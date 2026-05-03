// MarketplaceLoader.jsx - Loading spinner for marketplace page transitions
import React from 'react';

function MarketplaceLoader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 border-4 border-[#e5f3f0] rounded-full"></div>
          <div className="absolute inset-0 border-4 border-[#0F7275] border-t-transparent rounded-full animate-spin"></div>
        </div>
        
        {/* Loading text */}
        <p className="text-[#417679] text-sm font-medium animate-pulse">
          Loading...
        </p>
      </div>
    </div>
  );
}

export default MarketplaceLoader;
