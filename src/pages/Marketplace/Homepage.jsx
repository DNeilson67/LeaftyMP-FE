import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterMarketplace from '../../components/FilterMarketplace';
import Category from '@components/Category';
import RatingStar from '../../components/RatingStar';
import WidgetContainer from '@components/Cards/WidgetContainer';
import BasicTextFields from '../../components/BasicTextFields';
import Banner from '@assets/Banner.svg';
import ProductTiles from '../../components/ProductTiles';
import FilterMarket from "@assets/Filtermarketplace.svg";

function Homepage() {
  const products = [
    {
      productName: 'Powder',
      stockTimeMin: 3,
      stockTimeMax: 8,
      stockCount: 300,
      pricePerKg: 1500,
      totalSold: 20000,
      centraName: 'EverHarvest Farmers',
    },
    {
      productName: 'Dry Leaves',
      stockTimeMin: 6,
      stockTimeMax: 11,
      stockCount: 300,
      pricePerKg: 1500,
      totalSold: 20000,
      centraName: 'EverHarvest Farmers',
    },
    {
      productName: 'Wet Leaves',
      stockTimeMin: 5,
      stockTimeMax: 10,
      stockCount: 500,
      pricePerKg: 1000,
      totalSold: 50000,
      centraName: 'EverHarvest Farmers',
    },
    {
      productName: 'Dry Leaves',
      stockTimeMin: 3,
      stockTimeMax: 60,
      stockCount: 300,
      pricePerKg: 1500,
      totalSold: 20000,
      centraName: 'Green Valley Co-op',
    },
    {
      productName: 'Powder',
      stockTimeMin: 3,
      stockTimeMax: 8,
      stockCount: 300,
      pricePerKg: 1500,
      totalSold: 20000,
      centraName: 'Green Valley Co-op',
    },
    {
      productName: 'Wet Leaves',
      stockTimeMin: 5,
      stockTimeMax: 10,
      stockCount: 500,
      pricePerKg: 1000,
      totalSold: 50000,
      centraName: 'Green Valley Co-op',
    },
    {
      productName: 'Dry Leaves',
      stockTimeMin: 6,
      stockTimeMax: 11,
      stockCount: 300,
      pricePerKg: 1500,
      totalSold: 20000,
      centraName: 'Sunleaf Collective',
    },
    {
      productName: 'Wet Leaves',
      stockTimeMin: 5,
      stockTimeMax: 10,
      stockCount: 500,
      pricePerKg: 1000,
      totalSold: 50000,
      centraName: 'Sunleaf Collective',
    },
    {
      productName: 'Dry Leaves',
      stockTimeMin: 7,
      stockTimeMax: 12,
      stockCount: 300,
      pricePerKg: 1500,
      totalSold: 20000,
      centraName: 'Sunleaf Collective',
    },
    {
      productName: 'Powder',
      stockTimeMin: 3,
      stockTimeMax: 8,
      stockCount: 300,
      pricePerKg: 1500,
      totalSold: 20000,
      centraName: 'Riverbend Agri Group',
    },
    {
      productName: 'Dry Leaves',
      stockTimeMin: 6,
      stockTimeMax: 11,
      stockCount: 300,
      pricePerKg: 1500,
      totalSold: 20000,
      centraName: 'Riverbend Agri Group',
    },
    {
      productName: 'Wet Leaves',
      stockTimeMin: 5,
      stockTimeMax: 10,
      stockCount: 500,
      pricePerKg: 1000,
      totalSold: 50000,
      centraName: 'Riverbend Agri Group',
    },
  ];
  
  const [selectedValues, setSelectedValues] = useState([]);
  const navigate = useNavigate();


  const handleProductClick = (centraName, productName) => {
    navigate(`/marketplace/${centraName}/${productName}`);
  };

  return (
    <div className='flex justify-center'>

      <div className='flex flex-col xl:w-3/4'>
        <img src={Banner} alt="Banner" className="p-2" onClick={() => navigate("/marketplace/bulk", { replace: true })} />
        <div className="mx-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-4 auto-cols-max">
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

export default Homepage;
