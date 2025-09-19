import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useOutletContext } from 'react-router-dom';
import WidgetContainer from '../../components/Cards/WidgetContainer';
import CircularButton from '../../components/CircularButton';
import Shipments from '../../assets/Shipments.svg';
import MarketShipmentPopup from '../../components/Popups/MarketShipmentPopup';
import AccordionUsage from '../../components/AccordionUsage';
import ShipmentStatus from '@components/ShipmentStatus';
import LoadingStatic from "@components/LoadingStatic";
import { marketShipmentApi, transactionApi, ApiError } from '../../api/marketShipmentApi';
import { formatErrorMessage } from '../../api/errorHandling';
import Popup from '../../components/Popups/Popup';

function MarketplaceShipmentOrders() {
    const UserID = useOutletContext();
    const [shipments, setShipments] = useState([]);
    const [selectedShipment, setSelectedShipment] = useState(null);
    const [loading, setLoading] = useState(false); // Changed to false initially
    const [error, setError] = useState(null);
    const [processingId, setProcessingId] = useState(null);
    const [hasLoaded, setHasLoaded] = useState(false); // Track if data has been loaded
    const popupRef = useRef(null);
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

    const fetchShipments = useCallback(async () => {
        if (!UserID) return;
        
        try {
            setLoading(true);
            setError(null);
            const data = await marketShipmentApi.getMarketShipmentsByCentra(UserID);
            // Filter for awaiting/pending shipments
            const pendingShipments = data.filter(shipment => 
                shipment.ShipmentStatus === 'awaiting' || 
                shipment.ShipmentStatus === null ||
                shipment.ShipmentStatus === 'pending'
            );
            setShipments(pendingShipments);
            setHasLoaded(true);
        } catch (err) {
            console.error('Error fetching shipments:', err);
            setError(err instanceof ApiError ? err.message : 'Failed to fetch shipments');
        } finally {
            setLoading(false);
        }
    }, [UserID]);

    // Remove the automatic useEffect fetch
    // useEffect(() => {
    //     fetchShipments();
    // }, [fetchShipments]);

    const handleAccordionExpand = () => {
        // Only fetch if data hasn't been loaded yet
        if (!hasLoaded) {
            fetchShipments();
        }
    };

    const getProductTypeName = (productTypeID) => {
        const productTypes = {
            1: 'Wet Leaves',
            2: 'Dry Leaves', 
            3: 'Flour'
        };
        return productTypes[productTypeID] || 'Unknown Product';
    };

    const handleShipmentClick = (shipment) => {
        setSelectedShipment(shipment);
        document.getElementById('MarketShipmentPopup').showModal();
    };

    const handleProcessOrder = async (shipment) => {
        try {
            setProcessingId(shipment.MarketShipmentID);
            
            // Get the transaction ID from the shipment
            const transactionId = shipment.SubTransactionID;
            
            // Complete the transaction and process the product (with row-level locking)
            await transactionApi.completeTransaction(transactionId, UserID);
            
            // Update shipment status to "processed"
            await marketShipmentApi.updateMarketShipmentStatus(
                shipment.MarketShipmentID,
                'processed'
            );
            
            // Refresh the shipments list
            await fetchShipments();
            
            setPopup({
                open: true,
                title: 'Success',
                content: 'Order processed successfully! Product status updated and transaction completed.',
                onConfirm: () => {
                    setPopup(prev => ({ ...prev, open: false }));
                    if (popupRef.current) popupRef.current.close();
                },
                confirmText: 'OK'
            });
            if (popupRef.current) popupRef.current.showModal();
            
        } catch (err) {
            console.error('Error processing order:', err);
            
            const errorInfo = formatErrorMessage(err, 'Failed to process order');
            
            if (errorInfo.type === 'LOCK_CONFLICT') {
                // Show enhanced popup for lock conflicts with retry
                setPopup({ 
                    open: true, 
                    title: 'Order Processing Conflict',
                    content: errorInfo.message,
                    onRetry: () => {
                        setPopup(prev => ({ ...prev, isRetrying: true }));
                        handleProcessOrder(shipment);
                    },
                    onCancel: () => {
                        setPopup({ ...popup, open: false });
                        if (popupRef.current) popupRef.current.close();
                    },
                    confirmText: 'Close',
                    cancelText: 'Cancel Order',
                    retryText: 'Try Again'
                });
                if (popupRef.current) popupRef.current.showModal();
            } else {
                // Show popup for other errors
                setPopup({
                    open: true,
                    title: 'Error',
                    content: errorInfo.message,
                    onConfirm: () => {
                        setPopup(prev => ({ ...prev, open: false }));
                        if (popupRef.current) popupRef.current.close();
                    },
                    confirmText: 'OK'
                });
                if (popupRef.current) popupRef.current.showModal();
            }
        } finally {
            setProcessingId(null);
        }
    };

    const accordions = [
        {
            summary: 'Market Shipment Orders',
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
                                onClick={fetchShipments}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                            >
                                Retry
                            </button>
                        </div>
                    ) : (
                        <>
                            {shipments.map((shipment, index) => (
                                <div key={`market_order_${index}`} className='flex justify-between p-1'>
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
                                        </div>

                                        <div className="flex ml-auto items-center">
                                            <ShipmentStatus 
                                                status={shipment.ShipmentStatus || 'awaiting'} 
                                                packing={shipment.ShipmentStatus === 'awaiting'}
                                                processed={shipment.ShipmentStatus === 'processed'}
                                                shipped={shipment.ShipmentStatus === 'shipped'}
                                                delivered={shipment.ShipmentStatus === 'delivered'}
                                            />
                                        </div>
                                    </WidgetContainer>
                                </div>
                            ))}
                            {hasLoaded && shipments.length === 0 && (
                                <div className="text-center py-8 text-gray-500">
                                    <span className="font-montserrat text-base">No pending market shipment orders found.</span>
                                </div>
                            )}
                            {!hasLoaded && !loading && (
                                <div className="text-center py-8 text-gray-500">
                                    <span className="font-montserrat text-base">Click to expand and load market shipment orders</span>
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
        <>
            <AccordionUsage accordions={accordions} className="mt-3" />
            
            {selectedShipment && (
                <MarketShipmentPopup
                    marketShipmentData={selectedShipment}
                    onConfirm={handleProcessOrder}
                    onCancel={() => setSelectedShipment(null)}
                    confirmText="Process Order"
                    cancelText="Cancel"
                    loading={processingId === selectedShipment.MarketShipmentID}
                />
            )}

            {/* Enhanced Popup for Error Handling */}
            <Popup
                ref={popupRef}
                success={popup.title === 'Success'}
                error={popup.title === 'Error'}
                warning={popup.title === 'Order Processing Conflict'}
                confirm={!!(popup.onRetry || popup.onCancel)}
                description={popup.content}
                onConfirm={popup.onConfirm}
                onCancel={popup.onCancel}
                onRetry={popup.onRetry}
                confirmText={popup.confirmText}
                cancelText={popup.cancelText}
                retryText={popup.retryText}
                isRetrying={popup.isRetrying}
                canRetry={!!popup.onRetry}
            />
        </>
    );
}

export default MarketplaceShipmentOrders;
