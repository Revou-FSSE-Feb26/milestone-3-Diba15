"use client";

import { createContext, useContext, ReactNode, useState, useCallback, useMemo } from "react";
import Toast from "@/components/ui/Toast";
import Modal from "@/components/ui/Modal";

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

    const triggerToast = useCallback((message: string, type: 'success' | 'error' | 'warning') => {
        const newToast: ToastItem = {
            // Fallback aman jika browser/environment tidak mendukung crypto
            id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Date.now().toString(),
            message,
            type,
        };

        setToasts((prev) => {
            const next = [...prev, newToast];
            return next.length > 3 ? next.slice(next.length - 3) : next;
        });
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, []);

    const clearToast = useCallback(() => {
        setToasts([]);
    }, []);

    const clearModal = useCallback(() => {
        setModalConfig((prev) => ({ ...prev, showModal: false }));
    }, []);

    const triggerModal = useCallback((
        msg: string,
        modalType: 'confirmation' | 'alert',
        yesAction?: () => void,
        noAction?: () => void
    ) => {
        setModalConfig({
            showModal: true,
            modalMsg: msg,
            modalType: modalType,
            yesAction: () => {
                if (yesAction) yesAction();
                // Menggunakan functional update langsung agar tidak bergantung pada fungsi clearModal eksternal
                setModalConfig((prev) => ({ ...prev, showModal: false }));
            },
            noAction: () => {
                if (noAction) noAction();
                setModalConfig((prev) => ({ ...prev, showModal: false }));
            }
        });
    }, []);

    const contextValue = useMemo(() => ({
        triggerToast,
        clearToast,
        removeToast,
        triggerModal,
        clearModal
    }), [triggerToast, clearToast, removeToast, triggerModal, clearModal]);

    return (
        <NotifContext.Provider value={contextValue}>
            {children}
            {/* TOAST CONTAINER */}
            <div className="fixed top-4 right-4 z-50 flex flex-col gap-2">
                {toasts.map((toast) => (
                    <Toast
                        key={toast.id}
                        id={toast.id}
                        message={toast.message}
                        type={toast.type}
                        onClose={() => removeToast(toast.id)}
                    />
                ))}
            </div>

            {/* MODAL CONTAINER */}
            {modalConfig.showModal && (
                <Modal
                    msg={modalConfig.modalMsg}
                    modalType={modalConfig.modalType}
                    yesAction={modalConfig.yesAction}
                    noAction={modalConfig.noAction}
                />
            )}
        </NotifContext.Provider>
    )
}

export function useNotif() {
    const context = useContext(NotifContext);
    if (!context) throw new Error("useNotif must be used within a NotifProvider");
    return context;
}