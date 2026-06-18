import { useEffect, useState } from "react";
import { CheckCircle, XCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';

interface ToastProps {
    id: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'promise';
    onClose: () => void;
}

export default function Toast({ id, message, type, onClose }: ToastProps) {
    const [isAnimate, setIsAnimate] = useState(false);

    const handleClose = () => {
        setIsAnimate(false);

        setTimeout(() => {
            onClose();
        }, 300);
    };

    useEffect(() => {
        const startTimeout = setTimeout(() => setIsAnimate(true), 10);

        const autoCloseTimeout = setTimeout(() => {
            handleClose();
        }, 3000);

        return () => {
            clearTimeout(startTimeout);
            clearTimeout(autoCloseTimeout);
        };
    }, []);

    const bgColor = () => {
        switch (type) {
            case 'success':
                return 'bg-green-500';
            case 'error':
                return 'bg-red-500';
            case 'warning':
                return 'bg-yellow-500';
            case 'promise':
                return 'bg-gray-500';
            default:
                return 'bg-gray-500';
        }
    };

    const iconType = () => {
        switch (type) {
            case 'success':
                return <CheckCircle />;
            case 'error':
                return <XCircle />;
            case 'warning':
                return <AlertCircle />;
            case 'promise':
                return <AlertTriangle />;
            default:
                return <Info />;
        }
    };

    return (
        <div id={id}
            className={`flex justify-between items-center w-full ${bgColor()} text-white px-4 py-2 rounded-lg shadow-lg 
            transition-all duration-300 ease-in-out transform
            ${isAnimate ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0"}`}
        >
            <div className="flex gap-2 items-center">
                {iconType()}
                <span className="truncate max-w-xs">{message}</span>
            </div>
            <i className="fas fa-times ml-4 cursor-pointer hover:opacity-70 transition-opacity" onClick={handleClose}></i>
        </div>
    );
}