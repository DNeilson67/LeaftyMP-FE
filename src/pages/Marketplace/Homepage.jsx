import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import FilterMarketplace from '../../components/FilterMarketplace'; // Assuming these are correctly imported
import Category from '@components/Category'; // Assuming these are correctly imported
import RatingStar from '../../components/RatingStar'; // Assuming these are correctly imported
import WidgetContainer from '@components/Cards/WidgetContainer'; // Assuming these are correctly imported
import BasicTextFields from '../../components/BasicTextFields'; // Assuming these are correctly imported
import Banner from '@assets/Banner.svg';
import ProductTiles from '../../components/ProductTiles';
import FilterMarket from "@assets/Filtermarketplace.svg"; // Assuming these are correctly imported
import axios from 'axios';
import { API_URL } from '../../App';
import InfiniteScroll from 'react-infinite-scroll-component';
import LoadingCircle from '@components/LoadingCircle';
import LoadingBackdrop from '@components/LoadingBackdrop';
import LoadingStatic from '@components/LoadingStatic';
import ThreeDotsLoading from '@components/ThreeDotsLoading';

function Homepage() {
  const [products, setProducts] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0); // To keep track of the current page for pagination
  const navigate = useNavigate();

  const fetchProducts = async (pageNum) => {
    try {
      // You'll likely need to adjust your API to support pagination
      // For example, adding query parameters like ?page=${pageNum}&limit=10
      const response = await axios.get(`${API_URL}/marketplace/get?skip=${pageNum}&limit=10`);
      const fetchedProducts = response.data.map((item) => ({
        productId: item.id,
        productName: item.product_name,
        expiryTime: item.expiry_time,
        stock: item.stock,
        price: item.price,
        initialPrice: item.initial_price,
        centraName: item.centra_name,
      }));

      setProducts((prevProducts) => [...prevProducts, ...fetchedProducts]);
      setPage(pageNum + 1);

      if (fetchedProducts.length === 0 || fetchedProducts.length < 10) {
        setHasMore(false);
      }
      console.log(fetchedProducts);
    } catch (error) {
      setHasMore(false);
    }
  };

  useEffect(() => {
    fetchProducts(1); // Fetch initial products on component mount
  }, []);

  return (
    <div className='flex justify-center px-2 sm:px-4'>
      <div className='flex flex-col w-full xl:w-3/4'>
        <img src={Banner} alt="Banner" className="cursor-pointer p-1 sm:p-2 rounded-lg" onClick={() => navigate("/marketplace/bulk", { replace: true })} />
        {/* Removed ID as it's no longer the scroll target */}
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
          {/* This div is your grid container */}
          <div
            className="mx-1 sm:mx-2 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-2 sm:gap-4 auto-cols-max"
          >
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
        </InfiniteScroll>
      </div>
    </div>
  );
}

export default Homepage;