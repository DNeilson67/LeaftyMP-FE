import React, { useEffect, useState } from 'react';
import { ArrowDown, ChevronDown, Search } from 'lucide-react';
import TransactionContainer from '@components/TransactionContainer';
import axios from 'axios';
import { API_URL } from '../../App';
import ThreeDotsLoading from '@components/ThreeDotsLoading';

export default function TransactionHistory() {
  const [filter, setFilter] = useState('All');
  const [productFilter, setProductFilter] = useState('All Products');
  const [searchTerm, setSearchTerm] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true); // Start loading before fetch

    axios.get(API_URL + "/marketplace/get_transactions_by_customer")
      .then((response) => {
        setTransactions(response.data);
      })
      .catch((error) => {
        console.error("Error fetching transactions:", error);
      })
      .finally(() => {
        setLoading(false); // Only stop loading after fetch completes
      });
  }, []);



  const filteredTransactions = transactions.filter(transaction => {
    const term = searchTerm.toLowerCase();

    // Total Centras
    const centrasTotal = transaction.sub_transactions.reduce((acc, sub) => acc + (sub.CentraUsername ? 1 : 0), 0);

    // Filter by Single/Bulk
    if (filter === 'Single' && centrasTotal !== 1) return false;
    if (filter === 'Bulk' && centrasTotal <= 1) return false;

    // Filter by product
    if (productFilter !== 'All Products') {
      const hasProduct = transaction.sub_transactions.some(sub => 
        sub.market_shipments.some(shipment => shipment.ProductName === productFilter)
      );
      if (!hasProduct) return false;
    }

    // Search filter - search across all centra names and transaction data
    const transactionMatches = transaction.TransactionID.toLowerCase().includes(term) ||
                              transaction.TransactionStatus.toLowerCase().includes(term);
    
    const centraMatches = transaction.sub_transactions.some(sub => 
      sub.CentraUsername && sub.CentraUsername.toLowerCase().includes(term)
    );

    const productMatches = transaction.sub_transactions.some(sub =>
      sub.market_shipments.some(shipment =>
        shipment.ProductName.toLowerCase().includes(term)
      )
    );

    return transactionMatches || centraMatches || productMatches;
  });


  return (
    <main className="container mx-auto mt-2 sm:mt-4 py-2 sm:py-4 px-2 sm:px-4">
      <h1 className="text-xl sm:text-2xl font-bold mb-4">Transaction List</h1>

      <div className='flex flex-col lg:flex-row gap-4 lg:justify-between lg:items-center mb-4'>
        {/* Search Bar */}
        <div className='w-full lg:w-2/3 flex flex-col sm:flex-row justify-start items-stretch sm:items-center gap-2 sm:gap-4'>
          <div className="w-full sm:w-1/2 lg:w-1/2 items-center flex bg-gray-100 rounded-full border border-[#79B2B7] border-2">
            <input
              type="text"
              placeholder="Find Transaction"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow px-2 sm:px-4 py-2 mx-2 sm:mx-4 rounded-full border-none outline-none bg-gray-100 text-sm sm:text-base"
            />
            <button className="btn btn-circle self-place-end btn-sm sm:btn-md" style={{ backgroundColor: "#417679" }}>
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
                  <a onClick={() => setProductFilter(type)} className="text-sm">{type}</a>
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
              onClick={() => setFilter(type)}
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
            onClick={() => {
              setFilter('All');
              setProductFilter('All Products');
              setSearchTerm('');
            }}
          >
            Reset Filter
          </button>
        </div>

      </div>

      {/* Transactions List */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center items-center h-[50vh]">
            <ThreeDotsLoading />
          </div>
        ) : (
          <div className="space-y-4">
            {filteredTransactions.length === 0 ? (
              <p className="text-center text-gray-500">No transactions found.</p>
            ) : (
              filteredTransactions.map((transaction) => (
                <TransactionContainer key={transaction.id} transaction={transaction} />
              ))
            )}
          </div>
        )}

      </div>

    </main>
  );
}
