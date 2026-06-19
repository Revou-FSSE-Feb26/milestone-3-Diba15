import { useEffect, useState, useRef, useCallback } from "react";
import { CheckCircle, XCircle, AlertTriangle, AlertCircle, Info, X } from 'lucide-react';

interface ToastProps {
    id: string;
    message: string;
    type: 'success' | 'error' | 'warning' | 'promise';
    onClose: () => void;
}

// Diletakkan di luar komponen agar tidak dibuat ulang setiap render
const TOAST_CONFIG = {
    success: { color: 'bg-green-500', icon: CheckCircle },
    error: { color: 'bg-red-500', icon: XCircle },
    warning: { color: 'bg-yellow-500', icon: AlertCircle },
    promise: { color: 'bg-gray-500', icon: AlertTriangle },
};

export default function Toast({ id, message, type, onClose }: ToastProps) {
    const [isAnimate, setIsAnimate] = useState(false);
    // useRef untuk menyimpan ID timer agar bisa dibatalkan saat di-hover
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const handleClose = useCallback(() => {
        setIsAnimate(false);
        setTimeout(() => {
            onClose();
        }, 300);
    }, [onClose]);

    // Fungsi untuk memulai hitungan mundur 3 detik
    const startTimer = useCallback(() => {
        timerRef.current = setTimeout(() => {
            handleClose();
        }, 3000);
    }, [handleClose]);

    // Fungsi untuk menghentikan hitungan mundur (saat di-hover)
    const clearTimer = useCallback(() => {
        if (timerRef.current) clearTimeout(timerRef.current);
    }, []);

    useEffect(() => {
        const frame = requestAnimationFrame(() => setIsAnimate(true));
        startTimer();

        return () => {
            cancelAnimationFrame(frame);
            clearTimer();
        };
    }, [startTimer, clearTimer]);

    // Mengambil konfigurasi warna dan ikon dengan fallback default
    const { color: bgColor, icon: Icon } = TOAST_CONFIG[type] || { color: 'bg-gray-500', icon: Info };

    return (
        <div 
            id={id}
            role="alert"
            onMouseEnter={clearTimer}
            onMouseLeave={startTimer}
            className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-white shadow-lg transition-all duration-300 ease-in-out transform ${bgColor} ${
                isAnimate ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0"
            }`}
        >
            <div className="flex items-center gap-3">
                <Icon className="h-5 w-5 shrink-0" />
                <span className="max-w-xs text-sm font-medium leading-snug truncate">{message}</span>
            </div>
            
            <button 
                onClick={handleClose}
                className="ml-4 shrink-0 rounded-full p-1 opacity-80 transition-opacity hover:bg-white/20 hover:opacity-100 cursor-pointer"
                aria-label="Close notification"
            >
                <X className="h-4 w-4" />
            </button>
        </div>
    );
}