import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Pending from "@assets/Pendings.svg";

function PaymentPending() {
  const [timeLeft, setTimeLeft] = useState(60 * 60); 
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 0) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (timeInSeconds) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = timeInSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className="text-center p-8 flex flex-col items-center justify-center overflow-hidden h-[80dvh]">
      <div className="flex items-center justify-center mb-4">
        <img src={Pending} className="w-20 h-20" />
      </div>
      <h1 className="text-2xl font-semibold">Awaiting Payment</h1>
      <p className="mt-2 text-gray-700 mx-auto" style={{ wordWrap: 'break-word', width: "27%" }}>
        Your order has been placed and is currently awaiting payment. Please complete the payment process
        before <span style={{ color: '#0F7275', textShadow: '0 0 8px #0F7275' }}>{formatTime(timeLeft)}</span> to complete your purchase.
      </p>
      <div className="mt-4 flex items-center justify-center">
        <button 
          className="px-12 py-2 mr-2 text-white rounded-full" 
          style={{ backgroundColor: "#0F7275" }}
          onClick={() => navigate('/marketplace/homepage')}
        >
          Back to Marketplace
        </button>
      </div>
      <a href="/marketplace/history" className="mt-4 block hover:underline" style={{ color: "#94C3B3" }}>
        Go to Transaction List
      </a>
    </div>
  );
}

export default PaymentPending;

