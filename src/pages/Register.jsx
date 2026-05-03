import React, { useEffect, useState, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, useAnimationControls } from "framer-motion";
import '@style/App.css';
import { FaArrowLeft, FaMapMarkerAlt } from "react-icons/fa";
import Illustration from '@assets/Register.svg';
import Circle from '@components/Circle';
import logo from '@assets/LeaftyLogo.svg';
import profile from '@assets/icons/profile.svg';
import phone from '@assets/icons/phone.svg';
import location from '@assets/icons/location.svg';
import Button from '@components/Button';
import LoadingCircle from '@components/LoadingCircle';
import VerificationImage from '@components/Images';
import InputField from '@components/InputField';
import OpenStreetMapComponent from '@components/OpenStreetMapComponent';
import axios from 'axios';
import { useAuthRegister } from '../context/AuthRegisterContext';

axios.defaults.withCredentials = true

function Register() {
    const { setOtpAllowed, setRegAllowed, user, setUser, updateUserField } = useAuthRegister();

    const controls = useAnimationControls();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const Location = useLocation();
    const { emailAddress, userPassword } = Location.state || {};

    const [isVerified, setIsVerified] = useState(false);
    const [isImageVisible, setIsImageVisible] = useState(false);
    const [showLoadingCircle, setShowLoadingCircle] = useState(false);
    const [showMap, setShowMap] = useState(false);

    // Validation states
    const [usernameError, setUsernameError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [addressError, setAddressError] = useState('');

    useEffect(() => {
        if (emailAddress) updateUserField("Email", emailAddress);
        if (userPassword) updateUserField("Password", userPassword);
      }, [emailAddress, userPassword]);
      

    useEffect(() => {
        setTimeout(() => {
            setIsImageVisible(true);
        }, 250);
    }, []);

    // Username validation
    const validateUsername = (username) => {
        if (!username) {
            return 'Username is required';
        }
        if (username.length < 3) {
            return 'Username must be at least 3 characters';
        }
        if (username.length > 20) {
            return 'Username must not exceed 20 characters';
        }
        if (!/^[a-zA-Z0-9_]+$/.test(username)) {
            return 'Username can only contain letters, numbers, and underscores';
        }
        return '';
    };

    // Phone number validation
    const validatePhone = (phone) => {
        if (!phone) {
            return 'Phone number is required';
        }
        // Remove all non-digit characters for validation
        const digitsOnly = phone.replace(/\D/g, '');
        
        // Check if it starts with +62 or 62 or 0
        if (phone.startsWith('+62')) {
            if (digitsOnly.length < 11 || digitsOnly.length > 15) {
                return 'Phone number must be between 10-13 digits after +62';
            }
        } else if (phone.startsWith('62')) {
            if (digitsOnly.length < 10 || digitsOnly.length > 14) {
                return 'Phone number must be between 9-12 digits after 62';
            }
        } else if (phone.startsWith('0')) {
            if (digitsOnly.length < 10 || digitsOnly.length > 13) {
                return 'Phone number must be between 10-13 digits';
            }
        } else {
            return 'Phone number must start with +62, 62, or 0';
        }
        
        if (!/^\+?[0-9\s-]+$/.test(phone)) {
            return 'Phone number can only contain digits, spaces, dashes, and + symbol';
        }
        
        return '';
    };

    // Address validation
    const validateAddress = (address) => {
        if (!address) {
            return 'Address is required';
        }
        if (address.length < 10) {
            return 'Address must be at least 10 characters';
        }
        return '';
    };

    // Handle username change with validation
    const handleUsernameChange = (e) => {
        const username = e.target.value;
        updateUserField("Username", username);
        setUsernameError(validateUsername(username));
    };

    // Handle phone change with validation
    const handlePhoneChange = (e) => {
        const phone = e.target.value;
        updateUserField("PhoneNumber", phone);
        setPhoneError(validatePhone(phone));
    };


    const handleRegister = async (e) => {
        e.preventDefault();
        
        // Validate all fields before submission
        const usernameErr = validateUsername(user.Username);
        const phoneErr = validatePhone(user.PhoneNumber);
        const addressErr = validateAddress(user.AddressDetails);
        
        setUsernameError(usernameErr);
        setPhoneError(phoneErr);
        setAddressError(addressErr);
        
        // If any validation fails, don't proceed
        if (usernameErr || phoneErr || addressErr) {
            return;
        }
        
        setOtpAllowed(true);
        setLoading(true);
        
        navigate('/auth/verify');
    };


    const handleGoBack = (e) => {
        setRegAllowed(false);
        e.preventDefault();
        navigate(-1);
    }

    const handleOpenMap = () => {
        document.getElementById('my_modal_2').showModal()
        setShowMap(true);
    }

    // Handle address update from map with validation
    const handleAddressUpdate = (val) => {
        updateUserField("AddressDetails", val);
        setAddressError(validateAddress(val));
    };

    if (loading) {
        return <LoadingCircle />;
    }

    return (
        <div className='flex w-screen h-screen overflow-hidden disable-zoom'>
            <Button id="back" icon={<FaArrowLeft />} onClick={handleGoBack}></Button>
            <div id="contents" className="flex flex-col w-screen h-screen mx-20 gap-4 my-20 md:max-w-md">
                <img className="w-20 h-20" src={logo} alt="Logo" />
                <div className='flex flex-col'>
                    <span className='font-bold text-3xl'>Account Details</span>
                    <span className='text-xl font-medium' style={{ color: "#606060" }}>You are one step away from joining Leafty! Let's set some things up!</span>
                </div>
                <form className='flex flex-col gap-2' onSubmit={handleRegister}>
                    <div>
                        <InputField 
                            type={"text"} 
                            icon={profile} 
                            label={"Username"} 
                            placeholder={"@example"} 
                            onChange={handleUsernameChange}
                            value={user.Username} 
                        />
                        {usernameError && <p className="text-red-500 text-sm mt-1 ml-1">{usernameError}</p>}
                    </div>

                    <div>
                        <InputField 
                            type={"text"} 
                            icon={phone} 
                            label={"Phone Number"} 
                            placeholder={"+62 8xx xxxx xxxx"} 
                            onChange={handlePhoneChange}
                            value={user.PhoneNumber} 
                        />
                        {phoneError && <p className="text-red-500 text-sm mt-1 ml-1">{phoneError}</p>}
                    </div>

                    <div className="relative" onClick={() => {handleOpenMap()}}>
                        <InputField 
                            disabled 
                            type={"text"} 
                            icon={location} 
                            label={"Address Details"} 
                            placeholder={"Jl. Jenderal Sudirman"} 
                            value={user.AddressDetails} 
                        />
                        <button type="button" className="absolute top-0 right-0" onClick={handleOpenMap}>
                            <FaMapMarkerAlt size={24} color="#606060" />
                        </button>
                        {addressError && <p className="text-red-500 text-sm mt-1 ml-1">{addressError}</p>}
                    </div>
                    <div className='my-8 flex flex-col'>
                        <Button 
                            type={"submit"} 
                            background="#0F7275" 
                            color="#F7FAFC" 
                            label={isVerified ? <span className='loading loading-dots loading-sm'></span> : "Submit"}
                        />
                    </div>
                </form>
            </div>
            <motion.div className='w-1/2 h-screen relative justify-end items-center hidden md:block'
                initial={{ left: "0%" }}
                transition={{ duration: 2.5, type: "spring" }}
                variants={{ initial: { left: "0%" }, verifiedOTP: { left: "-100%" } }}
                animate={controls}
            >
                <div className='z-0'>
                    <Circle color="#94C3B3" opacity={"50%"} position={{ left: "0%", bottom: "-45%" }} />
                    <Circle color="#94C3B3" opacity={"50%"} position={{ left: "7.5%", bottom: "-45%" }} />
                    <Circle color="#94C3B3" opacity={"100%"} position={{ left: "15%", bottom: "-45%" }} />
                    <VerificationImage img={Illustration} isVisible={isImageVisible} />
                    {showLoadingCircle && <LoadingCircle />}
                </div>
            </motion.div>
            <dialog id="my_modal_2" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box max-w-full sm:max-w-4xl w-full sm:w-11/12 h-[90vh] p-0 overflow-hidden">
                    <div className="sticky top-0 bg-white z-10 p-4 border-b border-gray-200">
                        <div className="flex items-center justify-between">
                            <h3 className="font-bold text-xl text-[#0F7275]">Select your Location</h3>
                            <form method="dialog">
                                {/* <button className="btn btn-sm btn-circle btn-ghost">✕</button> */}
                            </form>
                        </div>
                        <p className="text-sm text-gray-600 mt-2">
                            Click on the map to set your location, or search for an address.
                        </p>
                    </div>
                    
                    <div className="h-[calc(90vh-120px)] overflow-auto">
                        <OpenStreetMapComponent
                            setShowMap={setShowMap}
                            setAddressDetails={handleAddressUpdate}
                            setLatitude={(val) => updateUserField("Latitude", val)}
                            setLongitude={(val) => updateUserField("Longitude", val)}
                        />
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </div>
    );
}

export default Register;