import React, { useContext } from 'react';
import Fab from '@mui/material/Fab';
import { Summarize } from '@mui/icons-material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import Badge from '@mui/material/Badge';
import { useNavigate } from 'react-router';
import { ValueContext } from '../pages/Centra/CentraLayout';

const theme = createTheme({
    palette: {
        primary: {
            main: '#0F7275',
        },
    },
});

export default function DailyReportComponent({recordedToday = true}) {
    const { value, setValue } = useContext(ValueContext);
    
    const navigate = useNavigate();
    const handleClick = () => {
        setValue("Daily Report");
        navigate('/centra/daily-report');
    };

    // Set badge content and color based on recordedToday
    const badgeProps = recordedToday
        ? { badgeContent: <span>&#10003;</span>, color: "success" } // checkmark and green
        : { badgeContent: "!", color: "error" };

    return (
        <ThemeProvider theme={theme}>
            {!recordedToday &&
                <div role="alert" className="alert alert-error">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 shrink-0 stroke-current"
                        fill="none"
                        viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>You haven't done your daily report today.</span>
                </div>
            }
            <div style={{ position: 'fixed', bottom: '75px', right: '16px', zIndex: '1000' }}>
                <Badge {...badgeProps}>
                    <Fab color="primary" aria-label="add" onClick={handleClick}>
                        <Summarize />
                    </Fab>
                </Badge>
            </div>
        </ThemeProvider>
    );
}