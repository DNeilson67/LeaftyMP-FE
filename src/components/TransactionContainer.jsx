import React, { useEffect, useState } from 'react';
import LeavesType from '@components/LeavesType';
import Centra from "@assets/centra.svg";
import { useNavigate } from 'react-router';
import WetLeavesMarketplace from '@assets/WetLeavesMarketplace.svg';
import DryLeavesMarketplace from '@assets/DryLeavesMarketplace.svg';
import PowderMarketplace from '@assets/PowderMarketplace.svg';
import OverlappingAvatars from '@components/OverlappingAvatars';

export default function TransactionContainer({ transaction }) {
    const [timeRemaining, setTimeRemaining] = useState({
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    function getImageSrc(productName) {
        switch (productName) {
            case 'Wet Leaves':
                return WetLeavesMarketplace;
            case 'Dry Leaves':
                return DryLeavesMarketplace;
            case 'Powder':
                return PowderMarketplace;
            default:
                return WetLeavesMarketplace; // Default image if no match
        }
    }

    const getColorImage = (productName) => {
        switch (productName) {
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

    const navigate = useNavigate();

    // Determine if this is a bulk transaction
    const isBulkTransaction = transaction.sub_transactions.length > 1;
    
    // Calculate total Centras (users with CentraUsername)
    const centrasTotal = transaction.sub_transactions.reduce((acc, sub) => acc + (sub.CentraUsername ? 1 : 0), 0);

    // Calculate Subtotal (sum of prices * weights)
    const subtotal = transaction.sub_transactions.reduce((acc, sub) => {
        return acc + sub.market_shipments.reduce((shipmentAcc, shipment) => {
            return shipmentAcc + (shipment.Price * shipment.Weight);
        }, 0);
    }, 0);

    // For bulk transactions, get summary data
    const getBulkSummary = () => {
        const productTypes = new Set();
        let totalWeight = 0;
        let totalItems = 0;

        transaction.sub_transactions.forEach(sub => {
            sub.market_shipments.forEach(shipment => {
                productTypes.add(shipment.ProductName);
                totalWeight += shipment.Weight || 0;
                totalItems += 1;
            });
        });

        return {
            productTypes: Array.from(productTypes),
            totalWeight,
            totalItems,
            primaryProduct: Array.from(productTypes)[0] // Use first product type for display
        };
    };

    const bulkSummary = isBulkTransaction ? getBulkSummary() : null;

    // Handle View Order navigation
    function handleViewOrder() {
        navigate(`/marketplace/transaction?tr_id=${transaction.TransactionID}`);
    }

    // Countdown logic
    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date();
            const expirationDate = new Date(transaction.ExpirationAt);
            const remainingTime = expirationDate - now;

            if (remainingTime <= 0) {
                setTimeRemaining({ hours: 0, minutes: 0, seconds: 0 });
                clearInterval(interval);
            } else {
                const hours = Math.floor(remainingTime / 1000 / 60 / 60);
                const minutes = Math.floor((remainingTime % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((remainingTime % (1000 * 60)) / 1000);
                setTimeRemaining({ hours, minutes, seconds });
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [transaction.ExpirationAt]);

    return (
        <div className="bg-white rounded-lg p-3 sm:p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-3 sm:gap-0 mb-4">
                {/* Centra Display - Different for bulk vs single */}
                {isBulkTransaction ? (
                    <OverlappingAvatars centras={transaction.sub_transactions} />
                ) : (
                    <div className="flex items-center space-x-2 justify-start sm:justify-center">
                        <div className="w-6 h-6 sm:w-10 sm:h-10 bg-[#C0CD30] rounded-full flex items-center justify-center">
                            <img src={Centra} className="w-4 h-4 sm:w-7 sm:h-7" alt="Centra Icon" />
                        </div>
                        <span className="font-semibold text-sm sm:text-lg">{transaction.sub_transactions[0].CentraUsername}</span>
                    </div>
                )}

                {/* Status Badge - Mobile optimized */}
                <div className="flex justify-between items-center sm:justify-end">
                    <span
                        className={`px-3 sm:px-4 py-1.5 sm:py-1 rounded-full text-xs sm:text-sm font-semibold ${["Transaction Expired", "Cancelled"].includes(transaction.TransactionStatus)
                            ? "bg-[#D45D5D]"
                            : "bg-[#79B2B7]"
                            }  text-white`}
                    >
                        {transaction.TransactionStatus.charAt(0).toUpperCase() +
                            transaction.TransactionStatus.slice(1)}
                    </span>
                </div>
            </div>

            <hr className="my-3 sm:my-4" style={{ color: 'rgba(148, 195, 179, 0.50)' }} />
            
            {/* Product Display - Different for bulk vs single */}
            {isBulkTransaction ? (
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0 my-3 sm:my-4">
                    <div className="flex items-center">
                        <LeavesType 
                            imageSrc={getImageSrc(bulkSummary.primaryProduct)} 
                            imgclassName="w-4/5 sm:w-5/6 h-4/5 sm:h-5/6" 
                            py={6} 
                            px={3} 
                            className="sm:py-8 sm:px-4"
                            backgroundColor={getColorImage(bulkSummary.primaryProduct)} 
                        />
                        <div className="ml-3 sm:ml-4 flex-1">
                            <h3 className="font-semibold text-base sm:text-lg leading-tight">
                                {bulkSummary.productTypes.length === 1 
                                    ? bulkSummary.primaryProduct 
                                    : `Mixed Products`
                                }
                            </h3>
                            {bulkSummary.productTypes.length > 1 && (
                                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                                    {bulkSummary.productTypes.join(', ')}
                                </p>
                            )}
                            <p className="text-gray-600 text-sm sm:text-base mt-1">
                                {bulkSummary.totalItems.toLocaleString()} items • {bulkSummary.totalWeight.toLocaleString('en-US', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} Kg
                            </p>
                        </div>
                    </div>
                    <div className="sm:ml-auto">
                        <span className="font-semibold text-base sm:text-xl text-[#79B2B7]">Bulk Order</span>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-0 my-3 sm:my-4">
                    <div className="flex items-center flex-1">
                        <LeavesType 
                            imageSrc={getImageSrc(transaction.sub_transactions[0].market_shipments[0].ProductName)} 
                            imgclassName="w-4/5 sm:w-5/6 h-4/5 sm:h-5/6" 
                            py={6} 
                            px={3} 
                            className="sm:py-8 sm:px-4"
                            backgroundColor={getColorImage(transaction.sub_transactions[0].market_shipments[0].ProductName)} 
                        />
                        <div className="ml-3 sm:ml-4 flex-1">
                            <h3 className="font-semibold text-base sm:text-lg">{transaction.sub_transactions[0].market_shipments[0].ProductName}</h3>
                            <p className="text-gray-600 text-sm sm:text-base">Amount: {transaction.sub_transactions[0].market_shipments[0].Weight} Kg</p>
                        </div>
                    </div>
                    <div className="sm:ml-auto">
                        <span className="font-semibold text-base sm:text-xl">Rp {transaction.sub_transactions[0].market_shipments[0].Price.toLocaleString()}</span>
                    </div>
                </div>
            )}

            <hr className="my-3 sm:my-4" style={{ color: 'rgba(148, 195, 179, 0.50)' }} />
            <div className="flex justify-center sm:justify-end items-center text-base sm:text-lg mt-2">
                <span className="font-semibold">
                    Subtotal: <span className="font-bold text-lg sm:text-2xl">Rp {subtotal.toLocaleString()}</span>
                </span>
            </div>

            <div className="mt-4 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
                <span className="text-xs sm:text-sm order-2 sm:order-1">
                    {new Date(transaction.CreatedAt).toLocaleString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })} | <span className="text-gray-400 italic text-xs">{transaction.TransactionID}</span>
                </span>

                <div className="flex flex-col sm:flex-row gap-2 sm:gap-2 order-1 sm:order-2">
                    <button className="px-3 sm:px-4 py-2 bg-[#79B2B7] text-white rounded-lg transition-all duration-300 hover:shadow-lg text-sm sm:text-base font-medium">
                        Support
                    </button>
                    <button className="px-3 sm:px-4 py-2 border border-[#79B2B7] text-[#2c5e4c] rounded-lg transition-all duration-300 hover:shadow-lg text-sm sm:text-base font-medium" onClick={handleViewOrder}>
                        View Order
                    </button>
                </div>
            </div>
        </div>
    );
}
