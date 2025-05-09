import React, { useState } from 'react';
import { replace, useNavigate, useParams } from 'react-router-dom';
import { Calendar, Clock, Minus, Plus, Share, Weight } from 'lucide-react';
import WetLeavesMarketplace from '@assets/WetLeavesMarketplace.svg';
import DryLeavesMarketplace from '@assets/DryLeavesMarketplace.svg';
import PowderMarketplace from '@assets/PowderMarketplace.svg';
import { formatRupiah } from '../../App';
import TimeMarketplace from '@assets/TimeMarketplace.svg';
import "./input.css";
import { Tabs as ShadTabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs"
import { ScrollArea, ScrollBar } from "@components/ui/scroll-area"
import CentraProfileCard from '../../components/CentraProfileCard';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { createTheme, ThemeProvider, styled } from '@mui/material/styles';
import PropTypes from 'prop-types';

export default function ProductDetails() {
  const { centraName, productName } = useParams(); // Get dynamic parameters from URL
  const [quantity, setQuantity] = useState(10); // Initialize quantity state
  const [selectedVariant, setSelectedVariant] = useState();

  const products = [
    {
      productName: 'Powder',
      stockTimeMin: 3,
      stockTimeMax: 8,
      stockCount: 300,
      pricePerKg: 1500,
      rating: 4.5,
      totalSold: 20000,
      centraName: 'EverHarvest Farmers',
    },
    {
      productName: 'Dry Leaves',
      stockTimeMin: 6,
      stockTimeMax: 11,
      stockCount: 300,
      pricePerKg: 1500,
      rating: 4.5,
      totalSold: 20000,
      centraName: 'EverHarvest Farmers',
    },
    {
      productName: 'Wet Leaves',
      stockTimeMin: 5,
      stockTimeMax: 10,
      stockCount: 500,
      pricePerKg: 1000,
      rating: 4,
      totalSold: 50000,
      centraName: 'EverHarvest Farmers',
    },
    {
      productName: 'Dry Leaves',
      stockTimeMin: 3,
      stockTimeMax: 60,
      stockCount: 300,
      pricePerKg: 1500,
      rating: 4.5,
      totalSold: 20000,
      centraName: 'Green Valley Co-op',
    },
    {
      productName: 'Powder',
      stockTimeMin: 3,
      stockTimeMax: 8,
      stockCount: 300,
      pricePerKg: 1500,
      rating: 4.5,
      totalSold: 20000,
      centraName: 'Green Valley Co-op',
    },
    {
      productName: 'Wet Leaves',
      stockTimeMin: 5,
      stockTimeMax: 10,
      stockCount: 500,
      pricePerKg: 1000,
      rating: 4,
      totalSold: 50000,
      centraName: 'Green Valley Co-op',
    },
    {
      productName: 'Dry Leaves',
      stockTimeMin: 6,
      stockTimeMax: 11,
      stockCount: 300,
      pricePerKg: 1500,
      rating: 4.5,
      totalSold: 20000,
      centraName: 'Sunleaf Collective',
    },
    {
      productName: 'Wet Leaves',
      stockTimeMin: 5,
      stockTimeMax: 10,
      stockCount: 500,
      pricePerKg: 1000,
      rating: 4,
      totalSold: 50000,
      centraName: 'Sunleaf Collective',
    },
    {
      productName: 'Dry Leaves',
      stockTimeMin: 7,
      stockTimeMax: 12,
      stockCount: 300,
      pricePerKg: 1500,
      rating: 4.5,
      totalSold: 20000,
      centraName: 'Sunleaf Collective',
    },
    {
      productName: 'Powder',
      stockTimeMin: 3,
      stockTimeMax: 8,
      stockCount: 300,
      pricePerKg: 1500,
      rating: 4.5,
      totalSold: 20000,
      centraName: 'Riverbend Agri Group',
    },
    {
      productName: 'Dry Leaves',
      stockTimeMin: 6,
      stockTimeMax: 11,
      stockCount: 300,
      pricePerKg: 1500,
      rating: 4.5,
      totalSold: 20000,
      centraName: 'Riverbend Agri Group',
    },
    {
      productName: 'Wet Leaves',
      stockTimeMin: 5,
      stockTimeMax: 10,
      stockCount: 500,
      pricePerKg: 1000,
      rating: 4,
      totalSold: 50000,
      centraName: 'Riverbend Agri Group',
    },
  ];


  const navigate = useNavigate();

  const handleQuantity = (e) => {
    const value = e.target.value;
    setQuantity(Math.max(1, Math.min(value, product.stockCount)));
  };

  // Find the product using the correct property names
  const product = products.find(p => p.centraName === centraName && p.productName === productName);

  if (!product) {
    return <div>Product not found</div>;
  }

  // Dynamically select the correct image based on the product name
  const getProductImage = (productName) => {
    switch (productName) {
      case 'Wet Leaves':
        return WetLeavesMarketplace;
      case 'Dry Leaves':
        return DryLeavesMarketplace;
      case 'Powder':
        return PowderMarketplace;
      default:
        return null; // Handle cases where no image is found
    }
  };

  const getColorImage = (productName) => {
    switch (productName) {
      case 'Wet Leaves':
        return "#94C3B3"
      case 'Dry Leaves':
        return "#0F7275"
      case 'Powder':
        return "#C0CD30"
      default:
        return null;
    }
  };

  const expirationVariants = [
    { id: "3-5", label: "3-5 Days", value: "3-5" },
    { id: "6-7", label: "6-7 Days", value: "6-7" },
    { id: "8-10", label: "8-10 Days", value: "8-10" },
    { id: "11-20", label: "11-20 Days", value: "11-20" },
    { id: "30-60", label: "30-60 Days", value: "30-60" },
  ]

  const theme = createTheme({
    palette: {
      primary: {
        main: '#0F7275',
      },
    },
  });

  const BoldTab = styled(Tab)({
    fontWeight: '600',
    fontSize: '15px',
    textTransform: 'capitalize',
    fontFamily: 'montserrat',
    flex: 1
  });

  function CustomTabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            {children}
          </Box>
        )}
      </div>
    );
  }

  CustomTabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };

  const [value, setValue] = useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    console.log('Tab changed to:', newValue);
  };

  return (
    <>
      <div className="flex p-8 gap-8 justify-center lg:justify-start flex-col xl:flex-row">
        <div className={`xl:w-1/3 w-1/2 h-1/2 bg-[${getColorImage(product.productName)}] rounded-3xl p-8 flex items-center justify-center`}>
          <img
            src={getProductImage(product.productName)}
            alt={product.productName}
            className="w-full h-full object-cover rounded-xl"
          />
        </div>

        <div className="xl:w-1/3 flex flex-col gap-2">
          <div className='flex flex-row gap-2 items-center'>
            <h1 className="text-2xl font-bold text-center xl:text-start">{product.productName}</h1>
            <div className="bg-[#94C3B380] rounded-md p-2 items-center flex justify-center">
              <div className="flex flex-row gap-2 justify-center items-center">
                <img src={TimeMarketplace} alt="Time" className="w-1/4" />
                <span className="text-sm whitespace-nowrap">
                  {product.stockTimeMin} - {product.stockTimeMax} Days
                </span>
              </div>
            </div>

          </div>

          <h2 className="text-3xl font-bold text-center xl:text-start">{formatRupiah(product.pricePerKg)} / Kg</h2>

          <div className="text-sm mb-4 justify-between">
            <ThemeProvider theme={theme}>
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, marginBottom: "20px", borderColor: 'divider' }}>
                  <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <BoldTab label="Description" to="ShipmentOrder" />
                    <BoldTab label="Spesification" to="ShipmentSent" />
                    <BoldTab disabled label="" to="ShipmentCompleted" />
                  </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>

                  Discover the natural goodness of Wet Leaf Moringa, a nutrient-rich superfood harvested from the fresh, green leaves of the Moringa tree. Packed with vitamins, minerals, and antioxidants, our wet leaf Moringa is perfect for smoothies, salads, and health-boosting recipes. Sustainably sourced and carefully processed to retain maximum nutrients, it offers a fresh and potent way to enhance your diet. Boost your energy, support your immune system, and enjoy the versatile culinary uses of Wet Leaf Moringa.
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                  <span className="text-sm leading-relaxed">
                    <strong>SNI 01-4325-1996 – Simplified Dry Medicinal Plants</strong>
                    <br />
                    This standard regulates the quality of dried medicinal plant materials, including Moringa. Key points include:
                    <ul className="list-disc list-inside mt-1">
                      <li>Maximum moisture content: <strong>10–12%</strong></li>
                      <li>Free from foreign matter (stones, dust, insects, etc.)</li>
                      <li>Color should be natural green (for dried/powder)</li>
                      <li>No visible mold or decay</li>
                      <li>No additives or preservatives</li>
                    </ul>
                    <br />
                 
                  </span>

                </CustomTabPanel>
                <CustomTabPanel value={value} index={2}>

                </CustomTabPanel>
              </Box>

            </ThemeProvider>


          </div>
          <CentraProfileCard />
        </div>

        <div className="bg-white p-6 rounded-3xl w-full lg:w-1/3 gap-2 flex flex-col">
          <h3 className="font-bold">Adjust Your Preferences </h3>
          <div className="flex flex-col gap-2">

            <h3 className="font-semibold text-gray-800 flex items-center gap-2">
              <Weight className="w-5 h-5 text-[#0F7275]" />
              Weight
            </h3>
            <div className='flex flex-row items-center gap-2'>
              <div className="flex items-center bg-[#CADED7] rounded-full p-2 justify-between w-3/4">
                <button
                  className="bg-[#79B2B7] rounded-full p-1"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  <Minus className="w-4 h-4 text-[#0F7275]" />
                </button>
                <div className='flex flex-row'>
                  <input className='text-[#0F7275] font-semibold bg-transparent text-center' type={"number"} value={quantity} onChange={handleQuantity}></input>
                  {/* <span className="mx-4 text-[#0F7275] font-semibold">{quantity} Kg</span> */}
                </div>
                <button
                  className="bg-[#79B2B7] rounded-full p-1"
                  onClick={() => setQuantity(Math.min(quantity + 1, product.stockCount))}
                >
                  <Plus className="w-4 h-4 text-[#0F7275]" />
                </button>
              </div>
              <span className='text-[#0F7275] font-semibold'>Kg</span>
              <span className="text-gray-500 text-sm">Stock: <br></br><div className='font-bold text-[#0F7275]'>{product.stockCount} Kg</div></span>
            </div>
          </div>

          {/* Expiration Date Variants - Tabs for categories */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#0F7275]" />
              Expiration Days
            </h3>

            <ShadTabs defaultValue="short" className="w-full">
              <TabsList className="grid grid-cols-3 mb-4">
                <TabsTrigger value="short">Short Term</TabsTrigger>
                <TabsTrigger value="medium">Medium Term</TabsTrigger>
                <TabsTrigger value="long">Long Term</TabsTrigger>
              </TabsList>

              <TabsContent value="short" className="mt-0">
                <ScrollArea className="w-full whitespace-nowrap">
                  <div className="flex space-x-2 pb-1">
                    {expirationVariants.slice(0, 2).map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant.value)}
                        className={`flex items-center gap-2 p-3 rounded-xl transition-all min-w-[120px] ${selectedVariant === variant.value
                          ? "bg-[#0F7275] text-white shadow-md"
                          : "bg-[#CADED7] text-[#0F7275] hover:bg-[#b5d6cc]"
                          }`}
                      >
                        <Clock
                          className={`w-5 h-5 ${selectedVariant === variant.value ? "text-white" : "text-[#0F7275]"
                            }`}
                        />
                        <span className="font-medium">{variant.label}</span>
                      </button>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </TabsContent>

              <TabsContent value="medium" className="mt-0">
                <ScrollArea className="w-full whitespace-nowrap">
                  <div className="flex space-x-2 pb-1">
                    {expirationVariants.slice(2, 4).map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant.value)}
                        className={`flex items-center gap-2 p-3 rounded-xl transition-all min-w-[120px] ${selectedVariant === variant.value
                          ? "bg-[#0F7275] text-white shadow-md"
                          : "bg-[#CADED7] text-[#0F7275] hover:bg-[#b5d6cc]"
                          }`}
                      >
                        <Clock
                          className={`w-5 h-5 ${selectedVariant === variant.value ? "text-white" : "text-[#0F7275]"
                            }`}
                        />
                        <span className="font-medium">{variant.label}</span>
                      </button>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </TabsContent>

              <TabsContent value="long" className="mt-0">
                <ScrollArea className="w-full whitespace-nowrap">
                  <div className="flex space-x-2 pb-1">
                    {expirationVariants.slice(4).map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant.value)}
                        className={`flex items-center gap-2 p-3 rounded-xl transition-all min-w-[120px] ${selectedVariant === variant.value
                          ? "bg-[#0F7275] text-white shadow-md"
                          : "bg-[#CADED7] text-[#0F7275] hover:bg-[#b5d6cc]"
                          }`}
                      >
                        <Clock
                          className={`w-5 h-5 ${selectedVariant === variant.value ? "text-white" : "text-[#0F7275]"
                            }`}
                        />
                        <span className="font-medium">{variant.label}</span>
                      </button>
                    ))}
                  </div>
                  <ScrollBar orientation="horizontal" />
                </ScrollArea>
              </TabsContent>
            </ShadTabs>
            <div className="mb-4">
              <span className="font-bold">Notes</span>
              <textarea
                draggable={false}
                className="w-full bg-[#e8f3f1] rounded-xl p-2 mt-2"
                rows={3}
                style={{ resize: "none" }}
                placeholder="Add your notes here..."
              ></textarea>

            </div>
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-500">Sub Total</span>
              <span className="text-xl font-bold">{formatRupiah(quantity * product.pricePerKg)}</span>
            </div>
            <button className="w-full bg-[#0F7275] text-white py-2 rounded-full" onClick={() => { navigate("/marketplace/transaction", { state: { quantity: quantity, pricePerKg: product.pricePerKg, productName: product.productName, productID: "", centraName: centraName }, replace: true }) }}>
              Buy
            </button>
          </div>
        </div>
      </div>
    </>
  );
}

