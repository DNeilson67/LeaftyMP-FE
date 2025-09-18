import Success from "@assets/Success.svg";
import Download from "@assets/Downloading.svg";
function PaymentSuccessful(){
    return <>
        <div className="text-center p-4 sm:p-8 flex flex-col items-center justify-center overflow-hidden h-[80dvh]">
            <div className="flex items-center justify-center mb-4">
            <img src={Success} className="w-16 h-16 sm:w-20 sm:h-20" />
            </div>
            <h1 className="text-xl sm:text-2xl font-semibold">Payment Successful</h1>
            <p className="mt-2 text-gray-700 w-full sm:w-2/3 lg:w-1/3 mx-auto text-sm sm:text-base px-4"style={{wordWrap: 'break-word'}}>
            Thank you for your purchase! Your transaction has been completed successfully.
            You can download your invoice for detailed information.
            </p>
            <div className="mt-4 flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-0 w-full sm:w-auto">
                <button className="w-full sm:w-auto px-6 sm:px-10 py-2 sm:mr-2 text-white rounded-full text-sm sm:text-base" style={{backgroundColor:"#0F7275"}}>
                    View Order
                </button>
                <button className="w-full sm:w-auto px-4 sm:px-6 py-2 text-white rounded-full text-sm sm:text-base" style={{backgroundColor:"#0F7275"}}>
                    <div className="flex items-center justify-center"><img src={Download} className="w-4 h-4 flex mr-2" />Download Invoice</div>
                </button>
            </div>
            <a href="/marketplace/history" className="mt-4 block hover:underline text-sm sm:text-base"style={{color:"#94C3B3"}}>
            Go to Transaction List
            </a>
        </div>
    </>
}

export default PaymentSuccessful;