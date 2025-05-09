import React from 'react';
import { Search, ShoppingCart, Bell, ChevronDown } from 'lucide-react';
import LeavesType from '../../components/LeavesType';
import WidgetContainer from '../../components/Cards/WidgetContainer';
import WetLeavesMarketplace from '../../assets/WetLeavesMarketplace.svg';
import Centra from "@assets/centra.svg";

export default function TransactionHistory() {
    return (
        <main className="container mx-auto mt-4 p-0">
            <h1 className="text-2xl font-bold mb-4">Transaction List</h1>

            <div className="flex-grow items-center flex bg-gray-100 rounded-full border border-[#79B2B7] border-2 mb-4">
                <input
                    type="text"
                    placeholder="Find Transaction"
                    className="flex-grow px-4 py-2 mx-4 rounded-full border-none outline-none bg-gray-100"
                />
                <button
                    className="btn btn-circle self-place-end"
                    style={{ backgroundColor: "#417679" }}
                >
                    <Search style={{color: 'white'}}/>
                </button>
            </div>

            <div className="flex space-x-2 mb-4">
                <button className="bg-[#a8d1c2] text-white px-4 py-1 rounded-full">All</button>
                <button className="bg-white text-[#2c5e4c] px-4 py-1 rounded-full">Single</button>
                <button className="bg-white text-[#2c5e4c] px-4 py-1 rounded-full">Bulk</button>
            </div>

            <div className="space-y-4">
                {[
                    { status: 'Order Being Packed', cancelled: false },
                    { status: 'Order Cancelled', cancelled: true },
                    { status: 'Order Successful', cancelled: false }
                ].map((order, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 shadow">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 bg-[#C0CD30] rounded-full flex items-center justify-center">
                                    <img src={Centra} className='w-6 h-6'></img>
                                </div>
                                <span className="font-semibold">Centra Name</span>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-sm ${order.cancelled ? 'bg-red-100 text-red-800' : 'bg-[#a8d1c2] text-white'
                                }`}>
                                {order.status}
                            </span>
                        </div>
                        <hr style={{ color: 'rgba(148, 195, 179, 0.50)' }}></hr>
                        <div className="flex items-center my-4">
                            <LeavesType imageSrc={WetLeavesMarketplace} imgclassName='w-1/2 h-auto' py={8} px={0} />
                            <div className='ml-4'>
                                <h3 className="font-semibold">Wet Leaves</h3>
                                <p className="text-gray-600">Amount: 10 Kg</p>
                            </div>
                            <div className="ml-auto">
                                <span className="font-semibold">Rp 650.000</span>
                            </div>
                        </div>
                        <hr style={{ color: 'rgba(148, 195, 179, 0.50)' }}></hr>
                        <div className="flex justify-end items-center text-lg mt-2">
                            <span className="font-semibold">Subtotal: <span className='font-bold text-2xl'>Rp 705.000</span></span>
                        </div>
                        <div className="mt-4 flex justify-between items-center">
                            <span>7 August 2024 11:00 INV/20241241/WL/23628736283</span>
                            <div className="space-x-2">
                                <button className="px-4 py-2 bg-[#a8d1c2] text-white rounded-full">Contact Support</button>
                                <button className="px-4 py-2 border border-[#a8d1c2] text-[#2c5e4c] rounded-full">Cancel Order</button>
                                <button className="px-4 py-2 border border-[#a8d1c2] text-[#2c5e4c] rounded-full">Change Payment</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </main>
    );
}