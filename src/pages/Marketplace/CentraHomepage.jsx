import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterMarketplace from '../../components/FilterMarketplace';
import Category from '@components/Category';
import RatingStar from '../../components/RatingStar';
import WidgetContainer from '@components/Cards/WidgetContainer';
import BasicTextFields from '../../components/BasicTextFields';
import Banner from '@assets/Banner.svg';
import ProductTiles from '../../components/ProductTiles';
import CentraProfileCard from '../../components/CentraProfileCard';


function CentraHomepage() {
  const leafLabels = ['Wet Leaves', 'Dry Leaves', 'Powder'];
  const weight = ['10.000 KG', '50.000 KG', '100.000 KG'];
  const date = ['Less Than 3 Days', 'Within 7 Days', 'More than 7 Days'];
  const ratings = [1, 2, 3, 4, 5];

  const products = [
    {

      productName: 'Wet Leaves',
      stockTime: 10,
      stockCount: 500,
      pricePerKg: 1000,
      rating: 4,
      totalSold: 50000,
      centraName: 'Name of Centra',
    },
    {

      productName: 'Dry Leaves',
      stockTime: 7,
      stockCount: 300,
      pricePerKg: 1500,
      rating: 4.5,
      totalSold: 20000,
      centraName: 'Name of Centra',
    },
    {

      productName: 'Powder',
      stockTime: 7,
      stockCount: 300,
      pricePerKg: 1500,
      rating: 4.5,
      totalSold: 20000,
      centraName: 'Name of Centra',
    },
    {

      productName: 'Dry Leaves',
      stockTime: 7,
      stockCount: 300,
      pricePerKg: 1500,
      rating: 4.5,
      totalSold: 20000,
      centraName: 'Name of Centra',
    },
    {
      productName: 'Wet Leaves',
      stockTime: 7,
      stockCount: 300,
      pricePerKg: 1500,
      rating: 4.5,
      totalSold: 20000,
      centraName: 'Name of Centra',
    },
    {

      productName: 'Dry Leaves',
      stockTime: 7,
      stockCount: 300,
      pricePerKg: 1500,
      rating: 4.5,
      totalSold: 20000,
      centraName: 'Name of Centra',
    }, {

      productName: 'Powder',
      stockTime: 7,
      stockCount: 300,
      pricePerKg: 1500,
      rating: 4.5,
      totalSold: 20000,
      centraName: 'Name of Centra',
    },
    , {

      productName: 'Wet Leaves',
      stockTime: 7,
      stockCount: 300,
      pricePerKg: 1500,
      rating: 4.5,
      totalSold: 20000,
      centraName: 'Name of Centra',
    }
    , {
      productName: 'Dry Leaves',
      stockTime: 7,
      stockCount: 300,
      pricePerKg: 1500,
      rating: 4.5,
      totalSold: 20000,
      centraName: 'Name of Centra',
    }
    , {

      productName: 'Powder',
      stockTime: 7,
      stockCount: 300,
      pricePerKg: 1500,
      rating: 4.5,
      totalSold: 20000,
      centraName: 'Name of Centra',
    }
    , {

      productName: 'Dry Leaves',
      stockTime: 7,
      stockCount: 300,
      pricePerKg: 1500,
      rating: 4.5,
      totalSold: 20000,
      centraName: 'Name of Centra',
    }
  ];

  const [selectedValues, setSelectedValues] = useState([]);
  const navigate = useNavigate();

  const handleCheckboxChange = (label) => {
    const updatedValues = selectedValues.includes(label)
      ? selectedValues.filter((value) => value !== label)
      : [...selectedValues, label];
    setSelectedValues(updatedValues);
  };

  const handleProductClick = (centraName, productName) => {
    navigate(`/marketplace/${centraName}/${productName}`);
  };

  return (
    <div className='flex'>
      <div className='flex-col flex p-10 gap-2 hidden xl:block'>
        <FilterMarketplace />
        <Category labels={leafLabels} selectedValues={selectedValues} handleCheckboxChange={handleCheckboxChange} />
        <hr className="w-full my-4" style={{ borderColor: '#94C3B3' }} />

        <span className="font-bold">Amount Sold</span>
        <Category labels={weight} selectedValues={selectedValues} handleCheckboxChange={handleCheckboxChange} />
        <hr className="w-full my-4" style={{ borderColor: '#94C3B3' }} />

        <span className="font-bold">Expiry Date</span>
        <Category labels={date} selectedValues={selectedValues} handleCheckboxChange={handleCheckboxChange} />

        <span className="font-bold">Price Range</span>
        <div className='flex gap-4'>
          <WidgetContainer padding = {false} borderColor="#0F7275" borderWidth="1px" backgroundColor="#94C3B380">
            <BasicTextFields label="Rp MIN" />
          </WidgetContainer>
          <WidgetContainer padding = {false} borderColor="#0F7275" borderWidth="1px" backgroundColor="#94C3B380">
            <BasicTextFields label="Rp MAX" />
          </WidgetContainer>
        </div>

        <hr className="w-full my-4" style={{ borderColor: '#94C3B3' }} />

        <span className="font-bold">Ratings</span>
        <RatingStar ratings={ratings} selectedValues={selectedValues} handleCheckboxChange={handleCheckboxChange} />

        <button className="w-full" style={{ backgroundColor: '#94C3B3', borderRadius: '10px' }}>
          <WidgetContainer border={false}>
            <div className='flex justify-center items-center h-full'>
              <p className='text-white'>Apply Filter</p>
            </div>
          </WidgetContainer>
        </button>

        <hr className="w-full my-4" style={{ borderColor: '#94C3B3' }} />
      </div>

      <div className='flex flex-col xl:w-3/4 w-full p-4'>
        <CentraProfileCard/>
        <div className="mt-2 mx-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-4 auto-cols-max">
          {products.map((product, index) => (
            <ProductTiles
              key={index}
              productName={product.productName}
              stockTime={product.stockTime}
              stockCount={product.stockCount}
              pricePerKg={product.pricePerKg}
              rating={product.rating}
              totalSold={product.totalSold}
              centraName={product.centraName}
              showAlert={(product.stockTime <= 7 )? true : false}
              onClick={() => handleProductClick(product.centraName, product.productName)} // Fix here
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default CentraHomepage;
