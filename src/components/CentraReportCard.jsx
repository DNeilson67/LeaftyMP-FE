import { Water, WaterDrop } from '@mui/icons-material';
import React from 'react';
import { FaTemperatureHigh} from 'react-icons/fa';
import { GiWateringCan } from "react-icons/gi";

const CentraReportCard = ({ temperature, wateredToday, date }) => {
    const getTemperatureColor = (temp) => {
        if (temp < 15) return 'text-blue-500';
        if (temp < 25) return 'text-[#0F7275]';
        if (temp < 35) return 'text-orange-500';
        return 'text-red-500';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'numeric', 
            day: 'numeric'
        });
    };

    

    return (
        <div className="bg-white w-full rounded-lg shadow-lg p-6 max-w-md mx-auto border-l-4 border-[#0F7275]">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">Plant Report</h2>
                <div className="text-sm text-gray-500">
                    {formatDate(date)}
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                        <span className="text-2xl mr-3 text-[#0F7275]"><FaTemperatureHigh /></span>
                        <span className="font-medium text-gray-700">Temperature</span>
                    </div>
                    <span className={`text-xl font-bold ${getTemperatureColor(temperature)}`}>
                        {temperature}°C
                    </span>
                </div>

                <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center">
                        <span className="text-2xl mr-3 text-[#0F7275]"><GiWateringCan/></span>
                        <span className="font-medium text-gray-700">Watered</span>
                    </div>
                    <div className="flex items-center">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${wateredToday
                                ? 'bg-green-100 text-green-800'
                                : 'bg-red-100 text-red-800'
                            }`}>
                            {wateredToday ? '✓' : '✗'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CentraReportCard;