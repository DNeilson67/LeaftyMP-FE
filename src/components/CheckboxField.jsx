import SwitchButton from "./SwitchButton";

export default function CheckboxField({ required, label, name, image, checked, onChange }) {
    return (
        <div className='flex items-center w-full justify-between'>
            <div className='flex items-center gap-6'>
                {image && <img src={image} alt="Market" />}
                <p className="text-xs md:text-sm text-left">{label}{required && <span className="text-red-500">*</span>}</p>
            </div>
            <div className="pl-2">
                <SwitchButton
                    checked={checked}
                    onChange={(event, checkedValue) =>
                        onChange({
                            target: {
                                name,
                                type: "checkbox",
                                checked: checkedValue, // boolean
                            }
                        })
                    }
                    checkedTrackColor="#0F7275"
                />
            </div>
        </div>
    );
}
