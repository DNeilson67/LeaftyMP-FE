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

function BulkQuestionaire({ onClose }) {
    const [currentStep, setCurrentStep] = useState(0);
    const [product, setProduct] = useState("");
    const [quantity, setQuantity] = useState(1000);
    const [results, setResults] = useState({});
    const [preferredCentra, setPreferredCentra] = useState("");
    const navigate = useNavigate(); // To navigate to another page

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
                return <StepThree preferredCentra={preferredCentra} setPreferredCentra={setPreferredCentra} product={product} />;
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
                    // Make the GET request to the API and await the response
                    const response = await axios.get(API_URL + "/algorithm/bulkItem", {
                        params: {
                            item_type: convertItemType(product),
                            target_weight: quantity
                        }
                    });

                    // Set the results state with the response data
                    setResults(response.data);

                    setTimeout(() => {
                        navigate('transaction', {
                            state: {
                                product,
                                // quantity,
                                results: response.data,
                            }
                        });
                    }, 2000);

                } catch (error) {
                    console.error("Error fetching bulk item data", error);
                }
            }
        };

        fetchDataAndRedirect();
    }, [currentStep, product, quantity, navigate]);

    return (
        <div className="w-full flex flex-col gap-6 pb-4">
            <div className="flex justify-between mb-2">
                {currentStep < 3 && steps.map((step, index) => (
                    <div
                        key={index}
                        className={`w-1/3 mt-1 mx-1 rounded-full p-1 transition-all duration-200 ease-in-out ${index === currentStep ? 'border-2 border-[#94C3B3]' : 'border-2 border-transparent'}`}
                    >
                        <LinearProgress
                            variant="indeterminate"
                            value={100}
                            sx={{
                                height: 12.5,
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
                                height: 12.5,
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
            <div className="flex items-center mx-4 justify-between ">
                <div className='flex flex-row'>
                    <img src={LeaftyLogo} alt="Logo" className="h-10 mr-2" />
                    <span className="text-4xl font-sm" style={{ fontFamily: "LT-Saeada", color: "#417679" }}>Leafty</span>
                </div>
                {onClose && (
                    <button className="btn btn-circle" style={{ backgroundColor: "rgba(148, 195, 179, 0.5)" }} onClick={onClose}>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="#0F7275">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                )}
            </div>
            <div className={`flex flex-col justify-center w-2/3 place-self-center ${currentStep === 3 ? "" : "mt-12"}`}>
                {renderStepContent()}
                <div className={`flex flex-row ${currentStep !== 0 ? "justify-between" : "justify-end"}`}>
                    {(currentStep > 0 && currentStep < 3) && (
                        <button
                            onClick={handlePrev}
                            className='btn btn-wide mt-4'
                            style={{ backgroundColor: "rgba(148, 195, 179, 0.50)" }}
                            disabled={currentStep === 0}
                        >
                            <span className="text-[#0F7275]">Previous</span>
                        </button>
                    )}
                    {currentStep < 2 && (
                        <button
                            onClick={handleNext}
                            className='btn btn-wide mt-4'
                            style={{ backgroundColor: product.length === 0 ? "" : "#0F7275" }}
                            disabled={product.length === 0 ? true : false}
                        >
                            <span className="text-white">Next</span>
                        </button>
                    )}
                    {currentStep === 2 && (
                        <button
                            onClick={handleNext}
                            className='btn btn-wide mt-4'
                            style={{ backgroundColor: preferredCentra.length === 0 ? "" : "#0F7275" }}
                            disabled={preferredCentra.length === 0 ? true : false}
                        >
                            <span className="text-white">Find Now</span>
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}

export default BulkQuestionaire;
