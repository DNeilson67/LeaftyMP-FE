import filter from "../assets/icons/filter.svg";
import FilterMarket from "@assets/Filtermarketplace.svg";

function FilterMarketplace({ tablet }) {
    return (
        <>

            <div
                tabIndex={0}
                role="button"
                className="flex gap-2 items-center rounded-full"
            >
                <img src={FilterMarket} alt="Filter Icon" className="p-1" />
                {!tablet && (
                    <span style={{ }}>
                        Filter
                    </span>
                )}
            </div>

        </>
    );
}

export default FilterMarketplace;

