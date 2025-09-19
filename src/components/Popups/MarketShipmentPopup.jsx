import React, { useCallback } from 'react';
import WidgetContainer from '../Cards/WidgetContainer';
import ShipmentLogo from '../../assets/ShipmentDetail.svg';
import PackageCount from '../../assets/Packagecount.svg';
import DateIcon from '../../assets/Date.svg';
import Address from '../../assets/Address.svg';
import Button from '../Button';
import { formatRupiah } from '../../App';

const MarketShipmentPopup = ({
    marketShipmentData,
    onConfirm,
    onCancel,
    desktop = false,
    confirmText = "Process Order",
    cancelText = "Cancel",
    loading = false
}) => {
    const handleConfirm = useCallback(() => {
        if (onConfirm && marketShipmentData) {
            onConfirm(marketShipmentData);
        }
        document.getElementById('MarketShipmentPopup').close();
    }, [onConfirm, marketShipmentData]);

    const handleCancel = useCallback(() => {
        if (onCancel) {
            onCancel();
        }
        document.getElementById('MarketShipmentPopup').close();
    }, [onCancel]);

    if (!marketShipmentData) return null;

    const getProductTypeName = (productTypeID) => {
        const productTypes = {
            1: 'Wet Leaves',
            2: 'Dry Leaves',
            3: 'Flour'
        };
        return productTypes[productTypeID] || 'Unknown Product';
    };

    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric'
            });
        } catch {
            return 'Invalid Date';
        }
    };

    const OrderText = `Market Order #${marketShipmentData.MarketShipmentID}`;

    return (
        <dialog id="MarketShipmentPopup" className={`modal ${desktop ? "modal-middle" : "modal-bottom"}`}>
            <div className='modal-box rounded-lg max-w-sm sm:max-w-md lg:max-w-lg w-full sm:mx-auto p-4 sm:p-6'>
                {/* Header with icon */}
                <div className='flex justify-center mb-4 sm:mb-6'>
                    <img src={ShipmentLogo} alt="Market Shipment" className='w-16 h-16 sm:w-20 sm:h-20 lg:w-24 lg:h-24' />
                </div>

                {/* Title */}
                <div className="flex flex-col items-center mb-4 sm:mb-6">
                    <span className="font-montserrat text-base sm:text-lg lg:text-xl font-semibold text-center mb-2">
                        {OrderText}
                    </span>
                    <div className="flex flex-wrap justify-center items-center gap-2 sm:gap-4">
                        <div className="flex items-center gap-1">
                            <img src={PackageCount} alt="Product" className='w-4 h-4 sm:w-5 sm:h-5' />
                            <span className="font-montserrat text-sm sm:text-base font-medium">
                                {getProductTypeName(marketShipmentData.ProductTypeID)}
                            </span>
                        </div>
                        {marketShipmentData.CreatedAt && (
                            <div className="flex items-center gap-1">
                                <img src={DateIcon} alt="Date" className='w-4 h-4 sm:w-5 sm:h-5' />
                                <span className="font-montserrat text-sm sm:text-base font-medium">
                                    {formatDate(marketShipmentData.CreatedAt)}
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Market Shipment Details */}
                <div className='mb-4 sm:mb-6'>
                    <WidgetContainer container={false} borderRadius="15px" className="p-3 sm:p-4">
                        <div className="space-y-3 sm:space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                                {/* Left Column */}
                                <div className="space-y-2 sm:space-y-3">
                                    <span className='font-montserrat text-sm sm:text-base font-semibold text-gray-700 block'>Product Details</span>

                                    <div className='flex items-center gap-2'>
                                        <img src={PackageCount} alt="Product Type" className='w-4 h-4 sm:w-5 sm:h-5' />
                                        <div className="flex flex-col">
                                            <span className="font-montserrat text-xs sm:text-sm text-gray-600">Type</span>
                                            <span className="font-montserrat text-sm sm:text-base font-medium">
                                                {getProductTypeName(marketShipmentData.ProductTypeID)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className='flex items-center gap-2'>
                                        <img src={PackageCount} alt="Product ID" className='w-4 h-4 sm:w-5 sm:h-5' />
                                        <div className="flex flex-col">
                                            <span className="font-montserrat text-xs sm:text-sm text-gray-600">Product ID</span>
                                            <span className="font-montserrat text-sm sm:text-base font-medium">
                                                #{marketShipmentData.ProductID}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Right Column */}
                                <div className="space-y-2 sm:space-y-3">
                                    <span className='font-montserrat text-sm sm:text-base font-semibold text-gray-700 block'>Pricing</span>

                                    <div className='flex items-center gap-2'>
                                        <img src={Address} alt="Current Price" className='w-4 h-4 sm:w-5 sm:h-5' />
                                        <div className="flex flex-col">
                                            <span className="font-montserrat text-xs sm:text-sm text-gray-600">Current Price</span>
                                            <span className="font-montserrat text-sm sm:text-base font-semibold text-green-600">
                                                {formatRupiah(marketShipmentData.Price || 0)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* <div className='flex items-center gap-2'>
                                        <img src={Address} alt="Initial Price" className='w-4 h-4 sm:w-5 sm:h-5' />
                                        <div className="flex flex-col">
                                            <span className="font-montserrat text-xs sm:text-sm text-gray-600">Initial Price</span>
                                            <span className="font-montserrat text-sm sm:text-base font-medium text-gray-500">
                                                ${marketShipmentData.InitialPrice?.toFixed(2) || '0.00'}
                                            </span>
                                        </div>
                                    </div> */}
                                </div>
                            </div>

                            <div className="pt-2 sm:pt-3 border-t border-gray-200">
                                <div className='flex items-center justify-between'>
                                    <div className="flex flex-col">
                                        <span className="font-montserrat text-xs sm:text-sm text-gray-600">Status</span>
                                        <span className={`font-montserrat text-sm sm:text-base font-medium px-2 py-1 rounded-full text-center ${marketShipmentData.ShipmentStatus === 'awaiting' ? 'bg-yellow-100 text-yellow-800' :
                                                marketShipmentData.ShipmentStatus === 'processed' ? 'bg-blue-100 text-blue-800' :
                                                    marketShipmentData.ShipmentStatus === 'shipped' ? 'bg-green-100 text-green-800' :
                                                        marketShipmentData.ShipmentStatus === 'delivered' ? 'bg-gray-100 text-gray-800' :
                                                            'bg-gray-100 text-gray-800'
                                            }`}>
                                            {(marketShipmentData.ShipmentStatus || 'awaiting').charAt(0).toUpperCase() + (marketShipmentData.ShipmentStatus || 'awaiting').slice(1)}
                                        </span>
                                    </div>

                                    {/* <div className="flex flex-col text-right">
                                                                    <span className="font-montserrat text-xs sm:text-sm text-gray-600">Centra ID</span>
                                                                    <span className="font-montserrat text-sm sm:text-base font-medium">
                                                                        {marketShipmentData.CentraID?.substring(0, 8) || 'N/A'}...
                                                                    </span>
                                                                </div> */}
                                </div>
                            </div>
                        </div>
                    </WidgetContainer>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full">
                    <Button
                        noMax={true}
                        className="w-full sm:w-1/2 order-2 sm:order-1 min-h-10 sm:min-h-12 text-sm sm:text-base"
                        onClick={handleCancel}
                        type="button"
                        background="#6b7280"
                        color="#F7FAFC"
                        label={cancelText}
                        disabled={loading}
                    />

                    <Button
                        noMax={true}
                        className="w-full sm:w-1/2 order-1 sm:order-2 min-h-10 sm:min-h-12 text-sm sm:text-base"
                        onClick={handleConfirm}
                        type="submit"
                        background="#0F7275"
                        color="#F7FAFC"
                        label={loading ? "Processing..." : confirmText}
                        disabled={loading}
                    />
                </div>

                {/* Close backdrop */}
                <form method="dialog" className="modal-backdrop">
                    <button type="button">Close</button>
                </form>
            </div>
        </dialog>
    );
};

export default MarketShipmentPopup;