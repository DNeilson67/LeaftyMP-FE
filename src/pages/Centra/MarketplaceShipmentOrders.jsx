import React, { useState, useEffect, useRef } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
    Box, 
    Card, 
    CardContent, 
    Typography, 
    Button, 
    Chip, 
    Grid, 
    Alert, 
    CircularProgress,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Snackbar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { marketShipmentApi, transactionApi, ApiError } from '../../api/marketShipmentApi';
import { formatErrorMessage } from '../../api/errorHandling';
import Popup from '../../components/Popups/Popup';

const StatusChip = styled(Chip)(({ theme, status }) => ({
    backgroundColor: 
        status === 'awaiting' ? '#FFF3CD' :
        status === 'processed' ? '#D1ECF1' :
        status === 'shipped' ? '#D4EDDA' :
        status === 'delivered' ? '#E2E3E5' : '#F8D7DA',
    color: 
        status === 'awaiting' ? '#856404' :
        status === 'processed' ? '#0C5460' :
        status === 'shipped' ? '#155724' :
        status === 'delivered' ? '#383D41' : '#721C24',
    fontWeight: 'bold',
}));

const ActionButton = styled(Button)(({ theme }) => ({
    margin: theme.spacing(0.5),
    textTransform: 'none',
}));

function MarketplaceShipmentOrders() {
    const UserID = useOutletContext();
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [processingId, setProcessingId] = useState(null);
    const [processDialog, setProcessDialog] = useState({ open: false, shipment: null });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
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

    const fetchShipments = async () => {
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
        } catch (err) {
            console.error('Error fetching shipments:', err);
            setError(err instanceof ApiError ? err.message : 'Failed to fetch shipments');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchShipments();
    }, [UserID]);

    const handleProcessOrder = async (shipment) => {
        setProcessDialog({ open: true, shipment });
    };

    const confirmProcessOrder = async () => {
        const { shipment } = processDialog;
        if (!shipment) return;

        try {
            setProcessingId(shipment.MarketShipmentID);
            
            // Get the transaction ID from the shipment
            // Note: You might need to adjust this based on your data structure
            const transactionId = shipment.SubTransactionID; // or however you get the transaction ID
            
            // Complete the transaction and process the product (with row-level locking)
            await transactionApi.completeTransaction(transactionId, UserID);
            
            // Update shipment status to "processed"
            await marketShipmentApi.updateMarketShipmentStatus(
                shipment.MarketShipmentID,
                'processed'
            );
            
            // Refresh the shipments list
            await fetchShipments();
            
            setSnackbar({
                open: true,
                message: 'Order processed successfully! Product status updated and transaction completed.',
                severity: 'success'
            });
            
            setProcessDialog({ open: false, shipment: null });
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
                        confirmProcessOrder();
                    },
                    onCancel: () => {
                        setPopup({ open: false, title: '', content: '', onRetry: null, onCancel: null });
                        setProcessDialog({ open: false, shipment: null });
                    },
                    confirmText: 'Close',
                    cancelText: 'Cancel Order',
                    retryText: 'Try Again'
                });
            } else {
                // Show snackbar for other errors
                setSnackbar({
                    open: true,
                    message: errorInfo.message,
                    severity: errorInfo.severity
                });
            }
        } finally {
            setProcessingId(null);
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

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
                <Typography variant="body1" sx={{ ml: 2 }}>Loading shipments...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mt: 2 }}>
                {error}
                <Button onClick={fetchShipments} sx={{ ml: 2 }}>Retry</Button>
            </Alert>
        );
    }

    return (
        <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Marketplace Shipment Orders
            </Typography>
            
            {shipments.length === 0 ? (
                <Alert severity="info">No pending shipment orders found.</Alert>
            ) : (
                <Grid container spacing={2}>
                    {shipments.map((shipment) => (
                        <Grid item xs={12} md={6} key={shipment.MarketShipmentID}>
                            <Card>
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                        <Typography variant="h6">
                                            Order #{shipment.MarketShipmentID}
                                        </Typography>
                                        <StatusChip 
                                            label={shipment.ShipmentStatus || 'awaiting'} 
                                            status={shipment.ShipmentStatus || 'awaiting'}
                                            size="small"
                                        />
                                    </Box>
                                    
                                    <Typography variant="body2" color="textSecondary" gutterBottom>
                                        Product: {getProductTypeName(shipment.ProductTypeID)}
                                    </Typography>
                                    
                                    <Typography variant="body2" color="textSecondary" gutterBottom>
                                        Product ID: {shipment.ProductID}
                                    </Typography>
                                    
                                    <Box display="flex" justifyContent="space-between" mb={2}>
                                        <Typography variant="body1">
                                            <strong>Price: ${shipment.Price}</strong>
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Initial: ${shipment.InitialPrice}
                                        </Typography>
                                    </Box>
                                    
                                    <Typography variant="body2" color="textSecondary" gutterBottom>
                                        Created: {new Date(shipment.CreatedAt).toLocaleDateString()}
                                    </Typography>
                                    
                                    <Box mt={2}>
                                        <ActionButton 
                                            variant="contained" 
                                            color="primary"
                                            disabled={processingId === shipment.MarketShipmentID}
                                            onClick={() => handleProcessOrder(shipment)}
                                        >
                                            {processingId === shipment.MarketShipmentID ? (
                                                <>
                                                    <CircularProgress size={16} sx={{ mr: 1 }} />
                                                    Processing...
                                                </>
                                            ) : (
                                                'Process Order'
                                            )}
                                        </ActionButton>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Process Order Confirmation Dialog */}
            <Dialog open={processDialog.open} onClose={() => setProcessDialog({ open: false, shipment: null })}>
                <DialogTitle>Process Product Order</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to process this order? This will:
                    </Typography>
                    <Box component="ul" sx={{ mt: 1, mb: 1 }}>
                        <li>Lock the product to prevent other transactions</li>
                        <li>Update the product status to "Processed"</li>
                        <li>Complete the transaction</li>
                        <li>Update the shipment status to "processed"</li>
                    </Box>
                    {processDialog.shipment && (
                        <Box mt={2} p={2} bgcolor="grey.100" borderRadius={1}>
                            <Typography variant="body2" color="textSecondary">
                                Product: {getProductTypeName(processDialog.shipment.ProductTypeID)}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Product ID: {processDialog.shipment.ProductID}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Order ID: {processDialog.shipment.MarketShipmentID}
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                Price: ${processDialog.shipment.Price}
                            </Typography>
                        </Box>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setProcessDialog({ open: false, shipment: null })} color="secondary">
                        Cancel
                    </Button>
                    <Button 
                        onClick={confirmProcessOrder} 
                        color="primary" 
                        variant="contained"
                        disabled={processingId === processDialog.shipment?.MarketShipmentID}
                    >
                        {processingId === processDialog.shipment?.MarketShipmentID ? (
                            <>
                                <CircularProgress size={16} sx={{ mr: 1 }} />
                                Processing...
                            </>
                        ) : (
                            'Confirm Process'
                        )}
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={handleCloseSnackbar}
            >
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
                    {snackbar.message}
                </Alert>
            </Snackbar>

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
        </Box>
    );
}

export default MarketplaceShipmentOrders;
