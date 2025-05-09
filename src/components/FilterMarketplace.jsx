import filter from "../assets/icons/filter.svg";
import FilterMarket from "@assets/Filtermarketplace.svg";

function FilterMarketplace({ tablet }) {
    return (
        <>
            <div className="dropdown" style={{ marginLeft: "-16px" }}> {/* Adjust margin as needed */}
                <div 
                    tabIndex={0} 
                    role="button" 
                    className="flex gap-2 items-center justify-between rounded-full" 
                >
                    <img src={FilterMarket} alt="Filter Icon" className="p-1"/>
                    {!tablet && (
                        <span style={{ marginRight: "auto" }}>
                            Filter
                        </span>
                    )}
                </div>
                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 border-white border-2 border-solid">
                    <li><a>All Time</a></li>
                    <li><a>Daily</a></li>
                    <li><a>Weekly</a></li>
                    <li><a>Monthly</a></li>
                    <li><a>Yearly</a></li>
                </ul>
            </div>
        </>
    );
}

export default FilterMarketplace;

