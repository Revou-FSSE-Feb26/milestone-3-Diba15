"use client";

import { createContext, useContext, useReducer, ReactNode, useState, useEffect, useRef } from "react";
import Toast from "@/components/ui/Toast";
import Modal from "@/components/ui/Modal";

// type NotifAction =
//     | { type: "TRIGGER_TOAST"; payload: { message: string; type: "success" | "error" | "warning" } }
//     | { type: "CLEAR_TOAST" }
//     | { type: "TRIGGER_MODAL", payload: { message: string; type: "confirmation" | "alert" } }
//     | { type: "CLEAR_MODAL" };


// function notifReducer(state: any, action: NotifAction): any {
//     switch (action.type) {
//         case "TRIGGER_TOAST":
//             return { ...state, showToast: true, msg: action.payload.message, toastType: action.payload.type };
//         case "CLEAR_TOAST":
//             return { ...state, showToast: false, msg: "", toastType: "success" };
//         case "TRIGGER_MODAL":
//             return { ...state, showModal: true, msg: action.payload.message, modalType: action.payload.type };
//         case "CLEAR_MODAL":
//             return { ...state, showModal: false, msg: "", modalType: "confirmation" };
//         default:
//             return state;
//     }
// }

interface ToastItem {
    id: string;
    message: string;
    type: "success" | "error" | "warning";
}

interface NotifContextType {
    triggerToast: (message: string, type: "success" | "error" | "warning") => void;
    clearToast: () => void;
    removeToast: (id: string) => void;
    triggerModal: (message: string, type: "confirmation" | "alert", yesAction?: () => void, noAction?: () => void) => void;
    clearModal: () => void;
}

const NotifContext = createContext<NotifContextType | null>(null);

export function NotifProvider({ children }: { children: ReactNode }) {
    const [toasts, setToasts] = useState<ToastItem[]>([]);
    const [modalConfig, setModalConfig] = useState({
        showModal: false,
        modalMsg: '',
        modalType: 'alert' as 'confirmation' | 'alert',
        yesAction: () => { },
        noAction: () => { },
    });

    const triggerToast = (message: string, type: 'success' | 'error' | 'warning') => {
        const newToast: ToastItem = {
            id: crypto.randomUUID(),
            message,
            type,
        };

        setToasts((prev) => {
            const next = [...prev, newToast];
            return next.length > 3 ? next.slice(next.length - 3) : next;
        });
    };

    const removeToast = (id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    };

    const triggerModal = (msg: string, modalType: 'confirmation' | 'alert', yesAction?: () => void, noAction?: () => void) => {
        setModalConfig({
            showModal: true,
            modalMsg: msg,
            modalType: modalType,
            yesAction: (() => {
                if (yesAction) yesAction();
                clearModal();
            }),
            noAction: (() => {
                if (noAction) noAction();
                clearModal();
            })
        });
    };

    const clearModal = () => {
        setModalConfig((prev) => ({ ...prev, showModal: false }));
    };

    const clearToast = () => {
        setToasts([]);
    };

    return (
        <NotifContext.Provider value={{
            triggerToast, clearToast, removeToast, triggerModal, clearModal
        }}>
            {children}
            <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
                {toasts.map((toast) => (
                    <Toast key={toast.id} id={toast.id} message={toast.message} type={toast.type} onClose={() => removeToast(toast.id)} />
                ))}
            </div>
            {modalConfig.showModal && <Modal msg={modalConfig.modalMsg} modalType={modalConfig.modalType} yesAction={modalConfig.yesAction} noAction={modalConfig.noAction} />}
        </NotifContext.Provider>
    )
}

export function useNotif() {
    const context = useContext(NotifContext);
    if (!context) throw new Error("useNotif must be used within a NotifProvider");
    return context;
}