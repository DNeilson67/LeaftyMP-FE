import React, { forwardRef } from 'react';
import Button from "@components/Button";
import InfoIcon from "@assets/confirm.svg";

const FeatureUnavailablePopup = forwardRef(({ 
    leavesid = "feature-unavailable-popup",
    title = "Feature Unavailable",
    description = "This feature is currently unavailable. We're working hard to bring it to you soon!",
    buttonText = "Got it"
}, ref) => {
    
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
                    <img src={InfoIcon} className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20" alt="Info" />
                    <span className='font-bold text-base sm:text-lg lg:text-xl text-center'>{title}</span>
                </div>

                {/* Content area */}
                <div className="flex flex-col gap-3 text-sm sm:text-base">
                    <div className="text-center text-sm sm:text-base px-2 sm:px-4">
                        {description}
                    </div>
                </div>

                {/* Button section */}
                <div className="flex flex-col w-full mt-2 sm:mt-4">
                    <Button 
                        noMax={true}
                        className="w-full min-h-10 sm:min-h-12 text-sm sm:text-base"
                        type="submit" 
                        background="#0F7275" 
                        color="#F7FAFC" 
                        label={buttonText} 
                        onClick={handleClose}
                    />
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

export default FeatureUnavailablePopup;
