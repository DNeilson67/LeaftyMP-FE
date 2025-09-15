import React, { useState, useEffect } from "react";
import Location from "@assets/location.svg";
import Button from '@components/Button';
import MyMapComponent from "@components/MyMapComponents";
import axios from "axios";
import { API_URL } from "../App";
export default function MarketplaceChangeAddress({ location, setLocation }) {
    const [showMap, setShowMap] = useState(false);
    const { addressDetails } = location || {};

    const handleOpenMap = () => {
        document.getElementById('map_modal').showModal();
        setShowMap(true);
    };

    const handleAddressChange = (newAddress) => {
        setLocation(prev => ({
            ...prev,
            addressDetails: newAddress
        }));
    };

    const handleCoordinatesChange = (lat, lng) => {
        setLocation(prev => ({
            ...prev,
            latitude: lat,
            longitude: lng
        }));
    };

    return (
        <>
            <div className='flex flex-col p-4 border-[#C8DFD7] border rounded-lg gap-2'>
                <span className='font-bold text-lg'>Shipping Address</span>
                <div className='flex flex-row justify-start gap-2'>
                    <img src={Location} className='w-4 h-4' alt="Location Icon" />
                    <span className="flex-1">{addressDetails || "No address selected"}</span>
                </div>
                <Button 
                    onClick={handleOpenMap} 
                    label="Change Address" 
                    background={"#79B2B7"} 
                    color={"white"} 
                    noMax={true} 
                    className={"w-fit"}
                />
            </div>

            <dialog id="map_modal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box max-w-3xl">
                    <h3 className="font-bold text-lg mb-4">Select your Location</h3>
                    <MyMapComponent 
                        setShowMap={setShowMap} 
                        setAddressDetails={handleAddressChange}
                        setLatitude={(lat) => handleCoordinatesChange(lat, location?.longitude)}
                        setLongitude={(lng) => handleCoordinatesChange(location?.latitude, lng)}
                        langitude={location?.latitude}
                        longitude={location?.longitude}
                    />
                </div>
            </dialog>
        </>
    );
}