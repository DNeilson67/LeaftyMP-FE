import React, { useRef, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Profilepic from '../assets/Profilepic.svg';
import ReturnWhite from '@components/ReturnWhite';
import Background from "@assets/UserSettingBackground.svg";
import FullNameIcon from "@assets/FullnameIcon.svg";
import EmailLogo from "@assets/EmailLogo.svg";
import AddressLogo from "@assets/AddressLogo.svg";
import SegmentedControl from '@components/SegmentedControl';
import axios from "axios";
import Adminfee from "@assets/Adminfee.svg";
import WarningCircle from "@assets/WarningCircle.svg";
import { API_URL } from '../App';
import { useAuth } from '@context/AuthContext';
import { Edit, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';
import OpenStreetMapComponent from '@components/OpenStreetMapComponent';

function UserProfile() {
    const [selectedValue, setSelectedValue] = useState("Account");
    const navigate = useNavigate();
    const { user } = useAuth();
    const [userLocation, setUserLocation] = useState(null);
    const [isEditingLocation, setIsEditingLocation] = useState(false);
    const [loadingLocation, setLoadingLocation] = useState(true);

    // Fetch user location on component mount
    useEffect(() => {
        const fetchUserLocation = async () => {
            if (!user?.UserID) return;
            
            try {
                // Use /profile endpoint which gets data from session (no N+1 problem)
                const response = await axios.get(`${API_URL}/profile`, {
                    withCredentials: true
                });
                if (response.data && response.data.Latitude && response.data.Longitude) {
                    setUserLocation({
                        latitude: response.data.Latitude,
                        longitude: response.data.Longitude,
                        addressDetails: response.data.Address || ''
                    });
                }
            } catch (error) {
                console.log("User location not set:", error);
            } finally {
                setLoadingLocation(false);
            }
        };
        fetchUserLocation();
    }, [user]);

    const handleLocationUpdate = async (newLocation) => {
        try {
            const response = await axios.patch(
                `${API_URL}/location/patchuserid/${user.UserID}`,
                {
                    latitude: newLocation.latitude,
                    longitude: newLocation.longitude,
                    location_address: newLocation.addressDetails
                }
            );
            
            setUserLocation(newLocation);
            setIsEditingLocation(false);
            toast.success('Location updated successfully!', {
                duration: 3000,
                position: 'bottom-center',
                style: {
                    minWidth: '300px',
                },
            });
        } catch (error) {
            console.error("Error updating location:", error);
            toast.error('Failed to update location. Please try again.', {
                duration: 3000,
                position: 'bottom-center',
                style: {
                    minWidth: '300px',
                },
            });
        }
    };

    async function handleLogout() {
        try {
            await axios.delete(API_URL + "/delete_session")

        } catch (error) {

        }

        navigate("/")
    }

    const roleName = ["", "Centra", "Harbor", "Company", "Admin", "Customer", "Rejected"]

    return (

        <div className="min-h-screen w-screen flex justify-center">
            <div className="w-full flex flex-col">
                <header className="p-4 flex items-center justify-between bg-cover h-[10%]" style={{
                    backgroundImage: `url(${Background})`
                }}
                >
                    <button variant="ghost" size="icon" className="text-white hover:bg-teal-600/20" onClick={()=>{navigate(-1)}}>
                        <ReturnWhite className="h-6 w-6" />
                        <span className="sr-only">Back</span>
                    </button>
                    <h1 className="text-xl font-semibold text-white">User Profile</h1>
                    <div></div>
                </header>

                <div borderRadius="rounded-tl-lg rounded-tr-lg" border={false} className="relative flex-col mt-4">

                    <div className="flex flex-col items-center mb-2 p-2">
                        <img src={Profilepic} alt="Profile" className="w-16 h-16 rounded-full " />
                        <p>{user.Username}</p>
                        <p className="text-gray-600">{roleName[user.RoleID]}</p>
                    </div>
                    {/* <div className="flex justify-center gap-4 p-2">
                            <div className="flex flex-col items-center mb-2">
                                <p className="text-green-600 whitespace-normal">150 KG</p>
                                <p className="whitespace-normal text-sm">Total Production</p>
                            </div>
                            <img src={Line} alt="Notification" className="w-auto h-8" />
                            <div className="flex flex-col items-center mb-2">
                                <p className="whitespace-normal rounded-lg" style={{ color: '#D2D681' }}>23</p>
                                <p className="whitespace-normal text-sm">Unscaled Pickup</p>
                            </div>
                        </div> */}

                    <SegmentedControl
                        name="group-1"
                        callback={(val) => setSelectedValue(val)}
                        controlRef={useRef()}
                        segments={[
                            { label: "Account", value: "Account", ref: useRef() },
                            { label: "Shop", value: "Shop", ref: useRef() },
                        ]}
                    />


                    <div className="flex flex-col items-center justify-between">
                        {selectedValue === "Account" && (
                            <div className="flex flex-col justify-center w-5/6">
                                <div className="mt-2 p-2 flex items-end ">
                                    <img src={FullNameIcon} alt="Full Name" className="w-6 h-6 ml-2 mt-2 flex-shrink-0" />
                                    <div className="flex flex-row ml-4 justify-between w-full gap-2">
                                        <p style={{ color: '#606060' }} className="flex-shrink-0">Full Name</p>
                                        <input
                                            type="text"
                                            placeholder={user.Username}
                                            onChange={() => { }}
                                            className="bg-transparent outline-none text-right flex-1 min-w-0"
                                        />
                                    </div>
                                </div>

                                <div className="mt-2 p-2 flex items-end ">
                                    <img src={EmailLogo} alt="Email" className="w-6 h-6 ml-2 mt-2 flex-shrink-0" />
                                    <div className="flex flex-row ml-4 justify-between w-full gap-2">
                                        <p style={{ color: '#606060' }} className="flex-shrink-0">Email</p>
                                        <input
                                            type="text"
                                            placeholder={user.Email}
                                            onChange={() => { }}
                                            className="bg-transparent outline-none text-right flex-1 min-w-0"
                                        />
                                    </div>
                                </div>

                                {/* Location Settings Section */}
                                <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="flex items-center gap-2 mb-3">
                                        <MapPin className="w-5 h-5 text-[#0F7275]" />
                                        <h3 className="font-semibold text-lg text-[#0F7275]">Location Settings</h3>
                                    </div>
                                    
                                    <p className="text-sm text-gray-600 mb-3">
                                        Set your default location to help us find the closest centras when you use the bulk algorithm.
                                    </p>

                                    {loadingLocation ? (
                                        <div className="flex justify-center p-4">
                                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0F7275]"></div>
                                        </div>
                                    ) : (
                                        <>
                                            {userLocation ? (
                                                <div className="bg-white p-3 rounded-lg border border-gray-200 mb-3">
                                                    <div className="flex items-start gap-2 mb-2">
                                                        <MapPin className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                                                        <div className="flex-1">
                                                            <p className="text-sm font-medium text-gray-700">Current Location:</p>
                                                            <p className="text-xs text-gray-600 mt-1">{userLocation.addressDetails || 'Address not available'}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 mb-3">
                                                    <p className="text-sm text-yellow-800">
                                                        ⚠️ No location set. Please set your location to use location-based features.
                                                    </p>
                                                </div>
                                            )}

                                            <button
                                                onClick={() => setIsEditingLocation(true)}
                                                className="w-full bg-[#0F7275] hover:bg-[#0a5557] text-white py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
                                            >
                                                <MapPin className="w-4 h-4" />
                                                {userLocation ? 'Update Location' : 'Set Location'}
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}


                    </div>
                    {selectedValue === "Shop" && (
                        <div className="flex flex-col p-4">
                            {/* <div className='flex items-center w-full justify-between p-6'>
                                <div className='flex items-center gap-6'>
                                    <img src={Market} alt="Market" className="" />
                                    <p className="font-montserrat text-[12px] font-medium leading-[14.63px] tracking-[0.02em] text-left">
                                        Allow Selling in market
                                    </p>
                                </div>

                                <SwitchButton />
                            </div> */}

                            <p className="flex justify-center font-montserrat text-[12px] font-medium leading-[14.63px] tracking-[0.02em] text-left ">
                                Information
                            </p>

                            <div className='flex items-center w-full justify-between p-6'>
                                <div className='flex items-center gap-6'>
                                    <img src={Adminfee} alt="AdminFee" className="" />
                                    <div className='flex gap-4'>
                                        <p className="font-montserrat text-[12px] font-medium leading-[14.63px] tracking-[0.02em] text-left">
                                            Admin Fee
                                        </p>
                                        <img src={WarningCircle} alt="Warning" className="" />
                                    </div>
                                </div>

                                <p className="font-montserrat text-[12px] font-medium leading-[14.63px] tracking-[0.02em] text-left flex items-center mr-5">
                                    RP 5,000
                                </p>

                            </div>
                            <div className="flex items-center justify-center mt-12">
                                <div
                                    container={false}
                                    backgroundColor="#0F7275"
                                    borderRadius="20px"
                                    border={false}
                                    className="w-1/2 mr-2"
                                >
                                    <button
                                        className="flex items-center justify-center w-full h-6 font-montserrat font-semibold text-left text-[14px] leading-[17.07px] tracking-[0.02em] text-gray-100"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </div>

                        </div>


                    )}
                </div>
            </div >

            {/* Location Edit Modal */}
            {isEditingLocation && (
                <dialog open className="modal modal-open modal-bottom sm:modal-middle">
                    <div className="modal-box max-w-full sm:max-w-4xl w-full sm:w-11/12 h-[90vh] p-0 overflow-hidden">
                        <div className="sticky top-0 bg-white z-10 p-4 border-b border-gray-200">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold text-xl text-[#0F7275]">
                                    {userLocation ? 'Update Your Location' : 'Set Your Location'}
                                </h3>
                                <form method="dialog">
                                    <button
                                        onClick={() => setIsEditingLocation(false)}
                                        className="btn btn-sm btn-circle btn-ghost"
                                    >
                                        ✕
                                    </button>
                                </form>
                            </div>
                            <p className="text-sm text-gray-600 mt-2">
                                Click on the map to set your location, or search for an address.
                            </p>
                        </div>
                        
                        <div className="h-[calc(90vh-120px)] overflow-auto">
                            <OpenStreetMapComponent
                                setShowMap={setIsEditingLocation}
                                setAddressDetails={(address) => setUserLocation(prev => ({ ...prev, addressDetails: address }))}
                                setLatitude={(lat) => setUserLocation(prev => ({ ...prev, latitude: lat }))}
                                setLongitude={(lng) => setUserLocation(prev => ({ ...prev, longitude: lng }))}
                                langitude={userLocation?.latitude || -6.2088}
                                longitude={userLocation?.longitude || 106.8456}
                                isEdit={true}
                                onConfirm={handleLocationUpdate}
                            />
                        </div>
                    </div>
                    <form method="dialog" className="modal-backdrop" onClick={() => setIsEditingLocation(false)}>
                        <button>close</button>
                    </form>
                </dialog>
            )}
        </div>


    );
}

export default UserProfile;
