import React, { useState, useEffect } from 'react';
import profile from "@assets/icons/sidebar/profile_pic.svg";
import logout_new from "@assets/logout_2.svg";
import notification from "../assets/icons/notification.svg";
import settings from "@assets/settings.svg";

import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FaFileInvoice } from "react-icons/fa";

const Profile = ({ Username = "Error", Role = "Unknown", handleLogout = ()=>{}}) => {
  const navigate = useNavigate();

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  const roleName = ["", "Centra", "Harbor", "Company", "Admin", "Customer", "Rejected"];

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSettings = () => navigate('/profile');
  const handleLogin = () => navigate("/");
  const handleTransactionHistory = () =>{navigate("/marketplace/history"); document.getElementById('profile_modal').close()};

  if (Username === "Error") {
    return (
      <button className='btn border-2 border-black' onClick={handleLogin}>
        Sign In
      </button>
    );
  }

  return isMobile ? (
    // ----- Mobile View -----
    <>
      <div className="flex flex-row rounded-full items-center gap-2">
        {/* <Link to="/Notification">
          <button className='btn rounded-full w-12 h-12' style={{ background: "#DEE295", borderRadius: "100%" }}>
            <img src={notification} width={"300%"} alt="Notification Icon" />
          </button>
        </Link> */}
        {/* <span className='font-semibold'>{Username}</span> */}
        <button className='btn-circle btn' style={{ background: "#4d7478" }} onClick={() => document.getElementById('profile_modal').showModal()}>
          <img src={profile} className='w-12 h-12' alt="Profile" />
        </button>
      </div>

      <dialog id="profile_modal" className="modal modal-bottom">
        <div className="modal-box">
          <div className='flex flex-col gap-2 items-center'>
            <img src={profile} className='w-12 h-12' alt="Profile" />
            <div className='flex flex-col items-center'>
              <span className='font-bold'>{Username}</span>
              <span>{Role !== "Unknown" && roleName[Role]}</span>
            </div>
          </div>
          <ul className='menu'>
            {roleName[Role] == "Customer" && <li><a className=''  onClick={handleTransactionHistory}><FaFileInvoice />Transaction History</a></li>}
            <li><a className="" onClick={handleSettings}><img src={settings} alt="Settings" />Account Settings</a></li>
            <li><a className="" onClick={handleLogout}><img src={logout_new} alt="Logout" />Logout</a></li>
          </ul>
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>Close</button>
        </form>
      </dialog>
    </>
  ) : (
    // ----- Desktop View -----
    <div className="dropdown dropdown-bottom dropdown-end">
      <div className="w-fit h-fit">
        <div className="flex flex-row rounded-full border-2 border-solid border-[#79b2b7] items-center gap-2 bg-white">
          <Link to="/Notification">
            <button className='btn rounded-full w-12 h-12' style={{ background: "#DEE295", borderRadius: "100%" }}>
              <img src={notification} width={"300%"} alt="Notification Icon" />
            </button>
          </Link>
          <span className='font-semibold mx-1'>{Username}</span>
          <button tabIndex={0} className='btn-circle btn' style={{ background: "#4d7478" }}>
            <img src={profile} className='w-12 h-12' alt="Profile" />
          </button>
        </div>
      </div>
      <div tabIndex={0} className="dropdown-content menu bg-base-100 rounded-box z-[1] shadow w-64 gap-2 justify-center">
        <div className='flex flex-row gap-2 items-center px-4 pt-4'>
          <img src={profile} className='w-12 h-12' alt="Profile" />
          <div className='flex flex-col'>
            <span className='font-bold text-sm'>{Username}</span>
            <span>{Role !== "Unknown" && roleName[Role]}</span>
          </div>
        </div>
        <ul>
          {roleName[Role] == "Customer" && <li><a className='' onClick={handleTransactionHistory}><FaFileInvoice />Transaction History</a></li>}
          <li><a onClick={handleSettings}><img src={settings} alt="Settings" />Account Settings</a></li>
          <li><a onClick={handleLogout}><img src={logout_new} alt="Logout" />Logout</a></li>
        </ul>
      </div>
    </div>
  );
};

export default Profile;
