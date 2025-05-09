import React, { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import FilterMarketplace from '../../components/FilterMarketplace';
import Category from '@components/Category';
import RatingStar from '../../components/RatingStar';
import WidgetContainer from '@components/Cards/WidgetContainer';
import BasicTextFields from '../../components/BasicTextFields';
import Banner from '@assets/Banner.svg';
import ProductTiles from '../../components/ProductTiles';
import FilterMarket from "@assets/Filtermarketplace.svg";

function SearchPage() {
    const leafLabels = ['Wet Leaves', 'Dry Leaves', 'Powder'];
    const weight = ['10.000 KG', '50.000 KG', '100.000 KG'];
    const date = ['Short Term', 'Medium Term', 'Long Term'];
    // const ratings = [1, 2, 3, 4, 5];
    const products = [
        {
            productName: 'Wet Leaves',
            stockTimeMin: 5,
            stockTimeMax: 10,
            stockCount: 500,
            pricePerKg: 1000,
            rating: 4,
            totalSold: 50000,
            centraName: 'Name of Centra',
        },
        {
            productName: 'Dry Leaves',
            stockTimeMin: 7,
            stockTimeMax: 12,
            stockCount: 300,
            pricePerKg: 1500,
            rating: 4.5,
            totalSold: 20000,
            centraName: 'Name of Centra',
        },
        {
            productName: 'Powder',
            stockTimeMin: 3,
            stockTimeMax: 8,
            stockCount: 300,
            pricePerKg: 1500,
            rating: 4.5,
            totalSold: 20000,
            centraName: 'Name of Centra',
        },
        {
            productName: 'Dry Leaves',
            stockTimeMin: 6,
            stockTimeMax: 11,
            stockCount: 300,
            pricePerKg: 1500,
            rating: 4.5,
            totalSold: 20000,
            centraName: 'Name of Centra',
        },
    ];

    const [selectedValues, setSelectedValues] = useState([]);
    const navigate = useNavigate();

    const handleCheckboxChange = (label) => {
        const updatedValues = selectedValues.includes(label)
            ? selectedValues.filter((value) => value !== label)
            : [...selectedValues, label];
        setSelectedValues(updatedValues);
    };

    const [searchParams] = useSearchParams();
    const query = searchParams.get("q");


    const handleProductClick = (centraName, productName) => {
        navigate(`/marketplace/${centraName}/${productName}`);
    };

    return (
        <div className='flex'>
            <div className='flex-col p-10 gap-2 hidden xl:block w-1/4'>
                <FilterMarketplace />
                <br></br>
                <span className="font-bold">Product Type</span>
                <Category labels={leafLabels} selectedValues={selectedValues} handleCheckboxChange={handleCheckboxChange} />
                
                <hr className="w-full my-4" style={{ borderColor: '#94C3B3' }} />

                {/* Amount Sold */}
                <span className="font-bold">Stocks Left</span>
                <Category labels={weight} selectedValues={selectedValues} handleCheckboxChange={handleCheckboxChange} />

                <hr className="w-full my-4" style={{ borderColor: '#94C3B3' }} />

                {/* Expiry Date */}
                <span className="font-bold">Expiry Days</span>
                <Category labels={date} selectedValues={selectedValues} handleCheckboxChange={handleCheckboxChange} />

                <hr className="w-full my-4" style={{ borderColor: '#94C3B3' }} />

                {/* Price Range */}
                <span className="font-bold">Price Range</span>
                <div className="flex gap-4">
                    <WidgetContainer
                        padding={false}
                        borderColor="#0F7275"
                        borderWidth="1px"
                        backgroundColor="#94C3B380"
                    >
                        <BasicTextFields label="Rp MIN" />
                    </WidgetContainer>
                    <WidgetContainer
                        padding={false}
                        borderColor="#0F7275"
                        borderWidth="1px"
                        backgroundColor="#94C3B380"
                    >
                        <BasicTextFields label="Rp MAX" />
                    </WidgetContainer>
                </div>

                <hr className="w-full my-4" style={{ borderColor: '#94C3B3' }} />

                {/* Ratings */}
                {/* <span className="font-bold">Ratings</span>
                <RatingStar ratings={ratings} selectedValues={selectedValues} handleCheckboxChange={handleCheckboxChange} />

                <hr className="w-full my-4" style={{ borderColor: '#94C3B3' }} /> */}

                {/* Apply Filter Button */}
                <button
                    className="w-full"
                    style={{ backgroundColor: '#94C3B3', borderRadius: '10px' }}
                >
                    <WidgetContainer border={false}>
                        <div className="flex justify-center items-center h-full">
                            <p className="text-white">Apply Filter</p>
                        </div>
                    </WidgetContainer>
                </button>
            </div>


            <div className='flex flex-col xl:w-3/4 gap-4 mt-4'>
                <span className='font-semibold text-xl'>Search results for <span className='text-[#0F7275]'>'{query}'</span></span>
                {/* <img src={Banner} alt="Banner" className="p-2" onClick={() => navigate("/marketplace/bulk", { replace: true })} /> */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-4 auto-cols-max">
                    {products.map((product, index) => (
                        <ProductTiles
                            key={index}
                            productName={product.productName}
                            stockTimeMin={product.stockTimeMin}
                            stockTimeMax={product.stockTimeMax}
                            stockCount={product.stockCount}
                            pricePerKg={product.pricePerKg}
                            rating={product.rating}
                            totalSold={product.totalSold}
                            centraName={product.centraName}
                            showAlert={(product.stockTimeMax <= 7)}
                            onClick={() => handleProductClick(product.centraName, product.productName)}
                        />

                    ))}
                </div>
            </div>
        </div>
    );
}

export default SearchPage;
