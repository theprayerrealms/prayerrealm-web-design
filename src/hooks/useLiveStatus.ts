import { useState, useEffect } from 'react';

// Nigeria Time is UTC+1.
export const getNigeriaTime = () => {
    const now = new Date();
    // Get UTC time and add 1 hour (3600000 ms)
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    return new Date(utc + 3600000);
};

export const isSecondSaturday = (date: Date) => {
    const day = date.getDate();
    const dayOfWeek = date.getDay(); // 0 is Sunday, 6 is Saturday
    // 2nd Saturday must fall within the range of 8th to 14th
    return dayOfWeek === 6 && day >= 8 && day <= 14;
};

export const checkIsLive = () => {
    const njTime = getNigeriaTime();
    const day = njTime.getDay();
    const hours = njTime.getHours();

    // Daily 11 PM to 1 AM (Nigeria Time)
    // 11 PM is 23, 12 AM is 0, 1 AM is 1. (ends before 1 AM)
    const isDailyLive = (hours >= 23 || hours < 1);

    // 2nd Saturday 7 AM to 12 PM (Nigeria Time)
    const is2ndSatLive = isSecondSaturday(njTime) && (hours >= 7 && hours < 12);

    return isDailyLive || is2ndSatLive;
};

export const useLiveStatus = () => {
    const [isLive, setIsLive] = useState(checkIsLive());

    useEffect(() => {
        const interval = setInterval(() => {
            setIsLive(checkIsLive());
        }, 30000); // Check every 30 seconds

        return () => clearInterval(interval);
    }, []);

    return isLive;
};
