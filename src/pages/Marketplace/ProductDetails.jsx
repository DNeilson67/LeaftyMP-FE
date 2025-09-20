import React, { useEffect, useState } from 'react';
import { replace, useNavigate, useParams } from 'react-router-dom';
import { Calendar, Clock, Minus, Plus, Share, Weight } from 'lucide-react';
import WetLeavesMarketplace from '@assets/WetLeavesMarketplace.svg';
import DryLeavesMarketplace from '@assets/DryLeavesMarketplace.svg';
import PowderMarketplace from '@assets/PowderMarketplace.svg';
import { API_URL, formatRupiah } from '../../App';
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
import axios from 'axios';
import PageNotFound from '../../pages/PageNotFound';
import LoadingStatic from '@components/LoadingStatic';
import ThreeDotsLoading from '@components/ThreeDotsLoading';
import Modal from '@components/Modal';
import { productAvailabilityUtils } from '../../api/marketShipmentApi';

export default function ProductDetails() {
  const { centraName, productName } = useParams();
  const queryParams = new URLSearchParams(location.search);
  const productId = queryParams.get('pr_id');
  const [quantity, setQuantity] = useState(10); // Initialize quantity state
  const [product, setProduct] = useState(); // Initialize products state
  const [value, setValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [buyLoading, setBuyLoading] = useState(false);

  // Check if product is available for purchase
  const isProductAvailable = () => {
    return productAvailabilityUtils.isProductAvailable(product);
  };

  // Get availability message for display
  const getAvailabilityMessage = () => {
    return productAvailabilityUtils.getAvailabilityMessage(product);
  };

  // Get status badge info
  const getStatusBadgeInfo = () => {
    return productAvailabilityUtils.getStatusBadgeInfo(product);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/marketplace/get_product_details`, {
          params: {
            product_id: productId,
            product_name: productName,
            username: centraName,
          },
        });
        console.log(response.data)
        setProduct(response.data);
        setLoading(false);
        // console.log('Fetched products:', response.data);
      } catch (error) {
        // console.error('Error fetching products:', error);
      }
    };
    fetchProducts();
  }, []);

  const navigate = useNavigate();

  const type_id_map = {
    "Wet Leaves": 1,
    "Dry Leaves": 2,
    "Powder": 3,
  };

  const handleProceedToPurchase = async () => {
    // Check if product is available before proceeding
    if (!isProductAvailable()) {
      alert(getAvailabilityMessage() || 'This product is not available for purchase.');
      return;
    }

    try {
      setBuyLoading(true);
      const product_type_id = type_id_map[product.product_name];

      // Check if the product type exists in the map
      if (!product_type_id) {
        throw new Error("Invalid product name");
      }

      // Sending a POST request to create the transaction
      const response = await axios.post(`${API_URL}/marketplace/create_transaction`, {
        CentraID: product.centra_id,
        ProductID: product.id,
        ProductTypeID: product_type_id,
        Price: product.price,
        InitialPrice: product.initial_price,
        ShipmentStatus: "Pending Transaction",
      });

      // Get the TransactionID from the response and navigate to the transaction page
      const transactionID = response.data.TransactionID;
      navigate(`/marketplace/transaction?tr_id=${transactionID}`);

    } catch (error) {
      console.error('Purchase error:', error);
      if (error.response?.status === 423) {
        alert('This product is currently being processed by another customer. Please try again later.');
      } else if (error.response?.status === 400) {
        // alert('This product is no longer available for purchase.');
        navigate('/', { replace: true });
      } else {
        navigate('/', { replace: true });
        // alert('Failed to proceed with purchase. Please try again.');
      }
    } finally {
      setBuyLoading(false);
    }
  };

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

  const handleChange = (event, newValue) => {
    setValue(newValue);
    console.log('Tab changed to:', newValue);
  };

  if (loading) {
    return <div className="flex justify-center items-center w-full h-[80dvh]">
      <ThreeDotsLoading />
    </div>

  }

  if (!product) {
    return <PageNotFound />
  }


  return (
    <>
      <div className="flex p-4 sm:p-6 lg:p-8 gap-4 sm:gap-6 lg:gap-8 justify-center lg:justify-start flex-col xl:flex-row items-center xl:items-start">
        <div className={`w-full sm:w-2/3 lg:w-1/2 xl:w-1/3 aspect-square bg-[${getColorImage(product.product_name)}] rounded-3xl p-4 sm:p-6 lg:p-8 flex items-center justify-center`}>
          <img
            src={getProductImage(product.product_name)}
            alt={product.product_name}
            className="w-full h-full object-contain rounded-xl"
          />
        </div>

        <div className="w-full xl:w-1/3 flex flex-col gap-2 items-center xl:items-start justify-center">
          <div className='flex flex-col sm:flex-row gap-2 items-center'>
            <h1 className="text-xl sm:text-2xl font-bold text-center xl:text-start">{product.product_name}</h1>

            {/* Product Status Badge */}
            <div className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusBadgeInfo().className}`}>
              {getStatusBadgeInfo().label}
            </div>

            <div className="bg-[#94C3B380] rounded-md p-2 items-center flex justify-center">
              <div className="flex flex-row gap-2 justify-center items-center">
                <img src={TimeMarketplace} alt="Time" className="w-4 h-4 sm:w-6 sm:h-6" />
                <span className="text-xs sm:text-sm whitespace-nowrap">
                  {product.expiry_time} Days
                </span>
              </div>
            </div>

          </div>

          <h2 className="text-2xl sm:text-3xl font-bold text-center xl:text-start">{formatRupiah(product.price)} / Kg</h2>

          <div className="text-sm mb-4 justify-between w-full">
            <ThemeProvider theme={theme}>
              <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, marginBottom: "20px", borderColor: 'divider' }}>
                  <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" variant="fullWidth">
                    <BoldTab label="Description" to="ShipmentOrder" />
                    <BoldTab label="Spesification" to="ShipmentSent" />
                    <BoldTab disabled label="" to="ShipmentCompleted" />
                  </Tabs>
                </Box>
                <CustomTabPanel value={value} index={0}>
                  <div className="text-sm leading-relaxed">
                    Discover the natural goodness of Wet Leaf Moringa, a nutrient-rich superfood harvested from the fresh, green leaves of the Moringa tree. Packed with vitamins, minerals, and antioxidants, our wet leaf Moringa is perfect for smoothies, salads, and health-boosting recipes. Sustainably sourced and carefully processed to retain maximum nutrients, it offers a fresh and potent way to enhance your diet. Boost your energy, support your immune system, and enjoy the versatile culinary uses of Wet Leaf Moringa.
                  </div>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={1}>
                  <span className="text-sm leading-relaxed">
                    <strong>SNI 01-4325-1996 - Simplified Dry Medicinal Plants</strong>
                    <br />
                    This standard regulates the quality of dried medicinal plant materials, including Moringa. Key points include:
                    <ul className="list-disc list-inside mt-1">
                      <li>Maximum moisture content: <strong>10-12%</strong></li>
                      <li>Free from foreign matter (stones, dust, insects, etc.)</li>
                      <li>Color should be natural green (for dried/powder)</li>
                      <li>No visible mold or decay</li>
                      <li>No additives or preservatives</li>
                    </ul>
                  </span>
                </CustomTabPanel>
                <CustomTabPanel value={value} index={2}>
                </CustomTabPanel>
              </Box>
            </ThemeProvider>
          </div>
          <div className="w-full">
            <CentraProfileCard centraName={product.centra_name} compact />
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-3xl w-full xl:w-1/3 gap-2 flex flex-col justify-between shadow-lg">
          <div className='flex flex-col gap-2 mb-4'>
            <h3 className="font-bold text-lg">Information</h3>
            <div className="flex flex-row justify-between gap-2">
              <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                <Weight className="w-4 h-4 sm:w-5 sm:h-5 text-[#0F7275]" />
                Weight
              </h3>
              <div className='flex flex-row items-center gap-2'>
                <span className="font-bold text-lg sm:text-xl text-[#0F7275]">{product.weight} Kg</span>
              </div>
            </div>
            <div className="mb-4">
              <span className="font-bold">Notes</span>
              <textarea
                draggable={false}
                className="w-full bg-[#e8f3f1] rounded-xl p-2 mt-2 text-sm"
                rows={3}
                style={{ resize: "none" }}
                placeholder="Add your notes here..."
              ></textarea>
            </div>
          </div>
          <div className='flex flex-col gap-2'>
            <div className="flex justify-between items-center mb-4">
              <span className="text-gray-500">Subtotal</span>
              <span className="text-lg sm:text-xl font-bold">{formatRupiah(product.weight * product.price)}</span>
            </div>

            {/* Product Availability Warning */}
            {!isProductAvailable() && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-3">
                <div className="flex items-center">
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <span className="text-red-700 text-sm font-medium">Product Unavailable</span>
                </div>
                <p className="text-red-600 text-xs sm:text-sm mt-1">{getAvailabilityMessage()}</p>
              </div>
            )}

            <button
              className={`w-full py-2 sm:py-3 rounded-full transition-all duration-300 text-sm sm:text-base ${isProductAvailable() && !loading && !buyLoading
                  ? 'bg-[#0F7275] text-white hover:shadow-lg'
                  : 'bg-gray-400 text-gray-600 cursor-not-allowed'
                }`}
              onClick={handleProceedToPurchase}
              disabled={loading || buyLoading || !isProductAvailable()}
            >
              {buyLoading ? (
                <ThreeDotsLoading size={"xs"} color='white' />
              ) : !isProductAvailable() ? (
                'Unavailable'
              ) : (
                'Buy'
              )}
            </button>

            {/* <button
              className={`w-full border-2 py-2 sm:py-3 rounded-full transition-all duration-300 text-sm sm:text-base ${
                isProductAvailable() && !loading
                  ? 'bg-white text-[#4C4949] border-[#0F7275] hover:shadow-lg'
                  : 'bg-gray-100 text-gray-400 border-gray-300 cursor-not-allowed'
              }`}
              onClick={() => {
                if (isProductAvailable()) {
                  console.log("Added to cart");
                } else {
                  alert(getAvailabilityMessage() || 'This product is not available.');
                }
              }}
              disabled={!isProductAvailable() || loading}
            >
              Add to Cart
            </button> */}

          </div>
        </div>
      </div>
    </>
  );
}

