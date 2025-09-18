import React, { useState, useEffect } from 'react';
import { useOutletContext } from 'react-router-dom';
import { 
    Box, 
    Card, 
    CardContent, 
    Typography, 
    Chip, 
    Grid, 
    Alert, 
    CircularProgress,
    Button
} from '@mui/material';
import { styled } from '@mui/material/styles';
import { marketShipmentApi, ApiError } from '../../api/marketShipmentApi';

const StatusChip = styled(Chip)(({ theme, status }) => ({
    backgroundColor: 
        status === 'delivered' ? '#E2E3E5' :
        status === 'completed' ? '#D4EDDA' : '#F8D7DA',
    color: 
        status === 'delivered' ? '#383D41' :
        status === 'completed' ? '#155724' : '#721C24',
    fontWeight: 'bold',
}));

function MarketplaceShipmentCompleted() {
    const UserID = useOutletContext();
    const [shipments, setShipments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchCompletedShipments = async () => {
        if (!UserID) return;
        
        try {
            setLoading(true);
            setError(null);
            const data = await marketShipmentApi.getMarketShipmentsByCentra(UserID);
            // Filter for completed/delivered shipments
            const completedShipments = data.filter(shipment => 
                shipment.ShipmentStatus === 'delivered' || 
                shipment.ShipmentStatus === 'completed'
            );
            setShipments(completedShipments);
        } catch (err) {
            console.error('Error fetching completed shipments:', err);
            setError(err instanceof ApiError ? err.message : 'Failed to fetch completed shipments');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCompletedShipments();
    }, [UserID]);

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

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
                <CircularProgress />
                <Typography variant="body1" sx={{ ml: 2 }}>Loading completed shipments...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Alert severity="error" sx={{ mt: 2 }}>
                {error}
                <Button onClick={fetchCompletedShipments} sx={{ ml: 2 }}>Retry</Button>
            </Alert>
        );
    }

    return (
        <Box>
            <Typography variant="h6" sx={{ mb: 2 }}>
                Completed Shipments
            </Typography>
            
            {shipments.length === 0 ? (
                <Alert severity="info">No completed shipments found.</Alert>
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
                                            <strong>Final Price: ${shipment.Price}</strong>
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            Initial: ${shipment.InitialPrice}
                                        </Typography>
                                    </Box>

                                    {shipment.Price < shipment.InitialPrice && (
                                        <Typography variant="body2" color="success.main" gutterBottom>
                                            Discount Applied: ${(shipment.InitialPrice - shipment.Price).toFixed(2)} 
                                            ({(((shipment.InitialPrice - shipment.Price) / shipment.InitialPrice) * 100).toFixed(1)}% off)
                                        </Typography>
                                    )}
                                    
                                    <Typography variant="body2" color="textSecondary" gutterBottom>
                                        Order Date: {new Date(shipment.CreatedAt).toLocaleDateString()}
                                    </Typography>
                                    
                                    <Typography variant="body2" color="textSecondary" gutterBottom>
                                        Completed: {new Date(shipment.UpdatedAt).toLocaleDateString()}
                                        ({calculateDaysAgo(shipment.UpdatedAt)} days ago)
                                    </Typography>

                                    <Box mt={2} p={1} bgcolor="success.light" borderRadius={1}>
                                        <Typography variant="body2" color="success.dark" fontWeight="bold">
                                            ✓ Transaction Completed Successfully
                                        </Typography>
                                        <Typography variant="caption" color="success.dark">
                                            Product has been processed and delivered to the customer.
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {shipments.length > 0 && (
                <Box mt={3} p={2} bgcolor="grey.100" borderRadius={1}>
                    <Typography variant="h6" gutterBottom>
                        Summary
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Total Completed Orders: {shipments.length}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Total Revenue: ${shipments.reduce((sum, shipment) => sum + shipment.Price, 0).toFixed(2)}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                        Average Order Value: ${(shipments.reduce((sum, shipment) => sum + shipment.Price, 0) / shipments.length).toFixed(2)}
                    </Typography>
                </Box>
            )}
        </Box>
    );
}

export default MarketplaceShipmentCompleted;
