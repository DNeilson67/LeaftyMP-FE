import { useEffect, useState, useContext, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, useAnimationControls } from "framer-motion";
import '@style/App.css';
import { FaArrowLeft } from "react-icons/fa";

import Illustration from "@assets/Verification.svg";
import Circle from '@components/Circle';
import logo from '@assets/LeaftyLogo.svg';
import OtpInput from 'react-otp-input';
import Button from '@components/Button';
import LoadingCircle from '@components/LoadingCircle';
import Image from '@components/Images';
import axios from 'axios';
import { API_URL } from '../App';
import { useAuthRegister } from '@context/AuthRegisterContext';
import Popup from '@components/Popups/Popup';
import toast from 'react-hot-toast';

function Verification() {
    const [otp, setOtp] = useState('');
    const [showLoadingCircle, setShowLoadingCircle] = useState(false);
    const [resendCountdown, setResendCountdown] = useState(60);
    const [isResendDisabled, setIsResendDisabled] = useState(false);
    const [hasManuallyResent, setHasManuallyResent] = useState(false);
    const modalRef4 = useRef(null);

    const { otpAllowed, regAllowed, setOtpAllowed, setRegAllowed, user, setUser } = useAuthRegister();

    const controls = useAnimationControls();
    const location = useLocation();
    const navigate = useNavigate();

    const { ForgotPass = false } = location.state || {};
    const [forgotPass] = useState(ForgotPass);

    const [email, setEmail] = useState(user.Email);
    const [username, setUserName] = useState(user.Username);
    const [phoneNumber, setPhoneNumber] = useState(user.PhoneNumber);
    const [password, setPassword] = useState(user.Password);
    const [address, setAddress] = useState(user.AddressDetails);
    const [lng, setLng] = useState(user.Longitude);
    const [lat, setLat] = useState(user.Latitude);
    const [isImageVisible, setIsImageVisible] = useState(false);

    const generateOTP = async (isManual = false) => {
        try {
            await axios.post(`${API_URL}/generate_otp`, { email });
            console.log('OTP sent to email:', email);

            if (isManual) {
                toast.success('Code has been resent!', {
                    duration: 4000,
                    position: 'top-center',
                });
            }
        } catch (error) {
            toast.error('An error has occurred. Please try resend the code.', {
                duration: 4000,
                position: 'top-center',
            });
        }
    };

    useEffect(() => {
        setIsImageVisible(true);
        if (email) {
            generateOTP(false); // silent initial send
        }
    }, []);

    useEffect(() => {
        let timer;
        if (isResendDisabled && resendCountdown > 0) {
            timer = setInterval(() => {
                setResendCountdown(prev => {
                    if (prev === 1) {
                        setIsResendDisabled(false);
                        clearInterval(timer);
                        return 60;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [isResendDisabled]);

    const handleGoBack = () => {
        setRegAllowed(false);
        navigate(-1);
    };

    const createUser = async () => {
        try {
            setRegAllowed(false);
            setOtpAllowed(false);
            const response = await axios.post(`${API_URL}/register`, {
                Username: username,
                Email: email,
                PhoneNumber: phoneNumber,
                RoleID: 5,
                Password: password,
                location_address: address,
                latitude: lat,
                longitude: lng,
            });
            console.log(response.data);
        } catch (error) {
            console.error('Error calling backend function', error);
        }
    };

    const handleVerify = async () => {
        try {
            const response = await axios.post(`${API_URL}/verify_otp`, {
                email: email,
                otp_code: otp
            });

            if (response.data.message === 'OTP verified successfully') {
                if (forgotPass) {
                    const userResp = await axios.get(`${API_URL}/user/get_user_details_email/${email}`);
                    navigate("/reset-password", { state: { uid: userResp.data.UserID, username: userResp.data.Username, email: email, ForgotPass: true } });
                } else {
                    await createUser();
                    navigate('/');
                }
            } else {
                modalRef4.current.showModal();
            }

            setUser({});
        } catch (error) {
            console.error('Error verifying OTP', error);
            modalRef4.current.showModal();
        }
    };

    const handleResendCode = async () => {
        if (isResendDisabled) return;

        setIsResendDisabled(true);
        setResendCountdown(60);
        setHasManuallyResent(true);
        await generateOTP(true); // manual = true → shows toast
    };

    const getMargin = () => {
        const width = window.innerWidth;
        if (width < 320) return '0.3vw';
        if (width < 600) return '0.5vw';
        return '0.55vw';
    };
    const margin = getMargin();

    const getInputStyle = () => {
        if (window.innerWidth <= 375) return { width: '45px', height: '45px' };
        if (window.innerWidth <= 480) return { width: '55px', height: '55px' };
        return { width: '55px', height: '55px' };
    };

    return (
        <div className='flex flex-col md:flex-row w-screen h-screen overflow-hidden disable-zoom'>
            <Button id="back" label={<FaArrowLeft />} onClick={handleGoBack} className="ml-5"></Button>

            <div id="contents" className="flex flex-col w-full md:w-1/2 h-screen m-4 md:m-20 mt-16 py-8 gap-4 max-w-md">
                <img className="w-20 h-20" src={logo} alt="Logo" />
                <div className='flex flex-col'>
                    <span className='font-bold text-3xl me-8'>Verify Your Account</span>
                    <span className='text-xl font-medium me-8' style={{ color: "#606060" }}>
                        Enter the code that we have sent to <span style={{ color: "#79B2B7" }}>{email}</span>
                    </span>
                </div>

                <OtpInput
                    className="flex justify-center items-center"
                    value={otp}
                    onChange={setOtp}
                    numInputs={6}
                    renderSeparator={<span style={{ margin: `0 ${margin}` }} />}
                    renderInput={(props) => (
                        <input
                            {...props}
                            style={{
                                ...getInputStyle(),
                                background: "#CAE3DA",
                                borderRadius: "0.5rem",
                                marginInlineEnd: margin,
                                textAlign: "center"
                            }}
                        />
                    )}
                />

                <div className='flex flex-row justify-end items-center'>
                    <span
                        style={{
                            color: isResendDisabled ? "#A0A0A0" : "#79B2B7",
                            cursor: isResendDisabled ? "default" : "pointer"
                        }}
                        onClick={handleResendCode}
                        className="me-8"
                    >
                        {isResendDisabled ? `Resend Code in ${resendCountdown}s` : "Resend Code"}
                    </span>
                </div>

                <Button background="#0F7275" color="#F7FAFC" label="Submit" onClick={handleVerify} className="me-8" />
            </div>

            <motion.div className='w-1/2 h-screen relative justify-end items-center'
                initial={{ left: "0%" }}
                transition={{ duration: 2.5, type: "spring" }}
                variants={{
                    initial: { left: "0%" },
                    verifiedOTP: { left: "-100%" }
                }}
                animate={controls}
            >
                <div className='z-0'>
                    <Circle color="#94C3B3" opacity={"50%"} position={{ left: "0%", bottom: "-45%" }} />
                    <Circle color="#94C3B3" opacity={"50%"} position={{ left: "7.5%", bottom: "-45%" }} />
                    <Circle color="#94C3B3" opacity={"100%"} position={{ left: "15%", bottom: "-45%" }} />
                    {showLoadingCircle && <LoadingCircle />}
                </div>
            </motion.div>

            <Image img={Illustration} isVisible={isImageVisible} />

            {/* Error Modal */}
            <Popup
                ref={modalRef4}
                error
                description={"Invalid or expired OTP. Please try again."}
                onConfirm={() => modalRef4.current?.close?.()}
            />
        </div>
    );
}

export default Verification;
