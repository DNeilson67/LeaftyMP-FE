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
        <>
            <div className="flex justify-center p-2">
                <LeavesType
                    imageSrc={currentProduct.logo}
                    backgroundColor={currentProduct.backgroundColor}
                    imgclassName={"w-32 h-32"}
                />
            </div>
            <p className="block text-center font-montserrat font-semibold text-lg">
                {currentProduct.name}
            </p>

            <div className='flex items-center w-full justify-between'>
                <div className='flex items-center gap-6'>
                    <img src={Market} alt="Market" />
                    <p className="font-montserrat text-[12px] font-medium  text-left">
                        Allow Selling in Market
                    </p>
                </div>
                <div className="pl-2">
                    <SwitchButton checked={sellable} onChange={handleClickSellable} checkedTrackColor="#0F7275" />
                </div>

            </div>

            <div className='flex items-center w-full justify-between'>
                <div className='flex items-center gap-6'>
                    <img src={AdminFeeIcon} alt="Admin Fee" />
                    <div className='flex gap-4'>
                        <p className="font-montserrat text-[12px] font-medium leading-[14.63px] tracking-[0.02em] text-left">
                            Price
                        </p>
                        <img src={WarningCircle} alt="Warning" />
                    </div>
                </div>
                <div className="flex items-center font-montserrat text-[10px] font-medium leading-[14.63px] tracking-[0.02em] text-left mr-4">
                    <WidgetContainer
                        borderColor="#0F72754D"
                        backgroundColor="#DFEDE9"
                        borderWidth="1px"
                        className="w-20"
                    >
                        <div className="flex gap-2">
                            <p>Rp</p>
                            <input
                                type="number"
                                className="text-[12px] font-medium text-left"
                                value={initialPrice}
                                onFocus={() => setFocus(true)} // Set focus to true when the input is focused
                                onBlur={() => {
                                    setFocus(false);
                                    afterInput(); // Trigger update when input loses focus
                                }} // Set focus to false when the input loses focus
                                onChange={handleInputChange}
                            />
                        </div>
                    </WidgetContainer>
                </div>


            </div>

            <WidgetContainer>
                <div className="p-1">
                    <div className="flex justify-between p-2 items-center">
                        <p className="font-montserrat font-semibold  text-left">
                            Discount Rates
                        </p>
                        <WidgetContainer
                            border={false}
                            backgroundColor="#0F7275"
                            borderRadius="20px"
                            className="w-1/4 h-1/2"
                            onClick={toggleDrawer(true)}
                        >
                            <div className="flex justify-evenly">
                                <p className="font-montserrat text-xl font-semibold leading-[12.19px]  text-left text-white">
                                    +
                                </p>
                                <p className="font-montserrat text-sm font-semibold leading-[12.19px]  text-left text-white">
                                    Add
                                </p>
                            </div>
                        </WidgetContainer>
                    </div>

                    <div className="flex flex-col space-y-2">
                        {data.map((item, index) => (
                            <WidgetContainer key={index} className="flex flex-row justify-between mx-2">
                                <div className="flex flex-col justify-between">
                                    <p className="font-montserrat text-sm font-semibold">
                                        Expiry in <span style={{ color: '#0F7275' }}>
                                            {item.expiry === Infinity ? '∞ Days' : `${item.expiry} Days`}
                                        </span>
                                    </p>
                                    <p className="font-montserrat text-sm font-semibold">
                                        {item.discountRate < 0 ? <span style={{ color: "#D45D5D" }}>Item Disabled</span> : <span style={{ color: '#0F7275' }}>Discount Rate: {item.discountRate}%</span>}
                                    </p>
                                </div>

                                {
                                    index !== 0 && index !== data.length - 1 ?
                                        <div className="flex flex-row gap-2">
                                            <button className="btn" style={{ backgroundColor: "#C0CD30", color: "white" }} onClick={() => handleEditClick(item)}><Edit /></button>
                                            <button className="btn" style={{ backgroundColor: "#D45D5D", color: "white" }} onClick={() => handleDeleteDiscountCondition(item.id)}><Trash /></button>
                                        </div> : <div className="flex flex-row gap-2">
                                            <button className="btn btn-disabled" disabled style={{ backgroundColor: "", color: "white" }}><Edit /></button>
                                            <button className="btn btn-disabled" disabled style={{ backgroundColor: "", color: "white" }}><Trash /></button>
                                        </div>
                                }

                            </WidgetContainer>
                        ))}
                    </div>
                </div>
            </WidgetContainer>

            <Drawer
                open={open}
                setOpen={setOpen}

                setData={setData} // Pass the function to update data
                firstText="Expiry In (Days)"
                secondText="Discount Rate"
                editData={selectedData} // Pass the selected data for editing
                isEditing={isEditing} // Pass edit mode flag
                firstImgSrc={DateIcon}
                secondImgSrc={DiscountRate}
                user_id={UserID}
                productName={product}
                setIsEditing={setIsEditing}
                setEditData={setSelectedData}
                data={data}
            />

            {loading && <LoadingBackdrop />}
        </>
    );
}

export default ProductsSetting;
