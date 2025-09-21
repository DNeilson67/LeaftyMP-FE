import FilterMarketplace from '../components/FilterMarketplace';
import Category from '@components/Category';
import RatingStar from '../components/RatingStar';
import WidgetContainer from '@components/Cards/WidgetContainer';
import BasicTextFields from '../components/BasicTextFields';
import Button from '../components/Button';
import { useState, useEffect } from 'react';

export default function FilterMarketplaceFeature({ showAll = false, onShowAllChange, mobileOnly = false }) {
    const [selectedValues, setSelectedValues] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState(showAll ? ['Show all Items'] : []);
    const [isFilterOpen, setIsFilterOpen] = useState(false);


    const handleCheckboxChange = (label) => {
        const updatedValues = selectedValues.includes(label)
            ? selectedValues.filter((value) => value !== label)
            : [...selectedValues, label];
        setSelectedValues(updatedValues);
    };

    const handleStatusChange = (label) => {
        if (label === 'Show all Items') {
            const isSelected = selectedStatus.includes(label);
            const updatedStatus = isSelected 
                ? selectedStatus.filter((value) => value !== label)
                : [...selectedStatus, label];
            setSelectedStatus(updatedStatus);
            // Update the parent component's showAll state
            if (onShowAllChange) {
                onShowAllChange(!isSelected);
            }
        }
    };

    const clearAllFilters = () => {
        setSelectedValues([]);
        setSelectedStatus([]);
        if (onShowAllChange) {
            onShowAllChange(false);
        }
    };

    const leafLabels = ['Wet Leaves', 'Dry Leaves', 'Powder'];
    const statusLabels = ['Show all Items'];
    const ratings = [1, 2, 3, 4, 5];

    // Sync selectedStatus with showAll prop changes
    useEffect(() => {
        setSelectedStatus(showAll ? ['Show all Items'] : []);
    }, [showAll]);

    const FilterContent = () => (
        <div className="space-y-4 lg:space-y-6">
            {/* Status Section */}
            <div className="space-y-2 lg:space-y-3">
                <h3 className="font-bold text-sm lg:text-base text-gray-800 mb-2 lg:mb-3">Status</h3>
                <div className="pl-1">
                    <Category labels={statusLabels} selectedValues={selectedStatus} handleCheckboxChange={handleStatusChange} />
                </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[#94C3B3] opacity-50 my-3 lg:my-4"></div>

            {/* Product Name Section */}
            <div className="space-y-2 lg:space-y-3">
                <h3 className="font-bold text-sm lg:text-base text-gray-800 mb-2 lg:mb-3">Product Name</h3>
                <div className="pl-1">
                    <Category labels={leafLabels} selectedValues={selectedValues} handleCheckboxChange={handleCheckboxChange} />
                </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[#94C3B3] opacity-50 my-3 lg:my-4"></div>

            {/* Price Range Section */}
            <div className="space-y-2 lg:space-y-3">
                <h3 className="font-bold text-sm lg:text-base text-gray-800 mb-2 lg:mb-3">Price Range</h3>
                <div className='flex flex-col sm:flex-row gap-2 sm:gap-3 lg:gap-4'>
                    <div className="flex-1 min-w-0">
                        <WidgetContainer 
                            padding={false} 
                            borderColor="#0F7275" 
                            borderWidth="1px" 
                            backgroundColor="#94C3B380" 
                            className="w-full h-12"
                        >
                            <BasicTextFields label="Rp MIN" />
                        </WidgetContainer>
                    </div>
                    <div className="flex-1 min-w-0">
                        <WidgetContainer 
                            padding={false} 
                            borderColor="#0F7275" 
                            borderWidth="1px" 
                            backgroundColor="#94C3B380" 
                            className="w-full h-12"
                        >
                            <BasicTextFields label="Rp MAX" />
                        </WidgetContainer>
                    </div>
                </div>
            </div>

            {/* Divider */}
            <div className="border-t border-[#94C3B3] opacity-50 my-3 lg:my-4"></div>

            {/* Apply Filter Button */}
            <div className="pt-2 lg:pt-3">
                <Button
                    background="#94C3B3"
                    color="white"
                    label="Apply Filter"
                    className="w-full text-sm lg:text-base py-4 lg:py-3 hover:bg-[#7da89d] transition-colors duration-200 font-medium touch-manipulation"
                    onClick={() => {
                        console.log('Filter applied with selected values:', selectedValues);
                        // Auto-close mobile filter after applying
                        if (window.innerWidth < 1024) {
                            setIsFilterOpen(false);
                        }
                    }}
                />
            </div>
        </div>
    );

    // If mobileOnly prop is true, only render the mobile filter button
    if (mobileOnly) {
        return (
            <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-4 py-2 bg-[#94C3B3] text-white rounded-lg hover:bg-[#7da89d] transition-all duration-200 active:scale-95 touch-manipulation text-sm font-medium"
            >
                <FilterMarketplace tablet />
                <span>Filter</span>
                {(selectedValues.length > 0 || selectedStatus.length > 0) && (
                    <div className="bg-white bg-opacity-30 rounded-full min-w-[20px] h-5 flex items-center justify-center">
                        <span className="text-xs font-bold">{selectedValues.length + selectedStatus.length}</span>
                    </div>
                )}
                
                {/* Mobile Filter Modal */}
                {isFilterOpen && (
                    <>
                        {/* Backdrop */}
                        <div 
                            className="fixed inset-0 bg-black bg-opacity-50 z-40"
                            onClick={() => setIsFilterOpen(false)}
                        />
                        
                        {/* Filter Panel */}
                        <div className='fixed inset-x-4 top-16 bottom-4 bg-white border border-[#94C3B3] rounded-2xl shadow-2xl z-50 overflow-hidden animate-in slide-in-from-top-4 duration-300'>
                            {/* Header */}
                            <div className="bg-gradient-to-r from-[#0F7275] to-[#94C3B3] p-4 text-white flex items-center justify-between">
                                <h2 className="text-lg font-bold">Filters</h2>
                                <div className="flex items-center gap-2">
                                    {(selectedValues.length > 0 || selectedStatus.length > 0) && (
                                        <button 
                                            onClick={clearAllFilters}
                                            className="text-xs bg-white bg-opacity-20 px-3 py-1 rounded-full hover:bg-opacity-30 transition-colors touch-manipulation"
                                        >
                                            Clear All
                                        </button>
                                    )}
                                    <button 
                                        onClick={() => setIsFilterOpen(false)}
                                        className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors touch-manipulation"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                            
                            {/* Scrollable Content */}
                            <div className="overflow-y-auto h-full pb-20">
                                <div className="p-4">
                                    <FilterContent />
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </button>
        );
    }

    // Mobile only - compact filter button
    if (mobileOnly) {
        return (
            <>
                <button
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="flex items-center gap-2 px-4 py-2 bg-[#94C3B3] text-gray-800 rounded-lg shadow-lg hover:bg-[#7da89d] transition-all duration-200 active:scale-95 touch-manipulation"
                >
                    <FilterMarketplace />
                    <span className="font-medium">Filter</span>
                    {(selectedValues.length > 0 || selectedStatus.length > 0) && (
                        <div className="bg-white bg-opacity-20 rounded-full w-5 h-5 flex items-center justify-center">
                            <span className="text-xs font-bold text-gray-800">{selectedValues.length + selectedStatus.length}</span>
                        </div>
                    )}
                </button>

                {isFilterOpen && (
                    <>
                        {/* Backdrop */}
                        <div 
                            className="fixed inset-0 bg-black bg-opacity-25 z-40"
                            onClick={() => setIsFilterOpen(false)}
                        />
                        
                        {/* Filter Modal */}
                        <div className='fixed inset-x-4 top-20 bottom-4 bg-white border border-[#94C3B3] rounded-2xl shadow-2xl z-50 overflow-hidden'>
                            {/* Header */}
                            <div className="bg-gradient-to-r from-[#0F7275] to-[#94C3B3] p-4 text-white flex items-center justify-between">
                                <h2 className="text-lg font-bold">Filters</h2>
                                <button 
                                    onClick={() => setIsFilterOpen(false)}
                                    className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors touch-manipulation"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>
                            
                            {/* Scrollable Content */}
                            <div className="overflow-y-auto h-full pb-20">
                                <div className="p-4">
                                    <FilterContent />
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </>
        );
    }

    // Desktop - full sidebar
    return (
        <div className='px-4 w-72 xl:w-80 2xl:w-96'>
            <div className="sticky top-4 bg-white rounded-xl border border-[#94C3B3] shadow-md overflow-hidden">
                {/* Filter Header */}
                <div className="bg-gradient-to-r from-[#0F7275] to-[#94C3B3] p-4 text-white">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-bold">Filters</h2>
                        {(selectedValues.length > 0 || selectedStatus.length > 0) && (
                            <button 
                                onClick={clearAllFilters}
                                className="text-sm bg-white bg-opacity-20 px-3 py-1 rounded-full hover:bg-opacity-30 transition-colors"
                            >
                                Clear All
                            </button>
                        )}
                    </div>
                </div>
                
                {/* Filter Content */}
                <div className="p-6">
                    <FilterContent />
                </div>
            </div>
        </div>
    );
}