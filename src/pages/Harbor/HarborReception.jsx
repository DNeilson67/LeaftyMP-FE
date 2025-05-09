import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import LongContainer from "../../components/Cards/LongContainer";
import { API_URL } from "../../App";
import LoadingBackdrop from "../../components/LoadingBackdrop";
import XYZPopup from "../../components/Popups/XYZPopup"; // Import XYZPopup component

function HarborReception() {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedShipment, setSelectedShipment] = useState(null); // State to store selected shipment
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [users, setUsers] = useState([]);

  function formatDate(dateString) {
    if (!dateString) return "Not Delivered";
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    const date = new Date(dateString);
    return "    " + date.toLocaleDateString(undefined, options);
  }

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const response = await axios.get(`${API_URL}/shipment/get`);
        console.log('Fetched shipments:', response.data);
        const shipments = response.data;

        const updatedShipments = await Promise.all(shipments.map(async (shipment) => {
          const flourDetails = await Promise.all(shipment.FlourIDs.map(async (flourID) => {
            const flourResponse = await axios.get(`${API_URL}/flour/get/${flourID}`);
            console.log(`Fetched flour details for flour ID ${flourID}:`, flourResponse.data);
            return {
              FlourID: flourID,
              Flour_Weight: flourResponse.data?.Flour_Weight || 0
            };
          }));

          const totalFlourWeight = flourDetails.reduce((sum, flour) => sum + flour.Flour_Weight, 0);

          const courierResponse = await axios.get(`${API_URL}/courier/get/${shipment.CourierID}`);
          const courierName = courierResponse.data?.CourierName || 'Unknown Courier';

          return {
            ...shipment,
            ShipmentWeight: totalFlourWeight,
            CourierName: courierName
          };
        }));

        // Filter updatedShipments based on Harbor_Reception_File
        const filteredShipments = updatedShipments.filter(shipment => shipment.Harbor_Reception_File === true);
        console.log('Filtered shipments:', filteredShipments);

        setShipments(filteredShipments);
      } catch (error) {
        console.error('Error fetching shipments:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchShipments();
    fetchUsers()
  }, []);


  const fetchUsers = async () => {
    try {
      console.log("Fetching all users from API...");
      const response = await axios.get(`${API_URL}/user/get`);
      console.log("Users fetched successfully:", response.data);
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };
  
  // Function to handle opening XYZPopup and passing shipment data
  const handleOpenPopup = (shipment) => {
    setSelectedShipment(shipment);
    setIsPopupOpen(true);
  };

  // Function to close XYZPopup
  const handleClosePopup = () => {
    setIsPopupOpen(false);
    setSelectedShipment(null); // Clear selected shipment
  };

  if (loading) {
    return <LoadingBackdrop />;
  }

  return (
    <div className='flex flex-col gap-2'>
      {shipments.map((item, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <LongContainer
            showWeight={false}
            packageCount={item.ShipmentQuantity}
            weightValue={item.ShipmentWeight}
            dateValue={formatDate(item.ShipmentDate)}
            expeditionId={item.ShipmentID}
            // Example button to trigger XYZPopup
            onConfirm={() => handleOpenPopup(item)}
          />
        </motion.div>
      ))}

      {/* XYZPopup component */}
      {isPopupOpen && selectedShipment && (
        <XYZPopup
          shipment={selectedShipment}
          open={isPopupOpen}
          onClose={handleClosePopup}
          users={users}
        // Pass other necessary props like users, courier, etc.
        />
      )}
    </div>
  );
}

export default HarborReception;
