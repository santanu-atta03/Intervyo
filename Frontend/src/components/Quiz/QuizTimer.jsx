import React, { useEffect } from 'react';
import { Clock } from 'lucide-react';

const QuizTimer = ({ timeRemaining, setTimeRemaining, onTimeUp, isPaused }) => {
    useEffect(() => {
        if (isPaused || timeRemaining <= 0) return;

        const timer = setInterval(() => {
            setTimeRemaining((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    onTimeUp();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [timeRemaining, isPaused, onTimeUp, setTimeRemaining]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    const isLowTime = timeRemaining <= 10;

    return (
        <div className={`flex items-center gap-2 font-mono font-bold text-xl ${isLowTime ? 'text-red-500 animate-pulse' : 'text-gray-700 dark:text-gray-200'}`}>
            <Clock className="w-5 h-5" />
            <span>{formatTime(timeRemaining)}</span>
        </div>
    );
};

export default QuizTimer;
