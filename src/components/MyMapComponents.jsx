import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import Button from "../components/Button"
import InputField from './InputField';
import Search from "@assets/SearchLogo.svg";
import SearchBox from './SearchBox';

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

function MyMapComponent({ setShowMap, setAddressDetails, setLatitude, setLongitude }) {
  const [center, setCenter] = useState(null);
  const [markers, setMarkers] = useState([]);
  const [address, setAddress] = useState("");
  // const [latitude, setLatitude] = useState(null);
  // const [longitude, setLongitude] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        () => console.log("Geolocation is not supported by this browser."),
      );
    }
  }, []);

  const handleMapClick = async (event) => {
    const newCenter = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng()
    };
    setCenter(newCenter);
    setMarkers([{ lat: newCenter.lat, lng: newCenter.lng }]); // Reset markers to only include the new one

    setLatitude(newCenter.lat);
    setLongitude(newCenter.lng);

    const response = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${newCenter.lat},${newCenter.lng}&key=AIzaSyBpSruz4Yf86sK9Xg5vTWe8X7rnnmEqZgk`);
    const data = await response.json();
    if (data.results[0]) {
      setAddress(data.results[0].formatted_address);
    } else {
      setAddress("Address not found");
    }
  };

  const handleSaveAddress = () => {
    setAddressDetails(address);
    setShowMap(false);
  };

  return (
    <form method="dialog" className="modal-backdrop">
      <button className="btn btn-sm btn-circle absolute right-2 top-2">✕</button>
      <div className='flex flex-col gap-2 mt-2'>
        <InputField placeholder={"Search for a place"} icon={Search} className={"text-black"} value={address} />
        <LoadScript
          googleMapsApiKey="AIzaSyBpSruz4Yf86sK9Xg5vTWe8X7rnnmEqZgk"
          libraries={['advanced-markers']}
        >
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={10}
            onClick={handleMapClick}
            options={{
              restriction: {
                latLngBounds: indonesiaBounds,
                strictBounds: true
              }
            }}
            
          >
            {markers.map((marker, index) => (
              <Marker key={index} position={marker} />
            ))}
          </GoogleMap>
        </LoadScript>
        {/* <div className=''>
          <h3 className='font-bold'>Selected Location Address:</h3>
          <span className='font-light text-black'>{address}</span>
        </div> */}
        {/* <h3 className='font-bold'>Latitude:</h3>
      <span className='font-light'>{latitude}</span>
      <h3 className='font-bold'>Longitude:</h3>
      <span className='font-light'>{longitude}</span> */}
        <div className='flex flex-row justify-between'>
          <Button background="#0F7275" color="#F7FAFC" label={"Save Address"} onClick={handleSaveAddress}></Button>

          <Button background="#0F7275" color="#F7FAFC" label={"Cancel"} onClick={() => setShowMap(false)}></Button>

        </div>
      </div>
    </form>
  );
}

export default MyMapComponent;
