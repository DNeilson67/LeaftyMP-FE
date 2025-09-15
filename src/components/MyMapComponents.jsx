import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { Autocomplete } from '@react-google-maps/api';
import Button from "../components/Button"
import InputField from './InputField';
import Search from "@assets/SearchLogo.svg";
import { API_URL } from '../App';
import axios from 'axios';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const indonesiaBounds = {
  north: 6.1,
  south: -11.2,
  west: 95,
  east: 141
};

function MyMapComponent({ langitude, longitude, setShowMap, setAddressDetails, setLatitude, setLongitude }) {
  const [center, setCenter] = useState({ langitude: langitude, longitude: longitude });
  const [markers, setMarkers] = useState([]);
  const [address, setAddress] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Refs for Google Places
  const autocompleteRef = useRef(null);
  const inputRef = useRef(null);

  const onLoad = (autocomplete) => {
    autocompleteRef.current = autocomplete;
    // Set bounds to Indonesia
    autocomplete.setBounds(new window.google.maps.LatLngBounds(
      new window.google.maps.LatLng(indonesiaBounds.south, indonesiaBounds.west),
      new window.google.maps.LatLng(indonesiaBounds.north, indonesiaBounds.east)
    ));
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      
      if (place.geometry) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        
        setCenter({ latitude: lat, longitude: lng });
        setMarkers([{ latitude: lat, longitude: lng }]);
        setLatitude(lat);
        setLongitude(lng);
        setAddress(place.formatted_address);
        setError(null);
      } else {
        setError({
          type: 'error',
          message: 'Please select a valid address from the dropdown'
        });
      }
    }
  };

  useEffect(() => {

    axios.get(`${API_URL}/get_location_user`).then(response => {
      if (response.data) {
        const { latitude, longitude, addressDetails } = response.data;
        setCenter({ latitude, longitude });
        setMarkers([{ latitude, longitude }]);
        setLatitude(latitude);
        setLongitude(longitude);
        setAddress(addressDetails || "");
        setIsLoading(false);
      } else {
        setError("No location data found. Please select a location on the map.");
        setIsLoading(false);
      }
    });

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      position => {
        setCenter({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setIsLoading(false);
      },
      (error) => {
        console.error("Error getting location:", error);
        setError("Could not get your location. Please search or click on the map.");
        // Default to Jakarta coordinates
        setCenter({
          latitude: -6.2088,
          longitude: 106.8456
        });
        setIsLoading(false);
      }
    );
  } else {
    setError("Geolocation is not supported by your browser");
    setIsLoading(false);
  }
}, []);

const handleMapClick = async (event) => {
  try {
    const newCenter = {
      latitude: event.latLng.lat(),
      longitude: event.latLng.lng()
    };
    setCenter(newCenter);
    setMarkers([{ latitude: newCenter.latitude, longitude: newCenter.longitude }]);

    setLatitude(newCenter.latitude);
    setLongitude(newCenter.longitude);

    await updateAddressFromCoordinates(newCenter.latitude, newCenter.longitude);
  } catch (error) {
    console.error("Error handling map click:", error);
    setError("Failed to get address information");
  }
};

const updateAddressFromCoordinates = async (lat, lng) => {
  try {
    setAddress("Address not found");
    setLatitude(lat);
    setLongitude(lng);
    setError({
      type: 'warning',
      message: '⚠️ Address could not be found. You can still save using these coordinates.'
    });

    try {
      const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}`);
      if (!response.ok) return;

      const data = await response.json();
      if (data.results[0]) {
        setAddress(data.results[0].formatted_address);
        setError(null);
      }
    } catch (error) {
      console.error("Error getting address:", error);
      // Keep the warning message since we couldn't get the address
    }
  } catch (error) {
    console.error("Error updating coordinates:", error);
    setError({
      type: 'error',
      message: 'Failed to update location'
    });
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
    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&components=country:ID`);
    if (!response.ok) throw new Error('Failed to search address');

    const data = await response.json();
    if (data.results[0]) {
      const { lat, lng } = data.results[0].geometry.location;
      setCenter({ latitude: lat, longitude: lng });
      setMarkers([{ latitude: lat, longitude: lng }]);
      setLatitude(lat);
      setLongitude(lng);
      setAddress(data.results[0].formatted_address);
      setError(null);
    } else {
      // Default to Jakarta coordinates if address not found
      const defaultLat = -6.2088;
      const defaultLng = 106.8456;
      setCenter({ latitude: defaultLat, longitude: defaultLng });
      setMarkers([{ latitude: defaultLat, longitude: defaultLng }]);
      setLatitude(defaultLat);
      setLongitude(defaultLng);
      setAddress("Address not found");
      setError({
        type: 'warning',
        message: '⚠️ Address not found. Map centered on Jakarta. You can click anywhere on the map to select a location.'
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
  setShowMap(false);
};

// Convert center and markers to {lat, lng} for GoogleMap and Marker components
const googleCenter = center ? { lat: center.latitude, lng: center.longitude } : null;
const googleMarkers = markers.map(marker => ({
  lat: marker.latitude,
  lng: marker.longitude
}));

return (
  <form method="dialog" className="modal-backdrop">
    <button className="btn btn-sm btn-circle absolute right-2 top-2" onClick={() => setShowMap(false)}>✕</button>
    <div className='flex flex-col gap-2 mt-2'>
      <div className="flex gap-2">
        <InputField
          placeholder={"Search for a place"}
          icon={Search}
          className={"text-black flex-1"}
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleSearchAddress())}
        />
        <Button
          background="#0F7275"
          color="#F7FAFC"
          label={"Search"}
          onClick={handleSearchAddress}
          className="w-24"
        />
      </div>

      {error && (
        <div
          className={`px-4 py-2 rounded relative ${error.type === 'warning'
              ? 'bg-yellow-100 border border-yellow-400 text-yellow-700'
              : 'bg-red-100 border border-red-400 text-red-700'
            }`}
          role="alert"
        >
          <span className="block sm:inline">{error.message}</span>
        </div>
      )}

      {isLoading ? (
        <div className="h-[400px] flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#0F7275]"></div>
        </div>
      ) : (
        <LoadScript
          googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
          libraries={['advanced-markers']}
        >
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={googleCenter}
            zoom={10}
            onClick={handleMapClick}
            options={{
              restriction: {
                latLngBounds: indonesiaBounds,
                strictBounds: true
              },
              mapTypeControl: false,
              streetViewControl: false,
              fullscreenControl: false
            }}
          >
            {googleMarkers.map((marker, index) => (
              <Marker key={index} position={marker} />
            ))}
          </GoogleMap>
        </LoadScript>
      )}

      <div className='flex flex-row justify-between gap-2'>
        <Button
          background="#0F7275"
          color="#F7FAFC"
          label={"Save Address"}
          onClick={handleSaveAddress}
          disabled={!address}
        />
        <Button
          background="#cbd5e1"
          color="#1f2937"
          label={"Cancel"}
          onClick={() => setShowMap(false)}
        />
      </div>
    </div>
  </form>
);
}

export default MyMapComponent;
