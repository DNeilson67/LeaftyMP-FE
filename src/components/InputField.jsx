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
          type={type}
          className="grow"
          placeholder={placeholder}
          onChange={!disabled ? handleChange : undefined}
          value={value}
          max={type === "number" ? maxNum : undefined}
        />
      </div>
    </label>
  );
}

export default InputField;
