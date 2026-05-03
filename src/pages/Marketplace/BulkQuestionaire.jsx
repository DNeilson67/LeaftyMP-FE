import React, { useEffect, useState } from 'react';
import { Button, LinearProgress } from '@mui/material';
import LeaftyLogo from "@assets/LeaftyLogo.svg";
import randomize from "@assets/randomize.svg";
import WideButtonRow from '@components/WideButtonRow';
import StepOne from '../../components/StepBulkTransaction/StepOne';
import StepThree from '../../components/StepBulkTransaction/StepThree';
import StepTwo from '../../components/StepBulkTransaction/StepTwo';
import LoadingStatic from '../../components/LoadingStatic';
import { useNavigate } from 'react-router';
import { API_URL } from '../../App';
import axios from 'axios';
import { AnimatedBeam } from '@components/ui/animated-beam';
import LoadingAnimation from '@components/LoadingAnimation';
import { useAuth } from '@context/AuthContext';

function BulkQuestionaire({ onClose }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [product, setProduct] = useState("");
    const [quantity, setQuantity] = useState(1000);
    const [results, setResults] = useState({});
    const [preferredCentra, setPreferredCentra] = useState("");
    const [selectedCentras, setSelectedCentras] = useState([]); // For customized mode
    const navigate = useNavigate(); // To navigate to another page
    const user = useAuth(); // Get authenticated user

    // New state for quantity mismatch modal
    const [showQuantityModal, setShowQuantityModal] = useState(false);
    const [availableQuantity, setAvailableQuantity] = useState(0);
    const [pendingResults, setPendingResults] = useState(null);

    const steps = [
        { label: 'Step 1', value: 33 },  // 33% for Step 1
        { label: 'Step 2', value: 66 },  // 66% for Step 2
        { label: 'Step 3', value: 100 }, // 100% for Step 3
    ];

    const handleNext = () => {
        if (currentStep < steps.length) {
            setCurrentStep(prevStep => prevStep + 1);
        }
    };

    const handlePrev = () => {
        if (currentStep > 0) {
            setCurrentStep(prevStep => prevStep - 1);
        }
    };

    const handleQuantity = (value) => {
        let numericValue = parseInt(value, 10) || 0;
        numericValue = Math.min(Math.max(numericValue, 500), 100000);
        setQuantity(numericValue);
    };

    const renderStepContent = () => {
        switch (currentStep) {
            case 0:
                return <StepOne product={product} setProduct={setProduct} />;
            case 1:
                return <StepTwo product={product} quantity={quantity} handleQuantity={handleQuantity} />;
            case 2:
                return <StepThree
                    preferredCentra={preferredCentra}
                    setPreferredCentra={setPreferredCentra}
                    product={product}
                    selectedCentras={selectedCentras}
                    setSelectedCentras={setSelectedCentras}
                />;
            case 3:
                return <div className="h-[60dvh] relative insets-0 flex flex-col justify-center items-center gap-4">
                    <LoadingAnimation />
                    <span className="font-semibold">Finding the best leaves for you! Please wait.</span>
                </div>
            default:
                return null;
        }
    };

    const convertItemType = (product) => {
        if (product === "Wet Leaves") {
            return "wet_leaves";
        } else if (product === "Dry Leaves") {
            return "dry_leaves";
        } else if (product === "Powder") {
            return "flour";
        }
    };

    useEffect(() => {
        const fetchDataAndRedirect = async () => {
            if (currentStep === 3) {
                try {
                    // Step 1: Prepare API parameters based on mode
                    const params = {
                        item_type: convertItemType(product),
                        target_weight: quantity
                    };

                    // Determine mode based on preferredCentra
                    if (preferredCentra === "Closest Proximity") {
                        params.mode = "closest";
                        // Backend will get user location from session data
                    } else if (preferredCentra === "Customized") {
                        params.mode = "customized";
                        // Add selected centra IDs (required for customized mode)
                        if (selectedCentras && selectedCentras.length > 0) {
                            params.selected_centra_ids = selectedCentras.map(c => c.key);
                        } else {
                            throw new Error("Please select at least one centra for customized mode");
                        }
                    } else {
                        // Randomized mode (default)
                        params.mode = "random";
                    }

                    // Step 2: Get the algorithm results
                    const response = await axios.get(API_URL + "/marketplace/bulkItem", {
                        params,
                        headers: {
                            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
                        },
                        paramsSerializer: {
                            indexes: null // This will serialize arrays as ?selected_centra_ids=id1&selected_centra_ids=id2
                        }
                    });

                    // Set the results state with the response data
                    setResults(response.data);

                    // Check if available quantity matches requested quantity
                    const maxValue = response.data.max_value;
                    if (maxValue < quantity) {
                        // Quantity mismatch - show modal
                        setAvailableQuantity(maxValue);
                        setPendingResults(response.data);
                        setShowQuantityModal(true);
                        setCurrentStep(2); // Go back to step 2 but keep loading appearance
                        return; // Don't proceed to transaction creation yet
                    }

                    // If quantities match, proceed with transaction creation
                    await createBulkTransaction(response.data);

                } catch (error) {
                    console.error("Error creating bulk transaction:", error);

                    // Show user-friendly error message
                    let errorMessage = "Failed to create bulk transaction. Please try again.";
                    if (error.response?.data?.detail) {
                        errorMessage = error.response.data.detail;
                    } else if (error.message) {
                        errorMessage = error.message;
                    }

                    alert(errorMessage);

                    // Go back to step 2 to let user retry
                    setCurrentStep(2);
                }
            }
        };

        fetchDataAndRedirect();
    }, [currentStep, product, quantity, navigate, preferredCentra, selectedCentras]);

    // Function to create bulk transaction (extracted for reuse)
    const createBulkTransaction = async (algorithmResults) => {
        try {
            // Step 3: Transform algorithm results into bulk transaction format
            const bulkItems = [];
            const choices = algorithmResults.choices;

            // Convert algorithm results to bulk transaction items
            Object.keys(choices).forEach(centraId => {
                const centraItems = choices[centraId];
                centraItems.forEach(item => {
                    // Determine ProductTypeID based on product type
                    let productTypeId;
                    if (product === "Wet Leaves") {
                        productTypeId = 1;
                    } else if (product === "Dry Leaves") {
                        productTypeId = 2;
                    } else if (product === "Powder") {
                        productTypeId = 3;
                    }

                    bulkItems.push({
                        CentraID: centraId,
                        ProductTypeID: productTypeId,
                        ProductID: item.id,
                        Price: item.price,
                        InitialPrice: item.initial_price,
                        Weight: item.weight
                    });
                });
            });

            // Step 4: Create the bulk transaction
            const bulkTransactionData = {
                items: bulkItems
            };

            const createTransactionResponse = await axios.post(
                API_URL + "/marketplace/create_bulk_transaction",
                bulkTransactionData,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            const transactionId = createTransactionResponse.data.TransactionID;

            setTimeout(() => {
                // Step 5: Redirect to transaction page with transaction ID
                navigate(`/marketplace/transaction?tr_id=${transactionId}`, {
                    state: {
                        product,
                        results: algorithmResults,
                        mode: preferredCentra,
                    }
                });
            }, 2000);
        } catch (error) {
            console.error("Error in createBulkTransaction:", error);
            throw error;
        }
    };

    // Handler for accepting available quantity
    const handleAcceptAvailableQuantity = async () => {
        setShowQuantityModal(false);
        setCurrentStep(3); // Show loading
        try {
            await createBulkTransaction(pendingResults);
        } catch (error) {
            console.error("Error creating transaction:", error);
            alert("Failed to create transaction. Please try again.");
            setCurrentStep(2);
        }
    };

    // Handler for adjusting quantity
    const handleAdjustQuantity = () => {
        setShowQuantityModal(false);
        setQuantity(availableQuantity);
        // User stays on step 2 to review and can proceed again
    };

    // Handler for canceling
    const handleCancelQuantityModal = () => {
        setShowQuantityModal(false);
        // User stays on step 2
    };

    return (
        <div className="w-full flex flex-col gap-4 sm:gap-6 pb-4 px-2 sm:px-4">
            {/* Quantity Mismatch Modal - DaisyUI */}
            <input
                type="checkbox"
                id="quantity_modal"
                className="modal-toggle"
                checked={showQuantityModal}
                readOnly
            />
            <div className="modal modal-bottom sm:modal-middle">
                <div className="modal-box max-w-lg p-0 overflow-hidden">
                    {/* Modal Header */}
                    <div className="bg-[#FFA726] text-white px-4 sm:px-6 py-3 sm:py-4 flex items-center gap-3">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 sm:h-8 sm:w-8 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <div>
                            <h2 className="font-semibold text-base sm:text-lg">Quantity Not Available</h2>
                            <p className="text-xs sm:text-sm opacity-90">The requested quantity is not fully available</p>
                        </div>
                    </div>

                    {/* Modal Content */}
                    <div className="p-4 sm:p-6">
                        <div className="mb-4">
                            <div className="flex justify-between items-center mb-3 pb-3 border-b">
                                <span className="text-sm sm:text-base text-gray-600">Requested Quantity:</span>
                                <span className="font-bold text-base sm:text-lg text-gray-800">{quantity.toLocaleString()} Kg</span>
                            </div>
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-sm sm:text-base text-gray-600">Available Quantity:</span>
                                <span className="font-bold text-base sm:text-lg text-green-600 flex items-center gap-2">
                                    {availableQuantity.toLocaleString()} Kg
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </span>
                            </div>

                            {/* Custom Warning Box (like old one) */}
                            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
                                <p className="text-xs sm:text-sm text-gray-700 font-semibold mb-2">
                                    What would you like to do?
                                </p>
                                <ul className="text-xs sm:text-sm text-gray-600 space-y-1 list-disc list-inside">
                                    {
                                        availableQuantity === 0 &&
                                        <li><strong>Cancel</strong> - Unfortunately, there is no available quantity at the moment. Please adjust your order.</li>
                                    }
                                    {
                                        availableQuantity > 0 && <>
                                            <li><strong>Proceed with {availableQuantity.toLocaleString()} Kg</strong> - Continue with available quantity</li>
                                            <li><strong>Adjust to {availableQuantity.toLocaleString()} Kg</strong> - Update your order and review</li>
                                            <li><strong>Cancel</strong> - Go back and change your selection</li>
                                        </>
                                    }

                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Modal Actions - Mobile Friendly */}
                    <div className="bg-gray-50 px-4 sm:px-6 py-3 sm:py-4 border-t border-gray-200">
                        <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 sm:justify-end">
                            {
                                availableQuantity === 0 &&
                                <button
                                    onClick={handleCancelQuantityModal}
                                    className="btn btn-ghost w-full sm:w-auto order-3 sm:order-1"
                                >
                                    Cancel
                                </button>
                            }

                            {
                                availableQuantity > 0 &&
                                <>
                                    <button
                                        onClick={handleAdjustQuantity}
                                        className="btn bg-[#FFA726] hover:bg-[#FB8C00] text-white border-none w-full sm:w-auto order-2"
                                    >
                                        Adjust to {availableQuantity.toLocaleString()} Kg
                                    </button>
                                    <button
                                        onClick={handleAcceptAvailableQuantity}
                                        className="btn bg-[#417579] hover:bg-[#2d5357] text-white border-none w-full sm:w-auto order-1 sm:order-3"
                                    >
                                        Proceed with {availableQuantity.toLocaleString()} Kg
                                    </button>
                                </>
                            }

                        </div>
                    </div>
                </div>
            </div>

            <div className="flex justify-between mb-2">
                {currentStep < 3 && steps.map((step, index) => (
                    <div
                        key={index}
                        className={`w-1/3 mt-1 mx-1 rounded-full p-1 transition-all duration-200 ease-in-out ${index === currentStep ? 'border-2 border-[#94C3B3]' : 'border-2 border-transparent'}`}
                    >
                        <LinearProgress
                            variant=""
                            value={100}
                            sx={{
                                height: { xs: 8, sm: 12.5 },
                                borderRadius: 100,
                                backgroundColor: '#e0e0e0',
                                '& .MuiLinearProgress-bar': {
                                    backgroundColor: index === currentStep ? '#72a3a5' : '#e0e0e0',
                                    transition: 'background-color 0.25s ease-in-out',
                                },
                                margin: 0.25,
                            }}
                        />
                    </div>
                ))}
                {
                    currentStep === 3 && <div
                        className={`w-full mt-1 mx-1 rounded-full p-1 transition-all duration-200 ease-in-out border-2 border-[#94C3B3]`}
                    >
                        <LinearProgress
                            variant="indeterminate"
                            value={100}
                            sx={{
                                height: { xs: 8, sm: 12.5 },
                                borderRadius: 100,
                                backgroundColor: '#e0e0e0',
                                '& .MuiLinearProgress-bar': {
                                    backgroundColor: '#72a3a5',
                                    transition: 'background-color 0.25s ease-in-out',
                                },
                                margin: 0.25,
                            }}
                        />
                    </div>
                }

            </div>
            <div className="flex items-center mx-2 sm:mx-4 justify-between">
                <div className='flex flex-row items-center cursor-pointer' onClick={() => navigate('/marketplace/homepage')}>
                    <img src={LeaftyLogo} alt="Logo" className="h-8 sm:h-10 mr-2" />
                    <span className="text-2xl sm:text-4xl font-sm" style={{ fontFamily: "LT-Saeada", color: "#417679" }}>Leafty</span>
                </div>
                {onClose && (
                    <button className="btn btn-circle btn-sm sm:btn-md" style={{ backgroundColor: "rgba(148, 195, 179, 0.5)" }} onClick={onClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 sm:h-6 sm:w-6" fill="none" viewBox="0 0 24 24" stroke="#0F7275">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>
            <div className={`flex flex-col justify-center w-full sm:w-4/5 lg:w-2/3 place-self-center px-2 sm:px-4 ${currentStep === 3 ? "" : "mt-6 sm:mt-12"}`}>
                {renderStepContent()}
                <div className={`flex flex-col sm:flex-row gap-2 sm:gap-4 ${currentStep !== 0 ? "sm:justify-between" : "sm:justify-end"} mt-4`}>
                    {(currentStep > 0 && currentStep < 3) && (
                        <button
                            onClick={handlePrev}
                            className='btn w-full sm:btn-wide'
                            style={{ backgroundColor: "rgba(148, 195, 179, 0.50)" }}
                            disabled={currentStep === 0}
                        >
                            <span className="text-[#0F7275] text-sm sm:text-base">Previous</span>
                        </button>
                    )}
                    {currentStep < 2 && (
                        <button
                            onClick={handleNext}
                            className='btn w-full sm:btn-wide'
                            style={{ backgroundColor: product.length === 0 ? "" : "#0F7275" }}
                            disabled={product.length === 0 ? true : false}
                        >
                            <span className="text-white text-sm sm:text-base">Next</span>
                        </button>
                    )}
                    {currentStep === 2 && (
                        <button
                            onClick={handleNext}
                            className='btn w-full sm:btn-wide'
                            style={{
                                backgroundColor: (preferredCentra.length === 0 ||
                                    (preferredCentra === "Customized" && selectedCentras.length === 0)) ? "" : "#0F7275"
                            }}
                            disabled={preferredCentra.length === 0 ||
                                (preferredCentra === "Customized" && selectedCentras.length === 0)}
                        >
                            <span className="text-white text-sm sm:text-base">Find Now</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default BulkQuestionaire;
