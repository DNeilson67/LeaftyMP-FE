import React from 'react';
import WidgetContainer from '../components/Cards/WidgetContainer';

const LeavesType = ({ imageSrc, text, imgclassName = "h-auto", py = 4, px = 6, backgroundColor = "#A0C2B5" }) => {
    return (
        <div className='flex flex-col items-center justify-center'>
            <div className='flex justify-center w-full'>
                <WidgetContainer backgroundColor={backgroundColor} borderRadius="20px" border={false} className={`flex items-center  justify-center py-${py} px-${px}`}>
                    <img
                        src={imageSrc}
                        alt="Wet Leaves"
                        className={imgclassName}
                    />
                </WidgetContainer>
            </div>
            {/* <span className="block text-center mt-2 font-montserrat font-semibold text-lg leading-6 tracking-tighter">{text}</span> */}
        </div>
    );
}

export default LeavesType;
