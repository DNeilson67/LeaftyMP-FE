import React, { useEffect, useState } from 'react';
import { ArrowDown, ChevronDown, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import TransactionContainer from '@components/TransactionContainer';
import axios from 'axios';
import { API_URL } from '../../App';
import ThreeDotsLoading from '@components/ThreeDotsLoading';

export default function TransactionHistory() {
  const [filter, setFilter] = useState('All');
  const [productFilter, setProductFilter] = useState('All Products');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchInput, setSearchInput] = useState(''); // Separate input state
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [totalItems, setTotalItems] = useState(0);
  const [hasMore, setHasMore] = useState(false);

  // Fetch transactions with pagination and filters
  const fetchTransactions = () => {
    setLoading(true);
    
    // Calculate skip value
    const skip = (currentPage - 1) * itemsPerPage;
    
    // Build query parameters
    const params = new URLSearchParams({
      skip: skip.toString(),
      limit: itemsPerPage.toString(),
    });
    
    // Add optional filters
    if (searchTerm) {
      params.append('search', searchTerm);
    }
    
    if (productFilter !== 'All Products') {
      params.append('product_type', productFilter);
    }
    
    // Add transaction type filter (Single/Bulk/All) - now sent to backend
    if (filter !== 'All') {
      params.append('transaction_type', filter);
    }

    axios.get(`${API_URL}/marketplace/get_transactions_by_customer?${params.toString()}`)
      .then((response) => {
        setTransactions(response.data.transactions || []);
        setTotalItems(response.data.total || 0);
        setHasMore(response.data.has_more || false);
      })
      .catch((error) => {
        console.error("Error fetching transactions:", error);
        setTransactions([]);
        setTotalItems(0);
        setHasMore(false);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchTransactions();
  }, [currentPage, itemsPerPage, searchTerm, productFilter, filter]);



  // No client-side filtering needed - all filtering is done on backend
  const filteredTransactions = transactions;

  // Calculate total pages
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Handle search submit
  const handleSearchSubmit = () => {
    setSearchTerm(searchInput);
    setCurrentPage(1); // Reset to first page on new search
  };

  // Handle search input key press
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  // Handle filter change
  const handleProductFilterChange = (newFilter) => {
    setProductFilter(newFilter);
    setCurrentPage(1); // Reset to first page
  };

  const handleTypeFilterChange = (newFilter) => {
    setFilter(newFilter);
    setCurrentPage(1); // Reset to first page
  };

  // Handle reset
  const handleReset = () => {
    setFilter('All');
    setProductFilter('All Products');
    setSearchTerm('');
    setSearchInput('');
    setCurrentPage(1);
  };

  // Pagination handlers
  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(prev => prev + 1);
    }
  };

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    }
  };

  const goToPage = (page) => {
    setCurrentPage(page);
  };


  return (
    <main className="container mx-auto mt-2 sm:mt-4 py-2 sm:py-4 px-2 sm:px-4">
      <h1 className="text-xl sm:text-2xl font-bold mb-4">Transaction List</h1>

      <div className='flex flex-col lg:flex-row gap-4 lg:justify-between lg:items-center mb-4'>
        {/* Search Bar */}
        <div className='w-full lg:w-2/3 flex flex-col sm:flex-row justify-start items-stretch sm:items-center gap-2 sm:gap-4'>
          <div className="w-full sm:w-1/2 lg:w-1/2 items-center flex bg-gray-100 rounded-full border border-[#79B2B7] border-2">
            <input
              type="text"
              placeholder="Search by Transaction ID or Centra"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={handleSearchKeyPress}
              className="flex-grow px-2 sm:px-4 py-2 mx-2 sm:mx-4 rounded-full border-none outline-none bg-gray-100 text-sm sm:text-base"
            />
            <button 
              onClick={handleSearchSubmit}
              className="btn btn-circle self-place-end btn-sm sm:btn-md" 
              style={{ backgroundColor: "#417679" }}
            >
              <Search style={{ color: 'white' }} className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
          </div>
          <details className="dropdown w-full sm:w-auto">
            <summary className="btn rounded-full w-full sm:w-auto text-xs sm:text-sm" style={{ color: "#A0C2B5", backgroundColor: "transparent", borderColor: "#79B2B7" }}>
              {productFilter} <ChevronDown className='text-[#A0C2B5] w-4 h-4' />
            </summary>
            <ul className="menu dropdown-content bg-base-100 rounded-box z-[1] w-52 p-2 shadow-sm">
              {['All Products', 'Wet Leaves', 'Dry Leaves', 'Powder'].map((type) => (
                <li key={type}>
                  <a onClick={() => handleProductFilterChange(type)} className="text-sm">{type}</a>
                </li>
              ))}
            </ul>
          </details>
        </div>


        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2">
          {['All', 'Single', 'Bulk'].map(type => (
            <button
              key={type}
              onClick={() => handleTypeFilterChange(type)}
              className={`px-4 sm:px-6 py-2 rounded-full text-sm sm:text-base ${filter === type
                ? 'bg-[#a8d1c2] text-white'
                : 'bg-white text-[#2c5e4c]'
                }`}
            >
              {type}
            </button>
          ))}
          <button 
            className='underline text-[#616161] text-sm sm:text-base'
            onClick={handleReset}
          >
            Reset Filter
          </button>
        </div>

      </div>

      {/* Results summary */}
      {!loading && (
        <div className="mb-4 text-sm text-gray-600">
          Showing {filteredTransactions.length > 0 ? ((currentPage - 1) * itemsPerPage) + 1 : 0} - {Math.min(currentPage * itemsPerPage, totalItems)} of {totalItems} transactions
        </div>
      )}

      {/* Transactions List */}
      <div className="space-y-3 sm:space-y-4">
        {loading ? (
          <div className="flex justify-center items-center h-[40vh] sm:h-[50vh]">
            <ThreeDotsLoading />
          </div>
        ) : (
          <div className="space-y-3 sm:space-y-4">
            {filteredTransactions.length === 0 ? (
              <p className="text-center text-gray-500 py-8 sm:py-12 text-sm sm:text-base">No transactions found.</p>
            ) : (
              filteredTransactions.map((transaction) => (
                <TransactionContainer key={transaction.id} transaction={transaction} />
              ))
            )}
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {!loading && totalItems > 0 && (
        <div className="mt-6 sm:mt-8 flex flex-col gap-3 sm:gap-4">
          {/* Items per page selector - Full width on mobile */}
          <div className="flex justify-between sm:justify-start items-center gap-2 sm:gap-3 pb-3 sm:pb-0 border-b sm:border-b-0">
            <span className="text-xs sm:text-sm text-gray-600">Items per page:</span>
            <select 
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1); // Reset to first page
              }}
              className="select select-bordered select-sm text-xs sm:text-sm"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
          </div>

          {/* Page navigation - Scrollable on mobile */}
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-2">
            <button
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
              className={`btn btn-sm w-full sm:w-auto ${currentPage === 1 ? 'btn-disabled' : 'btn-outline'}`}
              style={{ borderColor: "#79B2B7", color: currentPage === 1 ? '#gray' : "#417679" }}
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Previous</span>
              <span className="sm:hidden">Prev</span>
            </button>

            {/* Page numbers - Scrollable container on mobile */}
            <div className="flex gap-1 overflow-x-auto max-w-full sm:max-w-none pb-2 sm:pb-0 scrollbar-thin">
              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                // Show first page, last page, current page, and pages around current
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => goToPage(page)}
                      className={`btn btn-sm flex-shrink-0 min-w-[2.5rem] ${
                        currentPage === page
                          ? 'btn-active'
                          : 'btn-outline'
                      }`}
                      style={{
                        backgroundColor: currentPage === page ? "#a8d1c2" : "transparent",
                        borderColor: "#79B2B7",
                        color: currentPage === page ? "white" : "#417679"
                      }}
                    >
                      {page}
                    </button>
                  );
                } else if (page === currentPage - 2 || page === currentPage + 2) {
                  return <span key={page} className="px-1 sm:px-2 flex items-center">...</span>;
                }
                return null;
              })}
            </div>

            <button
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
              className={`btn btn-sm w-full sm:w-auto ${currentPage === totalPages ? 'btn-disabled' : 'btn-outline'}`}
              style={{ borderColor: "#79B2B7", color: currentPage === totalPages ? 'gray' : "#417679" }}
            >
              <span className="hidden sm:inline">Next</span>
              <span className="sm:hidden">Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

    </main>
  );
}
