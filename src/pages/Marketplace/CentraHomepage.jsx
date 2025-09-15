import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import FilterMarketplace from '../../components/FilterMarketplace';
import Category from '@components/Category';
import RatingStar from '../../components/RatingStar';
import WidgetContainer from '@components/Cards/WidgetContainer';
import BasicTextFields from '../../components/BasicTextFields';
import Banner from '@assets/Banner.svg';
import ProductTiles from '../../components/ProductTiles';
import CentraProfileCard from '../../components/CentraProfileCard';
import FilterMarketplaceFeature from '@components/FilterMarketplaceFeature';


function CentraHomepage() {
  const { centraName } = useParams();

  const products = [
    {
      productId: 3816,
      productName: "Wet Leaves",
      stock: 84,
      centraName: "Centra W",
      initialPrice: 5500,
      price: 5500,
      expiryTime: 777
    },
    {
      productId: 3817,
      productName: "Wet Leaves",
      stock: 50,
      centraName: "Centra W",
      initialPrice: 6000,
      price: 5800,
      expiryTime: 500
    },
    {
      productId: 3818,
      productName: "Wet Leaves",
      stock: 120,
      centraName: "Centra W",
      initialPrice: 5300,
      price: 5300,
      expiryTime: 900
    },
    {
      productId: 3819,
      productName: "Wet Leaves",
      stock: 30,
      centraName: "Centra W",
      initialPrice: 5700,
      price: 5600,
      expiryTime: 300
    },
    {
      productId: 3820,
      productName: "Wet Leaves",
      stock: 75,
      centraName: "Centra W",
      initialPrice: 5500,
      price: 5400,
      expiryTime: 650
    },
       {
      productId: 3819,
      productName: "Wet Leaves",
      stock: 30,
      centraName: "Centra W",
      initialPrice: 5700,
      price: 5600,
      expiryTime: 300
    },
    {
      productId: 3820,
      productName: "Wet Leaves",
      stock: 75,
      centraName: "Centra W",
      initialPrice: 5500,
      price: 5400,
      expiryTime: 650
    },
       {
      productId: 3819,
      productName: "Wet Leaves",
      stock: 30,
      centraName: "Centra W",
      initialPrice: 5700,
      price: 5600,
      expiryTime: 300
    },
    {
      productId: 3820,
      productName: "Wet Leaves",
      stock: 75,
      centraName: "Centra W",
      initialPrice: 5500,
      price: 5400,
      expiryTime: 650
    },
       {
      productId: 3819,
      productName: "Wet Leaves",
      stock: 30,
      centraName: "Centra W",
      initialPrice: 5700,
      price: 5600,
      expiryTime: 300
    },
    {
      productId: 3820,
      productName: "Wet Leaves",
      stock: 75,
      centraName: "Centra W",
      initialPrice: 5500,
      price: 5400,
      expiryTime: 650
    },
       {
      productId: 3819,
      productName: "Wet Leaves",
      stock: 30,
      centraName: "Centra W",
      initialPrice: 5700,
      price: 5600,
      expiryTime: 300
    },
    {
      productId: 3820,
      productName: "Wet Leaves",
      stock: 75,
      centraName: "Centra W",
      initialPrice: 5500,
      price: 5400,
      expiryTime: 650
    }
  ];
  const navigate = useNavigate();

  const handleProductClick = (centraName, productName) => {
    navigate(`/marketplace/${centraName}/${productName}`);
  };

  return (
    <div className='flex'>
      <FilterMarketplaceFeature />
      <div className='flex flex-col xl:w-3/4 w-full p-4'>
        <CentraProfileCard centraName={centraName} />
        <div className="mt-2 mx-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-4 auto-cols-max">
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

export default CentraHomepage;
