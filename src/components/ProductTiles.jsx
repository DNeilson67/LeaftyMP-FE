import React from 'react';
import WidgetContainer from '@components/Cards/WidgetContainer';
import LeavesType from '@components/LeavesType';
import Alert from '@assets/Alert.svg';
import TimeMarketplace from '@assets/TimeMarketplace.svg';
import WetMarketplace from '@assets/WetMarketplace.svg';
import Star from '@assets/Star.svg';
import YellowDot from '@assets/YellowDot.svg';
import centra from "@assets/centra.svg";
import WetLeavesMarketplace from '@assets/WetLeavesMarketplace.svg';
import DryLeavesMarketplace from '@assets/DryLeavesMarketplace.svg';
import PowderMarketplace from '@assets/PowderMarketplace.svg';
import { formatNumber, formatRupiah } from '../App';
import discountLogo from "@assets/discount_white.svg";

const ProductTiles = ({
  productName,
  stockTimeMin,
  stockTimeMax,
  stockCount,
  pricePerKg,
  rating,
  totalSold,
  centraName,
  showAlert,
  onClick
}) => {
  const getImageSrc = () => {
    switch (productName) {
      case 'Wet Leaves':
        return WetLeavesMarketplace;
      case 'Dry Leaves':
        return DryLeavesMarketplace;
      case 'Powder':
        return PowderMarketplace;
      default:
        return '';
    }
  };

  const getBackgroundColor = () => {
    switch (productName) {
      case 'Wet Leaves':
        return '#94C3B3';
      case 'Dry Leaves':
        return '#0F7275';
      case 'Powder':
        return '#C0CD30';
      default:
        return '#FFFFFF';
    }
  };

  return (
    <WidgetContainer onClick={onClick} border={true} borderRadius="20px" borderWidth="0.2px" borderColor="#41757980" className="p-2 relative">
      {showAlert && (
        <div className="absolute top-6 left-0">
          <WidgetContainer border={false} backgroundColor="#D45D5D" borderRadius="0px 15px 15px 0px">
            <img src={discountLogo} alt="Alert" />
          </WidgetContainer>
        </div>
      )}

      <LeavesType imageSrc={getImageSrc()} backgroundColor={getBackgroundColor()} imgclassName={"py-8"} />

      <div className="flex flex-col gap-2 p-1">
        <p className="text-sm font-medium">{productName}</p>

        <div className="flex gap-2 items-center">
          <div className="bg-[#94C3B380] rounded-md w-2/3 py-2 items-center flex justify-center">
            <div className="flex gap-1 items-center">
              <img src={TimeMarketplace} alt="Time" className="w-1/4" />
              <p className="whitespace-nowrap text-xs">
                {stockTimeMin} - {stockTimeMax} Days
              </p>
            </div>
          </div>

          <div className=" bg-[#94C3B380] rounded-md w-1/2 py-2 items-center flex justify-center">
            <div className="flex items-center gap-1">
              <img src={WetMarketplace} alt="Wet Leaves" className="w-[20px] h-[20px]" />
              <p className="whitespace-nowrap text-xs">{formatNumber(stockCount)} Kg</p>
            </div>
          </div>
        </div>

        <p className="text-sm font-bold">{formatRupiah(pricePerKg)} / KG</p>

        <div className="flex flex-row gap-2 items-center">
          <div className="w-8 h-8 bg-[#C0CD30] rounded-full flex items-center justify-center">
            <img src={centra} className="w-6 h-6" alt="Centra Logo" />
          </div>
          <p className="text-xs font-medium">{centraName}</p>
        </div>
      </div>
    </WidgetContainer>
  );
};

export default ProductTiles;
