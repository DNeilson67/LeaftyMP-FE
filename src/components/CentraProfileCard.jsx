import React from 'react';
import { FaStar } from 'react-icons/fa';
import centra from "@assets/centra.svg";
import completion from "@assets/Completion.svg";
import { useNavigate } from 'react-router';

const CentraProfileCard = ({ centraName, onlineStatus, rating, completionRate }) => {
  const navigate = useNavigate();
  return <>
    <div className="flex items-center w-full justify-between p-4 shadow-md rounded-xl  bg-white" onClick={() => navigate("/marketplace/"+centraName)}>

      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#C2D45E]">
          <img src={centra} className='w-10' />
        </div>
        <div>
          <h3 className="font-semibold text-lg">{centraName}</h3>
          {/* <p className="text-sm text-gray-500">Online {onlineStatus} ago</p> */}
        </div>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1">
            <FaStar size={14} color="#FFD700" />
            <span className="text-base font-medium">{rating}</span>
          </div>
          <span className="text-xs text-gray-500">Rating</span>
        </div>

        <div className="w-px h-5 bg-gray-300"></div>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1">
            <img src={completion} className="w-4 h-4" />
            <span className="text-base font-medium">{completionRate}%</span>
          </div>
          <span className="text-xs text-gray-500">Complete Orders</span>
        </div>
      </div>

    </div>
  </>
};

// Default props
CentraProfileCard.defaultProps = {
  centraName: 'Name of Centra',
  onlineStatus: '1 minute',
  rating: 4,
  completionRate: 100,
};

export default CentraProfileCard;