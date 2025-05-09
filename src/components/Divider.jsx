function Divider({label}){
 return (
    <div className="flex items-center"> 
        <hr className="flex-grow border-t border-gray-300" /> 
        <span className="px-3 text-gray-500 font-bold"> 
            {label}
        </span> 
        <hr className="flex-grow border-t border-gray-300" /> 
    </div> 
 )
}

export default Divider;