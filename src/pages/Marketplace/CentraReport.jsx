import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router';
import { useReadContract } from 'wagmi';
import CentraReportCard from '../../components/CentraReportCard';
import CentraProfileCard from '../../components/CentraProfileCard';
import axios from 'axios';
import { API_URL } from '../../App';
import EmptyDataImg from '@assets/EmptyData.svg';
import { parseAbi } from 'viem';
import LoadingStatic from '@components/LoadingStatic';

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
    const [error, setError] = useState(null);

    // Debug contract address
    console.log("Contract Address:", CONTRACT_ADDRESS);
    
    // Get contract data using wagmi - only enabled after IDs are loaded and contract address exists
    const { data: contractData, isLoading: contractLoading, error: contractError } = useReadContract({
        abi: CONTRACT_ABI,
        address: CONTRACT_ADDRESS,
        functionName: 'getReportsByIds', // Replace with your actual function name
        args: [ids],
        enabled: idsLoaded && ids.length > 0 && !!CONTRACT_ADDRESS
    });

    useEffect(() => {
        setLoading(true);
        axios.get(`${API_URL}/blockchain/centra/${centraName}`, {
            withCredentials: true // Ensure cookies are sent for authentication
        })
            .then(response => {
                const fetchedIds = response.data.data.map(item => item.trx_id);
                setIds(fetchedIds);
                setIdsLoaded(true);
            })
            .catch(error => {
                setIdsLoaded(true);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [centraName]);

    useEffect(() => {
        if (contractError) {
            console.error("Contract error:", contractError);
            setError("Failed to load blockchain data");
            return;
        }
        
        if (contractData && !contractLoading) {
            try {
                // Convert BigInt values to regular numbers
                const processedReports = contractData.map(report => ({
                    id: Number(report.id),
                    temperature: Number(report.weather.temperature),
                    date: new Date(Number(report.timestamp) * 1000), // Fixed: proper timestamp conversion
                    wateredToday: Boolean(report.actions.waterToday) // Assuming this is part of the report data
                }));

                setReports(processedReports);
                console.log("Processed reports:", processedReports);
            } catch (err) {
                console.error("Error processing contract data:", err);
                setError("Failed to process blockchain data");
            }
        }
        
        // If no contract address is set, show error
        if (!CONTRACT_ADDRESS && idsLoaded) {
            setError("Contract address not configured");
        }
    }, [contractData, contractLoading, contractError, CONTRACT_ADDRESS, idsLoaded]);

    if (loading || (idsLoaded && contractLoading)) {
        return <div className="flex justify-center items-center h-screen"><LoadingStatic /></div>;
    }

    if (error) {
        return (
            <div className='flex flex-col w-full px-8 py-4 gap-4'>
                <CentraProfileCard compact centraName={centraName} />
                <h2 className='font-bold text-2xl'>Moringa Health Reports</h2>
                <div className='flex flex-col items-center justify-center h-[50dvh]'>
                    <div className='text-red-500 text-center'>
                        <p className='text-xl mb-2'>⚠️ Error Loading Reports</p>
                        <p className='text-gray-600'>{error}</p>
                        <p className='text-sm text-gray-500 mt-2'>Check console for more details</p>
                    </div>
                </div>
            </div>
        );
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