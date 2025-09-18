
import React, { useState, useEffect } from 'react';
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
    Snackbar
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { marketShipmentApi, ApiError } from '../../api/marketShipmentApi';

const StatusChip = styled(Chip)(({ theme, status }) => ({
    backgroundColor: 
        status === 'processed' ? '#D1ECF1' :
        status === 'shipped' ? '#D4EDDA' :
        status === 'delivered' ? '#E2E3E5' : '#F8D7DA',
    color: 
        status === 'processed' ? '#0C5460' :
        status === 'shipped' ? '#155724' :
        status === 'delivered' ? '#383D41' : '#721C24',
    fontWeight: 'bold',
}));

function MarketplaceShipmentSent() {
    const UserID = useOutletContext();
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updatingId, setUpdatingId] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });

    const fetchSentShipments = async () => {
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
        } catch (err) {
            console.error('Error fetching sent shipments:', err);
            setError(err instanceof ApiError ? err.message : 'Failed to fetch sent shipments');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSentShipments();
    }, [UserID]);

    const handleUpdateToShipped = async (shipmentId) => {
        try {
            setUpdatingId(shipmentId);
            await marketShipmentApi.updateMarketShipmentStatus(shipmentId, 'shipped');
            await fetchSentShipments(); // Refresh the list
            
            setSnackbar({
                open: true,
                message: 'Shipment status updated to shipped successfully!',
                severity: 'success'
            });
        } catch (err) {
            console.error('Error updating shipment status:', err);
            let errorMessage = 'Failed to update shipment status';
            
            if (err instanceof ApiError) {
                errorMessage = err.message;
            }
            
            setSnackbar({
                open: true,
                message: errorMessage,
                severity: 'error'
            });
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

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
                <Typography variant="body1" sx={{ ml: 2 }}>Loading sent shipments...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mt: 2 }}>
                {error}
                <Button onClick={fetchSentShipments} sx={{ ml: 2 }}>Retry</Button>
            </Alert>
        );
    }

    return (
        <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Processed & Sent Shipments
            </Typography>
            
            {shipments.length === 0 ? (
                <Alert severity="info">No processed or sent shipments found.</Alert>
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
                                            label={shipment.ShipmentStatus} 
                                            status={shipment.ShipmentStatus}
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
                                    
                                    <Typography variant="body2" color="textSecondary" gutterBottom>
                                        Updated: {new Date(shipment.UpdatedAt).toLocaleDateString()}
                                    </Typography>
                                    
                                    {shipment.ShipmentStatus === 'processed' && (
                                        <Box mt={2}>
                                            <Button 
                                                variant="contained" 
                                                color="primary"
                                                onClick={() => handleUpdateToShipped(shipment.MarketShipmentID)}
                                                disabled={updatingId === shipment.MarketShipmentID}
                                                size="small"
                                            >
                                                {updatingId === shipment.MarketShipmentID ? (
                                                    <>
                                                        <CircularProgress size={16} sx={{ mr: 1 }} />
                                                        Updating...
                                                    </>
                                                ) : (
                                                    'Mark as Shipped'
                                                )}
                                            </Button>
                                        </Box>
                                    )}

                                    {shipment.ShipmentStatus === 'shipped' && (
                                        <Box mt={2}>
                                            <Typography variant="body2" color="success.main" fontWeight="bold">
                                                ✓ Shipped - Awaiting delivery confirmation
                                            </Typography>
                                        </Box>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

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
        </Box>
    );
}

export default MarketplaceShipmentSent;
