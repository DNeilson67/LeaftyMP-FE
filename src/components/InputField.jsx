import React, { useState } from 'react';

function InputField({
  noMax = true,
  maxNum = undefined,
  name,
  type,
  label,
  placeholder,
  icon,
  onChange,
  value,
  required = false,
  className,
  green = false,
  disabled = false,
  padding = true,
  formControl = true,
}) {
  const [showPassword, setShowPassword] = useState(false);
  
  // Custom onChange handler to limit number input
  const handleChange = (e) => {
    let val = e.target.value;

    if (type === "number" && maxNum !== undefined) {
      // Allow empty string so user can clear the input
      if (val === "") {
        onChange(e);
        return;
      }

      const numVal = Number(val);
      // If number is NaN or less or equal maxNum, accept it
      if (!isNaN(numVal) && numVal <= maxNum) {
        onChange(e);
      }
      // Else ignore input (don't update state)
      // Optionally, you could also clamp val to maxNum:
      // else onChange({ ...e, target: { ...e.target, value: maxNum.toString() } });
    } else {
      // For other input types, just pass through
      onChange(e);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <label className={`${formControl && "form-control"} w-full ${!noMax && "md:max-w-md"} ${className}`}>
      {label && (
        <div className={`px-0 ${padding ? "py-1" : ""}`}>
          <span className="text-xs md:text-sm">{label}{required && <span className="text-red-500">*</span>}</span>
        </div>
      )}
      <div className={`input input-bordered flex items-center gap-2 input-md ${green ? "green" : ""}`}>
        {icon && <img src={icon} className="w-5 h-5" />}
        <input
          name={name}
          type={inputType}
          className="grow"
          placeholder={placeholder}
          onChange={!disabled ? handleChange : undefined}
          value={value}
          max={type === "number" ? maxNum : undefined}
        />
        {type === 'password' && (
          <button
            type="button"
            onClick={togglePasswordVisibility}
            className="focus:outline-none"
            tabIndex="-1"
          >
            {showPassword ? (
              // Eye slash icon (password visible)
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
              </svg>
            ) : (
              // Eye icon (password hidden)
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-500 hover:text-gray-700 cursor-pointer">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            )}
          </button>
        )}
      </div>
    </label>
  );
}

export default InputField;
