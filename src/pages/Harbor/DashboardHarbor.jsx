import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import LoadingBackdrop from '@components/LoadingBackdrop';
import WidgetContainer from '@components/Cards/WidgetContainer';
import LongContainer from '@components/Cards/LongContainer';
import VerifiedPackages from '@assets/VerifiedPackages.svg';
import UnverifiedShipment from '@assets/UnverifiedShipment.svg';
import UnverifiedPackages from '@assets/UnverifiedPackages.svg';
import { API_URL } from '../../App';

function DashboardHarbor() {
    const [shipments, setShipments] = useState([]);
    const [statistics, setStatistics] = useState({
        verified_packages_count: 0,
        unverified_shipments_count: 0,
        unverified_packages_count: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchShipments = async () => {
            try {
                console.log('Fetching all shipments from API');
                const response = await axios.get(`${API_URL}/shipment/get`);
                console.log('Shipments fetched successfully:', response.data);
                setShipments(response.data);
                setLoading(false); // Set loading to false after fetching data
            } catch (error) {
                console.error('Error fetching shipments:', error);
                setLoading(false); // Set loading to false on error as well
            }
        };

        fetchShipments();
    }, []);

    useEffect(() => {
        const calculateStatistics = () => {
            if (!shipments || shipments.length === 0) {
                setStatistics({
                    verified_packages_count: 0,
                    unverified_shipments_count: 0,
                    unverified_packages_count: 0,
                });
                return;
            }

            const verifiedPackagesCount = shipments.filter(
                (shipment) => shipment.Check_in_Date && shipment.Check_in_Quantity
            ).length;
            const unverifiedShipmentsCount = shipments.filter(
                (shipment) => !shipment.Check_in_Date && !shipment.Check_in_Quantity
            ).length;
            const unverifiedPackagesCount = shipments.filter(
                (shipment) => !shipment.Check_in_Date && !shipment.Check_in_Quantity
            ).reduce((total, shipment) => total + shipment.ShipmentQuantity, 0);

            setStatistics({
                verified_packages_count: verifiedPackagesCount,
                unverified_shipments_count: unverifiedShipmentsCount,
                unverified_packages_count: unverifiedPackagesCount,
            });
        };

        calculateStatistics();
    }, [shipments]);

    if (loading) {
        return <LoadingBackdrop />;
    }

    return (
        <>
            <div className="flex items-center justify-between">
                <motion.div
                    className="flex items-center md:flex-row gap-2"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                >
                    <WidgetContainer className={'p-5 lg:p-0 h-[13rem] md:h-full w-1/3'}>
                        <div className="flex flex-col">
                            <div className="flex flex-col">
                                <span className="font-semibold md:text-md text-xs text-gray-600">Verified Package</span>
                                <span className="font-montserrat text-xl font-semibold text-left">
                                    {statistics.verified_packages_count}
                                </span>
                            </div>
                            <img
                                src={VerifiedPackages}
                                alt="VerifiedPackages"
                                className="w-20 h-auto md:w-20 md:h-auto object-contain mt-4"
                            />
                        </div>
                    </WidgetContainer>

                    <div className="flex flex-col md:flex-row gap-2 justify-around">
                        <WidgetContainer>
                            <div className="flex items-center gap-2 justify-between">
                                <div className="flex flex-col">
                                    <span className="w-8 font-montserrat text-base font-semibold text-gray-600">
                                        Unverified Shipment
                                    </span>
                                    <span className="font-montserrat text-xl font-semibold">
                                        {statistics.unverified_shipments_count}
                                    </span>
                                </div>
                                <img
                                    src={UnverifiedShipment}
                                    alt="Unverified Shipment"
                                    className="w-10 h-auto md:w-auto md:h-auto object-contain"
                                />
                            </div>
                        </WidgetContainer>
                        <WidgetContainer>
                            <div className="flex items-center gap-2 justify-between">
                                <div className="flex flex-col">
                                    <span className="font-montserrat text-base font-semibold text-gray-600">
                                        Unverified Packages
                                    </span>
                                    <span className="font-montserrat text-xxl font-semibold">
                                        {statistics.unverified_packages_count}
                                    </span>
                                </div>
                                <img
                                    src={UnverifiedPackages}
                                    alt="UnverifiedPackages"
                                    className="w-10 h-auto md:w-auto md:h-auto object-contain"
                                />
                            </div>
                        </WidgetContainer>
                    </div>
                </motion.div>
            </div>
            <span className="font-semibold text-base">Recent Verified Shipment</span>
            <div className="flex flex-col gap-2">
                {shipments
                    .filter((shipment) => shipment.Check_in_Date && shipment.Check_in_Quantity)
                    .slice(0, 5) // Limit to the first 5 items
                    .map((item, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                        >
                            <LongContainer
                                packageCount={item.ShipmentQuantity}
                                weightValue={item.Check_in_Quantity}
                                dateValue={format(new Date(item.Check_in_Date), 'yyyy-MM-dd')}
                                expeditionId={item.ShipmentID}
                            />
                        </motion.div>
                    ))}
            </div>
        </>
    );
}

export default DashboardHarbor;
