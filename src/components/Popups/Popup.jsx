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
            <div className="modal-box rounded-lg flex flex-col gap-4 max-w-lg w-full sm:mx-auto">
                {/* Header with icon and title */}
                <div className="flex flex-col items-center gap-2">
                    {warning && (
                        <>
                            <img src={WarningIcon} className="w-[60px] sm:w-[80px]" alt="Warning" />
                            <span className='font-bold text-lg sm:text-xl text-center'>{"Warning"}</span>
                        </>
                    )}
                    {info && (
                        <>
                            <img src={InfoIcon} className="w-[60px] sm:w-[80px]" alt="Info" />
                            <span className='font-bold text-lg sm:text-xl text-center'>{"Confirm?"}</span>
                        </>
                    )}
                    {success && (
                        <>
                            <img src={SuccessIcon} className="w-[60px] sm:w-[80px]" alt="Success" />
                            <span className='font-bold text-lg sm:text-xl text-center'>{"Thank you!"}</span>
                        </>
                    )}
                    {error && (
                        <>
                            <img src={ErrorIcon} className="w-[60px] sm:w-[80px]" alt="Error" />
                            <span className='font-bold text-lg sm:text-xl text-center'>{"Error"}</span>
                        </>
                    )}
                </div>

                {/* Content area with proper formatting */}
                <div className="flex flex-col gap-3 text-sm">
                    {description && (
                        <div className="text-left">
                            {/* Main question */}
                            <div className="text-center font-medium text-sm sm:text-base mb-4">
                                {description.split('\n')[0]}
                            </div>
                            
                            {/* Warning section for warning dialogs */}
                            {warning && (
                                <div className="bg-orange-50 border-l-4 border-orange-400 p-3 mb-4 rounded-r">
                                    <div className="font-medium text-orange-800 mb-2 text-sm sm:text-base">
                                        ⚠️ This action cannot be undone
                                    </div>
                                    <div className="text-orange-700 text-xs sm:text-sm space-y-1">
                                        {description.split('\n').slice(2).filter(line => line.startsWith('•')).map((line, index) => (
                                            <div key={index}>{line}</div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {/* Transaction details section */}
                            {description.includes('Transaction Details:') && (
                                <div className="bg-gray-50 p-3 rounded border">
                                    <div className="font-medium text-gray-800 mb-2 text-sm sm:text-base">Transaction Details:</div>
                                    <div className="text-gray-700 text-xs sm:text-sm space-y-1">
                                        {description.split('\n').slice(-3).map((line, index) => (
                                            <div key={index} className="flex items-center gap-1 break-all">
                                                {line}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                            
                            {/* Simple description for non-warning dialogs */}
                            {!warning && !description.includes('Transaction Details:') && (
                                <div className="text-center whitespace-pre-line leading-relaxed text-sm">
                                    {description}
                                </div>
                            )}
                        </div>
                    )}
                </div>
                {/* Buttons section */}
                <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-1/2">
                    {/* Cancel button for confirm dialogs - show first (bottom) */}
                    {confirm && (
                        <Button 
                            className="w-full order-2 sm:order-1" 
                            type="cancel" 
                            background="#6b7280" 
                            color="#F7FAFC" 
                            label={cancelText} 
                            onClick={handleCancel}
                            disabled={isConfirming}
                        />
                    )}
                    
                    {/* Default confirm button for non-error cases or errors without retry */}
                    {(!error || !canRetry) && (
                        <Button 
                            className="w-full order-1 sm:order-2" 
                            type="submit" 
                            background={warning ? "#dc2626" : "#0F7275"} 
                            color="#F7FAFC" 
                            label={isConfirming ? "Processing..." : confirmText} 
                            onClick={handleConfirm}
                            disabled={isConfirming}
                        />
                    )}
                    
                    {/* Show retry button for errors with retry capability */}
                    {error && canRetry && onRetry && (
                        <Button 
                            className="w-full order-1 sm:order-2" 
                            type="submit" 
                            background="#0F7275" 
                            color="#F7FAFC" 
                            label={isRetrying ? "Retrying..." : retryText}
                            onClick={handleRetry}
                            disabled={isRetrying}
                        />
                    )}
                </div>
                <button 
                    className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 font-bold text-[#0F7275]" 
                    onClick={handleClose}
                >
                    ✕
                </button>
            </div>
        </dialog>
    );
});

export default Popup;
