import WidgetContainer from "./Cards/WidgetContainer";
import "@style/InputField.css";

function TextareaField({
    noMax = true,
    name,
    label,
    placeholder,
    icon,
    onChange,
    value,
    className = "",
    green = false,
    disabled = false,
    padding = true,
    formControl = true,
    rows = 3,
}) {
    return (
        <label
            className={[
                formControl ? "form-control w-full" : "w-full",
                !noMax ? "md:max-w-md" : "",
                className,
            ].join(" ")}
        >
            {label && (
                <div className={`px-0 ${padding ? "py-1" : ""}`}>
                    <span className="label-text text-xs md:text-sm">{label}</span>
                </div>
            )}

            <textarea
                name={name}
                className={[
                    "textarea",
                    "w-full",
                    "resize-none",
                    green ? "textarea-success" : "textarea-bordered",
                    "outline-none",
                ].join(" ")}
                placeholder={placeholder}
                onChange={!disabled ? onChange : undefined}
                value={value}
                disabled={disabled}
                rows={rows}
            />
        </label>
    );
}

export default TextareaField;