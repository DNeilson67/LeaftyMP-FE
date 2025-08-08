export default function ThreeDotsLoading({ size = "lg", color = "#0F7275" }) {
    // Map for different sizes
    const sizeMap = {
        xs: { width: "24px", height: "24px" },
        sm: { width: "45px", height: "45px" },
        md: { width: "60px", height: "60px" },
        lg: { width: "75px", height: "75px" },
        xl: { width: "90px", height: "90px" },
    };

    // Use default size values if the provided size is not valid
    const { width, height } = sizeMap[size] || sizeMap.xl;

    return (
        <span
            className={`loading loading-dots loading-${size}`}
            style={{ color: color, marginBottom: "-5px", width: width, height: height }}
        ></span>
    );
}
