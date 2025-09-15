import React, { useEffect, useState } from 'react';
import LeavesType from '../../components/LeavesType';
import WidgetContainer from '../../components/Cards/WidgetContainer';
import WetLeavesMarketplace from '@assets/WetLeavesMarketplace.svg';
import DryLeavesMarketplace from '@assets/DryLeavesMarketplace.svg';
import PowderMarketplace from '@assets/PowderMarketplace.svg';
import Centra from "@assets/centra.svg";
import Button from '../../components/Button';
import { API_URL, formatRupiah } from '../../App';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router';
import LoadingBackdrop from '../../components/LoadingBackdrop';
import { useSearchParams } from 'react-router-dom';
import LoadingStatic from '@components/LoadingStatic';
import MarketplaceChangeAddress from '@components/MarketplaceChangeAddress';
import TransactionCountdown from '@components/TransactionCountdown';
import { useAuth } from '@context/AuthContext';
import PageNotFound from '../../pages/PageNotFound';

function TransactionDetails() {
    const [searchParams] = useSearchParams();

    const transactionId = searchParams.get("tr_id");

    const [location, setLocation] = useState({
        latitude: 0,
        longitude: 0,
        addressDetails: ""
    });

    const [transactionDetails, setTransactionDetails] = useState({});

    const [error, setError] = useState(false);

    const [loading, setLoading] = useState(true); // Changed to true initially

    const user = useAuth();

    const subtotal = transactionDetails.sub_transactions?.reduce((total, subTx) => {
        return total + subTx.market_shipments.reduce((sum, shipment) => sum + (shipment.Price * shipment.Weight), 0);
    }, 0) || 0;

    const adminFee = 5000;
    const shippingFee = 50000;

    const totalAmount = subtotal + adminFee + shippingFee;

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
            const response = await axios.post(`${API_URL}/create_invoice`, {
                external_id: 'transaction_' + Date.now() + '_' + transactionId,
                amount: totalAmount,
                payer_email: user.user.Email,
                description: 'Purchase of ' + transactionDetails.sub_transactions?.map(subTx => subTx.market_shipments.map(shipment => shipment.ProductName).join(', ')).join(', '),
                success_redirect_url: `${window.location.origin}/marketplace/transaction/success?tr_id=${transactionId}`,
                failure_redirect_url: `${window.location.origin}/marketplace/transaction/pending?tr_id=${transactionId}`
            });

            if (response.data.invoice_url) {
                // Redirect to the Xendit payment gateway
                window.location.href = response.data.invoice_url;
            }
        } catch (error) {
            console.error('Error creating Xendit invoice:', error);
        }
    };

    const handleProceedToProductDetails = () => {
        navigate(`/marketplace/${transactionDetails.sub_transactions[0].CentraUsername}/${transactionDetails.sub_transactions[0].market_shipments[0].ProductName}?pr_id=${transactionDetails.sub_transactions[0].market_shipments[0].ProductID}`);
    }

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
        <div className='m-4 mx-6 flex flex-col gap-4'>
            {
                isExpired &&
                <div role="alert" className="alert alert-error">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>This transaction has expired. Please re-purchase the selected product in <span className='font-bold underline cursor-pointer' onClick={handleProceedToProductDetails}>here</span>.</span>
                </div>
            }

            <div className='flex flex-row gap-4 w-full lg:flex-nowrap flex-wrap items-start'>

                <div className='flex flex-col w-full lg:w-2/3'>
                    <MarketplaceChangeAddress location={location} setLocation={setLocation} />
                    <div className='flex flex-col gap-2 my-4'>
                        {transactionDetails.sub_transactions?.map((subTx, idx) => (
                            subTx.market_shipments.map((shipment, i) => (
                                <WidgetContainer key={`${idx}-${i}`} border={false} className={'flex lg:basis-2/3 items-start w-full'}>
                                    <LeavesType
                                        backgroundColor={getColorImage(shipment.ProductName)}
                                        imageSrc={getProductImage(shipment.ProductName)}
                                        imgclassName=''
                                        py={4}
                                        px={4}
                                        className={""}
                                    />
                                    <div className='flex flex-col w-full gap-2 '>
                                        <div className='flex flex-row justify-between items-center'>
                                            <span className='font-bold'>{shipment.ProductName}</span>
                                            <div className='flex flex-row gap-2 items-center font-bold'>
                                                <span>{formatRupiah(shipment.Price)} x {shipment.Weight} Kg</span>
                                            </div>

                                        </div>
                                        <div className="flex flex-row gap-2 items-center">
                                            <div className="w-8 h-8 bg-[#C0CD30] rounded-full flex items-center justify-center">
                                                <img src={Centra} className='w-6 h-6' alt="Centra Logo" />
                                            </div>
                                            <span className="font-semibold">{subTx.CentraUsername}</span>
                                        </div>
                                    </div>
                                </WidgetContainer>
                            ))
                        ))}
                    </div>
                </div>

                <WidgetContainer border={false} padding={false} className={'flex flex-col lg:basis-1/3 py-2 px-2 justify-center font-semibold text-lg'}>
                    <span className='text-center'>Order Summary</span>
                    <div className='flex flex-col gap-2 text-[#616161] px-6'>
                        <div className='flex flex-row justify-between'>
                            <span>Item Subtotal</span>
                            <span className='font-bold'>{formatRupiah(subtotal)}</span>
                        </div>
                        <div className='flex flex-row justify-between'>
                            <span>Shipping Fee</span>
                            <span className='font-bold'>{formatRupiah(shippingFee)}</span>
                        </div>
                        <div className='flex flex-row justify-between'>
                            <span>Admin Fee</span>
                            <span className='font-bold'>{formatRupiah(adminFee)}</span>
                        </div>
                    </div>
                    <hr className="mx-4" style={{ color: 'rgba(148, 195, 179, 0.50)' }}></hr>
                    <div className='flex flex-row justify-between px-6'>
                        <span>Subtotal</span>
                        <span className='font-bold'>{formatRupiah(totalAmount)}</span>
                    </div>

                    <hr className="mb-2" style={{ color: 'rgba(148, 195, 179, 0.50)' }}></hr>
                    {(!isExpired && !isPaid) &&
                        <>
                            <div className='px-6'>
                                <TransactionCountdown expiresAt={transactionDetails.ExpirationAt} />
                            </div>
                            <Button onClick={handleProceedToPurchase} className={"place-self-center w-full"} background={"#0F7275"} color={"white"} label={"Proceed to Purchase"} />
                            <span className='mb-2 place-self-center text-[#79B2B7] font-normal text-sm text-center'>By continuing, you have agreed with the <br></br><u>Terms and Conditions</u></span>
                        </>
                    }

                </WidgetContainer>
            </div>
            {loading && <LoadingBackdrop />}
        </div>
    );
}

export default TransactionDetails;
