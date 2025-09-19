
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

function MarketplaceShipmentSent() {
    const UserID = useOutletContext();
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [hasLoaded, setHasLoaded] = useState(false);
    const [selectedShipment, setSelectedShipment] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);

    const fetchSentShipments = useCallback(async () => {
        if (!UserID) return;
        
        try {
            setLoading(true);
            setError(null);
            const data = await marketShipmentApi.getMarketShipmentsByCentra(UserID);
            // Filter for processed/sent shipments
            const sentShipments = data.filter(shipment => 
                shipment.ShipmentStatus === 'processed' || 
                shipment.ShipmentStatus === 'shipped'
            );
            setShipments(sentShipments);
            setHasLoaded(true);
        } catch (err) {
            console.error('Error fetching sent shipments:', err);
            setError(err instanceof ApiError ? err.message : 'Failed to fetch sent shipments');
        } finally {
            setLoading(false);
        }
    }, [UserID]);

    const handleAccordionExpand = useCallback(() => {
        if (!hasLoaded && !loading) {
            fetchSentShipments();
        }
    }, [hasLoaded, loading, fetchSentShipments]);

    const handleShipmentClick = (shipment) => {
        setSelectedShipment(shipment);
        document.getElementById('MarketShipmentPopup').showModal();
    };

    const handleUpdateToShipped = async (shipmentId) => {
        try {
            setUpdatingId(shipmentId);
            await marketShipmentApi.updateMarketShipmentStatus(shipmentId, 'shipped');
            await fetchSentShipments(); // Refresh the list
        } catch (err) {
            console.error('Error updating shipment status:', err);
            setError(err instanceof ApiError ? err.message : 'Failed to update shipment status');
        } finally {
            setUpdatingId(null);
        }
    };

    const getProductTypeName = (productTypeId) => {
        switch (productTypeId) {
            case 1: return 'Wet Leaves';
            case 2: return 'Dry Leaves';
            case 3: return 'Flour';
            default: return 'Unknown Product';
        }
    };
    const accordions = [
        {
            summary: 'Processed & Sent Shipments',
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
                                onClick={fetchSentShipments}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            >
                                Retry
                            </button>
                        </div>
                    ) : (
                        <>
                            {shipments.map((shipment, index) => (
                                <div key={`sent_shipment_${index}`} className='flex justify-between p-1'>
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
                                        </div>

                                        <div className="flex ml-auto items-center space-x-2">
                                            {shipment.ShipmentStatus === 'processed' && (
                                                <button
                                                    onClick={() => handleUpdateToShipped(shipment.MarketShipmentID)}
                                                    disabled={updatingId === shipment.MarketShipmentID}
                                                    className="px-3 py-1 bg-blue-600 text-white text-xs rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                                                >
                                                    {updatingId === shipment.MarketShipmentID ? 'Updating...' : 'Mark as Shipped'}
                                                </button>
                                            )}
                                            <ShipmentStatus 
                                                status={shipment.ShipmentStatus || 'processed'} 
                                                packing={shipment.ShipmentStatus === 'processed'}
                                                shipped={shipment.ShipmentStatus === 'shipped'}
                                                delivered={shipment.ShipmentStatus === 'delivered'}
                                            />
                                        </div>
                                    </WidgetContainer>
                                </div>
                            ))}
                            {hasLoaded && shipments.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    <span className="font-montserrat text-base">No processed or sent shipments found.</span>
                                </div>
                            )}
                            {!hasLoaded && !loading && (
                                <div className="text-center py-8 text-gray-500">
                                    <span className="font-montserrat text-base">Click to expand and load processed & sent shipments</span>
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
                    onAction={handleUpdateToShipped}
                    actionLabel="Mark as Shipped"
                    showAction={selectedShipment.ShipmentStatus === 'processed'}
                />
            )}
        </div>
    );
}

export default MarketplaceShipmentSent;
