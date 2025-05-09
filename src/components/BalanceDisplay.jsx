import React, { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const BalanceDisplay = () => {
    const [isMasked, setIsMasked] = useState(true);

    const toggleMask = () => {
        setIsMasked(!isMasked);
    };

    return (
        <div className="balance-display flex items-center">
            <span
                style={{
                    fontFamily: 'Montserrat',
                    fontSize: '20px',
                    fontWeight: 600,
                    lineHeight: '36.57px',
                    letterSpacing: '0.02em',
                    textAlign: 'left'
                }}
            >
                Rp
            </span>
            <span
                style={{
                    fontFamily: 'Montserrat',
                    fontSize: '25px',
                    fontWeight: 600,
                    lineHeight: '36.57px',
                    letterSpacing: '0.02em',
                    textAlign: 'left',
                    marginLeft: '8px',
                    marginRight: '8px'
                }}
            >
                {isMasked ? '************' : '100,000,000'}
            </span>
            <button onClick={toggleMask} className="toggle-button">
                {isMasked ? <FaEyeSlash color="#C0CD30" /> : <FaEye color="#C0CD30" />}
            </button>
        </div>
    );
};

export default BalanceDisplay;
