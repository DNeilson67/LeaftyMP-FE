import "../style/Button.css"

function Button({type, noMax = false, background, color, label, img, onClick, id, border, icon, className, disabled}){
    return <>
         <button 
            id={id} 
            type={type} 
            onClick={disabled ? undefined : onClick} 
            disabled={disabled}
            className={`btn ${noMax ? "" : "md:max-w-md"} rounded-full ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`} 
            style={{background: background, color: color, border: border}}
         >
            {img ? <img src={img}></img> : null}{icon}{label}
         </button>
    </>
}

export default Button;