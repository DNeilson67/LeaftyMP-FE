import React,{ useEffect, useState, useContext } from "react";
import {ValueContext} from "./CentraLayout";
import { useNavigate } from "react-router-dom";
import BarChart from '@components/Cards/BarChart';
import WidgetContainer from '@components/Cards/WidgetContainer';
import Products from '@assets/Products.svg';
import Myearnings from '@assets/Myearnings.svg';
import Performance from '@assets/Performance.svg'
function CentraCentre() {
    const [statistics, setStatistics] = useState({
        sum_wet_leaves: 100,
        sum_dry_leaves: 80,
        sum_flour: 0,
        sum_shipment_quantity: 0
    });
    const { value, setValue } = useContext(ValueContext);
    const navigate = useNavigate();
    const Bartitle = 'Shipment Sent';
    const Barlabels = ['Wet Leaves', 'Dry Leaves', 'Flour'];
    const Bardata = [statistics.sum_wet_leaves, statistics.sum_dry_leaves, statistics.sum_flour];
    const handleProductClick = () => {
        setValue("Products"); 
        navigate('/centra/Products'); 
    };
    const handleMyEarningsClick = () => {
        setValue("My Earnings"); 
        navigate('/centra/myearnings'); 
    };
    return (
        <>
            <div>
                <WidgetContainer title="Total Production" container={false} borderRadius="20px">
                    <BarChart title={Bartitle} labels={Barlabels} data={Bardata} />
                </WidgetContainer>
            </div>
            <div className="flex gap-4">
                <WidgetContainer borderWidth="3px" className="flex items-center justify-center" onClick={handleProductClick}>
                    <div className="flex flex-col gap-2">
                        <img src={Products} alt="Product" className="w-full h-1/2" />
                        <p className=" text-[10px] font-semibold leading-[12.19px] tracking-[0.02em] text-center "style={{ color: '#6B6A6A' }}>Products</p>
                    </div>
                </WidgetContainer>
                
                <WidgetContainer borderWidth="3px" className="flex items-center justify-center" onClick={ handleMyEarningsClick }>
                    <div className="flex flex-col ">
                        <img src={Myearnings} alt="earnings" className="w-full h-1/2" />
                        <p className=" text-[10px] font-semibold leading-[12.19px] tracking-[0.02em] text-center mb-2"style={{ color: '#6B6A6A' }}>My Earnings</p>
                    </div>
                </WidgetContainer>

                <WidgetContainer borderWidth="3px" className="flex items-center justify-center">
                    <div className="flex flex-col gap-4">
                        <img src={Performance} alt="Performance" className="w-full h-1/2" />
                        <p className=" text-[10px] font-semibold leading-[12.19px] tracking-[0.02em] text-center mb-3 "style={{ color: '#6B6A6A' }}>Performance</p>
                    </div>
                </WidgetContainer>
            </div>


        </>
    );
}

export default CentraCentre;
