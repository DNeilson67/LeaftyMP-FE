import React, { useContext, useEffect, useRef, useState } from "react";
import InputField from "../../components/InputField";
import DropdownField from "../../components/DropdownField";
import CheckboxField from "../../components/CheckboxField";
import Button from "@components/Button";
import TextareaField from "@components/TextareaField";
import Popup from "@components/Popups/Popup";
import { ValueContext } from "./CentraLayout";
import { use } from "react";
import LoadingStatic from "@components/LoadingStatic";
import { useNavigate } from "react-router";
import DataRecorded from "@assets/DataRecorded.svg";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const weatherOptions = [
    { label: "Sunny", value: "SUNNY" },
    { label: "Cloudy", value: "CLOUDY" },
    { label: "Rainy", value: "RAINY" },
    { label: "Stormy", value: "STORMY" },
    { label: "Windy", value: "WINDY" },
    { label: "Other", value: "OTHER" },
];

const soilOptions = [
    { label: "Dry", value: "DRY" },
    { label: "Moist", value: "MOIST" },
    { label: "Wet", value: "WET" },
    { label: "Waterlogged", value: "WATERLOGGED" },
    { label: "Cracked", value: "CRAKED" },
];

const diseaseOptions = [
    { label: "None", value: "NONE" },
    { label: "Leaf Spots", value: "LEAF_SPOTS" },
    { label: "Powdery Growth", value: "POWDERY_GROWTH" },
    { label: "Wilting", value: "WILTING" },
    { label: "Other", value: "OTHER" },
];

const DailyReportCentra = () => {
    const [form, setForm] = useState({
        weatherTemperature: "",
        weatherCondition: "SUNNY",
        waterToday: false,
        compostAdded: false,
        compostType: "",
        fertilizerAdded: false,
        fertilizerType: "",
        diseaseType: "NONE",
        diseaseOtherDescription: "",
        soilCondition: "DRY",
        extraNotes: "",
    });

    const [loading, setLoading] = useState(true);
    const [recordedToday, setRecordedToday] = useState(false);
    const [errors, setErrors] = useState({});
    const [showErrorPopup, setShowErrorPopup] = useState(false);
    const [errorDescription, setErrorDescription] = useState("");
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);

    const navigate = useNavigate();

    const popupRef = useRef(null);
    const successPopupRef = useRef(null);

    const handleChange = (e, value) => {
        if (e?.target) {
            const { name, type, checked, value: val } = e.target;
            setForm((prev) => ({
                ...prev,
                [name]: type === "checkbox" ? checked : val,
            }));
        } else {
            setForm((prev) => ({
                ...prev,
                [e]: value,
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        let newErrors = {};
        let firstErrorMessage = "";

        // Validate weatherTemperature as before
        if (!form.weatherTemperature) {
            newErrors.weatherTemperature = "Temperature is required";
            firstErrorMessage = "Temperature is required";
        } else if (isNaN(Number(form.weatherTemperature))) {
            newErrors.weatherTemperature = "Temperature must be a number";
            firstErrorMessage = "Temperature must be a number";
        } else if (Number(form.weatherTemperature) > 50) {
            newErrors.weatherTemperature = "Temperature cannot be higher than 50°C";
            firstErrorMessage = "Temperature cannot be higher than 50°C";
        }

        // New validations for compostType & fertilizerType
        if (form.compostAdded && !form.compostType.trim()) {
            newErrors.compostType = "Compost Type is required when compost is added";
            if (!firstErrorMessage) firstErrorMessage = "Compost Type is required when compost is added";
        }

        if (form.fertilizerAdded && !form.fertilizerType.trim()) {
            newErrors.fertilizerType = "Fertilizer Type is required when fertilizer is added";
            if (!firstErrorMessage) firstErrorMessage = "Fertilizer Type is required when fertilizer is added";
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            setErrorDescription(firstErrorMessage);
            setShowErrorPopup(true);
            if (popupRef.current) popupRef.current.showModal();
            return; // Stop submission
        }

        setErrors({});
        setShowErrorPopup(false);
        setErrorDescription("");

        // Proceed with submission logic
        const data = {
            weather: {
                temperature: Number(form.weatherTemperature),
                condition: form.weatherCondition,
            },
            actions: {
                waterToday: form.waterToday,
                compostAdded: form.compostAdded,
                compostType: form.compostType,
                fertilizerAdded: form.fertilizerAdded,
                fertilizerType: form.fertilizerType,
            },
            health: {
                diseaseType: form.diseaseType,
                diseaseOtherDescription:
                    form.diseaseType === "OTHER" ? form.diseaseOtherDescription : "",
                soilCondition: form.soilCondition,
            },
            extraNotes: form.extraNotes,
        };

        // TO-DO: Submit the data to the blockchain or API

        console.log("Form submitted successfully:", data);

        // Show success popup
        setShowSuccessPopup(true);
        if (successPopupRef.current) successPopupRef.current.showModal();
    };

    const handlePopupConfirm = () => {
        setShowErrorPopup(false);
        if (popupRef.current) popupRef.current.close();
    };

    const handleSuccessPopupConfirm = () => {
        setShowSuccessPopup(false);
        if (successPopupRef.current) successPopupRef.current.close();
        // Optionally, redirect or reset form
        setRecordedToday(true);
    };

    useEffect(() => {
        setTimeout(() => {
            setLoading(false);
        }, 1000);
        // TO-DO: Check if the daily report has been recorded today

    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <LoadingStatic />
            </div>
        );
    }

    if (recordedToday) {
        return (
            <div className="flex justify-center flex-col w-full gap-2 min-h-[70vh]">
                <img src={DataRecorded} alt="Daily Report Already Recorded" className="w-1/2 h-1/2 mx-auto" />
                <h2 className="text-xl font-bold text-center">Daily report recorded</h2>
                <h3 className="text-center">You have submitted your report recently.</h3>
                <Button
                    className="w-full mx-auto"
                    noMax
                    background="#0F7275"
                    color="#F7FAFC"
                    label={"Go Back"}
                    onClick={() => navigate("/centra/dashboard")}
                />
            </div>
        );
    }



    return (
        <div className="w-full">
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <h2 className="text-xl font-bold">Weather</h2>
                <div className="flex flex-col gap-4 col-span-2 justify-center">
                    <InputField
                        maxNum={50}
                        label="Weather Temperature (°C)"
                        name="weatherTemperature"
                        type="number"
                        value={form.weatherTemperature}
                        onChange={handleChange}
                        required
                    />
                    <DropdownField
                        label="Weather Condition"
                        name="weatherCondition"
                        value={form.weatherCondition}
                        onChange={handleChange}
                        required
                        options={weatherOptions}
                    />
                </div>
                <hr className="text-[#79B2B7]"></hr>
                <h2 className="text-xl font-bold">Daily Actions</h2>
                <CheckboxField
                    label="Watered Today"
                    name="waterToday"
                    checked={form.waterToday}
                    onChange={handleChange}
                    required
                />
                <div className="flex flex-col gap-2 col-span-2">
                    <CheckboxField
                        label="Compost Added"
                        name="compostAdded"
                        checked={form.compostAdded}
                        onChange={handleChange}
                        required
                    />
                    {form.compostAdded && (
                        <InputField
                            label="Compost Type"
                            name="compostType"
                            type="text"
                            value={form.compostType}
                            onChange={handleChange}
                            required
                        />
                    )}
                </div>

                <div className="flex flex-col gap-2 col-span-2">
                    <CheckboxField
                        label="Fertilizer Added"
                        name="fertilizerAdded"
                        checked={form.fertilizerAdded}
                        onChange={handleChange}
                        required
                    />
                    {form.fertilizerAdded && (
                        <InputField
                            label="Fertilizer Type"
                            name="fertilizerType"
                            type="text"
                            value={form.fertilizerType}
                            onChange={handleChange}
                            required
                        />
                    )}
                </div>
                <hr className="text-[#79B2B7]"></hr>
                <h2 className="text-xl font-bold">Health Status</h2>
                <DropdownField
                    label="Disease Type"
                    name="diseaseType"
                    value={form.diseaseType}
                    onChange={handleChange}
                    required
                    options={diseaseOptions}
                />
                {form.diseaseType === "OTHER" && (
                    <InputField
                        label="Disease Description"
                        name="diseaseOtherDescription"
                        type="text"
                        value={form.diseaseOtherDescription}
                        onChange={handleChange}
                        required
                    />
                )}
                <DropdownField
                    label="Soil Condition"
                    name="soilCondition"
                    value={form.soilCondition}
                    onChange={handleChange}
                    required
                    options={soilOptions}
                />
                <TextareaField
                    label="Extra Notes"
                    name="extraNotes"
                    type="textarea"
                    value={form.extraNotes}
                    onChange={handleChange}
                />

                <Button type={"submit"} noMax background="#0F7275" color="#F7FAFC" label={"Submit"} onClick={() => { }}></Button>
            </form>
            {/* Popup for errors */}
            <Popup
                ref={popupRef}
                error={true}
                description={errorDescription}
                onConfirm={handlePopupConfirm}
                leavesid="error_modal"
            />
            {/* Popup for success */}
            <Popup
                ref={successPopupRef}
                success={true}
                description="Daily report submitted successfully!"
                onConfirm={handleSuccessPopupConfirm}
                leavesid="success_modal"
                open={showSuccessPopup}
            />
        </div>
    );
};

export default DailyReportCentra;
