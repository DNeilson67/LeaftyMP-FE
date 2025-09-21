import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductTiles from '../../components/ProductTiles';
import FilterMarketplaceFeature from '@components/FilterMarketplaceFeature';
import InfiniteScroll from 'react-infinite-scroll-component';
import axios from 'axios';
import { API_URL } from '../../App';
import LoadingStatic from '@components/LoadingStatic';
import ThreeDotsLoading from '@components/ThreeDotsLoading';

function SearchPage() {
    const [searchParams] = useSearchParams();
    const query = searchParams.get("q");

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [showAll, setShowAll] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [page, setPage] = useState(0);
    const ITEMS_PER_PAGE = 10;

    const handleShowAllChange = (value) => {
        setShowAll(value);
    };

    const fetchProducts = async (pageNum) => {
        try {
            setLoading(true);
            const response = await axios.get(`${API_URL}/marketplace/search_products`, {
                params: {
                    query: query,
                    skip: pageNum * ITEMS_PER_PAGE,
                    limit: ITEMS_PER_PAGE,
                    show_all: showAll
                }
            });

            const formattedProducts = response.data.map(p => ({
                productId: p.id,
                productName: p.product_name,
                stock: p.stock,
                centraName: p.centra_name,
                initialPrice: p.initial_price,
                price: p.price,
                expiryTime: p.expiry_time,
                status: p.status
            }));

            if (pageNum === 0) {
                setProducts(formattedProducts);
            } else {
                setProducts((prevProducts) => [...prevProducts, ...formattedProducts]);
            }
            setPage(pageNum + 1);

            // Check if we've reached the end
            if (formattedProducts.length === 0 || formattedProducts.length < ITEMS_PER_PAGE) {
                setHasMore(false);
            }
            
        } catch (error) {
            if (error.response && error.response.status === 404) {
                if (pageNum === 0) {
                    setProducts([]); // no results
                }
                setHasMore(false);
            } else {
                console.error("Error fetching search results:", error);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!query) return;
        
        // Reset pagination state when query or showAll changes
        setProducts([]);
        setPage(0);
        setHasMore(true);
        
        fetchProducts(0);
    }, [query, showAll]);

    return (
        <div className='flex'>
            {/* Desktop Filter Sidebar */}
            <div className="hidden lg:block">
                <FilterMarketplaceFeature showAll={showAll} onShowAllChange={handleShowAllChange} />
            </div>
            
            <div className='flex flex-col w-full lg:w-3/4 gap-4 mt-4 px-4'>
                {/* Mobile: Search results + Filter button side by side */}
                <div className="flex justify-between items-center lg:justify-start">
                    <span className='font-semibold text-lg lg:text-xl'>
                        Search results for <span className='text-[#0F7275]'>'{query}'</span>
                    </span>
                    
                    {/* Mobile Filter Button */}
                    <div className="lg:hidden">
                        <FilterMarketplaceFeature 
                            showAll={showAll} 
                            onShowAllChange={handleShowAllChange}
                            mobileOnly={true}
                        />
                    </div>
                </div>
                {loading && products.length === 0 ? (
                    <div className="flex justify-center items-center py-16 h-[60dvh]">
                        <LoadingStatic />
                    </div>
                ) : (
                    <>
                        {products.length === 0 && !loading ? (
                            <p className="text-gray-500 text-center py-8">No products found.</p>
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
                                endMessage={
                                    <div className="text-center py-4 text-gray-500">
                                        <p>You've reached the end of the search results</p>
                                    </div>
                                }
                            >
                                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-5 gap-4 auto-cols-max">
                                    {products.map((product, index) => (
                                        <div key={`${product.productId}-${index}`}>
                                            <ProductTiles
                                                productId={product.productId}
                                                productName={product.productName}
                                                expiryTime={product.expiryTime}
                                                stock={product.stock}
                                                pricePerKg={product.price}
                                                initialPrice={product.initialPrice}
                                                centraName={product.centraName}
                                                status={product.status}
                                                showAlert={product.initialPrice > product.price}
                                            />
                                        </div>
                                    ))}
                                </div>
                            </InfiniteScroll>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}

export default SearchPage;