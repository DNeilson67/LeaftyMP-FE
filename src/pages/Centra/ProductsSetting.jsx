import { useEffect, useState } from "react";
import WidgetContainer from '@components/Cards/WidgetContainer';
import LeavesType from '../../components/LeavesType';
import SwitchButton from '../../components/SwitchButton';
import Drawer from '../../components/DrawerProduct';
import DateIcon from '../../assets/Date.svg';
import DiscountRate from '../../assets/DiscountRate.svg';
import { API_URL, formatNumber, formatRupiah } from "../../App";

// Import assets for each product
import WetLeavesLogo from '@assets/WetLeavesMarketplace.svg';
import DryLeavesLogo from '@assets/DryLeavesMarketplace.svg';
import PowderLogo from '@assets/PowderMarketplace.svg';
import Market from "@assets/Market.svg";
import AdminFeeIcon from "@assets/Adminfee.svg";
import WarningCircle from "@assets/WarningCircle.svg";
import axios from "axios";
import { useOutletContext } from "react-router";
import { Delete, Edit, Trash } from "lucide-react";
import LoadingBackdrop from "../../components/LoadingBackdrop";
import CheckboxField from "@components/CheckboxField";

function ProductsSetting({ product }) {
    const [open, setOpen] = useState(false);
    const [selectedData, setSelectedData] = useState(null); // Holds data for editing
    const [isEditing, setIsEditing] = useState(false); // Flag for edit mode
    const [sellable, setSellable] = useState(true);
    const [loading, setLoading] = useState(true);  // New loading state

    const productIDs = {
        "Wet Leaves": 1,
        "Dry Leaves": 2,
        "Powder": 3
    }

    const handleEditClick = (data) => {
        setSelectedData(data); // Set the data to be edited
        setIsEditing(true); // Enable edit mode
        setOpen(true); // Open the 
    };

    const handleAddClick = () => {
        setSelectedData(null); // Clear previous selection
        setIsEditing(false); // Disable edit mode
        setOpen(true); // Open the 
    };


    // const handleEditDiscountCondition = (item) => {
    //     setIsEditing(true);
    //     setEditingItemId(item.id);
    //     setExpiry(item.expiry === Infinity ? '' : item.expiry.toString()); // Prefill expiry
    //     setDiscountRate(item.discountRate.toString()); // Prefill discount rate
    //     setOpen(true); // Open the drawer
    // };

    const UserID = useOutletContext();

    useEffect(() => {
        // Set loading to true at the start of the fetch
        setLoading(true);

        // Fetch both data concurrently using Promise.all
        Promise.all([
            axios.get(`${API_URL}/centra_setting_detail/get_user/${UserID}/${product}`),
            axios.get(`${API_URL}/centra_base_settings/get_user/${UserID}/${product}`)
        ])
            .then(([settingsResponse, baseSettingsResponse]) => {
                // Update the data state from the first API call and sort it
                setData((prevData) => {
                    const updatedData = [...prevData, ...settingsResponse.data];
                    return updatedData.sort((a, b) => b.expiry - a.expiry); // Sort expiry in ascending order
                });


                console.log(baseSettingsResponse.data[0]);
                // Update the initialPrice and sellable from the second API call
                setInitialPrice(baseSettingsResponse.data[0].initialPrice);
                setSellable(baseSettingsResponse.data[0].sellable);
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            })
            .finally(() => {
                // Set loading to false after the requests are completed
                setLoading(false);
            });

    }, [UserID, product, API_URL]);  // Add dependencies to re-run on these values change


    const [data, setData] = useState([
        { expiry: Infinity, discountRate: 0 },
        { expiry: 3, discountRate: -1 },
    ]);


    const [initialPrice, setInitialPrice] = useState(5000);

    const toggleDrawer = (newOpen) => () => {
        setOpen(newOpen);
    };

    const handleDeleteDiscountCondition = (settingID) => {
        axios
            .delete(`${API_URL}/centra_setting_detail/delete/${settingID}`)
            .then((response) => {
                setData((prevData) => {
                    // Remove the deleted item from the state
                    return prevData.filter((item) => item.id !== settingID);
                });
            })
            .catch((error) => {
                console.error("Error fetching data:", error);
            });
    }

    const afterInput = async (newSellable = sellable) => {
        try {
            const response = await axios.patch(`${API_URL}/centra_base_settings/patch/${UserID}/${productIDs[product]}`, {
                InitialPrice: parseInt(initialPrice, 10),
                Sellable: newSellable  // Use the passed value instead of state
            });

            // Handle success
            console.log('Update successful:', response.data);
        } catch (error) {
            console.error('Error updating settings:', error);
            alert('Failed to update settings. Please try again.');
        }
    };



    const handleInputChange = (e) => {
        const value = e.target.value;

        // Allow only numbers, removing any non-numeric characters (except for commas)
        const numericValue = value.replace(/[^0-9]/g, '');
        setInitialPrice(numericValue);

    };

    const handleClickSellable = () => {
        const newSellable = !sellable;
        setSellable(newSellable);
        setTimeout(() => {
            afterInput(newSellable);  // Pass the updated value directly
        }, 500);
    }

    // Determine product-specific settings
    const productSettings = {
        "Wet Leaves": {
            logo: WetLeavesLogo,
            backgroundColor: "#94C3B3",
            name: "Wet Leaves"
        },
        "Dry Leaves": {
            logo: DryLeavesLogo,
            backgroundColor: "#0F7275",
            name: "Dry Leaves"
        },
        "Powder": {
            logo: PowderLogo,
            backgroundColor: "#C0CD30",
            name: "Powder"
        }
    };

    const currentProduct = productSettings[product];
    const [focus, setFocus] = useState(false);
    return (
        <div className="w-full space-y-6 p-4">
            {/* Product Header - Minimal & Clean */}
            <div className="flex flex-col items-center gap-3">
                <div className="relative">
                    <LeavesType
                        imageSrc={currentProduct.logo}
                        backgroundColor={currentProduct.backgroundColor}
                        imgclassName={"w-24 h-24 sm:w-28 sm:h-28"}
                    />
                </div>
                <h2 className="font-montserrat font-bold text-xl sm:text-2xl text-gray-800">
                    {currentProduct.name}
                </h2>
            </div>

            {/* Marketplace Toggle - Card Style */}
            <WidgetContainer className="hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#0F72751A] flex items-center justify-center">
                            <img src={Market} alt="Market" className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-montserrat font-semibold text-base text-gray-800">
                                Marketplace
                            </p>
                            <p className="font-montserrat text-xs text-gray-500">
                                {sellable ? 'Available for sale' : 'Not available'}
                            </p>
                        </div>
                    </div>
                    <SwitchButton checked={sellable} onChange={handleClickSellable} />
                </div>
            </WidgetContainer>

            {/* Price Setting - Clean Card */}
            <WidgetContainer className="hover:shadow-md transition-shadow">
                <div className="p-4 space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-[#0F72751A] flex items-center justify-center">
                            <img src={AdminFeeIcon} alt="Price" className="w-5 h-5" />
                        </div>
                        <div>
                            <p className="font-montserrat font-semibold text-base text-gray-800">
                                Base Price
                            </p>
                            <p className="font-montserrat text-xs text-gray-500">
                                Price per kilogram
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2 bg-[#F7FAFC] rounded-lg p-3 border border-[#0F72751A]">
                        <span className="font-montserrat font-medium text-gray-700">Rp</span>
                        <input
                            type="number"
                            className="flex-1 bg-transparent font-montserrat text-lg font-semibold text-gray-800 outline-none"
                            value={initialPrice}
                            onFocus={() => setFocus(true)}
                            onBlur={() => {
                                setFocus(false);
                                afterInput();
                            }}
                            onChange={handleInputChange}
                            placeholder="0"
                        />
                        <span className="font-montserrat text-sm text-gray-500">/kg</span>
                    </div>
                </div>
            </WidgetContainer>

            {/* Discount Rates - Modern Card */}
            <WidgetContainer className="hover:shadow-md transition-shadow">
                <div className="p-4 space-y-4">
                    <div className="flex justify-between items-center">
                        <div>
                            <p className="font-montserrat font-semibold text-base text-gray-800">
                                Discount Rates
                            </p>
                            <p className="font-montserrat text-xs text-gray-500">
                                Based on expiry time
                            </p>
                        </div>
                        <button
                            onClick={toggleDrawer(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-[#0F7275] hover:bg-[#0D5F62] text-white rounded-lg transition-colors font-montserrat text-sm font-semibold"
                        >
                            <span className="text-lg">+</span>
                            Add
                        </button>
                    </div>

                    <div className="space-y-2">
                        {data.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center justify-between p-3 bg-[#F7FAFC] rounded-lg border border-[#0F72751A] hover:border-[#0F7275] transition-colors"
                            >
                                <div className="flex-1 space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-montserrat text-sm font-medium text-gray-700">
                                            {item.expiry === Infinity ? '∞ Days' : `${item.expiry} Days`}
                                        </span>
                                        {item.expiry !== Infinity && (
                                            <span className="text-xs text-gray-400">until expiry</span>
                                        )}
                                    </div>
                                    <div className="font-montserrat text-sm font-semibold">
                                        {item.discountRate < 0 ? (
                                            <span className="text-[#D45D5D]">Item Disabled</span>
                                        ) : (
                                            <span className="text-[#0F7275]">{item.discountRate}% off</span>
                                        )}
                                    </div>
                                </div>

                                {index !== 0 && index !== data.length - 1 ? (
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEditClick(item)}
                                            className="p-2 bg-[#C0CD30] hover:bg-[#A8B428] text-white rounded-lg transition-colors"
                                            aria-label="Edit"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteDiscountCondition(item.id)}
                                            className="p-2 bg-[#D45D5D] hover:bg-[#C04545] text-white rounded-lg transition-colors"
                                            aria-label="Delete"
                                        >
                                            <Trash size={16} />
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex gap-2 opacity-30">
                                        <button
                                            disabled
                                            className="p-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
                                            aria-label="Edit disabled"
                                        >
                                            <Edit size={16} />
                                        </button>
                                        <button
                                            disabled
                                            className="p-2 bg-gray-300 text-gray-500 rounded-lg cursor-not-allowed"
                                            aria-label="Delete disabled"
                                        >
                                            <Trash size={16} />
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </WidgetContainer>

            <Drawer
                open={open}
                setOpen={setOpen}
                setData={setData}
                firstText="Expiry In (Days)"
                secondText="Discount Rate"
                editData={selectedData}
                isEditing={isEditing}
                firstImgSrc={DateIcon}
                secondImgSrc={DiscountRate}
                user_id={UserID}
                productName={product}
                setIsEditing={setIsEditing}
                setEditData={setSelectedData}
                data={data}
            />

            {loading && <LoadingBackdrop />}
        </div>
    );
}

export default ProductsSetting;
