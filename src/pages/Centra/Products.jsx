import { useEffect, useState } from "react";
import BarChart from '@components/Cards/BarChart';
import WidgetContainer from '@components/Cards/WidgetContainer';
import Wetleavesproduct from '@assets/Wetleavesproduct.svg';
import Dryleavesproduct from '@assets/Dryleavesproduct.svg';
import Powderproduct from '@assets/Powderproduct.svg';

function Products() {
   

    return (
        <>
            <div className="flex flex-col gap-3">
                <WidgetContainer borderWidth="3px" className="flex justify-start items-center">
                    <img src={Wetleavesproduct} alt="Product" className="w-10 h-10" />
                    <p className="font-[Montserrat] text-[10px] font-semibold leading-[12.19px] tracking-[0.02em] text-center" style={{ color: '#6B6A6A' }}>Wet Leaves</p>
                </WidgetContainer  >
                <WidgetContainer borderWidth="3px" className="flex justify-start items-center">
                    <img src={Dryleavesproduct} alt="Product" className="w-10 h-10" />
                    <p className="font-[Montserrat] text-[10px] font-semibold leading-[12.19px] tracking-[0.02em] text-center" style={{ color: '#6B6A6A' }}>Dry Leaves</p>
                    
                </WidgetContainer>
                <WidgetContainer borderWidth="3px" className="flex justify-start items-center">
                    <img src={Powderproduct} alt="Product" className="w-10 h-10" />
                    <p className="font-[Montserrat] text-[10px] font-semibold leading-[12.19px] tracking-[0.02em] text-center" style={{ color: '#6B6A6A' }}>
                        Powder
                    </p>
                </WidgetContainer>
            </div>
            

        </>
    );
}

export default Products;
