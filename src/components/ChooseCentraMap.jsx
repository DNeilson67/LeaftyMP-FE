import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import WetLeaves from "@assets/WetLeaves.svg";
import DryLeaves from "@assets/DryLeaves.svg";
import Powder from "@assets/Powder.svg";
import { API_URL } from "../App";
import SearchBox from "./SearchBox";
import LoadingStatic from "./LoadingStatic";

// Fix for default marker icons in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

// Create custom marker icon with original Google Maps colors (#C0CD30 background, #417579 border)
const createCustomIcon = (selected = false) => {
  const svgIcon = `
    <svg width="30" height="45" viewBox="0 0 30 45" xmlns="http://www.w3.org/2000/svg">
      <path d="M15 0C6.716 0 0 6.716 0 15c0 8.284 15 30 15 30s15-21.716 15-30C30 6.716 23.284 0 15 0z" 
            fill="${selected ? '#94C3B3' : '#C0CD30'}" 
            stroke="#417579" 
            stroke-width="2"/>
      <circle cx="15" cy="15" r="6" fill="#417579"/>
    </svg>
  `;
  
  return new L.DivIcon({
    html: svgIcon,
    className: 'custom-marker-icon',
    iconSize: [30, 45],
    iconAnchor: [15, 45],
    popupAnchor: [0, -45]
  });
};

const ChooseCentraMap = ({ product, selectedCentras, setSelectedCentras }) => {
  const [activeCity, setActiveCity] = useState(null); // Tracks the city in the active popup
  const [statistics, setStatistics] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState();
  const [map, setMap] = useState(null);
  const [centraLocations, setCentraLocations] = useState([]);
  const [loadingCentras, setLoadingCentras] = useState(true);
  const [centraError, setCentraError] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  // Fetch centra locations on component mount
  useEffect(() => {
    const fetchCentraLocations = async () => {
      setLoadingCentras(true);
      setCentraError(null);
      try {
        const response = await fetch(`${API_URL}/location/centras`);
        if (!response.ok) {
          throw new Error(`Error: ${response.statusText}`);
        }
        const data = await response.json();
        
        // Transform API data to match the format expected by the component
        const transformedCentras = data.centras.map(centra => ({
          name: centra.username,
          lat: centra.latitude,
          lng: centra.longitude,
          key: centra.centra_id,
          email: centra.email,
          phone_number: centra.phone_number,
          location_address: centra.location_address
        }));
        
        setCentraLocations(transformedCentras);
      } catch (error) {
        console.error('Error fetching centra locations:', error);
        setCentraError(error.message);
      } finally {
        setLoadingCentras(false);
      }
    };

    fetchCentraLocations();
  }, []);

  const fetchStatistics = async (cityKey) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/centra/statistics/${cityKey}`);
      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }
      const data = await response.json();
      setStatistics((prevStats) => ({ ...prevStats, [cityKey]: data }));
      console.log(statistics);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkerClick = (city) => {
    setActiveCity(city); // Set the clicked city as the active popup
    fetchStatistics(city.key);
    
    // Pan map to marker position
    if (map) {
      map.setView([city.lat, city.lng], map.getZoom());
    }
  };

  const handleSelectCity = (city) => {
    if (selectedCentras.some(selected => selected.key === city.key)) {
      setSelectedCentras(selectedCentras.filter(selected => selected.key !== city.key)); // Remove if already selected
    } else {
      setSelectedCentras([...selectedCentras, city]); // Add to selected if not already
    }
  };

  const isCitySelected = (cityKey) => selectedCentras.some(city => city.key === cityKey);

  // Show loading state while fetching centras
  if (loadingCentras) {
    return (
      <div style={{ height: "50vh", width: "100%" }} className="flex items-center justify-center bg-white">
        <LoadingStatic />
      </div>
    );
  }

  // Show error state if centras couldn't be fetched
  if (centraError) {
    return (
      <div style={{ height: "50vh", width: "100%" }} className="flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-red-500 font-semibold">Error loading centra locations</p>
          <p className="text-sm text-gray-600">{centraError}</p>
        </div>
      </div>
    );
  }

  // Show message if no centras available
  if (centraLocations.length === 0) {
    return (
      <div style={{ height: "50vh", width: "100%" }} className="flex items-center justify-center bg-white">
        <div className="text-center">
          <p className="text-gray-600">No centra locations available</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ position: 'relative', display: 'flex' }} className="bg-white">
      {/* Floating Button to Open Selected Centras Modal */}
      {selectedCentras.length > 0 && (
        <div className="absolute right-4 top-4 z-30">
          <button
            onClick={handleOpenModal}
            className="bg-[#417579] hover:bg-[#2d5357] text-white px-4 py-3 rounded-full shadow-lg transition-all duration-200 flex items-center gap-2 relative"
            title="View Selected Centras"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
            </svg>
            <span className="text-sm font-semibold hidden sm:inline">Selected Centras</span>
            {/* Badge */}
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center">
              {selectedCentras.length}
            </span>
          </button>
        </div>
      )}

      {/* DaisyUI Modal for Selected Centras */}
      <dialog id="selected_centras_modal" className={`modal modal-bottom sm:modal-middle ${modalOpen ? 'modal-open' : ''}`}>
        <div className="modal-box max-w-2xl w-full p-0 max-h-[85vh] flex flex-col">
          {/* Modal Header */}
          <div className="bg-[#417579] text-white px-4 sm:px-6 py-4 flex items-center justify-between sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
              <div>
                <h2 className="font-semibold text-base sm:text-lg">Selected Centras</h2>
                <p className="text-xs opacity-90">{selectedCentras.length} centra(s) selected</p>
              </div>
            </div>
            <button 
              onClick={handleCloseModal}
              className="btn btn-sm btn-circle btn-ghost text-white hover:bg-white/20"
            >
              ✕
            </button>
          </div>
          
          {/* Scrollable List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6">
            {selectedCentras.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No centras selected yet
              </div>
            ) : (
              <div className="space-y-3">
                {selectedCentras.map((city, index) => (
                  <div 
                    key={city.key}
                    className="p-3 sm:p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-all duration-200 animate-fadeIn"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="badge bg-[#94C3B3] text-white border-none px-2.5 py-3 text-xs font-bold">
                            {index + 1}
                          </span>
                          <span className="font-semibold text-gray-800 text-sm sm:text-base">{city.name}</span>
                        </div>
                        {city.location_address && (
                          <div className="text-xs sm:text-sm text-gray-600 ml-8">
                            📍 {city.location_address}
                          </div>
                        )}
                        {city.email && (
                          <div className="text-xs text-gray-500 ml-8 mt-1">
                            ✉️ {city.email}
                          </div>
                        )}
                      </div>
                      <button 
                        onClick={() => handleSelectCity(city)}
                        className="btn btn-sm btn-ghost text-red-500 hover:bg-red-50 hover:text-red-600"
                        title="Remove centra"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Modal Footer */}
          <div className="bg-gray-50 px-4 sm:px-6 py-3 border-t border-gray-200 flex justify-end sticky bottom-0">
            <button
              onClick={handleCloseModal}
              className="btn bg-[#417579] hover:bg-[#2d5357] text-white border-none px-6 normal-case"
            >
              Close
            </button>
          </div>
        </div>
        {/* Modal backdrop */}
        <form method="dialog" className="modal-backdrop">
          <button onClick={handleCloseModal}>close</button>
        </form>
      </dialog>

      <SearchBox centers={centraLocations} onSelect={handleMarkerClick} />

      <div className={"z-10"}style={{ height: "50vh", width: "100%" }}>
        <MapContainer
          center={[-2.548926, 118.0148634]}
          zoom={5}
          style={{ height: "100%", width: "100%" }}
          maxBounds={[
            // [7.5, 95],    // Northwest corner
            // [-11, 141]    // Southeast corner
          ]}
          maxBoundsViscosity={1.0}
          minZoom={2}
          ref={setMap}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          
          {centraLocations.map((city) => (
            <Marker
              key={city.key}
              position={[city.lat, city.lng]}
              icon={createCustomIcon(isCitySelected(city.key))}
              eventHandlers={{
                click: () => handleMarkerClick(city),
              }}
            >
              <Popup>
                <div className="font-bold text-md mb-2 px-12">{city.name}</div>
                <div style={{ color: 'black' }} className="grid grid-cols-1 gap-2">
                  {activeCity?.key === city.key && (
                    <>
                      {error ? (
                        <div>Error: {error}</div>
                      ) : loading ? (
                        <LoadingStatic />
                      ) : (
                        <>
                          {product === "Wet Leaves" && (
                            <div className="flex flex-row gap-2">
                              <img src={WetLeaves} alt="Wet Leaves" />
                              <div className="flex flex-col">
                                <span>Wet Leaves</span>
                                <span className="font-bold">{statistics[city.key]?.sum_wet_leaves ? (statistics[city.key]?.sum_wet_leaves).toLocaleString() : 'N/A'} Kg</span>
                              </div>
                            </div>
                          )}
                          {product === "Dry Leaves" && (
                            <div className="flex flex-row gap-2">
                              <img src={DryLeaves} alt="Dry Leaves" />
                              <div className="flex flex-col">
                                <span>Dry Leaves</span>
                                <span className="font-bold">{statistics[city.key]?.sum_dry_leaves ? (statistics[city.key]?.sum_dry_leaves).toLocaleString() : 'N/A'} Kg</span>
                              </div>
                            </div>
                          )}
                          {product === "Powder" && (
                            <div className="flex flex-row gap-2">
                              <img src={Powder} alt="Powder" />
                              <div className="flex flex-col">
                                <span>Powder</span>
                                <span className="font-bold">{statistics[city.key]?.sum_powder ? (statistics[city.key]?.sum_powder).toLocaleString() : 'N/A'} Kg</span>
                              </div>
                            </div>
                          )}
                        </>
                      )}
                      <button
                        onClick={() => handleSelectCity(city)}
                        className={`mt-2 px-4 py-2 font-semibold rounded ${isCitySelected(city.key) ? "bg-[#94C3B3] text-white" : "bg-[#E8E8E8] text-black"
                          }`}
                      >
                        {isCitySelected(city.key) ? "Selected" : "Select"}
                      </button>
                    </>
                  )}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default ChooseCentraMap;
