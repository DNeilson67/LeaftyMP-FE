import React, { useState, useEffect } from 'react';
import { Scanner, useDevices } from '@yudiel/react-qr-scanner';
import ScanResultsDrawer from '@components/ScanResultsDrawer';
import './scanner.css'; 

function XYZScanner() {
    const [selectedDeviceId, setSelectedDeviceId] = useState(null);
    const [data, setData] = useState('');
    const [open, setOpen] = useState(false);
    const devices = useDevices();

    const handleDeviceChange = (event) => {
        setSelectedDeviceId(event.target.value);
    };

    const handleError = (error) => {
        console.error(error?.message);
    };

    const handleToggleDrawer = (isOpen) => () => {
        setOpen(isOpen);
    };

    useEffect(() => {
        if (data) {
            setOpen(true);
        }
    }, [data]);

    return (
        <div>
            {devices.length > 0 && (
                <div style={{ marginBottom: '10px' }}>
                    <label htmlFor="cameraSelect">Select Camera:</label>
                    <select id="cameraSelect" onChange={handleDeviceChange} value={selectedDeviceId || devices[0].deviceId}>
                        {devices.map((device) => (
                            <option key={device.deviceId} value={device.deviceId}>
                                {device.label}
                            </option>
                        ))}
                    </select>
                </div>
            )}
            <div className="scanner-container">
                <Scanner
                    onResult={(text) => setData(text)}
                    onError={handleError}
                    options={{ deviceId: selectedDeviceId }}
                />
            </div>
            <ScanResultsDrawer 
                open={open} 
                toggleDrawer={handleToggleDrawer} 
                data={data}
                companyMode
            />
        </div>
    );
}

export default XYZScanner;
