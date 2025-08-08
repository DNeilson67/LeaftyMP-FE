import React from 'react';
import { FaStar } from 'react-icons/fa';
import centra from "@assets/centra.svg";
import completion from "@assets/Completion.svg";
import WidgetContainer from './Cards/WidgetContainer';
import CircularButton from './CircularButton';
import DiscountRate from "@assets/DiscountRate.svg";
import { formatNumber, formatRupiah } from '../App';

const CentraContainer = ({ centraName, leavesLogo, chosenLeaves = [] }) => {
  // Calculate total weight
  const totalWeight = chosenLeaves.reduce((acc, item) => acc + item.weight, 0);

  // Calculate total initial price and total final price
  const totalInitialPrice = chosenLeaves.reduce((acc, item) => acc + item.weight * item.initial_price, 0);
  const totalPrice = chosenLeaves.reduce((acc, item) => acc + item.weight * item.price, 0);

  // Find the minimum and maximum price for the chosen leaves
  const minPrice = chosenLeaves.length > 0 ? Math.min(...chosenLeaves.map(item => item.price)) : 0;
  const maxPrice = chosenLeaves.length > 0 ? Math.max(...chosenLeaves.map(item => item.price)) : 0;

  return <>
    <div className="flex items-center justify-between p-4 shadow-md rounded-xl bg-white" onClick={() => { document.getElementById(centraName).showModal() }}>
      <div className="flex flex-row items-center justify-between w-full">
        <div className='flex flex-row items-center gap-4'>
          <div className="flex items-center justify-center w-16 h-16 rounded-full bg-[#C2D45E]">
            <img src={centra} className='w-10' />
          </div>
          <div>
            <h3 className="font-semibold text-lg">{centraName}</h3>
            <span>{formatNumber(totalWeight)} Kg</span>
          </div>
        </div>
        <div className='flex flex-col items-end justify-right gap-2'>
          <div className='flex items-center text-right'>
            {totalInitialPrice !== totalPrice && <img src={DiscountRate} className='w-8 h-8' alt="Discount Rate" />}
            <span className='font-semibold text-xl'>{formatRupiah(totalPrice)}</span>
          </div>
          <span className='text-xs text-right'>{formatRupiah(minPrice)} - {formatRupiah(maxPrice)}</span>
        </div>

      </div>
    </div>
    <dialog id={centraName} className="modal modal-bottom sm:modal-middle">
      <div className="modal-box">
        <div className='flex flex-row justify-between items-center'>
          <span className='font-semibold text-xl'>{centraName}</span>
          {
            totalInitialPrice !== totalPrice && <div className='text-right'>
              <span className='font-light text-xs line-through'>{formatRupiah(totalInitialPrice)}</span>
            </div>
          }
        </div>

        <div className='flex flex-row w-full justify-between items-center'>
          {
            totalInitialPrice !== totalPrice && <span className=''>You saved <b>{formatRupiah(totalInitialPrice - totalPrice)}</b></span>}
          <span className='font-semibold text-xl'>{formatNumber(totalWeight)} Kg | {formatRupiah(totalPrice)}</span>
        </div>

        {chosenLeaves.map((item) => (
          <div key={item.id} className="flex justify-between p-1">
            <WidgetContainer borderRadius="10px" className="w-full flex items-center">
              <button>
                <CircularButton imageUrl={leavesLogo} backgroundColor="#94C3B3" />
              </button>
              <div className="flex flex-col ml-3">
                <span className="font-montserrat text-base font-semibold leading-tight tracking-wide text-left">
                  {item.weight} Kg
                </span>
                <div className='flex flex-col'>
                  {
                    item.price !== item.initial_price && <span className="line-through font-montserrat text-xs font-light leading-17 tracking-wide text-left">
                      {formatRupiah(item.initial_price)} / Kg
                    </span>
                  }
                  <span className="font-montserrat text-sm font-medium leading-17 tracking-wide text-left">
                    {formatRupiah(item.price)} / Kg
                  </span>
                </div>
              </div>
              <div className="flex ml-auto items-right flex-col text-right">
                {
                  item.price !== item.initial_price && <span className='line-through text-xs font-light'>{formatRupiah(item.weight * item.initial_price)}</span>}

                <div className='flex flex-row gap-2'>
                  <span className='font-semibold'>{formatRupiah(item.weight * item.price)}</span>
                  {item.price !== item.initial_price && <img src={DiscountRate}></img>}
                </div>
              </div>
            </WidgetContainer>
          </div>
        ))}
      </div>
      <form method="dialog" className="modal-backdrop">
        <button>close</button>
      </form>
    </dialog>
  </>
};

export default CentraContainer;
