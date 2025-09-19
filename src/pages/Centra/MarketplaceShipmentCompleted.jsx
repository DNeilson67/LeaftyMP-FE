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
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasLoaded, setHasLoaded] = useState(false);
    const [selectedShipment, setSelectedShipment] = useState(null);

    const fetchCompletedShipments = useCallback(async () => {
        if (!UserID) return;
        
        try {
            setLoading(true);
            setError(null);
            const data = await marketShipmentApi.getMarketShipmentsByCentra(UserID);
            // Filter for completed, delivered, failed, or cancelled shipments
            const completedShipments = data.filter(shipment => 
                shipment.ShipmentStatus === 'delivered' || 
                shipment.ShipmentStatus === 'completed' ||
                shipment.ShipmentStatus === 'failed' ||
                shipment.ShipmentStatus === 'cancelled'
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

    const handleAccordionExpand = useCallback(() => {
        if (!hasLoaded && !loading) {
            fetchCompletedShipments();
        }
    }, [hasLoaded, loading, fetchCompletedShipments]);

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
                                    <WidgetContainer borderRadius="10px" className="w-full flex items-center">
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
                                            <span className='font-montserrat text-xs font-medium leading-17 tracking-wide text-left text-gray-600'>
                                                Product ID: {shipment.ProductID}
                                            </span>
                                            <span className='font-montserrat text-sm font-bold leading-17 tracking-wide text-left text-green-600'>
                                                ${shipment.Price?.toFixed(2) || '0.00'}
                                            </span>
                                            {shipment.Price < shipment.InitialPrice && (
                                                <span className='font-montserrat text-xs text-green-700'>
                                                    {(((shipment.InitialPrice - shipment.Price) / shipment.InitialPrice) * 100).toFixed(1)}% discount applied
                                                </span>
                                            )}
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
                                                    {shipment.ShipmentStatus === 'cancelled' && '✗ Cancelled'}
                                                </div>
                                            </div>
                                            <ShipmentStatus 
                                                status={shipment.ShipmentStatus || 'delivered'} 
                                                delivered={shipment.ShipmentStatus === 'delivered'}
                                                completed={shipment.ShipmentStatus === 'completed'}
                                                failed={shipment.ShipmentStatus === 'failed'}
                                                cancelled={shipment.ShipmentStatus === 'cancelled'}
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
                            {hasLoaded && shipments.length > 0 && (
                                <div className="mt-4 p-4 bg-gray-100 rounded-lg">
                                    <h3 className="font-montserrat text-lg font-semibold mb-2">Summary</h3>
                                    <div className="space-y-1 text-sm">
                                        <div>Total Completed Orders: {shipments.length}</div>
                                        <div>Total Revenue: ${shipments.reduce((sum, shipment) => sum + shipment.Price, 0).toFixed(2)}</div>
                                        <div>Average Order Value: ${(shipments.reduce((sum, shipment) => sum + shipment.Price, 0) / shipments.length).toFixed(2)}</div>
                                    </div>
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
                    shipmentData={selectedShipment}
                    onAction={() => {}}
                    actionLabel=""
                    showAction={false}
                />
            )}
        </div>
    );
}

export default MarketplaceShipmentCompleted;
