import React, { useState, useEffect } from "react";
import Location from "@assets/location.svg";
import Button from '@components/Button';
import OpenStreetMapComponent from "@components/OpenStreetMapComponent";
import axios from "axios";
import { API_URL } from "../App";
export default function MarketplaceChangeAddress({ changeable = true, location, setLocation, onSaveAddress }) {
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

    const handleLocationConfirm = (newLocationData) => {
        // Update local state with the new location data
        setLocation(newLocationData);
        
        // Call the save callback if provided with the fresh location data
        if (onSaveAddress) {
            onSaveAddress(newLocationData);
        }
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
                    disabled={!changeable}
                    onClick={handleOpenMap} 
                    label="Change Address" 
                    background={"#79B2B7"} 
                    color={"white"} 
                    noMax={true} 
                    className={"w-fit"}
                />
            </div>

            <dialog id="map_modal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box max-w-full sm:max-w-4xl w-full sm:w-11/12 h-[90vh] p-0 overflow-hidden">
                    <div className="sticky top-0 bg-white z-10 p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-xl text-[#0F7275]">Update Shipping Address</h3>
                            <form method="dialog">
                                <button className="btn btn-sm btn-circle btn-ghost">✕</button>
                            </form>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                            Click on the map to set your location, or search for an address.
                        </p>
                    </div>
                    
                    <div className="h-[calc(90vh-120px)] overflow-auto">
                        <OpenStreetMapComponent 
                            setShowMap={setShowMap} 
                            setAddressDetails={handleAddressChange}
                            setLatitude={(lat) => handleCoordinatesChange(lat, location?.longitude)}
                            setLongitude={(lng) => handleCoordinatesChange(location?.latitude, lng)}
                            langitude={location?.latitude}
                            longitude={location?.longitude}
                            isEdit={true}
                            onConfirm={handleLocationConfirm}
                        />
                    </div>
                </div>
            </dialog>
        </>
    );
}