import Success from "@assets/Success.svg";
import Download from "@assets/Downloading.svg";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

const API_URL = import.meta.env.VITE_API_URL;

function PaymentSuccessful(){
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const transactionId = searchParams.get('tr_id');
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        // If no transaction ID, redirect to transaction history
        if (!transactionId) {
            toast.error('Transaction ID not found');
            navigate('/marketplace/history');
        }
    }, [transactionId, navigate]);

    const handleViewOrder = () => {
        if (transactionId) {
            navigate(`/marketplace/transaction?tr_id=${transactionId}`);
        }
    };

    const handleDownloadInvoice = async () => {
        if (!transactionId) {
            toast.error('Transaction ID not found');
            return;
        }

        setIsGenerating(true);
        try {
            const response = await axios.get(
                `${API_URL}/invoice/generate/${transactionId}`,
                {
                    responseType: 'blob',
                    withCredentials: true
                }
            );

            // Create a blob from the PDF data
            const blob = new Blob([response.data], { type: 'application/pdf' });
            const url = window.URL.createObjectURL(blob);
            
            // Create a temporary link and trigger download
            const link = document.createElement('a');
            link.href = url;
            link.download = `Invoice_${transactionId}.pdf`;
            document.body.appendChild(link);
            link.click();
            
            // Cleanup
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            
            toast.success('Invoice downloaded successfully!', {
                duration: 3000,
                style: {
                    minWidth: '300px'
                }
            });
        } catch (error) {
            console.error('Error downloading invoice:', error);
            toast.error('Failed to download invoice. Please try again.', {
                duration: 4000,
                style: {
                    minWidth: '300px'
                }
            });
        } finally {
            setIsGenerating(false);
        }
    };

    return <>
        <div className="text-center p-4 sm:p-8 flex flex-col items-center justify-center overflow-hidden h-[80dvh]">
            <div className="flex items-center justify-center mb-4">
            <img src={Success} className="w-16 h-16 sm:w-20 sm:h-20" />
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold">Payment Successful</h1>
            <p className="mt-2 text-gray-700 w-full sm:w-2/3 lg:w-1/3 mx-auto text-sm sm:text-base px-4"style={{wordWrap: 'break-word'}}>
            Thank you for your purchase! Your transaction has been completed successfully.
            You can download your invoice for detailed information.
            </p>
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-0 w-full sm:w-auto">
                <button 
                    onClick={handleViewOrder}
                    className="w-full sm:w-auto px-6 sm:px-10 py-2 sm:mr-2 text-white rounded-full text-sm sm:text-base hover:opacity-90 transition-opacity" 
                    style={{backgroundColor:"#0F7275"}}
                >
                    View Order
                </button>
                <button 
                    onClick={handleDownloadInvoice}
                    disabled={isGenerating}
                    className="w-full sm:w-auto px-4 sm:px-6 py-2 text-white rounded-full text-sm sm:text-base hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed" 
                    style={{backgroundColor:"#0F7275"}}
                >
                    <div className="flex items-center justify-center">
                        <img src={Download} className="w-4 h-4 flex mr-2" />
                        {isGenerating ? <span className='loading loading-dots loading-sm'></span> : 'Download Invoice'}
                    </div>
                </button>
            </div>
            <a href="/marketplace/history" className="mt-4 block hover:underline text-sm sm:text-base"style={{color:"#94C3B3"}}>
            Go to Transaction List
            </a>
        </div>
    </>
}

export default PaymentSuccessful;