import { useEffect, useState } from "react";
import BarChart from '@components/Cards/BarChart';
import WidgetContainer from '@components/Cards/WidgetContainer';
import Products from '@assets/Products.svg';
import Performance from '@assets/Performance.svg'
import BalanceDisplay from "../../components/BalanceDisplay";
import Deposit from "@assets/Deposit.svg";
import Withdraw from "@assets/Withdraw.svg";
import CircularButton from '../../components/CircularButton';
import PowderLogo from '../../assets/Powder.svg';
import DryLeavesLogo from '../../assets/DryLeavesEarning.svg';
import WetLeavesLogo from '../../assets/WetLeaves.svg';
import PaymentForm from "@components/PaymentForm";
import DrawerFinance from "@components/DrawerFinance";
import axios from "axios";
import { API_URL } from "../../App";
import { useOutletContext } from "react-router";
import LoadingStatic from "@components/LoadingStatic";
import LoadingBackdrop from "@components/LoadingBackdrop";

function Myearnings() {

    const [financeData, setFinanceData] = useState(null);
    const [loading, setLoading] = useState(true);


    const UserID = useOutletContext();
    useEffect(() => {
        async function FetchData() {
            try {
                const response = await axios.get(`${API_URL}/centra_finance/get_user/${UserID}`)
                setFinanceData(response.data)
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false);
            }
        }
        FetchData()
    }, [])
    
    const activityData = [
        {
            imageUrl: PowderLogo,
            backgroundColor: "#C0CD30",
            title: "10 Kg Wet Leaves",
            date: "20 August 2024, 17:00 PM",
            amount: "RP100.000"
        },
        {
            imageUrl: DryLeavesLogo,
            backgroundColor: "#0F7275",
            title: "500 Kg Dry Leaves",
            date: "21 August 2024, 10:00 AM",
            amount: "RP500.000"
        },
        {
            imageUrl: WetLeavesLogo,
            backgroundColor: "#94C3B3",
            title: "500 Kg Wet Leaves",
            date: "21 August 2024, 10:00 AM",
            amount: "RP500.000"
        },
        {
            imageUrl: DryLeavesLogo,
            backgroundColor: "#0F7275",
            title: "500 Kg Dry Leaves",
            date: "21 August 2024, 10:00 AM",
            amount: "RP500.000"
        },
    ];

    if (loading) {
        return <LoadingBackdrop />
    }

    return (
        <>
            <div className="flex flex-col gap-4">
                {!financeData &&
                    <div role="alert" className="alert alert-error">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6 shrink-0 stroke-current"
                            fill="none"
                            viewBox="0 0 24 24">
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Activate your account by entering your credit card info.</span>
                    </div>
                }
                <div className="flex flex-col justify-center items-center gap-2">

                    {financeData ? (
                        <PaymentForm financeData={financeData} />
                    ) : (
                        <LoadingStatic />
                    )}
                    <p className="text-center text-[#616161] font-[Montserrat] text-[16px] font-semibold leading-[19.5px] tracking-[0.02em]">
                        Pending Balance
                    </p>
                    <BalanceDisplay />
                </div>
                {/* <div className="flex gap-4">
                    <WidgetContainer border={false} backgroundColor="#0F7275" borderRadius="20px">
                        <div className="flex items-center">
                            <img src={Deposit} alt="Performance" className="w-12 h-5" />
                            <p className="text-left text-[#FCFCFC] font-[Montserrat] text-[14px] font-semibold leading-[17.07px] tracking-[0.02em]">
                                Edit
                            </p>
                        </div>
                    </WidgetContainer>
                    <WidgetContainer border={false} backgroundColor="#0F7275" borderRadius="20px">
                        <div className="flex items-center">
                            <img src={Withdraw} alt="Performance" className="w-12 h-5" />
                            <p className="text-left text-[#FCFCFC] font-[Montserrat] text-[14px] font-semibold leading-[17.07px] tracking-[0.02em]">
                                Withdraw
                            </p>
                        </div>
                    </WidgetContainer>

                </div> */}
                <WidgetContainer className="w-full max-h-[300px] o rounded-lg bg-white p-2 shadow">
                    <h3 className="text-center font-bold mb-4">Recent Transactions</h3>
                    {/* Activity items */}
                    <div className="flex flex-col max-h-[250px] overflow-y-auto ">
                        {activityData.map((item, index) => (
                            <div key={index} className="flex items-center justify-between gap-2 mb-4 px-2">
                                <div className="flex gap-2 items-center">
                                    <CircularButton imageUrl={item.imageUrl} backgroundColor={item.backgroundColor} />
                                    <div className="flex flex-col gap-2">
                                        <p className="font-montserrat text-[14px] font-semibold leading-[14px] tracking-[0.02em] text-left">
                                            {item.title}
                                        </p>
                                        <p className="font-montserrat text-[12px] font-medium leading-[12px] tracking-[0.02em] text-left">
                                            {item.date}
                                        </p>
                                    </div>
                                </div>

                                <p className="font-montserrat text-[14px] font-semibold leading-[14.63px] tracking-[0.02em] text-left">
                                    {item.amount}
                                </p>
                            </div>
                        ))}
                    </div>

                </WidgetContainer>

            </div>


        </>
    );
}

export default Myearnings;
