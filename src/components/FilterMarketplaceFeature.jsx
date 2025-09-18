import FilterMarketplace from '../components/FilterMarketplace';
import Category from '@components/Category';
import RatingStar from '../components/RatingStar';
import WidgetContainer from '@components/Cards/WidgetContainer';
import BasicTextFields from '../components/BasicTextFields';
import { useState } from 'react';

export default function FilterMarketplaceFeature() {
    const [selectedValues, setSelectedValues] = useState([]);
    const [isFilterOpen, setIsFilterOpen] = useState(false);


    const handleCheckboxChange = (label) => {
        const updatedValues = selectedValues.includes(label)
            ? selectedValues.filter((value) => value !== label)
            : [...selectedValues, label];
        setSelectedValues(updatedValues);
    };

    const leafLabels = ['Wet Leaves', 'Dry Leaves', 'Powder'];
    const weight = ['10.000 KG', '50.000 KG', '100.000 KG'];
    const date = ['Less Than 3 Days', 'Within 7 Days', 'More than 7 Days'];
    const ratings = [1, 2, 3, 4, 5];
    
    const FilterContent = () => (
        <>
            <span className="font-bold text-sm sm:text-base">Product Name</span>
            <Category labels={leafLabels} selectedValues={selectedValues} handleCheckboxChange={handleCheckboxChange} />
            <hr className="w-full my-2 sm:my-4" style={{ borderColor: '#94C3B3' }} />

            <span className="font-bold text-sm sm:text-base">Amount Sold</span>
            <Category labels={weight} selectedValues={selectedValues} handleCheckboxChange={handleCheckboxChange} />
            <hr className="w-full my-2 sm:my-4" style={{ borderColor: '#94C3B3' }} />

            <span className="font-bold text-sm sm:text-base">Expiry Date</span>
            <Category labels={date} selectedValues={selectedValues} handleCheckboxChange={handleCheckboxChange} />
            <hr className="w-full my-2 sm:my-4" style={{ borderColor: '#94C3B3' }} />
            <span className="font-bold text-sm sm:text-base">Price Range</span>
            <div className='flex gap-2 sm:gap-4'>
                <WidgetContainer padding={false} borderColor="#0F7275" borderWidth="1px" backgroundColor="#94C3B380" className="flex-1">
                    <BasicTextFields label="Rp MIN" />
                </WidgetContainer>
                <WidgetContainer padding={false} borderColor="#0F7275" borderWidth="1px" backgroundColor="#94C3B380" className="flex-1">
                    <BasicTextFields label="Rp MAX" />
                </WidgetContainer>
            </div>

            <hr className="w-full my-2 sm:my-4" style={{ borderColor: '#94C3B3' }} />

            <button className="w-full" style={{ backgroundColor: '#94C3B3', borderRadius: '10px' }}>
                <WidgetContainer border={false}>
                    <div className='flex justify-center items-center h-full'>
                        <p className='text-white text-sm sm:text-base'>Apply Filter</p>
                    </div>
                </WidgetContainer>
            </button>

            <hr className="w-full my-2 sm:my-4" style={{ borderColor: '#94C3B3' }} />
        </>
    );
    
    return (
        <>
            {/* Mobile Filter Toggle */}
            <div className='lg:hidden mb-4'>
                <button 
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="w-full flex items-center justify-between p-3 bg-[#94C3B3] text-white rounded-lg"
                >
                    <div className="flex items-center gap-2">
                        <FilterMarketplace tablet />
                        <span className="font-semibold">Filters</span>
                    </div>
                    <svg 
                        className={`w-5 h-5 transition-transform ${isFilterOpen ? 'rotate-180' : ''}`} 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>
                
                {isFilterOpen && (
                    <div className='mt-4 p-4 bg-white border border-[#94C3B3] rounded-lg'>
                        <FilterContent />
                    </div>
                )}
            </div>

            {/* Desktop Filter Sidebar */}
            <div className='flex-col justify-start flex p-4 lg:p-10 gap-2 lg:gap-4 hidden lg:block lg:w-64 xl:w-80'>
                <FilterMarketplace />
                <FilterContent />
            </div>
        </>
    );
}