import React, { forwardRef, useEffect, useState } from 'react';
import Button from "@components/Button";
import ErrorIcon from "@assets/error.svg";
import InfoIcon from "@assets/confirm.svg";
import WarningIcon from "@assets/warning.svg";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import SuccessIcon from "@assets/SuccessIcon.svg";

const Popup = forwardRef(({ 
    success = false, 
    warning = false, 
    info = false, 
    error = false, 
    confirm = false, 
    
    leavesid, 
    description, 
    onConfirm, 
    onCancel,
    onRetry,
    canRetry = false,
    retryText = "Try Again",
    isRetrying = false,
    confirmText = "Confirm",
    cancelText = "Cancel",
    isConfirming = false
}, ref) => {
    
    const handleConfirm = () => {
        if (onConfirm) {
            onConfirm();
        }
        if (ref.current) {
            ref.current.close();
        }
    };

    const handleCancel = () => {
        if (onCancel) {
            onCancel();
        }
        if (ref.current) {
            ref.current.close();
        }
    };

    const handleRetry = () => {
        if (onRetry) {
            onRetry();
        }
    };

    const handleClose = () => {
        if (ref.current) {
            ref.current.close();
        }
    };

    return (
        <dialog ref={ref} id={leavesid} className="modal modal-bottom sm:modal-middle">
            <div className="modal-box rounded-lg flex flex-col gap-2 max-w-sm sm:max-w-md lg:max-w-xl w-full sm:mx-auto p-4 sm:p-6">
                {/* Header with icon and title */}
                <div className="flex flex-col items-center gap-2 sm:gap-3">
                    {warning && (
                        <>
                            <img src={WarningIcon} className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20" alt="Warning" />
                            <span className='font-bold text-base sm:text-lg lg:text-xl text-center'>{"Warning"}</span>
                        </>
                    )}
                    {info && (
                        <>
                            <img src={InfoIcon} className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20" alt="Info" />
                            <span className='font-bold text-base sm:text-lg lg:text-xl text-center'>{"Confirm?"}</span>
                        </>
                    )}
                    {success && (
                        <>
                            <img src={SuccessIcon} className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20" alt="Success" />
                            <span className='font-bold text-base sm:text-lg lg:text-xl text-center'>{"Thank you!"}</span>
                        </>
                    )}
                    {error && (
                        <>
                            <img src={ErrorIcon} className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20" alt="Error" />
                            <span className='font-bold text-base sm:text-lg lg:text-xl text-center'>{"Error"}</span>
                        </>
                    )}
                </div>

                {/* Content area with proper formatting */}
                <div className="flex flex-col gap-3 text-sm sm:text-base">
                    {description && (
                        <div className="text-left">
                            {/* Complex warning dialog with structured content */}
                            {warning && description.includes('\n') && description.includes('•') ? (
                                <>
                                    {/* Main question */}
                                    <div className="text-center font-medium text-sm sm:text-base lg:text-lg mb-3 sm:mb-4">
                                        {description.split('\n')[0]}
                                    </div>
                                    
                                    {/* Warning section */}
                                    <div className="bg-orange-50 border-l-4 border-orange-400 p-3 sm:p-4 mb-3 sm:mb-4 rounded-r">
                                        <div className="font-medium text-orange-800 mb-2 text-sm sm:text-base">
                                            ⚠️ This action cannot be undone
                                        </div>
                                        <div className="text-orange-700 text-xs sm:text-sm space-y-1">
                                            {description.split('\n').slice(2).filter(line => line.startsWith('•')).map((line, index) => (
                                                <div key={index}>{line}</div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            ) : description.includes('Transaction Details:') ? (
                                <>
                                    {/* Main question */}
                                    <div className="text-center font-medium text-sm sm:text-base lg:text-lg mb-3 sm:mb-4">
                                        {description.split('\n')[0]}
                                    </div>
                                    
                                    {/* Transaction details section */}
                                    <div className="bg-gray-50 p-3 sm:p-4 rounded border">
                                        <div className="font-medium text-gray-800 mb-2 text-sm sm:text-base">Transaction Details:</div>
                                        <div className="text-gray-700 text-xs sm:text-sm space-y-1">
                                            {description.split('\n').slice(-3).map((line, index) => (
                                                <div key={index} className="flex items-center gap-1 break-all">
                                                    {line}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </>
                            ) : (
                                /* Simple description for all other cases */
                                <div className="text-center text-sm sm:text-base px-2 sm:px-4">
                                    {description}
                                </div>
                            )}
                        </div>
                    )}
                </div>
                {/* Buttons section - Fully responsive */}
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full mt-2 sm:mt-4">
                    {/* Cancel button for confirm dialogs - show first (bottom on mobile, left on desktop) */}
                    {confirm && (
                        <Button 
                            noMax={true}
                            className={`${confirm ? 'w-full sm:w-1/2' : 'w-full'} order-2 sm:order-1 min-h-10 sm:min-h-12 text-sm sm:text-base`}
                            type="cancel" 
                            background="#6b7280" 
                            color="#F7FAFC" 
                            label={cancelText || "Cancel"} 
                            onClick={handleCancel}
                            disabled={isConfirming}
                        />
                    )}
                    
                    {/* Default confirm button for non-error cases or errors without retry */}
                    {(!error || !canRetry) && (
                        <Button 
                            noMax={true}
                            className={`${confirm ? 'w-full sm:w-1/2' : 'w-full'} order-1 sm:order-2 min-h-10 sm:min-h-12 text-sm sm:text-base`}
                            type="submit" 
                            background={warning ? "#dc2626" : "#0F7275"} 
                            color="#F7FAFC" 
                            label={isConfirming ? "Processing..." : (confirmText || "Confirm")} 
                            onClick={handleConfirm}
                            disabled={isConfirming}
                        />
                    )}
                    
                    {/* Show retry button for errors with retry capability */}
                    {error && canRetry && onRetry && (
                        <Button 
                            noMax={true}
                            className="w-full order-1 sm:order-2 min-h-10 sm:min-h-12 text-sm sm:text-base" 
                            type="submit" 
                            background="#0F7275" 
                            color="#F7FAFC" 
                            label={isRetrying ? "Retrying..." : (retryText || "Try Again")}
                            onClick={handleRetry}
                            disabled={isRetrying}
                        />
                    )}
                </div>
                <button 
                    className="btn btn-sm sm:btn-md btn-circle btn-ghost absolute right-2 top-2 sm:right-3 sm:top-3 font-bold text-[#0F7275] text-sm sm:text-base" 
                    onClick={handleClose}
                >
                    ✕
                </button>
            </div>
        </dialog>
    );
});

export default Popup;
