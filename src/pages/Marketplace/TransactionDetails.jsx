import React, { useEffect, useState } from 'react';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import LeavesType from '../../components/LeavesType';
import WidgetContainer from '../../components/Cards/WidgetContainer';
import WetLeavesMarketplace from '@assets/WetLeavesMarketplace.svg';
import DryLeavesMarketplace from '@assets/DryLeavesMarketplace.svg';
import PowderMarketplace from '@assets/PowderMarketplace.svg';
import Centra from "@assets/centra.svg";
import Location from "@assets/location.svg";
import Button from '../../components/Button';
import MyMapComponent from "@components/MyMapComponents";
import { API_URL, formatRupiah } from '../../App';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router';
import LoadingBackdrop from '../../components/LoadingBackdrop';

function TransactionDetails() {
    const [showMap, setShowMap] = useState(false);
    const location = useLocation();
    const { quantity, pricePerKg, productName, centraName } = location.state || {};

    const [latitude, setLatitude] = useState(null);
    const [longitude, setLongitude] = useState(null);
    const [address, setAddress] = useState(null);


    const subtotal = quantity * pricePerKg;
    const adminFee = 5000;
    const shippingFee = 50000;
    const totalAmount = subtotal + adminFee + shippingFee;

    const handleProceedToPurchase = async () => {
        setLoading(true);
        try {
            const response = await axios.post(`${API_URL}/create_invoice`, {
                external_id: 'order_' + Date.now(),
                amount: totalAmount,
                payer_email: 'samsungneilson@gmail.com',
                description: 'Purchase of Wet Leaves',
                success_redirect_url: `${window.location.origin}/marketplace/transaction/success`,
                failure_redirect_url: `${window.location.origin}/marketplace/transaction/pending`
            });

            if (response.data.invoice_url) {
                // Redirect to the Xendit payment gateway
                window.location.href = response.data.invoice_url;
            }
        } catch (error) {
            console.error('Error creating Xendit invoice:', error);
        }
    };

    const breadcrumbs = [
        <Link underline="hover" key="1" color="black" href="/" onClick={(e) => e.preventDefault()} sx={{ fontFamily: 'Montserrat' }}>
            Home
        </Link>,
        <Link underline="hover" color="black" key="2" onClick={(e) => e.preventDefault()} sx={{ fontFamily: 'Montserrat' }}>
            {productName}
        </Link>,
        <Typography key="3" sx={{ color: '#0F7275', fontWeight: '500', fontFamily: 'Montserrat' }}>
            Transaction Details
        </Typography>,
    ];

    const navigate = useNavigate();

    // Dynamically select the correct image based on the product name
    const getProductImage = (productName) => {
        switch (productName) {
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

    const [addressDetails, setAddressDetails] = useState("Jl. Pangeran Antasari No. 1234 Kompleks Permata Indah Blok C No. 56 Kecamatan Ciputat Timur, Kota Tangerang Selatan Provinsi Banten, 15412 Indonesia");
    const [loading, setLoading] = useState(false);

    const handleOpenMap = () => {
        document.getElementById('map_modal').showModal()
        setShowMap(true);
    }

    const handleCloseMap = () => {
        setShowMap(false);
    }

    return (
        <div className='m-4 mx-6'>
            {/* <Stack spacing={2}>
                <Breadcrumbs
                    separator={<NavigateNextIcon fontSize="small" style={{ color: '#0F7275' }} />}
                    aria-label="breadcrumb"
                >
                    {breadcrumbs}
                </Breadcrumbs>
            </Stack> */}
            <div className='flex flex-row gap-4 w-full lg:flex-nowrap flex-wrap items-center justify-center'>
                <WidgetContainer border={false} className={'flex lg:basis-2/3 my-4 items-start w-full'}>
                    <LeavesType backgroundColor={getColorImage(productName)} imageSrc={getProductImage(productName)} imgclassName='' py={4} px={4} className={""} />
                    <div className='flex flex-col w-full gap-2 '>
                        <div className='flex flex-row justify-between items-center'>
                            <span className='font-bold'>{productName}</span>
                            <span>{quantity} Kg</span>
                        </div>
                        <div className="flex flex-row gap-2 items-center">
                            <div className="w-8 h-8 bg-[#C0CD30] rounded-full flex items-center justify-center">
                                <img src={Centra} className='w-6 h-6' alt="Centra Logo" />
                            </div>
                            <span className="font-semibold">{centraName}</span>
                        </div>
                        <div className='flex flex-col p-4 border-[#C8DFD7] border rounded-lg gap-2'>
                            <span className='font-bold text-lg'>Shipping Address</span>
                            <div className='flex flex-row justify-start gap-2'>
                                <img src={Location} className='w-4 h-4' alt="Location Icon" />
                                <span>{addressDetails}</span>
                            </div>
                            <Button onClick={handleOpenMap} label="Change Address" background={"#79B2B7"} color={"white"} noMax={true} className={"w-fit"} />
                        </div>
                    </div>
                </WidgetContainer>
                <WidgetContainer border={false} padding={false} className={'flex flex-col lg:basis-1/3 my-4 px-2 justify-center font-semibold text-lg'}>
                    <span className='text-center'>Order Summary</span>
                    <div className='flex flex-col gap-2 text-[#616161]'>
                        <div className='flex flex-row justify-between px-6'>
                            <span>Item Subtotal</span>
                            <span className='font-bold'>{formatRupiah(subtotal)}</span>
                        </div>
                        <div className='flex flex-row justify-between px-6'>
                            <span>Shipping Fee</span>
                            <span className='font-bold'>{formatRupiah(shippingFee)}</span>
                        </div>
                        <div className='flex flex-row justify-between px-6'>
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
                    <Button onClick={handleProceedToPurchase} className={"place-self-center w-full"} background={"#0F7275"} color={"white"} label={"Proceed to Purchase"} />
                    <span className='mb-2 place-self-center text-[#79B2B7] font-normal text-sm text-center'>By continuing, you have agreed with the <br></br><u>Terms and Conditions</u></span>
                </WidgetContainer>
            </div>
            <dialog id="map_modal" className="modal modal-bottom sm:modal-middle">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Select your Location</h3>
                    <MyMapComponent setShowMap={setShowMap} setAddressDetails={setAddressDetails} />
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
            {loading && <LoadingBackdrop />}
        </div>
    );
}

export default TransactionDetails;
