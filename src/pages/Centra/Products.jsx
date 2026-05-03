import { useEffect, useState, useContext } from "react";
import { useNavigate } from 'react-router-dom';
import { ValueContext } from './CentraLayout';
import BarChart from '@components/Cards/BarChart';
import WidgetContainer from '@components/Cards/WidgetContainer';
import Wetleavesproduct from '@assets/Wetleavesproduct.svg';
import Dryleavesproduct from '@assets/Dryleavesproduct.svg';
import Powderproduct from '@assets/Powderproduct.svg';
import { ChevronRight } from 'lucide-react';

function Products() {
    const navigate = useNavigate();
    const { setValue } = useContext(ValueContext);

    const handleProductClick = (productName) => {
        setValue(productName);
        navigate(`/centra/${productName}/settings`);
    };

    const products = [
        {
            name: 'Wet Leaves',
            icon: Wetleavesproduct,
            color: '#94C3B3',
            description: 'Fresh tea leaves from harvesting'
        },
        {
            name: 'Dry Leaves',
            icon: Dryleavesproduct,
            color: '#0F7275',
            description: 'Processed and dried tea leaves'
        },
        {
            name: 'Powder',
            icon: Powderproduct,
            color: '#C0CD30',
            description: 'Ground tea powder for final products'
        }
    ];

    return (
        <div className="w-full p-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product, index) => (
                    <WidgetContainer
                        key={index}
                        className="cursor-pointer hover:shadow-xl transition-all duration-300 group"
                        onClick={() => handleProductClick(product.name)}
                    >
                        <div className="p-5 space-y-4">
                            <div className="flex items-start justify-between">
                                <div 
                                    className="w-16 h-16 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 duration-300"
                                    style={{ backgroundColor: `${product.color}20` }}
                                >
                                    <img src={product.icon} alt={product.name} className="w-10 h-10" />
                                </div>
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <ChevronRight size={18} className="text-gray-600" />
                                </div>
                            </div>
                            
                            <div className="space-y-1">
                                <h3 className="font-montserrat font-bold text-lg text-gray-800">
                                    {product.name}
                                </h3>
                                <p className="font-montserrat text-sm text-gray-500">
                                    {product.description}
                                </p>
                            </div>

                            <div className="flex items-center gap-2 text-sm font-montserrat font-semibold" style={{ color: product.color }}>
                                <span>Configure settings</span>
                                <ChevronRight size={16} />
                            </div>
                        </div>
                    </WidgetContainer>
                ))}
            </div>
        </div>
    );
}

export default Products;
