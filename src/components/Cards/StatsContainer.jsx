import "./StatsContainer.css"
import information from "../../assets/icons/information.svg"
import WidgetContainer from "./WidgetContainer";

function StatsContainer({ row = true, label, value, unit = false, icon_unit = false, description, modalContent, color, modal = true, frontIcon = false, backIcon = false, round, dashboardStats = false, truck = false }) {
    return <>
        <WidgetContainer noRightBorder container={false} padding={false} round={round}>
            <div className="flex flex-row justify-between py-3 sm:py-2 pl-3 sm:pl-2 items-center">
                {frontIcon ? <img src={frontIcon} className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 flex-shrink-0"></img> : <></>}
                <div className={`flex ${row ? "flex-col" : "flex-row"} gap-1 sm:gap-1.5 flex-1 min-w-0 px-2`}>
                    <div className="flex flex-row justify-between items-center">
                        {modal ? <button className="" onClick={() => document.getElementById('my_modal').showModal()}><img src={information}></img></button> : <></>}
                        <div></div>
                    </div>
                    <span style={{ color: "#6B6A6A" }} className="text-xs sm:text-sm md:text-base truncate">
                        {label ? label : <></>}
                    </span>
                    <span className={`font-bold text-lg sm:text-xl md:text-2xl lg:text-2xl xl:text-2xl truncate`}>
                        {(value && unit) ? Number(value).toLocaleString() + " " + unit : ""}
                        {value != null && icon_unit ? (
                            <>
                                <div className="flex flex-row gap-2 sm:gap-4 items-center">
                                    <span className="truncate">{Number(value).toLocaleString() + " "}</span>
                                    <img src={icon_unit} className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" alt="" />
                                </div>
                            </>
                        ) : null}
                    </span>
                    <span style={{ color: "#6B6A6A" }} className="text-xs sm:text-sm truncate">
                        {description ? description : <></>}
                    </span>
                </div>
                <div className="flex justify-start flex-row flex-shrink-0">
                    {backIcon ? <img src={backIcon} className="w-12 h-12 sm:w-16 sm:h-16"></img> : <></>}
                    {dashboardStats && <img src={dashboardStats} className={`w-16 h-16 sm:w-20 sm:h-20 md:w-[100px] md:h-[100px] ${truck && "mr-2 sm:mr-6"}`}></img>}
                </div>
                {/* <img src={powder} className="w-1/4 transform -scale-x-100 opacity-10 place-self-end"></img> */}
                <div className="w-[15px] sm:w-[20px] h-[80px] sm:h-[100px] place-self-center flex-shrink-0">
                    <div className="w-[15px] sm:w-[20px] h-[80px] sm:h-[100px] rounded-[10px_0px_0px_10px] shadow-[inset_0px_4px_4px_#0000001a]" style={{ background: color }} />
                </div>
            </div>
        </WidgetContainer>
        {modal ?
            <dialog id="my_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">Statistics</h3>
                    <p className="py-4">Show Statistics</p>
                </div>
                <form method="dialog" className="modal-backdrop">
                    <button>close</button>
                </form>
            </dialog> : <></>}
    </>
}

export default StatsContainer;