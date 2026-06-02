import { useCart } from "@/context/CartContext";
import { useEffect, useState } from "react";

export default function Toast({ message, type }: { message: string; type: 'success' | 'error' | 'warning'; }) {
    const { clearToast } = useCart();
    const [isAnimate, setIsAnimate] = useState(false);

    const handleClose = () => {
        setIsAnimate(false);

        setTimeout(() => {
            clearToast();
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
            default:
                return 'bg-gray-500';
        }
    };

    return (
        <div
            className={`flex justify-between items-center fixed top-4 right-4 z-999 ${bgColor()} text-white px-4 py-2 rounded-lg shadow-lg 
            transition-all duration-300 ease-in-out transform
            ${isAnimate ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0"}`}
        >
            <span>{message}</span>
            <i className="fas fa-times ml-4 cursor-pointer hover:opacity-70 transition-opacity" onClick={handleClose}></i>
        </div>
    );
}