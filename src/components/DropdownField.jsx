import React from "react";

const DropdownField = ({
    label = "Bank",
    name = "bankCode",
    value,
    onChange,
    options = [],
    placeholder,
    required = false,
}) => (
    <div className="w-full flex gap-2 flex-col">
        <label className="text-xs md:text-sm ">{label}{required && <span className="text-red-500">*</span>}</label>
        <div className="relative w-full">
            <select
                className="input input-bordered w-full h-full px-2 appearance-none"
                value={value}
                onChange={onChange}
                name={name}
            >
                {placeholder && <option value="">{placeholder}</option>}
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label} {/* <-- use label instead of channel_name */}
                    </option>
                ))}
            </select>

            <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <svg
                    className="w-5 h-5 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                    />
                </svg>
            </div>
        </div>
    </div>
);

export default DropdownField;