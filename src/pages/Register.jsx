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
import MyMapComponent from '@components/MyMapComponents';
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

    useEffect(() => {
        if (emailAddress) updateUserField("Email", emailAddress);
        if (userPassword) updateUserField("Password", userPassword);
      }, [emailAddress, userPassword]);
      

    useEffect(() => {
        const timeout = setTimeout(() => {
            setIsImageVisible(true);
        }, 250);
    }, []);


    const handleRegister = async () => {
        setOtpAllowed(true);
        setLoading(true);
        
        navigate('/verify');
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
                <form className='flex flex-col gap-2'>
                    <InputField type={"text"} icon={profile} label={"Username"} placeholder={"@example"} onChange={(e) => {
                        updateUserField("Username", e.target.value);
                    }}
                        value={user.Username} />

                    <InputField type={"text"} icon={phone} label={"Phone Number"} placeholder={"+62 8xx xxxx xxxx"} onChange={(e) => {
                        updateUserField("PhoneNumber", e.target.value);
                    }}
                        value={user.PhoneNumber} />

                    <div className="relative">
                        <InputField disabled type={"text"} icon={location} label={"Address Details"} placeholder={"Jl. Jenderal Sudirman"} value={user.AddressDetails} />
                        <button type="button" className="absolute top-0 right-0" onClick={handleOpenMap}>
                            <FaMapMarkerAlt size={24} color="#606060" />
                        </button>
                    </div>
                    <div className='my-8 flex flex-col'>
                        <Button type={"submit"} background="#0F7275" color="#F7FAFC" label={isVerified ? <span className='loading loading-dots loading-sm'></span> : "Submit"} onClick={handleRegister}></Button>
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
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Select your Location</h3>
                    <MyMapComponent
                        setShowMap={setShowMap}
                        setAddressDetails={(val) => updateUserField("AddressDetails", val)}
                        setLatitude={(val) => updateUserField("Latitude", val)}
                        setLongitude={(val) => updateUserField("Longitude", val)}
                    />

                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </div>
    );
}

export default Register;