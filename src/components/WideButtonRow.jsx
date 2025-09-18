import React from 'react';
import { motion } from 'framer-motion';
import WetLeaves from "@assets/products/wl.svg";
import DryLeaves from "@assets/products/dl.svg";
import Powder from "@assets/products/pd.svg";
import "@style/bigbtn.css";
import WidgetContainer from "./Cards/WidgetContainer";

function WideButtonRow({ count, widthClass, Buttons, width = "1/6", item, setItem }) {
    return (
        <>
            <div className='flex flex-col sm:flex-row gap-2 sm:gap-4 mt-4'>
                {Buttons.map(({ label, image, disabled }, index) => (
                    <motion.button 
                        key={index}
                        disabled={disabled} 
                        className={`big-btn bg-gray-100 border-2 border-[#E8E8E8] p-4 sm:p-6 rounded ${label === item ? 'active-btn' : ''} ${widthClass}`}
                        onClick={() => setItem(label)}
                    >
                        <div className="flex flex-col items-center justify-between">
                            <motion.img 
                                src={image} 
                                alt={label} 
                                className={`${label === "Powder" ? 'w-1/4 mb-2':`w-${width} mb-1`} max-w-12 sm:max-w-16`}
                                whileHover={{ scale: 1.1 }} // Scale up on hover
                                transition={{ duration: 0.2 }}
                            />
                            <span className="text-center text-gray-700 text-sm sm:text-base">{label}</span>
                        </div>
                    </motion.button>
                ))}
            </div>
        </>
    );
}

export default WideButtonRow;
