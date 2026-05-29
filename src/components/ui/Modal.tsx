import { useEffect, useState } from "react";

interface ModalProps {
    msg: string;
    modalType: 'confirmation' | 'alert';
    yesAction?: () => void;
    noAction?: () => void;
}

export default function Modal({ msg, modalType, yesAction, noAction }: ModalProps) {
    const [isAnimate, setIsAnimate] = useState(false);

    useEffect(() => {
        const timeout = setTimeout(() => setIsAnimate(true), 10);
        return () => clearTimeout(timeout);
    }, []);

    const handleClose = (action?: () => void) => {
        setIsAnimate(false);

        setTimeout(() => {
            if (action) action();
        }, 300);
    };

    return (
        <div
            className={`fixed inset-0 bg-black/50 flex items-center justify-center z-50 transition-opacity duration-300 ease-in-out ${isAnimate ? "opacity-100" : "opacity-0"
                }`}
        >
            <div
                className={`bg-white rounded-lg p-6 w-80 text-center transform transition-all duration-300 ease-in-out ${isAnimate ? "scale-100 opacity-100" : "scale-95 opacity-0"
                    }`}
            >
                <p className={"mb-4"}>{msg}</p>
                <div className={"flex justify-center gap-4"}>
                    {modalType === 'confirmation' ? (
                        <>
                            <button
                                onClick={() => handleClose(yesAction)}
                                className={"bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition-colors"}
                            >
                                Yes
                            </button>
                            <button
                                onClick={() => handleClose(noAction)}
                                className={"bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition-colors"}
                            >
                                No
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => handleClose(yesAction)}
                            className={"bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"}
                        >
                            OK
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}