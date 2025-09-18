import React, { useEffect, useState } from 'react';
import LeavesType from '../../components/LeavesType';
import WidgetContainer from '../../components/Cards/WidgetContainer';
import WetLeavesMarketplace from '@assets/WetLeavesMarketplace.svg';
import DryLeavesMarketplace from '@assets/DryLeavesMarketplace.svg';
import PowderMarketplace from '@assets/PowderMarketplace.svg';
import Centra from "@assets/centra.svg";
import DiscountRate from "@assets/DiscountRate.svg";
import Button from '../../components/Button';
import CircularButton from '../../components/CircularButton';
import CentraContainer from '../../components/CentraContainer';
import { API_URL, formatRupiah, formatNumber } from '../../App';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router';
import LoadingBackdrop from '../../components/LoadingBackdrop';
import { useSearchParams } from 'react-router-dom';
import LoadingStatic from '@components/LoadingStatic';
import MarketplaceChangeAddress from '@components/MarketplaceChangeAddress';
import TransactionCountdown from '@components/TransactionCountdown';
import { useAuth } from '@context/AuthContext';
import PageNotFound from '../../pages/PageNotFound';
import { transactionApi, ApiError } from '../../api/marketShipmentApi';
import { formatErrorMessage } from '../../api/errorHandling';
import Popup from '../../components/Popups/Popup';
import toast from 'react-hot-toast';
import { 
    Typography, 
    Box
} from '@mui/material';

function TransactionDetails() {
    const [searchParams] = useSearchParams();

    const transactionId = searchParams.get("tr_id");
    // Removed mode parameter - will auto-detect based on transaction structure

    const [location, setLocation] = useState({
        latitude: 0,
        longitude: 0,
        addressDetails: ""
    });

    const [transactionDetails, setTransactionDetails] = useState({});

    const [error, setError] = useState(false);

    const [loading, setLoading] = useState(true); // Changed to true initially

    // New state for cancellation functionality
    const [cancelPopupRef, setCancelPopupRef] = useState(null);
    const [isPopupConfirming, setIsPopupConfirming] = useState(false);
    const [cancelling, setCancelling] = useState(false);
    const [popup, setPopup] = useState({
        open: false,
        title: '',
        content: '',
        onConfirm: null,
        onCancel: null,
        onRetry: null,
        isRetrying: false,
        confirmText: 'OK',
        cancelText: 'Cancel',
        retryText: 'Retry'
    });

    const user = useAuth();

    // Helper function to determine if this is a bulk transaction
    // Based purely on transaction structure - multiple sub-transactions means bulk
    const isBulkTransaction = () => {
        if (!transactionDetails.sub_transactions) return false;
        
        // Consider it bulk if it has multiple sub-transactions (multiple centras)
        return transactionDetails.sub_transactions.length > 1;
    };

    const subtotal = transactionDetails.sub_transactions?.reduce((total, subTx) => {
        return total + subTx.market_shipments.reduce((sum, shipment) => sum + (shipment.Price * shipment.Weight), 0);
    }, 0) || 0;

    const adminFee = 5000;
    const shippingFee = 50000;


    // Calculate total savings from discounts
    const calculateTotalSavings = () => {
        if (!transactionDetails.sub_transactions) return 0;
        
        return transactionDetails.sub_transactions.reduce((total, subTx) => {
            return total + subTx.market_shipments.reduce((sum, shipment) => {
                if (shipment.InitialPrice && shipment.InitialPrice !== shipment.Price) {
                    return sum + ((shipment.InitialPrice - shipment.Price) * shipment.Weight);
                }
                return sum;
            }, 0);
        }, 0);
    };

    const totalSavings = calculateTotalSavings();

    const totalAmount = subtotal + adminFee + shippingFee - totalSavings;

    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Get transaction details
                const transactionResponse = await axios.get(
                    `${API_URL}/marketplace/get_transaction_details/${transactionId}`
                );
                setTransactionDetails(transactionResponse.data);

                // Get location details
                const locationResponse = await axios.get(`${API_URL}/get_location_user`);
                const locationData = locationResponse.data;
                
                // Make sure we have all required fields
                setLocation({
                    latitude: locationData.latitude || 0,
                    longitude: locationData.longitude || 0,
                    addressDetails: locationData.location_address || ""
                });

                console.log(locationData);
                
                setLoading(false);
            } catch (error) {
                console.error("Error fetching data:", error);
                setError(true);
                setLoading(false);
            }
        };

        fetchData();
    }, [])

    const handleProceedToPurchase = async () => {
        setLoading(true);
        try {
            // Calculate invoice duration based on transaction expiration
            const transactionExpiration = new Date(transactionDetails.ExpirationAt);
            const currentTime = new Date();
            const durationInSeconds = Math.max(0, Math.floor((transactionExpiration - currentTime) / 1000));
            
            // Check if transaction has expired
            if (durationInSeconds <= 0) {
                setError('Transaction has expired. Cannot proceed with payment.');
                setLoading(false);
                return;
            }
            
            // Create the invoice request payload
            const invoicePayload = {
                external_id: 'transaction_' + Date.now() + '_' + transactionId,
                amount: totalAmount,
                payer_email: user.user.Email,
                description: (() => {
                    const allProducts = transactionDetails.sub_transactions?.flatMap(subTx => 
                        subTx.market_shipments.map(shipment => shipment.ProductName)
                    ) || [];
                    
                    if (allProducts.length === 1) {
                        return `Purchase of ${allProducts[0]}`;
                    } else {
                        return 'Purchase of Bulk Products';
                    }
                })(),
                success_redirect_url: `${window.location.origin}/marketplace/transaction/success?tr_id=${transactionId}`,
                failure_redirect_url: `${window.location.origin}/marketplace/transaction/pending?tr_id=${transactionId}`,
                invoice_duration: durationInSeconds // Sync with transaction expiration
            };

            const response = await axios.post(`${API_URL}/create_invoice`, invoicePayload);

            if (response.data.invoice_url) {
                // Redirect to the Xendit payment gateway
                window.location.href = response.data.invoice_url;
            }
        } catch (error) {
            console.error('Error creating Xendit invoice:', error);
            setError('Failed to create payment invoice. Please try again.');
            setLoading(false);
        }
    };

    const handleProceedToProductDetails = () => {
        navigate(`/marketplace/${transactionDetails.sub_transactions[0].CentraUsername}/${transactionDetails.sub_transactions[0].market_shipments[0].ProductName}?pr_id=${transactionDetails.sub_transactions[0].market_shipments[0].ProductID}`);
    }

    // Handle transaction cancellation with enhanced error handling
    const handleCancelTransaction = async () => {
        try {
            setCancelling(true);
            setIsPopupConfirming(true);
            
            // Call the cancellation API with row-level locking
            await transactionApi.cancelTransaction(transactionId, user.user.UserID);
            
            toast.success('Transaction cancelled successfully!', {
                duration: 4000,
                position: 'bottom-center',
            });
            transactionDetails.TransactionStatus = "Cancelled"
            
        } catch (err) {
            console.error('Error cancelling transaction:', err);
            
            const errorInfo = formatErrorMessage(err, 'Failed to cancel transaction');
            
            if (errorInfo.type === 'LOCK_CONFLICT') {
                // Show enhanced popup for lock conflicts with retry
                setPopup({ 
                    open: true, 
                    title: 'Transaction Cancellation Conflict',
                    content: errorInfo.message,
                    onRetry: () => {
                        setPopup(prev => ({ ...prev, isRetrying: true }));
                        handleCancelTransaction();
                    },
                    onCancel: () => {
                        setPopup({ open: false, title: '', content: '', onRetry: null, onCancel: null });
                    },
                    confirmText: 'Close',
                    cancelText: 'Cancel',
                    retryText: 'Try Again'
                });
            } else {
                // Show toast for other errors
                toast.error(errorInfo.message, {
                    duration: 5000,
                    position: 'bottom-center',
                });
            }
        } finally {
            setCancelling(false);
            setIsPopupConfirming(false);
            if (cancelPopupRef) {
                cancelPopupRef.close();
            }
        }
    };

    const handleOpenCancelDialog = () => {
        if (cancelPopupRef) {
            cancelPopupRef.showModal();
        }
    };

    const handleCloseCancelDialog = () => {
        if (cancelPopupRef) {
            cancelPopupRef.close();
        }
    };

    const getCancellationDescription = () => {
        const itemCount = transactionDetails.sub_transactions?.reduce((count, subTx) => 
            count + subTx.market_shipments.length, 0) || 0;
        const centraCount = transactionDetails.sub_transactions?.length || 0;
        
        const transactionType = isBulkTransaction() ? 'bulk transaction' : 'transaction';
        const itemText = isBulkTransaction() ? 
            `${itemCount} products from ${centraCount} centra${centraCount > 1 ? 's' : ''}` : 
            `${itemCount} product${itemCount > 1 ? 's' : ''}`;
        
        return `Are you sure you want to cancel this ${transactionType}?

⚠️ This action cannot be undone

What will happen:
• All reserved products will be released back to the marketplace
• You will need to create a new order if you want to purchase these items
• No charges will be applied to your account

Transaction Details:
📋 Transaction ID: ${transactionId}
💰 Total Amount: ${formatRupiah(totalAmount)}
📦 Items: ${itemText}${isBulkTransaction() ? `
🏪 Transaction Type: Bulk Purchase` : ''}`;
    };

    // Check if transaction can be cancelled (not paid, not expired, and not already cancelled)
    const canCancelTransaction = () => {
        if (!transactionDetails.TransactionStatus) return false;
        
        const status = transactionDetails.TransactionStatus.toLowerCase();
        const isExpired = new Date(transactionDetails.ExpirationAt) < new Date();
        const isPaid = status.includes('paid') || status.includes('success') || status.includes('completed');
        const isCancelled = status.includes('cancelled');
        
        return !isPaid && !isExpired && !isCancelled && (status.includes('pending') || status.includes('awaiting'));
    };

    // Dynamically select the correct image based on the product name
    const getProductImage = (ProductName) => {
        switch (ProductName) {
            case 'Wet Leaves':
                return WetLeavesMarketplace;
            case 'Dry Leaves':
                return DryLeavesMarketplace;
            case 'Powder':
                return PowderMarketplace;
            default:
                return null; // Handle cases where no image is found
        }
    };

    const getColorImage = (ProductName) => {
        switch (ProductName) {
            case 'Wet Leaves':
                return "#94C3B3"
            case 'Dry Leaves':
                return "#0F7275"
            case 'Powder':
                return "#C0CD30"
            default:
                return null;
        }
    };

    const isExpired = transactionDetails.TransactionStatus === "Transaction Expired";
    const isPaid = transactionDetails.TransactionStatus === "On Delivery";
    const isCancelled = transactionDetails.TransactionStatus === "Cancelled";

    if (error) {
        return <div className='h-[60dvh]'><PageNotFound /></div>;
    }

    if (!transactionDetails || Object.keys(transactionDetails).length === 0) {
        return <div className='flex justify-center items-center w-full py-4 h-[80vh]
        '>
            <LoadingStatic />
        </div>;
    }


    return (
        <div className='m-2 sm:m-4 sm:mx-6 flex flex-col gap-4'>
                 {
                isExpired &&
                <div role="alert" className="alert alert-error text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span className="text-xs sm:text-sm">This transaction has expired. {!isBulkTransaction() && 'Please re-purchase the selected product'} <span className='font-bold underline cursor-pointer' onClick={handleProceedToProductDetails}>here</span>.</span>
                </div>
            }

            {
                isCancelled &&
                <div role="alert" className="alert alert-warning text-sm">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                    </svg>
                    <span className="text-xs sm:text-sm">This transaction has been cancelled. {!isBulkTransaction() && 'Please re-purchase the selected product'} <span className='font-bold underline cursor-pointer' onClick={handleProceedToProductDetails}>here</span>.</span>
                </div>
            }

            {/* Transaction Type Header */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-2">
                <div className={`px-3 py-1 rounded-full text-xs sm:text-sm font-semibold w-fit ${
                    isBulkTransaction() 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                }`}>
                    {isBulkTransaction() ? 'Bulk Transaction' : 'Single Transaction'}
                </div>
                <span className="hidden sm:inline">-</span>
                <span className="text-gray-600 text-xs sm:text-sm">
                    ID: {transactionId}
                </span>
            </div>

       
            <div className='flex flex-col lg:flex-row gap-4 w-full items-start'>

                <div className='flex flex-col w-full lg:w-2/3'>
                    <MarketplaceChangeAddress location={location} setLocation={setLocation} />
                    
                    {/* Product Display - Different layouts for single vs bulk */}
                    <div className='flex flex-col gap-2 my-4'>
                        {isBulkTransaction() ? (
                            // Bulk Transaction Layout - Using CentraContainer Component
                            <div className='flex flex-col gap-2'>
                                {transactionDetails.sub_transactions?.map((subTx, idx) => {
                                    // Transform market_shipments to match CentraContainer expected format
                                    const chosenLeaves = subTx.market_shipments.map(shipment => ({
                                        id: shipment.ProductID,
                                        weight: shipment.Weight,
                                        price: shipment.Price,
                                        initial_price: shipment.InitialPrice || shipment.Price
                                    }));

                                    return (
                                        <CentraContainer
                                            key={idx}
                                            leavesLogo={getProductImage(subTx.market_shipments[0]?.ProductName)}
                                            centraName={subTx.CentraUsername}
                                            chosenLeaves={chosenLeaves}
                                        />
                                    );
                                })}
                            </div>
                        ) : (
                            // Single Transaction Layout - Original layout
                            transactionDetails.sub_transactions?.map((subTx, idx) => (
                                subTx.market_shipments.map((shipment, i) => (
                                    <WidgetContainer shadow={false} key={`${idx}-${i}`} border={false} className={'flex basis-full items-start w-full'}>
                                        <LeavesType
                                            backgroundColor={getColorImage(shipment.ProductName)}
                                            imageSrc={getProductImage(shipment.ProductName)}
                                            imgclassName=''
                                            py={3}
                                            px={3}
                                            className={"flex-shrink-0"}
                                        />
                                        <div className='flex flex-col w-full gap-2 ml-2 sm:ml-4'>
                                            <div className='flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 sm:gap-2'>
                                                <span className='font-bold text-sm sm:text-base'>{shipment.ProductName}</span>
                                                <div className='flex flex-row gap-2 items-center font-bold text-sm sm:text-base'>
                                                    {/* Show initial price if discounted */}
                                                    {shipment.InitialPrice && shipment.InitialPrice !== shipment.Price && (
                                                        <span className='line-through text-xs font-light text-gray-500'>
                                                            {formatRupiah(shipment.InitialPrice)}
                                                        </span>
                                                    )}
                                                    <span className="text-xs sm:text-sm">{formatRupiah(shipment.Price)} x {shipment.Weight} Kg</span>
                                                    {shipment.InitialPrice && shipment.InitialPrice !== shipment.Price && (
                                                        <img src={DiscountRate} className='w-5 h-5 sm:w-6 sm:h-6' alt="Discount" />
                                                    )}
                                                </div>
                                            </div>
                                            {/* Show discount savings if applicable */}
                                            {shipment.InitialPrice && shipment.InitialPrice !== shipment.Price && (
                                                <div className="text-xs sm:text-sm text-gray-600">
                                                    <div className="flex flex-col sm:flex-row sm:justify-between gap-1">
                                                        <span className='line-through'>
                                                            Original: {formatRupiah(shipment.InitialPrice * shipment.Weight)}
                                                        </span>
                                                        <span className="text-green-600 font-semibold">
                                                            You saved {formatRupiah((shipment.InitialPrice - shipment.Price) * shipment.Weight)}
                                                        </span>
                                                    </div>
                                                </div>
                                            )}
                                            <div className="flex flex-row gap-2 items-center">
                                                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-[#C0CD30] rounded-full flex items-center justify-center">
                                                    <img src={Centra} className='w-4 h-4 sm:w-6 sm:h-6' alt="Centra Logo" />
                                                </div>
                                                <span className="font-semibold text-sm sm:text-base">{subTx.CentraUsername}</span>
                                            </div>
                                        </div>
                                    </WidgetContainer>
                                ))
                            ))
                        )}
                    </div>
                </div>

                <WidgetContainer border={false} padding={false} className={'flex flex-col w-full lg:w-1/3 py-2 px-2 justify-center font-semibold text-base sm:text-lg'}>
                    <span className='text-center text-sm sm:text-lg'>
                        {isBulkTransaction() ? 'Bulk Order Summary' : 'Order Summary'}
                    </span>
                    
                    
                    <div className='flex flex-col gap-2 text-[#616161] px-3 sm:px-6 text-sm sm:text-base'>
                        <div className='flex flex-row justify-between'>
                            <span>Total Weight</span>
                            <span className='font-bold'>{transactionDetails.sub_transactions?.reduce((total, subTx) => 
                                total + subTx.market_shipments.reduce((sum, shipment) => sum + shipment.Weight, 0), 0) || 0} Kg</span>
                        </div>
                        <div className='flex flex-row justify-between'>
                            <span>Total Items</span>
                            <span className='font-bold'>{transactionDetails.sub_transactions?.reduce((total, subTx) => 
                                total + subTx.market_shipments.length, 0) || 0}</span>
                        </div>
                        <hr className="mx-2 sm:mx-4" style={{ color: 'rgba(148, 195, 179, 0.50)' }}></hr>
                        <div className='flex flex-row justify-between'>
                            <span>Item Subtotal</span>
                            <span className='font-bold text-xs sm:text-sm'>{formatRupiah(subtotal)}</span>
                        </div>
                        <div className='flex flex-row justify-between'>
                            <span>Shipping Fee</span>
                            <span className='font-bold text-xs sm:text-sm'>{formatRupiah(shippingFee)}</span>
                        </div>
                        <div className='flex flex-row justify-between'>
                            <span>Admin Fee</span>
                            <span className='font-bold text-xs sm:text-sm'>{formatRupiah(adminFee)}</span>
                        </div>
                        {/* Show total savings if there are any discounts */}
                        {totalSavings > 0 && (
                            <div className='flex flex-row justify-between'>
                                <span className="text-green-600">Discounts</span>
                                <span className='font-bold text-green-600 text-xs sm:text-sm'>-{formatRupiah(totalSavings)}</span>
                            </div>
                        )}
                    </div>
                    <hr className="mx-2 sm:mx-4" style={{ color: 'rgba(148, 195, 179, 0.50)' }}></hr>
                    <div className='flex flex-row justify-between px-3 sm:px-6'>
                        <span>Subtotal</span>
                        <span className='font-bold text-sm sm:text-base'>{formatRupiah(totalAmount)}</span>
                    </div>

                    <hr className="mb-2" style={{ color: 'rgba(148, 195, 179, 0.50)' }}></hr>
                    {(!isExpired && !isPaid && !isCancelled) &&
                        <>
                            <div className='px-3 sm:px-6'>
                                <TransactionCountdown expiresAt={transactionDetails.ExpirationAt} />
                            </div>
                            <div className='flex flex-col gap-2 w-full px-2 sm:px-0'>
                                <button
                                    className={`w-full border-2 py-2 sm:py-3 rounded-full transition-all duration-300 text-sm sm:text-base ${
                                        !loading
                                            ? 'bg-[#0F7275] text-white border-[#0F7275] hover:shadow-lg hover:bg-[#0d5f62]'
                                            : 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
                                    }`}
                                    onClick={handleProceedToPurchase}
                                    disabled={loading}
                                >
                                    {loading ? (
                                        <span className='loading loading-dots loading-sm'></span>
                                    ) : (
                                        'Proceed to Purchase'
                                    )}
                                </button>
                                {canCancelTransaction() && (
                                    <button
                                        className={`w-full text-sm sm:text-base border-2 py-2 sm:py-3 rounded-full transition-all duration-300 ${
                                            !cancelling
                                                ? 'bg-white text-[#dc2626] border-[#dc2626] hover:shadow-lg hover:bg-red-50'
                                                : 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
                                        }`}
                                        onClick={!cancelling ? handleOpenCancelDialog : undefined}
                                        disabled={cancelling}
                                    >
                                        {cancelling ? (
                                            <span className='loading loading-dots loading-sm'></span>
                                        ) : (
                                            'Cancel Transaction'
                                        )}
                                    </button>
                                )}
                            </div>
                            <span className='mb-2 place-self-center text-[#79B2B7] font-normal text-xs sm:text-sm text-center px-4'>By continuing, you have agreed with the <br className="hidden sm:block"></br><u>Terms and Conditions</u></span>
                        </>
                    }

                    {/* Cancellation Popup */}
                    <Popup
                        ref={(ref) => setCancelPopupRef(ref)}
                        warning={true}
                        confirm={true}
                        description={getCancellationDescription()}
                        onConfirm={() => {
                            handleCancelTransaction();
                        }}
                        onCancel={handleCloseCancelDialog}
                        confirmText={cancelling ?  <span className='loading loading-dots loading-sm'></span> : "Confirm Cancellation"}
                        cancelText="Keep Transaction"
                        // isConfirming={isPopupConfirming}
                        leavesid="cancel-transaction-popup"
                    />

                </WidgetContainer>
            </div>
            
            {/* Enhanced Popup for Error Handling */}
            <Popup
                open={popup.open}
                title={popup.title}
                content={popup.content}
                onConfirm={popup.onConfirm}
                onCancel={popup.onCancel}
                onRetry={popup.onRetry}
                confirmText={popup.confirmText}
                cancelText={popup.cancelText}
                retryText={popup.retryText}
                isRetrying={popup.isRetrying}
                canRetry={!!popup.onRetry}
            />
            
            {/* {loading && <LoadingBackdrop />} */}
        </div>
    );
}

export default TransactionDetails;
