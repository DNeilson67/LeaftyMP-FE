import React, { useState } from 'react';
import illustration from "@assets/404.svg";
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../App';
import Button from '../components/Button';

function PageNotFound() {
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    async function handleLogout() {
        try {
            await axios.delete(API_URL + "/delete_session");
    
          
        } catch (error) {

        }

        setLoading(true);
        await new Promise((resolve) => setTimeout(resolve, 1500));
        navigate("/")
    }
    
    return (
        <div className='flex flex-col justify-center items-center min-h-screen'>
            <img src={illustration} className='w-[500px] h-[500px]' alt="Page Not Found Illustration" />
            <span className='font-bold text-3xl mt-4'>Oops! Page Not Found</span>
            <span className='w-1/3 text-center mt-2'>We've searched far and wide and couldn't seem to find what you were looking for</span>
            <Button className={"mt-4"} onClick={handleLogout} label={loading ? <span className='loading loading-dots loading-sm'></span>: "Sign Out"} background={'#0F7275'} color={"white"} />
            {/* <button onClick={handleWhoAmI}>whoami</button>
            <Button onClick={() => document.getElementById('AddLeaves').showModal()} label={"Sign Out"} background={'#0F7275'} color={"white"}/>
            <AddLeavesPopup /> */}
        </div>
    );
}

export default PageNotFound;
