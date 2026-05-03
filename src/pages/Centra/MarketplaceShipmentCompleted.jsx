import React, { useState, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import WidgetContainer from '../../components/Cards/WidgetContainer';
import CircularButton from '../../components/CircularButton';
import LoadingStatic from '../../components/LoadingStatic';
import AccordionUsage from '../../components/AccordionUsage';
import MarketShipmentPopup from '../../components/Popups/MarketShipmentPopup';
import ShipmentStatus from '../../components/ShipmentStatus';
import Shipments from '../../assets/Shipments.svg';
import { marketShipmentApi, ApiError } from '../../api/marketShipmentApi';

function MarketplaceShipmentCompleted() {
    const UserID = useOutletContext();
    const [shipments, setShipments] = useState([]);
    const [cancelledShipments, setCancelledShipments] = useState([]);
    const [expiredShipments, setExpiredShipments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [cancelledLoading, setCancelledLoading] = useState(false);
    const [expiredLoading, setExpiredLoading] = useState(false);
    const [error, setError] = useState(null);
    const [cancelledError, setCancelledError] = useState(null);
    const [expiredError, setExpiredError] = useState(null);
    const [hasLoaded, setHasLoaded] = useState(false);
    const [cancelledHasLoaded, setCancelledHasLoaded] = useState(false);
    const [expiredHasLoaded, setExpiredHasLoaded] = useState(false);
    const [selectedShipment, setSelectedShipment] = useState(null);

    const fetchCompletedShipments = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await marketShipmentApi.getMarketShipmentsForUser();
            // Filter for completed, delivered, or failed shipments (excluding cancelled and expired)
            const completedShipments = data.filter(shipment => 
                shipment.ShipmentStatus === 'delivered' || 
                shipment.ShipmentStatus === 'completed' ||
                shipment.ShipmentStatus === 'failed'
            );
            setShipments(completedShipments);
            setHasLoaded(true);
        } catch (err) {
            console.error('Error fetching completed shipments:', err);
            setError(err instanceof ApiError ? err.message : 'Failed to fetch completed shipments');
        } finally {
            setLoading(false);
        }
    }, [UserID]);

    const fetchCancelledShipments = useCallback(async () => {
        try {
            setCancelledLoading(true);
            setCancelledError(null);
            const data = await marketShipmentApi.getMarketShipmentsForUser();
            // Filter for cancelled shipments
            const cancelled = data.filter(shipment => 
                shipment.ShipmentStatus === 'cancelled'
            );
            setCancelledShipments(cancelled);
            setCancelledHasLoaded(true);
        } catch (err) {
            console.error('Error fetching cancelled shipments:', err);
            setCancelledError(err instanceof ApiError ? err.message : 'Failed to fetch cancelled shipments');
        } finally {
            setCancelledLoading(false);
        }
    }, [UserID]);

    const fetchExpiredShipments = useCallback(async () => {
        try {
            setExpiredLoading(true);
            setExpiredError(null);
            const data = await marketShipmentApi.getMarketShipmentsForUser();
            // Filter for expired shipments
            const expiredShipmentsList = data.filter(shipment => 
                shipment.ShipmentStatus === 'Expired'
            );
            setExpiredShipments(expiredShipmentsList);
            setExpiredHasLoaded(true);
        } catch (err) {
            console.error('Error fetching expired shipments:', err);
            setExpiredError(err instanceof ApiError ? err.message : 'Failed to fetch expired shipments');
        } finally {
            setExpiredLoading(false);
        }
    }, [UserID]);

    const handleAccordionExpand = useCallback(() => {
        if (!hasLoaded && !loading) {
            fetchCompletedShipments();
        }
    }, [hasLoaded, loading, fetchCompletedShipments]);

    const handleCancelledAccordionExpand = useCallback(() => {
        if (!cancelledHasLoaded && !cancelledLoading) {
            fetchCancelledShipments();
        }
    }, [cancelledHasLoaded, cancelledLoading, fetchCancelledShipments]);

    const handleExpiredAccordionExpand = useCallback(() => {
        if (!expiredHasLoaded && !expiredLoading) {
            fetchExpiredShipments();
        }
    }, [expiredHasLoaded, expiredLoading, fetchExpiredShipments]);

    const handleShipmentClick = (shipment) => {
        setSelectedShipment(shipment);
        document.getElementById('MarketShipmentPopup').showModal();
    };

    const getProductTypeName = (productTypeId) => {
        switch (productTypeId) {
            case 1: return 'Wet Leaves';
            case 2: return 'Dry Leaves';
            case 3: return 'Flour';
            default: return 'Unknown Product';
        }
    };

    const calculateDaysAgo = (date) => {
        const today = new Date();
        const shipmentDate = new Date(date);
        const diffTime = Math.abs(today - shipmentDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays;
    };

    const accordions = [
        {
            summary: 'Completed Shipments',
            onExpand: handleAccordionExpand,
            details: () => (
                <>
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <LoadingStatic />
                        </div>
                    ) : error ? (
                        <div className="text-center py-8">
                            <div className="text-red-600 mb-4">
                                <span className="font-montserrat text-base">{error}</span>
                            </div>
                            <button 
                                onClick={fetchCompletedShipments}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            >
                                Retry
                            </button>
                        </div>
                    ) : (
                        <>
                            {shipments.map((shipment, index) => (
                                <div key={`completed_shipment_${index}`} className='flex justify-between p-1'>
                                    <WidgetContainer container={true} borderRadius="10px" className="w-full flex items-center">
                                        <button onClick={() => handleShipmentClick(shipment)}>
                                            <CircularButton imageUrl={Shipments} backgroundColor="#C0CD30" />
                                        </button>

                                        <div className='flex flex-col ml-3 flex-grow'>
                                            <span className="font-montserrat text-base font-semibold leading-tight tracking-wide text-left">
                                                {getProductTypeName(shipment.ProductTypeID)}
                                            </span>
                                            <span className='font-montserrat text-sm font-medium leading-17 tracking-wide text-left'>
                                                Order #{shipment.MarketShipmentID}
                                            </span>
                                        </div>

                                        <div className="flex ml-auto items-center">
                                            <div className="text-right mr-3">
                                                <div className="text-xs text-gray-600">
                                                    {calculateDaysAgo(shipment.UpdatedAt)} days ago
                                                </div>
                                                <div className={`text-xs font-semibold ${
                                                    shipment.ShipmentStatus === 'delivered' || shipment.ShipmentStatus === 'completed' 
                                                        ? 'text-green-600' 
                                                        : shipment.ShipmentStatus === 'failed' 
                                                        ? 'text-red-600' 
                                                        : 'text-gray-600'
                                                }`}>
                                                    {shipment.ShipmentStatus === 'delivered' && '✓ Delivered'}
                                                    {shipment.ShipmentStatus === 'completed' && '✓ Completed'}
                                                    {shipment.ShipmentStatus === 'failed' && '✗ Failed'}
                                                </div>
                                            </div>
                                            <ShipmentStatus 
                                                status={shipment.ShipmentStatus || 'delivered'} 
                                                delivered={shipment.ShipmentStatus === 'delivered'}
                                                completed={shipment.ShipmentStatus === 'completed'}
                                                failed={shipment.ShipmentStatus === 'failed'}
                                            />
                                        </div>
                                    </WidgetContainer>
                                </div>
                            ))}
                            {hasLoaded && shipments.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    <span className="font-montserrat text-base">No completed shipments found.</span>
                                </div>
                            )}
                            {!hasLoaded && !loading && (
                                <div className="text-center py-8 text-gray-500">
                                    <span className="font-montserrat text-base">Click to expand and load completed shipments</span>
                                </div>
                            )}
                        </>
                    )}
                </>
            ),
            defaultExpanded: false,
        },
        {
            summary: 'Cancelled Shipments',
            onExpand: handleCancelledAccordionExpand,
            details: () => (
                <>
                    {cancelledLoading ? (
                        <div className="flex justify-center py-8">
                            <LoadingStatic />
                        </div>
                    ) : cancelledError ? (
                        <div className="text-center py-8">
                            <div className="text-red-600 mb-4">
                                <span className="font-montserrat text-base">{cancelledError}</span>
                            </div>
                            <button 
                                onClick={fetchCancelledShipments}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            >
                                Retry
                            </button>
                        </div>
                    ) : (
                        <>
                            {cancelledShipments.map((shipment, index) => (
                                <div key={`cancelled_shipment_${index}`} className='flex justify-between p-1'>
                                    <WidgetContainer container={true} borderRadius="10px" className="w-full flex items-center">
                                        <button onClick={() => handleShipmentClick(shipment)}>
                                            <CircularButton imageUrl={Shipments} backgroundColor="#D45D5D" />
                                        </button>

                                        <div className='flex flex-col ml-3 flex-grow'>
                                            <span className="font-montserrat text-base font-semibold leading-tight tracking-wide text-left">
                                                {getProductTypeName(shipment.ProductTypeID)}
                                            </span>
                                            <span className='font-montserrat text-sm font-medium leading-17 tracking-wide text-left'>
                                                Order #{shipment.MarketShipmentID}
                                            </span>
                                        </div>

                                        <div className="flex ml-auto items-center">
                                            <div className="text-right mr-3">
                                                <div className="text-xs text-gray-600">
                                                    {calculateDaysAgo(shipment.UpdatedAt)} days ago
                                                </div>
                                                <div className="text-xs font-semibold text-red-600">
                                                    ✗ Cancelled
                                                </div>
                                            </div>
                                            <ShipmentStatus 
                                                status="cancelled"
                                                cancelled={true}
                                            />
                                        </div>
                                    </WidgetContainer>
                                </div>
                            ))}
                            {cancelledHasLoaded && cancelledShipments.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    <span className="font-montserrat text-base">No cancelled shipments found.</span>
                                </div>
                            )}
                            {!cancelledHasLoaded && !cancelledLoading && (
                                <div className="text-center py-8 text-gray-500">
                                    <span className="font-montserrat text-base">Click to expand and load cancelled shipments</span>
                                </div>
                            )}
                        </>
                    )}
                </>
            ),
            defaultExpanded: false,
        },
        {
            summary: 'Expired Shipments',
            onExpand: handleExpiredAccordionExpand,
            details: () => (
                <>
                    {expiredLoading ? (
                        <div className="flex justify-center py-8">
                            <LoadingStatic />
                        </div>
                    ) : expiredError ? (
                        <div className="text-center py-8">
                            <div className="text-red-600 mb-4">
                                <span className="font-montserrat text-base">{expiredError}</span>
                            </div>
                            <button 
                                onClick={fetchExpiredShipments}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            >
                                Retry
                            </button>
                        </div>
                    ) : (
                        <>
                            {expiredShipments.map((shipment, index) => (
                                <div key={`expired_shipment_${index}`} className='flex justify-between p-1'>
                                    <WidgetContainer container={true} borderRadius="10px" className="w-full flex items-center">
                                        <button onClick={() => handleShipmentClick(shipment)}>
                                            <CircularButton imageUrl={Shipments} backgroundColor="#FF6B6B" />
                                        </button>

                                        <div className='flex flex-col ml-3 flex-grow'>
                                            <span className="font-montserrat text-base font-semibold leading-tight tracking-wide text-left">
                                                {getProductTypeName(shipment.ProductTypeID)}
                                            </span>
                                            <span className='font-montserrat text-sm font-medium leading-17 tracking-wide text-left'>
                                                Order #{shipment.MarketShipmentID}
                                            </span>

                                        </div>

                                        <div className="flex ml-auto items-center">
                                            <ShipmentStatus 
                                                status="expired"
                                                expired={true}
                                            />
                                        </div>
                                    </WidgetContainer>
                                </div>
                            ))}
                            {expiredHasLoaded && expiredShipments.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    <span className="font-montserrat text-base">No expired shipments found.</span>
                                </div>
                            )}
                            {!expiredHasLoaded && !expiredLoading && (
                                <div className="text-center py-8 text-gray-500">
                                    <span className="font-montserrat text-base">Click to expand and load expired shipments</span>
                                </div>
                            )}

                        </>
                    )}
                </>
            ),
            defaultExpanded: false,
        }
    ];

    return (
        <div className="space-y-4">
            <AccordionUsage accordions={accordions} />
            
            {selectedShipment && (
                <MarketShipmentPopup 
                    marketShipmentData={selectedShipment}
                    // onConfirm={() => {}}
                    onCancel={() => {}}
                    confirmText=""
                    cancelText="Close"
                    loading={false}
                />
            )}
        </div>
    );
}

export default MarketplaceShipmentCompleted;
