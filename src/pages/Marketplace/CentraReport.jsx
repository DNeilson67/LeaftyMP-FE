import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useReadContract } from 'wagmi';
import CentraReportCard from '../../components/CentraReportCard';
import CentraProfileCard from '../../components/CentraProfileCard';
import axios from 'axios';
import LoadingCircle from '@components/LoadingCircle';
import { API_URL } from '../../App';
import EmptyDataImg from '@assets/EmptyData.svg';
import { parseAbi } from 'viem';

// You'll need to import your contract ABI and address

function CentraReport() {
    const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS; // Replace with your contract address
    const CONTRACT_ABI = parseAbi([
        'function getReportsByIds(uint256[] reportIds) external view returns ((uint256 id, uint256 timestamp, (int16 temperature, uint8 condition) weather, (bool waterToday, bool compostAdded, string compostType, bool fertilizerAdded, string fertilizerType) actions, (uint8 diseaseType, string diseaseOtherDescription, uint8 soilCondition) health, string extraNotes, address submittedBy)[])',
    ]);
    const { centraName } = useParams();
    const [loading, setLoading] = useState(true);
    const [reports, setReports] = useState([]);
    const [ids, setIds] = useState([]);
    const [idsLoaded, setIdsLoaded] = useState(false);

    // Get contract data using wagmi - only enabled after IDs are loaded
    const { data: contractData, isLoading: contractLoading, error: contractError } = useReadContract({
        address: CONTRACT_ADDRESS,
        abi: CONTRACT_ABI,
        functionName: 'getReportsByIds', // Replace with your actual function name
        args: [ids],
        enabled: idsLoaded && ids.length > 0
    });

    useEffect(() => {
        setLoading(true);
        axios.get(`${API_URL}/blockchain/centra/${centraName}`)
            .then(response => {
                const fetchedIds = response.data.data.map(item => item.trx_id);
                setIds(fetchedIds);
                setIdsLoaded(true);
            })
            .catch(error => {
                console.error("Error fetching reports:", error);
                setIdsLoaded(true);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [centraName]);

    useEffect(() => {
        console.log("Contract data:", contractData);
        console.log("Contract loading state:", contractLoading);
        if (contractData && !contractLoading) {
            // Convert BigInt values to regular numbers
            const processedReports = contractData.map(report => ({
                id: Number(report.id),
                temperature: Number(report.weather.temperature),
                date: Date(report.date),
                wateredToday: Boolean(report.actions.waterToday) // Assuming this is part of the report data
            }));

            setReports(processedReports);
            console.log("Processed reports:", processedReports);
        }
    }, [contractData, contractLoading]);

    if (loading || (idsLoaded && contractLoading)) {
        return <div className="flex justify-center items-center h-screen"><LoadingCircle /></div>;
    }

    return (
        <div className='flex flex-col w-full px-8 py-4 gap-4'>
            <CentraProfileCard compact centraName={centraName} />
            <h2 className='font-bold text-2xl'>Moringa Health Reports</h2>
            {reports.length === 0 && (
                <div className='flex flex-col items-center justify-center h-[50dvh]'>
                    <img src={EmptyDataImg} alt="No Reports" className='w-1/2 h-1/2 mb-4' />
                    <p className='text-gray-500'>No reports available for this Centra.</p>
                </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                {reports.map((report) => (
                    <CentraReportCard
                        key={report.id}
                        temperature={report.temperature}
                        wateredToday={report.wateredToday}
                        date={report.date}
                    />
                ))}
            </div>
        </div>
    );
}

export default CentraReport;