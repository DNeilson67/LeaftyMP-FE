import React, { useEffect, useState } from 'react';
import LeavesType from '@components/LeavesType';
import Centra from "@assets/centra.svg";
import { useNavigate } from 'react-router';
import WetLeavesMarketplace from '@assets/WetLeavesMarketplace.svg';
import DryLeavesMarketplace from '@assets/DryLeavesMarketplace.svg';
import PowderMarketplace from '@assets/PowderMarketplace.svg';

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

    // Calculate total Centras (users with CentraUsername)
    const centrasTotal = transaction.sub_transactions.reduce((acc, sub) => acc + (sub.CentraUsername ? 1 : 0), 0);

    // Calculate Subtotal (sum of prices * weights)
    const subtotal = transaction.sub_transactions.reduce((acc, sub) => {
        return acc + sub.market_shipments.reduce((shipmentAcc, shipment) => {
            return shipmentAcc + (shipment.Price * shipment.Weight);
        }, 0);
    }, 0);

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
        <div className="bg-white rounded-lg p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-2 justify-center">
                    <div className="w-10 h-10 bg-[#C0CD30] rounded-full flex items-center justify-center">
                        <img src={Centra} className="w-7 h-7" alt="Centra Icon" />
                    </div>
                    <span className="font-semibold text-xl">{transaction.sub_transactions[0].CentraUsername}</span>
                    {centrasTotal > 1 && (
                        <div className="ml-2 text-gray-500 text-sm">+{centrasTotal}</div>
                    )}
                </div>

                <span
                    className={`px-4 py-1 rounded-full text-sm font-semibold gap-2 flex flex-row items-center ${transaction.TransactionStatus === "Transaction Expired"
                        ? "bg-[#D45D5D]"
                        : "bg-[#79B2B7]"
                        }  text-white`}
                >
                    {transaction.TransactionStatus.charAt(0).toUpperCase() +
                        transaction.TransactionStatus.slice(1)}

                    {transaction.TransactionStatus === "Transaction Pending" && (
                        <>
                            <span>-</span>
                            <div className="font-bold countdown font-mono">
                                <span style={{ '--value': timeRemaining.hours }}></span>:
                                <span style={{ '--value': timeRemaining.minutes }}></span>:
                                <span style={{ '--value': timeRemaining.seconds }}></span>
                            </div>
                        </>
                    )}
                </span>

            </div>

            <hr style={{ color: 'rgba(148, 195, 179, 0.50)' }} />
            <div className="flex items-center my-4">
                <LeavesType imageSrc={getImageSrc(transaction.sub_transactions[0].market_shipments[0].ProductName)} imgclassName="w-5/6 h-5/6" py={8} px={4} backgroundColor={getColorImage(transaction.sub_transactions[0].market_shipments[0].ProductName)} />
                <div className="ml-4">
                    <h3 className="font-semibold text-lg">{transaction.sub_transactions[0].market_shipments[0].ProductName}</h3>
                    <p className="text-gray-600">Amount: {transaction.sub_transactions[0].market_shipments[0].Weight} Kg</p>
                </div>
                <div className="ml-auto">
                    <span className="font-semibold text-xl">Rp {transaction.sub_transactions[0].market_shipments[0].Price.toLocaleString()}</span>
                </div>
            </div>

            <hr style={{ color: 'rgba(148, 195, 179, 0.50)' }} />
            <div className="flex justify-end items-center text-lg mt-2">
                <span className="font-semibold">
                    Subtotal: <span className="font-bold text-2xl">Rp {subtotal.toLocaleString()}</span>
                </span>
            </div>

            <div className="mt-4 flex justify-between items-center">
                <span className="text-sm">
                    {new Date(transaction.CreatedAt).toLocaleString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                    })} | <span className="text-gray-400 italic">{transaction.TransactionID}</span>
                </span>

                <div className="space-x-2">
                    <button className="px-4 py-2 bg-[#79B2B7] text-white rounded-lg transition-all duration-300 hover:shadow-lg">Contact Support</button>
                    <button className="px-4 py-2 border border-[#79B2B7] text-[#2c5e4c] rounded-lg transition-all duration-300 hover:shadow-lg" onClick={handleViewOrder}>View Order</button>
                </div>
            </div>
        </div>
    );
}
