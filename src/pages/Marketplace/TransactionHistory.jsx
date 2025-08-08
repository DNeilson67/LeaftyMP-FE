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

    // // Filter by product
    // if (
    //   productFilter !== 'All Products' &&
    //   !transaction.sub_transactions.some(sub => sub[0].market_shipment.ProductName === productFilter)
    // ) return false;

    // Search filter
    return (
      transaction.TransactionID.toLowerCase().includes(term) ||
      transaction.sub_transactions[0].CentraUsername.toLowerCase().includes(term) ||
      transaction.TransactionStatus.toLowerCase().includes(term)
    );
  });


  return (
    <main className="container mx-auto mt-4 py-4">
      <h1 className="text-2xl font-bold mb-4">Transaction List</h1>

      <div className='flex flex-row flex-wrap justify-between items-center mb-4'>
        {/* Search Bar */}
        <div className='w-2/3 flex flex-row justify-start items-center gap-4'>
          <div className="w-1/2 items-center flex bg-gray-100 rounded-full border border-[#79B2B7] border-2">
            <input
              type="text"
              placeholder="Find Transaction"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-grow px-4 py-2 mx-4 rounded-full border-none outline-none bg-gray-100"
            />
            <button className="btn btn-circle self-place-end" style={{ backgroundColor: "#417679" }}>
              <Search style={{ color: 'white' }} />
            </button>
          </div>
          <details className="dropdown">
            <summary className="btn rounded-full" style={{ color: "#A0C2B5", backgroundColor: "transparent", borderColor: "#79B2B7" }}>
              {productFilter} <ChevronDown className='text-[#A0C2B5]' />
            </summary>
            <ul className="menu dropdown-content bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
              {['All Products', 'Wet Leaves', 'Dry Leaves', 'Powder'].map((type) => (
                <li key={type}>
                  <a onClick={() => setProductFilter(type)}>{type}</a>
                </li>
              ))}
            </ul>
          </details>

        </div>


        {/* Filter Buttons */}
        <div className="flex space-x-2">
          {['All', 'Single', 'Bulk'].map(type => (
            <button
              key={type}
              onClick={() => setFilter(type)}
              className={`px-6 py-2 rounded-full ${filter === type
                ? 'bg-[#a8d1c2] text-white'
                : 'bg-white text-[#2c5e4c]'
                }`}
            >
              {type}
            </button>
          ))}
          <button className='underline text-[#616161]'>Reset Filter</button>
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
