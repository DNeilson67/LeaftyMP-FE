// InputDataCentra.jsx
import React from 'react';
import WidgetContainer from "@components/Cards/WidgetContainer";
import dateSymbol from "@assets/Date.svg";


const InputDataCentra = ({
  firstp,
  secondp,
  secondimg,
  date,
  setDate,
  discountRate,
  setDiscountRate,
  handleSave,
}) => {
  return (
    <div className="w-full max-w mt-4 p-4">
      {/* Date Input */}
      <div className="mb-4">
        <p className="font-montserrat text-xs font-medium leading-[14.63px] tracking-wide text-left ml-1">
          {firstp}
        </p>
        <WidgetContainer
          backgroundColor="#FFFFFF"
          borderRadius="20px"
          borderWidth=""
          borderColor=""
          container={false}
          className="mt-2"
        >
          <div className="flex justify-items-end">
            <input
              type="number"
              className="w-full h-full bg-transparent border-none outline-none px-2"
              placeholder='Enter Expiry Days'
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
            <img src={dateSymbol} alt="Discount Rate" className="w-6 h-auto mr-3" />
          </div>
        </WidgetContainer>
      </div>

      {/* Discount Rate Input */}
      <div className="mb-4 flex flex-col items-center">
        <p className="font-montserrat text-xs font-medium leading-[14.63px] tracking-wide text-left self-start mb-2">
          {secondp}
        </p>
        <WidgetContainer
          backgroundColor="#FFFFFF"
          borderRadius="20px"
          borderWidth=""
          borderColor=""
          className="w-full"
          container={false}
        >
          <div className="flex">
            <input
              type="number"
              className="w-full h-full bg-transparent border-none outline-none px-2"
              placeholder="Enter Discount Rate"
              value={discountRate}
              onChange={(e) => setDiscountRate(e.target.value)}
            />
            <img src={secondimg} alt="Discount Rate" className="w-6 h-auto mr-3" />
          </div>
        </WidgetContainer>
      </div>

      <span className='italic text-gray-500'>Set -1 to Discount Rate to disable the item in your marketplace.</span>

      {/* Save Button */}
      <div className="flex items-center justify-center mt-12">
        <WidgetContainer
          container={false}
          backgroundColor="#0F7275"
          borderRadius="20px"
          border={false}
          className="w-full mr-2"
        >
          <button
            className="flex items-center justify-center w-full h-8 font-montserrat font-semibold leading-4 tracking-wide text-gray-100 text-lg"
            onClick={handleSave}
          >
            Save
          </button>
        </WidgetContainer>
      </div>
    </div>
  );
};

export default InputDataCentra;
