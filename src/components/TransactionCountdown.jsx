import { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

export default function TransactionCountdown({ expiresAt }) {
    const [timeLeft, setTimeLeft] = useState(() => getTimeLeft(new Date(expiresAt)));

    useEffect(() => {
        const interval = setInterval(() => {
            const newTimeLeft = getTimeLeft(new Date(expiresAt));

            if (newTimeLeft.total <= 0) {
                clearInterval(interval);
                setTimeLeft({ hours: 0, minutes: 0, seconds: 0, total: 0 });
            } else {
                setTimeLeft(newTimeLeft);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [expiresAt]);

    const isExpired = timeLeft.total <= 0;

    return (
        <div
            className={`flex items-center gap-4 p-4 rounded-lg w-full border 
        ${isExpired
                    ? 'bg-red-50 text-red-800 border-red-200'
                    : 'bg-yellow-50 text-yellow-800 border-yellow-200'
                }`}
        >
            <Clock className="w-6 h-6" />
            <div>

                {isExpired ? (
                    <div className="text-xl">Transaction expired</div>
                ) : (
                    <>
                        <p className="text-sm font-medium">Payment Due in</p>
                        <div className="text-2xl font-bold countdown font-mono">
                            <span style={{ '--value': timeLeft.hours }}></span>:
                            <span style={{ '--value': timeLeft.minutes }}></span>:
                            <span style={{ '--value': timeLeft.seconds }}></span>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

function getTimeLeft(targetDate) {
    const now = new Date();
    const diff = Math.max(0, Math.floor((targetDate - now) / 1000)); // seconds
    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    const seconds = diff % 60;
    return { hours, minutes, seconds, total: diff };
}
