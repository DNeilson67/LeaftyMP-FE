import React, { useEffect, useRef, useState } from "react";
import InputField from "../../components/InputField";
import DropdownField from "../../components/DropdownField";
import CheckboxField from "../../components/CheckboxField";
import Button from "@components/Button";
import TextareaField from "@components/TextareaField";
import Popup from "@components/Popups/Popup";
import WalletRequired from "@assets/WalletRequired.svg";
import LoadingStatic from "@components/LoadingStatic";
import { useNavigate } from "react-router";
import DataRecorded from "@assets/DataRecorded.svg";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import axios from "axios";
import { parseAbi } from "viem";
import { API_URL } from "../../App";

const weatherOptions = [
    { label: "Sunny", value: 0 },
    { label: "Cloudy", value: 1 },
    { label: "Rainy", value: 2 },
    { label: "Stormy", value: 3 },
    { label: "Windy", value: 4 },
    { label: "Other", value: 5 },
];

const soilOptions = [
    { label: "Dry", value: 0 },
    { label: "Moist", value: 1 },
    { label: "Wet", value: 2 },
    { label: "Waterlogged", value: 3 },
    { label: "Cracked", value: 4 },
];

const diseaseOptions = [
    { label: "None", value: 0 },
    { label: "Leaf Spots", value: 1 },
    { label: "Powdery Growth", value: 2 },
    { label: "Wilting", value: 3 },
    { label: "Other", value: 4 },
];

const DailyReportCentra = () => {
    // Contract configuration
    const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;

    const abi = parseAbi([
        'function submitDailyReport((int16 temperature, uint8 condition) _weather, (bool waterToday, bool compostAdded, string compostType, bool fertilizerAdded, string fertilizerType) _actions, (uint8 diseaseType, string diseaseOtherDescription, uint8 soilCondition) _health, string _extraNotes) external'
    ]);

    // Wagmi hooks
    const { address, isConnected } = useAccount();
    const { writeContract, data: hash, isPending, error: contractError } = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
        hash,
    });

    const [form, setForm] = useState({
        weatherTemperature: "",
        weatherCondition: "SUNNY",
        waterToday: false,
        compostAdded: false,
        compostType: "",
        fertilizerAdded: false,
        fertilizerType: "",
        diseaseType: "NONE",
        diseaseOtherDescription: "",
        soilCondition: "DRY",
        extraNotes: "",
    });

    const [loading, setLoading] = useState(true);
    const [recordedToday, setRecordedToday] = useState(false);
    const [errors, setErrors] = useState({});
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [errorDescription, setErrorDescription] = useState("");
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const [showHistory, setShowHistory] = useState(false);
    const [transactionHistory, setTransactionHistory] = useState([]);

    const navigate = useNavigate();
    const popupRef = useRef(null);
    const successPopupRef = useRef(null);

    const hasSubmittedToday = (transactions) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0); 
        
        return transactions.some(tx => {
            if (!tx.created_at) return false;
            
            const txDate = new Date(tx.created_at);
            txDate.setHours(0, 0, 0, 0);
            
            return txDate.getTime() === today.getTime();
        });
    };
    const saveBlockchainTransaction = async (transactionId) => {
        try {
            const response = await axios.post(`${API_URL}/blockchain/create`, {
                trx_id: transactionId
            }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true // Important: This sends the session cookie
            });

            return response.data;
        } catch (error) {            
            // Handle specific error cases
            if (error.response?.status === 403) {
                throw new Error('Session expired or authentication failed. Please log in again.');
            }
            
            if (error.response?.status === 400 && error.response?.data?.detail === "Transaction ID already exists") {
                console.log('Transaction already exists in database');
                return { success: true, message: 'Transaction already recorded' };
            }
            
            if (error.response?.status === 404 && error.response?.data?.detail === "User not found") {
                throw new Error('User not found in system');
            }
            
            throw error;
        }
    };

    const getMyBlockchainTransactions = async () => {
        try {
            const response = await axios.get(`${API_URL}/blockchain/my-transactions`, {
                withCredentials: true
            });
            return response.data.data || [];
        } catch (error) {
            console.error('Error fetching blockchain transactions:', error);
            return [];
        }
    };

    const loadTransactionHistory = async () => {
        try {
            const transactions = await getMyBlockchainTransactions();
            setTransactionHistory(transactions);
            setShowHistory(true);
        } catch (error) {
            console.error('Error loading transaction history:', error);
        }
    };

    const handleChange = (e, value) => {
        if (e?.target) {
            const { name, type, checked, value: val } = e.target;
            setForm((prev) => ({
                ...prev,
                [name]: type === "checkbox" ? checked : val,
            }));
        } else {
            setForm((prev) => ({
                ...prev,
                [e]: value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (isPending || isConfirming) {
            return;
        }

        let newErrors = {};
        let firstErrorMessage = "";

        // Validate weatherTemperature
        if (!form.weatherTemperature) {
            newErrors.weatherTemperature = "Temperature is required";
            firstErrorMessage = "Temperature is required";
        } else if (isNaN(Number(form.weatherTemperature))) {
            newErrors.weatherTemperature = "Temperature must be a number";
            firstErrorMessage = "Temperature must be a number";
        } else if (Number(form.weatherTemperature) > 50) {
            newErrors.weatherTemperature = "Temperature cannot be higher than 50°C";
            firstErrorMessage = "Temperature cannot be higher than 50°C";
        }

        // Validate compostType & fertilizerType
        if (form.compostAdded && !form.compostType.trim()) {
            newErrors.compostType = "Compost Type is required when compost is added";
            if (!firstErrorMessage) firstErrorMessage = "Compost Type is required when compost is added";
        }

        if (form.fertilizerAdded && !form.fertilizerType.trim()) {
            newErrors.fertilizerType = "Fertilizer Type is required when fertilizer is added";
            if (!firstErrorMessage) firstErrorMessage = "Fertilizer Type is required when fertilizer is added";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setErrorDescription(firstErrorMessage);
            setShowErrorPopup(true);
            if (popupRef.current) popupRef.current.showModal();
            return;
        }

        setErrors({});
        setShowErrorPopup(false);
        setErrorDescription("");

        

        if (!isConnected) {
            setErrorDescription("Please connect your wallet first");
            setShowErrorPopup(true);
            if (popupRef.current) popupRef.current.showModal();
            return;
        }

        // Check if contract address is configured
        if (!CONTRACT_ADDRESS) {
            setErrorDescription("Contract address not configured. Please check your environment variables.");
            setShowErrorPopup(true);
            if (popupRef.current) popupRef.current.showModal();
            return;
        }

        try {
            // Prepare the data for the smart contract
            const _weatherData = {
                temperature: Number(form.weatherTemperature),
                condition: weatherOptions.find(w => w.label === form.weatherCondition)?.value || 0
            };

            const _careActions = {
                waterToday: form.waterToday,
                compostAdded: form.compostAdded,
                compostType: form.compostType || "None",
                fertilizerAdded: form.fertilizerAdded,
                fertilizerType: form.fertilizerType || "None"
            };

            const _healthStatus = {
                diseaseType: diseaseOptions.find(d => d.label === form.diseaseType)?.value || 0,
                diseaseOtherDescription: form.diseaseType === "OTHER" ? form.diseaseOtherDescription : "",
                soilCondition: soilOptions.find(s => s.label === form.soilCondition)?.value || 0
            };

            const _extraNotes = form.extraNotes || "";

            // Call the smart contract
            await writeContract({
                address: CONTRACT_ADDRESS,
                abi: abi,
                functionName: 'submitDailyReport',
                args: [_weatherData, _careActions, _healthStatus, _extraNotes],
            });

        } catch (err) {
            console.error("Error submitting to blockchain:", err);
            let errorMsg = "Failed to submit to blockchain";

            if (err.message) {
                if (err.message.includes("User rejected")) {
                    errorMsg = "Transaction was rejected by user";
                } else if (err.message.includes("insufficient funds")) {
                    errorMsg = "Insufficient funds for gas fees";
                } else if (err.message.includes("execution reverted")) {
                    errorMsg = "Contract execution failed. Please check your data.";
                } else {
                    errorMsg = err.message;
                }
            }

            setErrorDescription(errorMsg);
            setShowErrorPopup(true);
            if (popupRef.current) popupRef.current.showModal();
        }
    };

    const handlePopupConfirm = () => {
        setShowErrorPopup(false);
        if (popupRef.current) popupRef.current.close();
    };

    const handleSuccessPopupConfirm = () => {
        setShowSuccessPopup(false);
        if (successPopupRef.current) successPopupRef.current.close();
        setRecordedToday(true);
    };

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 1000);
        
        const checkTodayReport = async () => {
            try {
                const transactions = await getMyBlockchainTransactions();

                if (hasSubmittedToday(transactions)) {
                    // setRecordedToday(true);
                }
            } catch (error) {
                console.error('Error checking today report:', error);
                // If session expired
                if (error.message.includes('Session expired')) {
                    navigate('/login');
                }
            }
        };
        
        checkTodayReport();
    }, []);

    useEffect(() => {
        const handleTransactionConfirmed = async () => {
            if (isConfirmed && hash) {
                console.log("Transaction confirmed with hash:", hash);
                
                try {
                    
                    const result = await saveBlockchainTransaction(hash);
                    console.log("Transaction saved to database:", result);
                    
                    setShowSuccessPopup(true);
                    if (successPopupRef.current) successPopupRef.current.showModal();
                    
                } catch (error) {
                    console.error("Error saving transaction to database:", error);
                    
                    if (error.message.includes('Session expired')) {
                        setErrorDescription("Session expired. Please log in again and retry.");
                        setShowErrorPopup(true);
                        if (popupRef.current) popupRef.current.showModal();
                        setTimeout(() => navigate('/login'), 2000);
                        return;
                    }
                    
                    setErrorDescription(`Blockchain transaction successful, but failed to save to database: ${error.message}`);
                    setShowErrorPopup(true);
                    if (popupRef.current) popupRef.current.showModal();
                }
            }
        };

        handleTransactionConfirmed();
    }, [isConfirmed, hash, navigate]);

    useEffect(() => {
        if (contractError) {
            console.error("Contract Error:", contractError);
            let errorMsg = "Transaction failed";

            if (contractError.message) {
                if (contractError.message.includes("User rejected")) {
                    errorMsg = "Transaction was rejected by user";
                } else if (contractError.message.includes("insufficient funds")) {
                    errorMsg = "Insufficient funds for gas fees";
                } else if (contractError.message.includes("execution reverted")) {
                    errorMsg = "Contract execution failed. Please check your data.";
                } else {
                    errorMsg = contractError.message;
                }
            }

            setErrorDescription(errorMsg);
            setShowErrorPopup(true);
            if (popupRef.current) popupRef.current.showModal();
        }
    }, [contractError]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <LoadingStatic />
            </div>
        );
    }

    if (!isConnected) {
        return (
            <div className="flex flex-col gap-4 justify-center min-h-[70vh]">
                <img src={WalletRequired} alt="Wallet Required" className="w-1/2 h-1/2 mx-auto" />
                <h2 className="text-xl font-bold text-center">Wallet Required</h2>
                <h3 className="text-center">Please connect your wallet to submit the daily report</h3>
                <ConnectButton.Custom>
                    {({ openConnectModal }) => (
                        <Button
                            noMax
                            background="#0F7275"
                            color="#F7FAFC"
                            label="Connect Wallet"
                            onClick={openConnectModal}
                        />
                    )}
                </ConnectButton.Custom>
            </div>
        );
    }

    if (recordedToday) {
        return (
            <div className="flex justify-center flex-col w-full gap-2 min-h-[70vh]">
                <img src={DataRecorded} alt="Daily Report Already Recorded" className="w-1/2 h-1/2 mx-auto" />
                <h2 className="text-xl font-bold text-center">Daily report recorded</h2>
                <h3 className="text-center">You have submitted your report recently.</h3>
                <Button
                    className="w-full mx-auto"
                    noMax
                    background="#0F7275"
                    color="#F7FAFC"
                    label={"Go Back"}
                    onClick={() => navigate("/centra/dashboard")}
                />
            </div>
        );
    }

    return (
        <div className="w-full flex flex-col gap-2">
            {/* Your existing form JSX */}
            <div className="flex flex-row justify-between items-center gap-4 mb-4">
                <span className="text-xl font-bold">Your Wallet</span>
                <ConnectButton></ConnectButton>
            </div>
            <hr className="text-[#79B2B7]"></hr>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-row justify-between">
                    <h2 className="text-xl font-bold">Weather</h2>

                    {/* <ConnectButton.Custom>
                        {({ openConnectModal }) => (
                            <Button
                                type={"button"}
                                noMax
                                background="#D45D5D"
                                color="#F7FAFC"
                                label="Disconnect Wallet"
                                onClick={openConnectModal}
                            />
                        )}
                    </ConnectButton.Custom> */}
                </div>
                <div className="flex flex-col gap-4 col-span-2 justify-center">

                    <InputField
                        maxNum={50}
                        label="Weather Temperature (°C)"
                        name="weatherTemperature"
                        type="number"
                        value={form.weatherTemperature}
                        onChange={handleChange}
                        required
                    />






                    <DropdownField
                        label="Weather Condition"
                        name="weatherCondition"
                        value={form.weatherCondition}
                        onChange={handleChange}
                        required
                        options={weatherOptions}
                    />
                </div>
                <hr className="text-[#79B2B7]"></hr>
                <h2 className="text-xl font-bold">Daily Actions</h2>
                <CheckboxField
                    label="Watered Today"
                    name="waterToday"
                    checked={form.waterToday}
                    onChange={handleChange}
                    required
                />
                <div className="flex flex-col gap-2 col-span-2">
                    <CheckboxField
                        label="Compost Added"
                        name="compostAdded"
                        checked={form.compostAdded}
                        onChange={handleChange}
                        required
                    />
                    {form.compostAdded && (
                        <InputField
                            label="Compost Type"
                            name="compostType"
                            type="text"
                            value={form.compostType}
                            onChange={handleChange}
                            required
                        />
                    )}
                </div>

                <div className="flex flex-col gap-2 col-span-2">
                    <CheckboxField
                        label="Fertilizer Added"
                        name="fertilizerAdded"
                        checked={form.fertilizerAdded}
                        onChange={handleChange}
                        required
                    />
                    {form.fertilizerAdded && (
                        <InputField
                            label="Fertilizer Type"
                            name="fertilizerType"
                            type="text"
                            value={form.fertilizerType}
                            onChange={handleChange}
                            required
                        />
                    )}
                </div>
                <hr className="text-[#79B2B7]"></hr>
                <h2 className="text-xl font-bold">Health Status</h2>
                <DropdownField
                    label="Disease Type"
                    name="diseaseType"
                    value={form.diseaseType}
                    onChange={handleChange}
                    required
                    options={diseaseOptions}
                />
                {form.diseaseType === "OTHER" && (
                    <InputField
                        label="Disease Description"
                        name="diseaseOtherDescription"
                        type="text"
                        value={form.diseaseOtherDescription}
                        onChange={handleChange}
                        required
                    />
                )}
                <DropdownField
                    label="Soil Condition"
                    name="soilCondition"
                    value={form.soilCondition}
                    onChange={handleChange}
                    required
                    options={soilOptions}
                />
                <TextareaField
                    label="Extra Notes"
                    name="extraNotes"
                    type="textarea"
                    value={form.extraNotes}
                    onChange={handleChange}
                />

                <Button
                    type="submit"
                    noMax
                    background="#0F7275"
                    color="#F7FAFC"
                    label={(isPending || isConfirming) ? <span className='loading loading-dots loading-sm'></span> : "Submit"}
                // disabled={isPending || isConfirming}
                />
            </form>

            <div className="mt-4">
                <Button
                    type="button"
                    noMax
                    background="#6B7280"
                    color="#F7FAFC"
                    label="View Transaction History"
                    onClick={loadTransactionHistory}
                />
            </div>

            {showHistory && (
                <div className="mt-4 p-4 border rounded-lg bg-gray-50">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-lg font-bold">Transaction History</h3>
                        <button 
                            onClick={() => setShowHistory(false)}
                            className="text-gray-500 hover:text-gray-700"
                        >
                            ×
                        </button>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                        {transactionHistory.length === 0 ? (
                            <p className="text-gray-500">No transactions found</p>
                        ) : (
                            <div className="space-y-2">
                                {transactionHistory.map((tx, index) => (
                                    <div key={index} className="p-3 bg-white rounded border">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="font-mono text-sm text-gray-600">
                                                    {tx.trx_id.substring(0, 20)}...
                                                </p>
                                                <p className="text-xs text-gray-500">
                                                    {tx.created_at ? new Date(tx.created_at).toLocaleString() : 'No date'}
                                                </p>
                                            </div>
                                            <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                                                Confirmed
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
            
            {/* Popups */}
            <Popup
                ref={popupRef}
                error={true}
                description={errorDescription}
                onConfirm={handlePopupConfirm}
                leavesid="error_modal"
            />
            <Popup
                ref={successPopupRef}
                success={true}
                description="Daily report submitted successfully and saved to blockchain!"
                onConfirm={handleSuccessPopupConfirm}
                leavesid="success_modal"
                open={showSuccessPopup}
            />
        </div>
    );
};

export default DailyReportCentra;