import React from 'react';
import { FaStar } from 'react-icons/fa';
import centra from "@assets/centra.svg";
import completion from "@assets/Completion.svg";
import { useNavigate } from 'react-router';
import Button from './Button';

const CentraProfileCard = ({ compact = false, centraName, onlineStatus, rating, completionRate }) => {
  const navigate = useNavigate();

  const handleViewReportCentra = () => {
    navigate(`/marketplace/${centraName}/reports`);
  }
  return (
    <div
      className="flex items-center w-full justify-between p-6 shadow-lg rounded-2xl bg-white hover:shadow-xl transition-shadow duration-300 cursor-pointer"
      onClick={() => navigate(`/marketplace/${centraName}`)}
      aria-label={`View ${centraName} profile`}
    >
      <div className="flex items-center gap-5">
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#C2D45E] shadow">
          <img src={centra} alt="Centra Logo" className="w-10 h-10 object-contain" />
        </div>
        <div className="flex flex-col justify-center">
          <h3 className="font-semibold text-lg text-[#0F7275]">{centraName}</h3>
          {/* <span className="text-xs text-gray-500">Online {onlineStatus} ago</span> */}
          {
            compact ? null : (
              <div className="flex flex-row gap-2 mt-1">
                <button
                  className="bg-[#0F7275] text-white px-4 py-1 rounded-full hover:bg-[#09585a] transition"
                  onClick={e => {
                    e.stopPropagation();
                    // Contact support logic
                    console.log("Contact Support clicked");
                  }}
                >
                  Chat
                </button>
                <button
                  className="bg-white text-[#0F7275] border-2 border-[#0F7275] px-4 py-1 rounded-full hover:bg-[#f3f3f3] transition"
                  onClick={e => {
                    e.stopPropagation();
                    handleViewReportCentra();
                  }}
                >
                  View Report
                </button>
              </div>
            )
          }
        </div>
      </div>
      <div className="flex items-center gap-6 text-sm">
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1">
            <FaStar size={16} color="#FFD700" />
            <span className="text-base font-semibold">{rating}</span>
          </div>
          <span className="text-xs text-gray-500">Rating</span>
        </div>
        <div className="w-px h-8 bg-gray-300"></div>
        <div className="flex flex-col items-center">
          <div className="flex items-center gap-1">
            <img src={completion} alt="Completion Icon" className="w-5 h-5" />
            <span className="text-base font-semibold">{completionRate}%</span>
          </div>
          <span className="text-xs text-gray-500">Complete Orders</span>
        </div>
      </div>
    </div>
  );
};

// Default props
CentraProfileCard.defaultProps = {
  centraName: 'Name of Centra',
  onlineStatus: '1 minute',
  rating: 4,
  completionRate: 100,
};

export default CentraProfileCard;