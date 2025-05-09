import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ReturnLogo from'../assets/ReturnWhite.svg';
const ReturnWhite = () => {
    
    const navigate = useNavigate();
    return (
            <img src={ReturnLogo} onClick={()=>navigate(-1)}alt="Return" className='w-auto h-auto   ' />
    );
};

export default ReturnWhite;
