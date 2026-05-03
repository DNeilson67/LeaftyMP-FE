import React, { useState } from 'react';

const SearchBox = ({ centers, onSelect }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredCenters, setFilteredCenters] = useState([]);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length > 0) {
      const results = centers.filter((center) =>
        center.name.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredCenters(results);
    } else {
      setFilteredCenters([]);
    }
  };

  const handleCenterSelect = (center) => {
    onSelect(center); // Calls the map’s marker click handler
    setSearchQuery(center.name); // Update search box with selected center
    setFilteredCenters([]); // Clear search results
  };

  return (
    <div className="absolute top-2 left-2 z-10 w-80">
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="🔍 Search for a Centra..."
        className="input input-bordered w-full bg-white shadow-md"
      />
      {filteredCenters.length > 0 && (
        <div className="bg-white border border-gray-300 mt-1 max-h-60 overflow-y-auto shadow-xl rounded-lg">
          {filteredCenters.map((center) => (
            <div
              key={center.key}
              onClick={() => handleCenterSelect(center)}
              className="p-3 cursor-pointer hover:bg-[#C0CD30] hover:bg-opacity-20 border-b border-gray-100 last:border-b-0 transition-colors"
            >
              <div className="font-semibold text-gray-800">{center.name}</div>
              {center.location_address && (
                <div className="text-xs text-gray-500 mt-1">{center.location_address}</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>

  );
};

export default SearchBox;
