import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import WidgetContainer from "@components/Cards/WidgetContainer";
import Powder from '@assets/PowderLogo.svg';
import Van from '@assets/van.svg';
import Box from '@assets/PackageBox.svg';
import Location from '@assets/location.svg';
import DateIcon from '@assets/Date.svg';  // Renamed to avoid conflict with the Date component
import Centra from '@assets/centra.svg';
import VerificationWait from "../../components/VerificationWait";
import HarborReception from "../../components/HarborReception";
import RescallingInput from "../../components/RescallingInput";
import ReceptionDetail from "../../components/ReceptionDetail";
import Button from '../../components/Button';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { API_URL } from "../../App"; // Adjust the import according to your project structure

const ItemDetail = ({ icon, title, value, altText }) => (
    <div className="flex flex-col gap-2">
        <span className="font-bold text-xl">{title}</span>
        <div className="flex flex-row gap-2 items-center">
            <img src={icon} alt={altText} className='w-8 h-8' />
            <span className="text-lg">{value}</span>
        </div>
    </div>
);

const Column = ({ children, border = false }) => (
    <div className={`flex flex-col gap-4 justify-between ${border ? "border-r-2 border-[#94C3B3]" : ""} pr-8`}>
        {children}
    </div>
);

const HarborContainers = [
    { label: 'Harbor Name' },
    { label: 'Total Packages' },
    { label: 'Centra Name' },
];

const CentraContainers = [
    { label: 'Centra Name' },
    { label: 'Weight' },
    { label: 'Your Name' },
];

function ShipmentDetails() {
    const location = useLocation();
    const { shipment } = location.state || {};
    const [currentComponent, setCurrentComponent] = useState(0);
    const [userData, setUserData] = useState(null);

    useEffect(() => {
        if (shipment?.UserID) {
            fetchUserDetails(shipment.UserID);
        }
        determineCurrentComponent(shipment)
    }, [shipment]);

    const fetchUserDetails = async (userId) => {
        try {
            const response = await axios.get(`${API_URL}/user/get_user/${userId}`);
            setUserData(response.data);
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const determineCurrentComponent = (shipment) => {
        if (!shipment.ShipmentDate) {
            setCurrentComponent(1);
        } else if (!shipment.Check_in_Date && !shipment.Check_in_Weight) {
            setCurrentComponent(2);
        } else if (!shipment.Harbor_Reception_File) {
            setCurrentComponent(3);
        } else if (!shipment.Rescalled_Weight && !shipment.Rescalled_Date) {
            setCurrentComponent(4);
        } else if (!shipment.Centra_Reception_File) {
            setCurrentComponent(5);
        } 
        else if (shipment.Centra_Reception_File) {
            setCurrentComponent(6);
        }
    };

    function formatDate(dateString) {
        if (!dateString) return "Not Delivered";
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, options);
    }

    return (
        <div className="flex flex-col h-full">
            <Stepper className="mt-4" activeStep={currentComponent-1} alternativeLabel>
                {['Shipping', 'Verification', 'Harbor Reception','Rescalling Input', 'Centra Reception'].map((label, index) => (
                    <Step key={label}>
                        <StepLabel
                            StepIconProps={{
                                style: {
                                    fontSize: '2rem',
                                    width: '40px',
                                    height: '40px',
                                    backgroundColor: '#ffffff',
                                    color: '#C0CD30'
                                }
                            }}
                            classes={{
                                label: 'text-lg'
                            }}
                        >
                            {label}
                        </StepLabel>
                    </Step>
                ))}
            </Stepper>
            <WidgetContainer border={true} className="w-full gap-2 py-4 pl-4 pr-0 flex flex-row justify-between">
                <div className="flex flex-col gap-2">
                    <span className="font-bold text-2xl">Item Details</span>
                    <div className="flex flex-row gap-8">
                        <div className="bg-[#79B2B7] w-fit h-fit p-8 rounded-md">
                            <img src={Powder} alt="Powder" className='w-36 h-auto' />
                        </div>
                        <Column border>
                            <ItemDetail icon={Box} title="Powder" value={`${shipment?.ShipmentQuantity || 1} Packages`} altText="Box" />
                            <ItemDetail icon={Van} title={`${shipment?.ShipmentWeight || 30} Kg`} value={`Courier - ${shipment?.CourierName || 'SiCepat'}`} altText="Truck" />
                        </Column>
                        <Column>
                            <ItemDetail icon={Centra} title="Centra" value={userData?.name || "CentraAB"} altText="Centra" />
                            {/* <ItemDetail icon={Location} title="Centra Region" value="Sulawesi Tengah" altText="Location" /> */}
                        </Column>
                        <Column>
                            <ItemDetail icon={Van} title="Shipment No." value={`#${shipment?.ShipmentID || '6'}`} altText="Van" />
                            <ItemDetail icon={DateIcon} title="Shipment Date" value={formatDate(shipment?.ShipmentDate)} altText="Date" />
                        </Column>
                    </div>
                </div>
                <div className="flex items-center">
                    <div id="decor" className="w-[25px] h-[175px] rounded-[10px_0px_0px_10px] shadow-[inset_0px_4px_4px_#0000001a]" style={{ background: "#79B2B7" }} />
                </div>
            </WidgetContainer>
        </div>
    );
}

export default ShipmentDetails;
