import React, { useState, useEffect } from "react";

export default function SuccessMessage({ message, duration }) {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timerId = setTimeout(() => {
            setIsVisible(false);
        }, duration);

        return () => {
            clearTimeout(timerId);
        };
    }, [duration]);

    return (
        <>
            {isVisible && message && (
                <div className="text-green-700 p-1">
                    <span className="font-semibold">Success : </span>
                    <span>{message}</span>
                </div>
            )}
        </>
    );
}
