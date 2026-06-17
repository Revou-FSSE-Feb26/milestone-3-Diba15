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

interface NotifContextType {
    triggerToast: (message: string, type: "success" | "error" | "warning") => void;
    clearToast: () => void;
    triggerModal: (message: string, type: "confirmation" | "alert", yesAction?: () => void, noAction?: () => void) => void;
    clearModal: () => void;
}

const NotifContext = createContext<NotifContextType | null>(null);

export function NotifProvider({ children }: { children: ReactNode }) {
    const [showToast, setShowToast] = useState(false);
    const [message, setMessage] = useState("");
    const [type, setType] = useState<"success" | "error" | "warning">("success");
    const toastTimeout = useRef<NodeJS.Timeout | null>(null);
    const [modalConfig, setModalConfig] = useState({
        showModal: false,
        modalMsg: '',
        modalType: 'alert' as 'confirmation' | 'alert',
        yesAction: () => { },
        noAction: () => { },
    });

    const triggerToast = (message: string, type: 'success' | 'error' | 'warning') => {
        setMessage(message);
        setType(type);
        setShowToast(true);

        if (toastTimeout.current) clearTimeout(toastTimeout.current);

        toastTimeout.current = setTimeout(() => {
            setShowToast(false);
            toastTimeout.current = null;
        }, 3000);
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
        setShowToast(false);
        if (toastTimeout.current) {
            clearTimeout(toastTimeout.current);
            toastTimeout.current = null;
        }
    }

    return (
        <NotifContext.Provider value={{
            triggerToast, clearToast, triggerModal, clearModal
        }}>
            {children}
            {showToast && <Toast message={message} type={type} />}
            {modalConfig.showModal && <Modal msg={modalConfig.modalMsg} modalType={modalConfig.modalType} yesAction={modalConfig.yesAction} noAction={modalConfig.noAction} />}
        </NotifContext.Provider>
    )
}

export function useNotif() {
    const context = useContext(NotifContext);
    if (!context) throw new Error("useNotif must be used within a NotifProvider");
    return context;
}