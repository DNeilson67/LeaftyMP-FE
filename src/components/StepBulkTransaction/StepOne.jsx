import WideButtonRow from "../WideButtonRow";
import WetLeaves from "@assets/products/wl.svg";
import DryLeaves from "@assets/products/dl.svg";
import Powder from "@assets/products/pd.svg";

function StepOne({product, setProduct}) {
    const Buttons = [
        {
            label: "Wet Leaves",
            image: WetLeaves,
            disabled: true
        },
        {
            label: "Dry Leaves",
            image: DryLeaves,
            disabled: false
        },
        {
            label: "Powder",
            image: Powder,
            disabled: false
        }
    ];
    return <>
        <div className='flex flex-col w-full'>
            <span className='text-xl sm:text-2xl font-semibold'>Choose Your Product</span>
            <span className='text-[#79B2B7] text-lg sm:text-xl'>Please select only one option</span>
            <hr className='w-1/6 sm:w-1/12 border-[#0F7275] rounded border-2 my-2'></hr>
        </div>
        <WideButtonRow widthClass="w-full sm:w-1/3" Buttons={Buttons} item = {product} setItem = {setProduct}/>
    </>
}   

export default StepOne;