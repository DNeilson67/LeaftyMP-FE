import WideButtonRow from "../WideButtonRow";
import closest from "@assets/closest.svg";
import bestquality from "@assets/bestquality.svg";
import customized from "@assets/customized.svg";
import instant from "@assets/instant.svg";
import PerformanceMap from "@components/PerformanceMap";
import randomize from "@assets/randomize.svg";
import { InfoOutlined } from "@mui/icons-material";
import ChooseCentraMap from "../ChooseCentraMap";

function StepThree({ preferredCentra, setPreferredCentra, product, selectedCentras, setSelectedCentras }) {
    const Buttons = [
        // {
        //     label: "Best Quality",
        //     image: bestquality,
        //     disabled: true
        // },
        // {
        //     label: "Instant",
        //     image: instant,
        //     disabled: true
        // },
        {
            label: "Closest Proximity",
            image: closest,
            disabled: false
        },
        {
            label: "Randomized",
            image: randomize,
            disabled: false,
        },
        {
            label: "Customized",
            image: customized,
            disabled: false
        },
    ];
    return <>
        <div className='flex flex-col w-full'>
            <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
                <span className='text-xl sm:text-2xl font-semibold'>Which kind of Centra do you prefer?</span>
                <button className="" onClick={() => document.getElementById('info_centra').showModal()}><InfoOutlined className="text-[#0F7275]" /></button>
            </div>
            <span className='text-[#79B2B7] text-lg sm:text-xl'>Please select only one option</span>
            <hr className='w-1/6 sm:w-1/12 border-[#0F7275] rounded border-2 my-2'></hr>
            <WideButtonRow item={preferredCentra} setItem={setPreferredCentra} widthClass="w-full sm:w-1/3" Buttons={Buttons} width={"1/4"} />
            {
                preferredCentra === "Customized" &&
                <div className="mt-4">
                    <div className="alert alert-info mb-3 text-xs sm:text-sm">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-5 h-5 sm:w-6 sm:h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <span className="leading-tight">Please select at least one centra from the map below. Click on centra markers to select them.</span>
                    </div>
                    <ChooseCentraMap
                        container={false}
                        product={product}
                        selectedCentras={selectedCentras}
                        setSelectedCentras={setSelectedCentras}
                    />
                </div>
            }
            <dialog id="info_centra" className="modal">
                <div class="modal-box max-w-sm sm:max-w-lg">
                    <form method="dialog">
                        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <div className="flex flex-col gap-2 text-sm sm:text-base">
                        {/* <div className="flex flex-row gap-2 items-center">
                            <img src={bestquality} className="w-6 h-6 sm:w-8 sm:h-8"></img>
                            <span className="font-semibold text-[#0F7275] text-lg sm:text-xl">Best Quality</span>
                        </div>
                        <span>Choose this option to receive the highest quality leaves. Please note that this may take up to 3 days for delivery, as it is based on selecting the top-rated leaves.</span> */}
                        <div className="flex flex-row gap-2 items-center">
                            <img src={closest} className="w-6 h-6 sm:w-8 sm:h-8"></img>
                            <span className="font-semibold text-[#0F7275] text-lg sm:text-xl">Closest Proximity</span>
                        </div>
                        <span>Select this option for the fastest delivery, typically within 1 day, as it identifies and ships from the nearest distribution center.</span>
                        
                        <div className="flex flex-row gap-2 items-center">
                            <img src={randomize} className="w-6 h-6 sm:w-8 sm:h-8"></img>
                            <span className="font-semibold text-[#0F7275] text-lg sm:text-xl">Randomize</span>
                        </div>
                    
                        <span>Opt for this choice to randomize the selection of distribution centers, providing a varied delivery experience each time.</span>

                        <div className="flex flex-row gap-2 items-center">
                            <img src={customized} className="w-6 h-6 sm:w-8 sm:h-8"></img>
                            <span className="font-semibold text-[#0F7275] text-lg sm:text-xl">Customized</span>
                        </div>
                        <span>Use this option to select your preferred distribution center from a map, allowing you to tailor the delivery to your specific preferences.</span>
                    </div>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog>
        </div>

    </>
}

export default StepThree;