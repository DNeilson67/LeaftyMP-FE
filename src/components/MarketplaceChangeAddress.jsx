import React, { useState, useEffect } from "react";
import Location from "@assets/location.svg";
import Button from '@components/Button';
import MyMapComponent from "@components/MyMapComponents";
export default function MarketplaceChangeAddress() {
    const [showMap, setShowMap] = useState(false);
    const [addressDetails, setAddressDetails] = useState("Jl. Pangeran Antasari No. 1234 Kompleks Permata Indah Blok C No. 56 Kecamatan Ciputat Timur, Kota Tangerang Selatan Provinsi Banten, 15412 Indonesia");

    const handleOpenMap = () => {
        document.getElementById('map_modal').showModal()
        setShowMap(true);
    }
    return (
        <>
            <div className='flex flex-col p-4 border-[#C8DFD7] border rounded-lg gap-2'>
                <span className='font-bold text-lg'>Shipping Address</span>
                <div className='flex flex-row justify-start gap-2'>
                    <img src={Location} className='w-4 h-4' alt="Location Icon" />
                    <span>{addressDetails}</span>
                </div>
                <Button onClick={handleOpenMap} label="Change Address" background={"#79B2B7"} color={"white"} noMax={true} className={"w-fit"} />
            </div>

            <dialog id="map_modal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Select your Location</h3>
                    <MyMapComponent setShowMap={setShowMap} setAddressDetails={setAddressDetails} />
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </>
    );
}