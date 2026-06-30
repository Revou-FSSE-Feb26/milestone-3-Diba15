"use client";

import { createContext, useContext, ReactNode, useReducer, useCallback, useMemo } from "react";
import Toast from "@/components/ui/Toast";
import Modal from "@/components/ui/Modal";

interface ToastItem {
  id: string;
  message: string;
  type: "success" | "error" | "warning" | "promise";
}

interface ModalConfig {
  showModal: boolean;
  modalMsg: string;
  modalType: "confirmation" | "alert";
  yesAction: () => void;
  noAction: () => void;
}

interface NotifState {
  toasts: ToastItem[];
  modal: ModalConfig;
}

type NotifAction =
  | { type: "ADD_TOAST"; payload: ToastItem }
  | { type: "REMOVE_TOAST"; payload: { id: string } }
  | { type: "CLEAR_TOASTS" }
  | { type: "SHOW_MODAL"; payload: Omit<ModalConfig, "showModal"> }
  | { type: "HIDE_MODAL" };

const initialState: NotifState = {
  toasts: [],
  modal: {
    showModal: false,
    modalMsg: "",
    modalType: "alert",
    yesAction: () => { },
    noAction: () => { },
  },
};

function notifReducer(state: NotifState, action: NotifAction): NotifState {
  switch (action.type) {
    case "ADD_TOAST": {
      const nextToasts = [...state.toasts, action.payload];
      // Batasi maksimal hanya 3 toast yang muncul bersamaan di layar
      const limitedToasts = nextToasts.length > 3 ? nextToasts.slice(nextToasts.length - 3) : nextToasts;
      return { ...state, toasts: limitedToasts };
    }
    case "REMOVE_TOAST":
      return {
        ...state,
        toasts: state.toasts.filter((toast) => toast.id !== action.payload.id),
      };
    case "CLEAR_TOASTS":
      return { ...state, toasts: [] };

    case "SHOW_MODAL":
      return {
        ...state,
        modal: {
          showModal: true,
          ...action.payload,
        },
      };
    case "HIDE_MODAL":
      return {
        ...state,
        modal: {
          ...state.modal,
          showModal: false,
        },
      };
    default:
      return state;
  }
}

interface NotifContextValue {
  triggerToast: (message: string, type: "success" | "error" | "warning" | "promise") => void;
  clearToast: () => void;
  removeToast: (id: string) => void;
  triggerModal: (message: string, type: "confirmation" | "alert", yesAction?: () => void, noAction?: () => void) => void;
  clearModal: () => void;
}

const NotifContext = createContext<NotifContextValue | null>(null);

export function NotifProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(notifReducer, initialState);

  // Fungsi pembungkus (Action Creators) untuk Toast
  const triggerToast = useCallback((message: string, type: "success" | "error" | "warning" | "promise") => {
    const id = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    dispatch({
      type: "ADD_TOAST",
      payload: { id, message, type },
    });
  }, []);

  const removeToast = useCallback((id: string) => {
    dispatch({ type: "REMOVE_TOAST", payload: { id } });
  }, []);

  const clearToast = useCallback(() => {
    dispatch({ type: "CLEAR_TOASTS" });
  }, []);

  const clearModal = useCallback(() => {
    dispatch({ type: "HIDE_MODAL" });
  }, []);

  // Fungsi pembungkus untuk mengorkestrasi callback internal Modal sebelum menutup state
  const triggerModal = useCallback((
    msg: string,
    modalType: "confirmation" | "alert",
    yesAction?: () => void,
    noAction?: () => void
  ) => {
    dispatch({
      type: "SHOW_MODAL",
      payload: {
        modalMsg: msg,
        modalType,
        yesAction: () => {
          if (yesAction) yesAction();
          dispatch({ type: "HIDE_MODAL" }); // Otomatis sembunyikan modal setelah aksi dijalankan
        },
        noAction: () => {
          if (noAction) noAction();
          dispatch({ type: "HIDE_MODAL" }); // Otomatis sembunyikan modal setelah pembatalan
        },
      },
    });
  }, []);

  const contextValue = useMemo(() => ({
    triggerToast,
    clearToast,
    removeToast,
    triggerModal,
    clearModal,
  }), [triggerToast, clearToast, removeToast, triggerModal, clearModal]);

  return (
    <NotifContext.Provider value={contextValue}>
      {children}
      {/* Area Render Toast Stack */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 w-full max-w-sm px-4 sm:px-0">
        {state.toasts.map((toast) => (
          <Toast
            key={toast.id}
            id={toast.id}
            message={toast.message}
            type={toast.type}
            onClose={() => removeToast(toast.id)}
          />
        ))}
      </div>
      {/* Area Render Modal Dialog */}
      {state.modal.showModal && (
        <Modal
          msg={state.modal.modalMsg}
          modalType={state.modal.modalType}
          yesAction={state.modal.yesAction}
          noAction={state.modal.noAction}
        />
      )}
    </NotifContext.Provider>
  );
}

export function useNotif() {
  const context = useContext(NotifContext);
  if (!context) {
    throw new Error("useNotif must be used inside a <NotifProvider>");
  }
  return context;
}
