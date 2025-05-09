import React, { useRef, useState } from 'react';
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
import { Edit } from 'lucide-react';

function UserProfile() {
    const [selectedValue, setSelectedValue] = useState("Account");
    const navigate = useNavigate();
    const { user } = useAuth();

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
                    <button variant="ghost" size="icon" className="text-white hover:bg-teal-600/20">
                        <Edit className="h-5 w-5" />
                        <span className="sr-only">Edit</span>
                    </button>
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
                                    <img src={FullNameIcon} alt="Full Name" className="w-6 h-6 ml-2 mt-2" />
                                    <div className="flex flex-row ml-4 justify-between w-full">
                                        <p style={{ color: '#606060' }}>Full Name</p>
                                        <input
                                            type="text"
                                            placeholder={user.Username}
                                            onChange={() => { }}
                                            className=" bg-transparent outline-none text-right"
                                        />
                                    </div>
                                </div>

                                <div className="mt-2 p-2 flex items-end ">
                                    <img src={EmailLogo} alt="Email" className="w-6 h-6 ml-2 mt-2" />
                                    <div className="flex flex-row ml-4 justify-between w-full">
                                        <p style={{ color: '#606060' }}>Email</p>
                                        <input
                                            type="text"
                                            placeholder={user.Email}
                                            onChange={() => { }}
                                            className=" bg-transparent outline-none text-right"
                                        />
                                    </div>
                                </div>

                                <div className="mt-2 p-2 flex items-end ">
                                    <img src={AddressLogo} alt="Address" className="w-6 h-6 ml-2 mt-2" />
                                    <div className="flex flex-row ml-4 justify-between w-full">
                                        <p style={{ color: '#606060' }}>Address</p>
                                        <input
                                            type="text"
                                            placeholder="Jakarta, Indonesia"
                                            onChange={() => { }}
                                            className=" bg-transparent outline-none text-right"
                                        />
                                    </div>
                                </div>

                                <div className="flex items-center justify-center mt-12">
                                    <div
                                        onClick={() => { handleLogout() }}
                                        container={false}
                                        backgroundColor="#0F7275"
                                        borderRadius="20px"
                                        border={false}
                                        className="w-48 mr-2"
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
        </div>


    );
}

export default UserProfile;
