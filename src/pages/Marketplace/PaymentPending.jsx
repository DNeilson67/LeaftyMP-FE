import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Pending from "@assets/Pendings.svg";
import { API_URL } from '../../App';
import PageNotFound from '../../pages/PageNotFound';

function PaymentPending() {
  const [timeLeft, setTimeLeft] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const transactionId = queryParams.get('tr_id');

  useEffect(() => {
    if (!transactionId) return;

    axios.get(`${API_URL}/marketplace/get_transaction_details/${transactionId}`)
      .then(response => {
        const transactionData = response.data;
        const expirationAt = new Date(transactionData.ExpirationAt);
        const now = new Date();
        const diffInSeconds = Math.max(Math.floor((expirationAt - now) / 1000), 0);
        setTimeLeft(diffInSeconds);
      })
      .catch(error => {
        // console.error('Error fetching transaction data:', error);
        setError(true);
      });
  }, [transactionId]);

  useEffect(() => {
    if (timeLeft === null) return;

    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (timeInSeconds) => {
    const hours = Math.floor(timeInSeconds / 3600);
    const minutes = Math.floor((timeInSeconds % 3600) / 60);
    const seconds = timeInSeconds % 60;

    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };


  return (
    <div className="text-center p-4 sm:p-8 flex flex-col items-center justify-center overflow-hidden h-[80dvh]">
      <div className="flex items-center justify-center mb-4">
        <img src={Pending} className="w-16 h-16 sm:w-20 sm:h-20" />
      </div>
      <h1 className="text-xl sm:text-2xl font-semibold">Awaiting Payment</h1>
      <p className="mt-2 text-gray-700 text-sm sm:text-base px-4">
        Please complete the payment process
        before <span style={{ color: '#0F7275', textShadow: '0 0 8px #0F7275' }}>{formatTime(timeLeft)}</span> to complete your purchase.
      </p>
      <div className="mt-4 flex items-center justify-center w-full sm:w-auto">
        <button
          className="w-full sm:w-auto px-8 sm:px-12 py-2 mr-0 sm:mr-2 text-white rounded-full text-sm sm:text-base"
          style={{ backgroundColor: "#0F7275" }}
          onClick={() => navigate('/marketplace/homepage')}
        >
          Back to Marketplace
        </button>
      </div>
      <button onClick={() => navigate('/marketplace/history')} className="mt-4 block hover:underline text-sm sm:text-base" style={{ color: "#94C3B3" }}>
        Go to Transaction List
      </button>
    </div>
  );
}

export default PaymentPending;
