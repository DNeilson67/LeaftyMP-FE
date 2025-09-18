import React, { useState, useEffect } from 'react';
import { Slider } from '@mui/material';

// Helper function to format numbers with commas
const formatQuantity = (quantity) => {
    return quantity.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

function StepTwo({ product = "Product", quantity, handleQuantity }) {
    const [showKg, setShowKg] = useState(true);
    const [inputValue, setInputValue] = useState(formatQuantity(quantity));

    useEffect(() => {
        // Update the input value whenever the quantity prop changes
        setInputValue(formatQuantity(quantity));
    }, [quantity]);

    const incrementQuantity = () => {
        const newQuantity = Math.min(quantity + 500, 10000);
        handleQuantity(newQuantity);
    };

    const decrementQuantity = () => {
        const newQuantity = Math.max(quantity - 500, 500);
        handleQuantity(newQuantity);
    };

    const handleBlur = () => {
        // Validate and format the input value on blur
        let numericValue = parseInt(inputValue.replace(/[^0-9]/g, ''), 10) || 0;
        numericValue = Math.min(Math.max(numericValue, 500), 10000); // Clamp between 1,000 and 100,000
        handleQuantity(numericValue);
        setInputValue(formatQuantity(numericValue)); // Update formatted value
    };

    const handleInputChange = (e) => {
        // Allow user to input numeric values and update local state
        const value = e.target.value.replace(/[^0-9]/g, ''); // Strip non-numeric characters
        setInputValue(value);
    };

    return (
        <div className='flex flex-col w-full'>
            <span className='text-xl sm:text-2xl font-semibold'>How much {product} do you want to purchase?</span>
            <span className='text-[#79B2B7] text-lg sm:text-xl'>Manually input the amount or use the slider</span>
            <hr className='w-1/6 sm:w-1/12 border-[#0F7275] rounded border-2 my-2'></hr>

            <div className="flex flex-col justify-center items-center gap-2 px-2 sm:px-4">
                <span className="text-gray-500 text-sm sm:text-base">Amount (Kg)</span>

                <div className="flex flex-row w-full justify-between items-center gap-2 sm:gap-4">
                    {/* Decrement Button */}
                    <button
                        className="btn btn-circle btn-sm sm:btn-md"
                        style={{ backgroundColor: "#79B2B7", color: "#0F7275" }}
                        onClick={decrementQuantity}
                    >
                        <span className="text-lg sm:text-xl">-</span>
                    </button>

                    {/* Input Field with Formatted Quantity */}
                    <input
                        value={inputValue}
                        style={{
                            background: "rgba(148, 195, 179, 0.30)",
                            border: "3px rgba(15, 114, 117, 0.30)"
                        }}
                        onClick={() => setShowKg(!showKg)}
                        onChange={handleInputChange} // Update local state
                        onBlur={handleBlur} // Validate and update on blur
                        type="text"
                        className="input input-bordered w-1/2 sm:w-1/4 text-center text-lg sm:text-xl"
                    />

                    {/* Increment Button */}
                    <button
                        className="btn btn-circle btn-sm sm:btn-md"
                        style={{ backgroundColor: "#79B2B7", color: "#0F7275" }}
                        onClick={incrementQuantity}
                    >
                        <span className="text-lg sm:text-xl">+</span>
                    </button>
                </div>
            </div>

            {/* Slider */}
            <div className="px-2 sm:px-4 mt-4">
                <Slider
                    style={{
                        color: '#0F7275',
                        height: 8,
                    }}
                    value={quantity}
                    max={10000}
                    min={500}
                    step={500}
                    onChange={(e, value) => handleQuantity(value)} // Sync slider with input
                />
            </div>
        </div>
    );
}

export default StepTwo;
