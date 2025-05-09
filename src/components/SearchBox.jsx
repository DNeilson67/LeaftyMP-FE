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
    <div className="absolute top-2 left-2 z-10">
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearchChange}
        placeholder="Search for a Centra..."
        className="input input-bordered"
      />
      {filteredCenters.length > 0 && (
        <div className="bg-white border border-gray-200 mt-2 max-h-52 overflow-y-auto shadow-lg rounded-lg">
          {filteredCenters.map((center) => (
            <div
              key={center.key}
              onClick={() => handleCenterSelect(center)}
              className="p-2 cursor-pointer hover:bg-gray-100"
            >
              {center.name}
            </div>
          ))}
        </div>
      )}
    </div>

  );
};

export default SearchBox;
