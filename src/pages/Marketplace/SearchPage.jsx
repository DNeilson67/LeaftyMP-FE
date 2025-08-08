import React, { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import ProductTiles from '../../components/ProductTiles';
import FilterMarketplaceFeature from '@components/FilterMarketplaceFeature';

function SearchPage() {
    const products = [
        {
            "productId": 3816,
            "productName": "Wet Leaves",
            "stock": 84,
            "centraName": "Centra W",
            "initialPrice": 5500,
            "price": 5500,
            "expiryTime": 777
        }
    ];

    const [searchParams] = useSearchParams();
    const query = searchParams.get("q");

    return (
        <div className='flex'>
            <FilterMarketplaceFeature />
            <div className='flex flex-col xl:w-3/4 gap-4 mt-4'>
                <span className='font-semibold text-xl'>Search results for <span className='text-[#0F7275]'>'{query}'</span></span>
                {/* <img src={Banner} alt="Banner" className="p-2" onClick={() => navigate("/marketplace/bulk", { replace: true })} /> */}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-4 auto-cols-max">
                    {products.map((product, index) => (
                        <ProductTiles
                            key={index}
                            productId={product.productId}
                            productName={product.productName}
                            expiryTime={product.expiryTime}
                            stock={product.stock}
                            pricePerKg={product.price}
                            initialPrice={product.initialPrice}
                            centraName={product.centraName}
                            showAlert={product.initialPrice > product.price}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default SearchPage;
