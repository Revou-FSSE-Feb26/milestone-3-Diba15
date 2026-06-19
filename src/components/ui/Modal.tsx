import { useEffect, useState, useCallback } from "react";

interface ModalProps {
    msg: string;
    modalType: 'confirmation' | 'alert';
    yesAction?: () => void;
    noAction?: () => void;
}

export default function Modal({ msg, modalType, yesAction, noAction }: ModalProps) {
    const [isAnimate, setIsAnimate] = useState(false);

    // Membungkus handleClose dengan useCallback agar referensinya stabil saat digunakan di useEffect
    const handleClose = useCallback((action?: () => void) => {
        setIsAnimate(false);

        // Menunggu transisi CSS keluar selesai sebelum mengeksekusi aksi pembatalan/penutupan
        setTimeout(() => {
            if (action) action();
        }, 300);
    }, []);

    useEffect(() => {
        // requestAnimationFrame untuk memicu transisi masuk CSS dengan mulus
        const frame = requestAnimationFrame(() => setIsAnimate(true));

        // Event handler untuk menutup modal via tombol Escape
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") {
                handleClose(noAction);
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        // Pembersihan event listener saat komponen lepas dari DOM (unmount)
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [noAction, handleClose]);

    return (
        <div
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 transition-opacity duration-300 ease-in-out ${
                isAnimate ? "opacity-100" : "opacity-0"
            }`}
            role="dialog"
            aria-modal="true"
            onClick={() => handleClose(noAction)} // Menutup modal saat area backdrop gelap diklik
        >
            <div
                className={`w-80 transform rounded-2xl bg-white p-6 text-center shadow-xl transition-all duration-300 ease-in-out ${
                    isAnimate ? "scale-100 opacity-100" : "scale-95 opacity-0"
                }`}
                onClick={(e) => e.stopPropagation()} // Mencegah modal tertutup saat area putih diklik
            >
                <p className="mb-6 text-gray-800 font-medium">{msg}</p>
                
                <div className="flex justify-center gap-3">
                    {modalType === 'confirmation' ? (
                        <>
                            <button
                                type="button"
                                onClick={() => handleClose(noAction)}
                                className="rounded-xl bg-gray-100 px-5 py-2.5 text-sm font-bold text-gray-700 transition-colors hover:bg-gray-200 cursor-pointer"
                            >
                                No
                            </button>
                            <button
                                type="button"
                                onClick={() => handleClose(yesAction)}
                                className="rounded-xl bg-accent px-5 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-accent/90 cursor-pointer"
                            >
                                Yes
                            </button>
                        </>
                    ) : (
                        <button
                            type="button"
                            onClick={() => handleClose(yesAction)}
                            className="rounded-xl bg-primary px-8 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-primary/90 cursor-pointer"
                        >
                            OK
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}