import React, { useState, useEffect } from 'react';
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
import InfiniteScroll from 'react-infinite-scroll-component';
import { marketplaceApi, ApiError } from '../../api/marketShipmentApi';
import ThreeDotsLoading from '@components/ThreeDotsLoading';

const API_URL = import.meta.env.VITE_API_URL;


function CentraHomepage() {
  const { centraName } = useParams();
  const [products, setProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchProducts = async (pageNum) => {
    try {
      setLoading(true);
      setError(null);
      
      const responseData = await marketplaceApi.getMarketplaceItemsByCentra(
        centraName, 
        pageNum * 10, // Convert page to skip value
        10
      );
      
      const fetchedProducts = responseData.map((item) => ({
        productId: item.id,
        productName: item.product_name,
        expiryTime: item.expiry_time,
        stock: item.stock,
        price: item.price,
        initialPrice: item.initial_price,
        centraName: item.centra_name,
      }));

      if (pageNum === 0) {
        setProducts(fetchedProducts);
      } else {
        setProducts((prevProducts) => [...prevProducts, ...fetchedProducts]);
      }
      setPage(pageNum + 1);

      if (fetchedProducts.length === 0 || fetchedProducts.length < 10) {
        setHasMore(false);
      }
      console.log('Fetched products for centra:', centraName, fetchedProducts);
    } catch (error) {
      console.error('Error fetching centra products:', error);
      
      if (error instanceof ApiError) {
        setError(error.message);
      } else {
        setError('Failed to fetch products');
      }
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Reset state when centra name changes
    setProducts([]);
    setPage(0);
    setHasMore(true);
    setError(null);
    
    // Fetch initial products for this centra
    fetchProducts(0);
  }, [centraName]);

  const handleProductClick = (centraName, productName) => {
    navigate(`/marketplace/${centraName}/${productName}`);
  };

  if (error) {
    return (
      <div className='flex justify-center items-center min-h-64'>
        <div className='text-center'>
          <p className='text-red-500 mb-4'>{error}</p>
          <button 
            onClick={() => {
              setError(null);
              fetchProducts(0);
            }}
            className='bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600'
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='flex justify-center lg:flex-row flex-col'>
      {/* <FilterMarketplaceFeature /> */}
      <div className='flex flex-col xl:w-3/4 w-full p-4'>
        <CentraProfileCard centraName={centraName} />
        
        {loading && products.length === 0 ? (
          <div className='flex justify-center items-center min-h-64'>
            <ThreeDotsLoading />
          </div>
        ) : (
          <InfiniteScroll
            dataLength={products.length}
            next={() => fetchProducts(page)}
            hasMore={hasMore}
            loader={
              <div className='flex justify-center items-center w-full py-4'>
                <ThreeDotsLoading />
              </div>
            }
          >
            <div className="mt-2 mx-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-4 auto-cols-max">
              {products.map((product, index) => (
                <ProductTiles
                  key={`${product.productId}-${index}`}
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
          </InfiniteScroll>
        )}
        
        {products.length === 0 && !loading && !error && (
          <div className='flex justify-center items-center min-h-64'>
            <p className='text-gray-500'>No products available for {centraName}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default CentraHomepage;
