import React from 'react';
import { FaStar } from 'react-icons/fa';
import centra from "@assets/centra.svg";
import completion from "@assets/Completion.svg";
const CentraProfileCard = ({ centraName, onlineStatus, rating, completionRate }) => {
  return <>
    <div className="flex items-center justify-between p-4 shadow-md rounded-xl  bg-white">

      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#C2D45E]">
          <img src={centra} className='w-10'/>
        </div>
        <div>
          <h3 className="font-semibold text-lg">{centraName}</h3>
          {/* <p className="text-sm text-gray-500">Online {onlineStatus} ago</p> */}
        </div>
      </div>

      {/* <div className="flex items-center gap-6">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1">
            <FaStar color="#FFD700" />
            <span className="text-lg font-semibold">{rating}</span>
          </div>
          <span className="text-sm text-gray-500">Rating & Reviews</span>
        </div>

        <div className="w-px h-6 bg-gray-300"></div>

        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1">
            <img src={completion}/>
            <span className="text-lg font-semibold">{completionRate}%</span>
          </div>
          
          <span className="text-sm text-gray-500">Complete Orders</span>
        </div>
      </div> */}
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