import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents, useMap } from 'react-leaflet';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import Button from "../components/Button";
import InputField from './InputField';
import Search from "@assets/SearchLogo.svg";
import { API_URL } from '../App';
import axios from 'axios';

// Fix for default marker icons in React-Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import LoadingStatic from './LoadingStatic';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

L.Marker.prototype.options.icon = DefaultIcon;

const indonesiaBounds = {
  north: 6.1,
  south: -11.2,
  west: 95,
  east: 141
};

// Helper function to format address details like Google Maps
const formatAddressDetails = (addressData) => {
  const address = addressData.address || {};
  const parts = [];
  
  // Street address
  if (address.road) {
    const street = address.house_number 
      ? `${address.road} No. ${address.house_number}` 
      : address.road;
    parts.push(street);
  } else if (address.hamlet || address.neighbourhood) {
    parts.push(address.hamlet || address.neighbourhood);
  }
  
  // District/Suburb
  if (address.suburb || address.residential || address.quarter) {
    parts.push(address.suburb || address.residential || address.quarter);
  }
  
  // City/Town/Village
  const city = address.city || address.town || address.village || address.municipality;
  if (city) {
    parts.push(city);
  }
  
  // District (Kecamatan in Indonesia)
  if (address.county && !city) {
    parts.push(address.county);
  }
  
  // State/Province
  if (address.state) {
    parts.push(address.state);
  }
  
  // Postal code
  if (address.postcode) {
    parts.push(address.postcode);
  }
  
  // Country
  if (address.country && parts.length < 3) {
    parts.push(address.country);
  }
  
  return parts.filter(Boolean).join(', ');
};

// Get icon based on location type
const getAddressIcon = (type, addressData) => {
  const address = addressData?.address || {};
  
  if (address.house_number || type === 'house') return '🏠';
  if (address.building || type === 'building') return '🏢';
  if (type === 'road' || type === 'street') return '🛣️';
  if (type === 'city') return '🏙️';
  if (type === 'town') return '🏘️';
  if (type === 'village') return '🏡';
  if (address.suburb) return '🏘️';
  if (type === 'administrative') return '🏛️';
  return '📍';
};

// Get short address for primary display
const getShortAddress = (addressData) => {
  const address = addressData?.address || {};
  
  let primary = '';
  if (address.road) {
    primary = address.house_number 
      ? `${address.road} ${address.house_number}` 
      : address.road;
  } else if (address.hamlet) {
    primary = address.hamlet;
  } else if (address.suburb) {
    primary = address.suburb;
  } else if (address.neighbourhood) {
    primary = address.neighbourhood;
  } else {
    primary = address.village || address.town || address.city || 'Location';
  }
  
  return primary;
};

// Get secondary address details
const getSecondaryAddress = (addressData) => {
  const address = addressData?.address || {};
  const parts = [];
  
  // Add suburb if not already in primary
  if (address.road && address.suburb) {
    parts.push(address.suburb);
  }
  
  // Add city/town
  const city = address.city || address.town || address.village;
  if (city && !parts.includes(city)) {
    parts.push(city);
  }
  
  // Add state
  if (address.state) {
    parts.push(address.state);
  }
  
  // Add postal code
  if (address.postcode) {
    parts.push(address.postcode);
  }
  
  return parts.filter(Boolean).join(', ') || 'Indonesia';
};

// Component to handle map clicks and provide map instance
function MapClickHandler({ onMapClick, onMapReady }) {
  const map = useMap();
  
  useEffect(() => {
    if (onMapReady) {
      onMapReady(map);
    }
  }, [map, onMapReady]);

  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });
  return null;
}

function OpenStreetMapComponent({ langitude, longitude, setShowMap, setAddressDetails, setLatitude, setLongitude, isEdit = false, onConfirm }) {
  const [center, setCenter] = useState({ lat: longitude || -6.2088, lng: langitude || 106.8456 });
  const [marker, setMarker] = useState(longitude && langitude ? { lat: longitude, lng: langitude } : null);
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchSuggestions, setSearchSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const mapInstanceRef = useRef(null);
  const searchProvider = useRef(new OpenStreetMapProvider());
  const lastRequestTime = useRef(0);
  const searchTimeoutRef = useRef(null);

  const handleMapReady = (mapInstance) => {
    mapInstanceRef.current = mapInstance;
  };

  useEffect(() => {
    // If editing existing location, try to get user's saved location
    if (isEdit) {
      axios.get(`${API_URL}/get_location_user`, { withCredentials: true })
        .then(response => {
          if (response.data) {
            const { latitude, longitude, location_address } = response.data;
            const newCenter = { lat: latitude, lng: longitude };
            setCenter(newCenter);
            setMarker(newCenter);
            setLatitude(latitude);
            setLongitude(longitude);
            setAddress(location_address || "");
            setIsLoading(false);
            
            // Fly to the location if map is ready
            if (mapInstanceRef.current) {
              mapInstanceRef.current.flyTo([latitude, longitude], 13);
            }
          } else {
            getCurrentLocation();
          }
        })
        .catch(error => {
          console.error("Error fetching saved location:", error);
          getCurrentLocation();
        });
    } else {
      // For new registration, just try to get current location
      getCurrentLocation();
    }
  }, [isEdit]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const newCenter = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          setCenter(newCenter);
          setMarker(newCenter);
          updateAddressFromCoordinates(position.coords.latitude, position.coords.longitude);
          setIsLoading(false);
        },
        (error) => {
          console.error("Error getting location:", error);
          setError({
            type: 'info',
            message: '📍 Click on the map or search for your location to get started!'
          });
          // Default to Jakarta coordinates
          setCenter({ lat: -6.2088, lng: 106.8456 });
          setIsLoading(false);
        }
      );
    } else {
      setError({
        type: 'error',
        message: 'Geolocation is not supported by your browser'
      });
      setCenter({ lat: -6.2088, lng: 106.8456 });
      setIsLoading(false);
    }
  };

  const handleMapClick = async (latlng) => {
    try {
      setMarker(latlng);
      setLatitude(latlng.lat);
      setLongitude(latlng.lng);
      await updateAddressFromCoordinates(latlng.lat, latlng.lng);
      
      // Move map to clicked location
      if (mapInstanceRef.current) {
        mapInstanceRef.current.flyTo([latlng.lat, latlng.lng], mapInstanceRef.current.getZoom());
      }
    } catch (error) {
      console.error("Error handling map click:", error);
      setError({
        type: 'error',
        message: 'Failed to get address information'
      });
    }
  };

  const updateAddressFromCoordinates = async (lat, lng) => {
    try {
      // Respect rate limiting (1 request per second)
      const now = Date.now();
      const timeSinceLastRequest = now - lastRequestTime.current;
      if (timeSinceLastRequest < 1000) {
        await new Promise(resolve => setTimeout(resolve, 1000 - timeSinceLastRequest));
      }
      lastRequestTime.current = Date.now();

      // Use backend proxy endpoint to avoid CORS issues
      const response = await axios.get(
        `${API_URL}/geocode/reverse`,
        {
          params: {
            lat: lat,
            lon: lng
          },
          withCredentials: true
        }
      );
      
      if (response.data && response.data.address) {
        // Use formatted address instead of display_name for better structure
        const formattedAddress = formatAddressDetails(response.data);
        setAddress(formattedAddress || response.data.display_name);
        setError(null);
      } else {
        const genericAddress = `Location: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
        setAddress(genericAddress);
        setError({
          type: 'info',
          message: '📍 Using coordinates. You can manually edit the address if needed.'
        });
      }
    } catch (error) {
      console.error("Error getting address:", error);
      // Fallback to coordinates if geocoding fails
      const genericAddress = `Location: ${lat.toFixed(6)}, ${lng.toFixed(6)}`;
      setAddress(genericAddress);
      setError({
        type: 'info',
        message: '📍 Could not fetch address details. Using coordinates instead. You can manually edit if needed.'
      });
    }
  };

  const handleSearchInputChange = (e) => {
    const value = e.target.value;
    setAddress(value);

    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Clear suggestions immediately if input is too short
    if (value.trim().length <= 2) {
      setSearchSuggestions([]);
      setShowSuggestions(false);
      setIsSearching(false);
      return;
    }

    // Show loading state
    setIsSearching(true);

    // Debounce: Wait 500ms after user stops typing before making API call
    searchTimeoutRef.current = setTimeout(async () => {
      try {
        // Use backend proxy to avoid CORS issues
        const response = await axios.get(
          `${API_URL}/geocode/search`,
          {
            params: {
              q: value,
              limit: 10
            },
            withCredentials: true
          }
        );
        
        if (response.data && response.data.length > 0) {
          // Format results with more complete address information
          const formattedResults = response.data.map(item => ({
            display_name: item.display_name,
            address: item.address,
            lat: parseFloat(item.lat),
            lng: parseFloat(item.lon),
            type: item.type,
            osm_type: item.osm_type,
            importance: item.importance,
            // Pre-format for display
            primaryAddress: getShortAddress(item),
            secondaryAddress: getSecondaryAddress(item),
            fullAddress: formatAddressDetails(item),
            icon: getAddressIcon(item.type, item)
          }));
          
          // Sort by importance/relevance
          formattedResults.sort((a, b) => (b.importance || 0) - (a.importance || 0));
          
          setSearchSuggestions(formattedResults);
          setShowSuggestions(true);
          setIsSearching(false);
        } else {
          setSearchSuggestions([]);
          setShowSuggestions(false);
          setIsSearching(false);
        }
      } catch (error) {
        console.error("Error searching:", error);
        if (error.response?.status === 504) {
          setError({
            type: 'warning',
            message: '⚠️ Search timeout. Please try again or be more specific.'
          });
        }
        setSearchSuggestions([]);
        setShowSuggestions(false);
        setIsSearching(false);
      }
    }, 500); // Wait 500ms after user stops typing
  };

  const handleSelectSuggestion = (suggestion) => {
    const lat = suggestion.lat;
    const lng = suggestion.lng;
    
    setCenter({ lat, lng });
    setMarker({ lat, lng });
    setLatitude(lat);
    setLongitude(lng);
    setAddress(suggestion.fullAddress || suggestion.display_name);
    setShowSuggestions(false);
    setError(null);

    // Fly to selected location with closer zoom
    if (mapInstanceRef.current) {
      mapInstanceRef.current.flyTo([lat, lng], 16);
    }
  };

  const handleSearchAddress = async () => {
    if (!address.trim()) {
      setError({
        type: 'error',
        message: 'Please enter an address to search'
      });
      return;
    }

    try {
      // Use backend proxy to avoid CORS issues
      const response = await axios.get(
        `${API_URL}/geocode/search`,
        {
          params: {
            q: address,
            limit: 1
          },
          withCredentials: true
        }
      );
      
      if (response.data && response.data.length > 0) {
        const result = response.data[0];
        const lat = parseFloat(result.lat);
        const lng = parseFloat(result.lon);
        
        setCenter({ lat, lng });
        setMarker({ lat, lng });
        setLatitude(lat);
        setLongitude(lng);
        setAddress(result.display_name);
        setError(null);
        setShowSuggestions(false);

        // Fly to searched location
        if (mapInstanceRef.current) {
          mapInstanceRef.current.flyTo([lat, lng], 15);
        }
      } else {
        setError({
          type: 'warning',
          message: '⚠️ Address not found. Please try a different search or click on the map to select a location.'
        });
      }
    } catch (error) {
      console.error("Error searching address:", error);
      setError({
        type: 'error',
        message: 'Failed to search for address. Please try again or click on the map to select a location.'
      });
    }
  };

  const handleSaveAddress = () => {
    setAddressDetails(address);
    setLatitude(marker.lat);
    setLongitude(marker.lng);
    
    // Call the onConfirm callback with current values if provided
    if (onConfirm) {
      onConfirm({
        latitude: marker.lat,
        longitude: marker.lng,
        addressDetails: address
      });
    }
    // Close the dialog using DaisyUI method
    const dialog = document.querySelector('dialog[open]');
    if (dialog) {
      dialog.close();
    }
  };

  return (
    <>
      <form method="dialog">
        <button 
          className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 z-[1000] bg-white hover:bg-gray-100"
        >
          ✕
        </button>
      </form>
      
      <div className='flex flex-col gap-3 mt-2 relative p-4 h-full'>

        {/* Search Bar */}
        <div className="relative">
          <InputField
            placeholder={"Search for a place in Indonesia"}
            icon={Search}
            className={"text-black"}
            value={address}
            onChange={handleSearchInputChange}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSearchAddress();
                setShowSuggestions(false);
              }
            }}
            onFocus={() => searchSuggestions.length > 0 && setShowSuggestions(true)}
          />
          
          {/* Loading indicator */}
          {isSearching && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 z-[1001]">
              <LoadingStatic size='24px' />
            </div>
          )}
          
          {/* Search Suggestions Dropdown - Google Maps Style */}
          {showSuggestions && searchSuggestions.length > 0 && (
              <div className="absolute z-[1000] w-full bg-white border border-gray-300 rounded-md shadow-xl mt-1 max-h-80 overflow-y-auto">
                {searchSuggestions.map((suggestion, index) => (
                  <div
                    key={index}
                    className="px-4 py-3 hover:bg-teal-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                    onClick={() => handleSelectSuggestion(suggestion)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-1 min-w-0">
                        {/* Main address */}
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {suggestion.address?.road || suggestion.address?.hamlet || suggestion.address?.village || suggestion.address?.suburb || 'Location'}
                          {suggestion.address?.house_number && ` ${suggestion.address.house_number}`}
                        </div>
                        {/* Secondary address info */}
                        <div className="text-xs text-gray-600 mt-0.5 line-clamp-2">
                          {[
                            suggestion.address?.suburb,
                            suggestion.address?.city || suggestion.address?.town || suggestion.address?.village,
                            suggestion.address?.state,
                            suggestion.address?.postcode
                          ].filter(Boolean).join(', ')}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
        </div>

        {error && (
          <div
            className={`px-4 py-3 rounded-lg relative shadow-sm ${
              error.type === 'warning'
                ? 'bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800'
                : error.type === 'info'
                ? 'bg-blue-50 border-l-4 border-blue-400 text-blue-800'
                : 'bg-red-50 border-l-4 border-red-400 text-red-800'
            }`}
            role="alert"
          >
            <span className="block sm:inline text-sm font-medium">{error.message}</span>
          </div>
        )}

        {/* Helpful instruction banner when no marker is placed */}
        {!marker && !error && (
          <div className="bg-gradient-to-r from-teal-50 to-cyan-50 border border-teal-200 rounded-lg px-4 py-3 shadow-sm">
            <div className="flex items-start gap-3">
              <span className="text-2xl">🗺️</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-teal-800">Quick Tips:</p>
                <ul className="text-xs text-teal-700 mt-1 space-y-1 list-disc list-inside">
                  <li>Type your address in the search box above</li>
                  <li>Or simply click anywhere on the map</li>
                  <li>You can edit the address manually before saving</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="h-[400px] flex flex-col items-center justify-center bg-gray-50 rounded-lg">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F7275]"></div>
            <p className="mt-3 text-sm text-gray-600">Loading map...</p>
          </div>
        ) : (
          <div style={{ width: '100%', height:'100%', position: 'relative', zIndex: 1 }} className="rounded-lg overflow-hidden shadow-lg border-2 border-gray-200">
            <MapContainer
              center={[center.lat, center.lng]}
              zoom={10}
              style={{ height: '100%', width: '100%' }}
              maxBounds={[
                [indonesiaBounds.south, indonesiaBounds.west],
                [indonesiaBounds.north, indonesiaBounds.east]
              ]}
              minZoom={5}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              <MapClickHandler onMapClick={handleMapClick} onMapReady={handleMapReady} />
              {marker && (
                <Marker position={[marker.lat, marker.lng]}>
                  <Popup>
                    <div className="text-sm p-2">
                      <p className="font-bold text-teal-700 flex items-center gap-2">
                        <span>📍</span>
                        <span>Selected Location</span>
                      </p>
                      <p className="text-xs text-gray-600 mt-2 leading-relaxed">
                        {address || `Coordinates: ${marker.lat.toFixed(6)}, ${marker.lng.toFixed(6)}`}
                      </p>
                      <div className="mt-2 pt-2 border-t border-gray-200">
                        <p className="text-xs text-gray-500 italic">
                          Click "Save Address" to confirm
                        </p>
                      </div>
                    </div>
                  </Popup>
                </Marker>
              )}
            </MapContainer>
          </div>
        )}

        {/* Action Buttons */}
        <div className='flex flex-row gap-3 mt-2 w-full'>
          <Button
            background={marker ? "#0F7275" : "#94a3b8"}
            color="#F7FAFC"
            label={marker ? "Save Address" : "Select Location First"}
            onClick={handleSaveAddress}
            disabled={!marker}
            type="button"
            noMax={true}
            className="w-3/4 font-semibold shadow-md hover:shadow-lg transition-shadow"
          />
          <Button
            background="#e2e8f0"
            color="#475569"
            label="Cancel"
            noMax={true}
            onClick={() => {
              const dialog = document.querySelector('dialog[open]');
              if (dialog) {
                dialog.close();
              }
              if (setShowMap) {
                setShowMap(false);
              }
            }}
            type="button"
            className="w-1/4 font-semibold hover:bg-gray-300 transition-colors"
          />
        </div>
      </div>
    </>
  );
}

export default OpenStreetMapComponent;
