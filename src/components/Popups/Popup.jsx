import React, { forwardRef } from 'react';
import Button from "@components/Button";
import ErrorIcon from "@assets/error.svg";
import InfoIcon from "@assets/confirm.svg";
import WarningIcon from "@assets/warning.svg";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import SuccessIcon from "@assets/SuccessIcon.svg";

const Popup = forwardRef(({ success = false, warning = false, info = false, error = false, confirm = false, leavesid, description, onConfirm, onCancel }, ref) => {
    return (
        <dialog ref={ref} id={leavesid} className="modal">
            <div className="modal-box rounded-lg flex flex-col gap-2 items-center justify-center">
                {warning && <>
                    <img src={WarningIcon} className="w-[100px]" alt="Warning" />
                    <span className='font-bold text-xl'>{"Warning"}</span>
                    <span>{description || "Confirm?"}</span>
                </>}
                {info && (
                    <>
                        <img src={InfoIcon} className="w-[100px]" alt="Info" />
                        <span className='font-bold text-xl'>{"Confirm?"}</span>
                        <span className='text-md'>{description}</span>
                    </>
                )}
                {success && (
                    <>
                        <img src={SuccessIcon} className="w-[100px]" alt="Success" />
                        <span className='font-bold text-xl'>{"Thank you!"}</span>
                        <span className='text-md'>{description}</span>
                    </>
                )}
                {error && <>
                    <img src={ErrorIcon} className="w-[100px]" alt="Error" />
                    <span className='font-bold text-2xl'>{"Error"}</span>
                    <span className='text-md'>{description || "Confirm?"}</span>
                </>}
                <div className="mt-4 w-full flex justify-center flex-col items-center gap-2">
                    <Button className="w-full" type="submit" background="#0F7275" color="#F7FAFC" label="Confirm" onClick={onConfirm} />
                    {confirm && (
                        <div className='gap-2 w-full flex flex-col items-center'>
                            <Button className="w-full" type="cancel" background="#94C3B3" color="#F7FAFC" label="Cancel" onClick={onCancel} />
                        </div>
                    )}
                </div>
                <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 font-bold text-[#0F7275]" onClick={() => ref.current.close()}>
                    ✕
                </button>
            </div>
        </dialog>
    );
});

export default Popup;
