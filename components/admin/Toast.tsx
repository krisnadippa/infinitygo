"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { CheckCircle2, XCircle, AlertCircle, Info, X } from "lucide-react";

type ToastType = "success" | "error" | "info" | "warning";

interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: ToastType = "success") => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, type, message }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  useEffect(() => {
    if (typeof window === "undefined") return;
    const originalAlert = window.alert;
    
    window.alert = (message: string) => {
      const msg = String(message);
      const lower = msg.toLowerCase();
      let type: ToastType = "info";
      
      if (lower.includes("gagal") || lower.includes("error") || lower.includes("tidak valid") || lower.includes("salah")) {
        type = "error";
      } else if (lower.includes("maksimal") || lower.includes("harap") || lower.includes("warning") || lower.includes("perhatian")) {
        type = "warning";
      } else if (lower.includes("berhasil") || lower.includes("sukses") || lower.includes("saved") || lower.includes("success") || lower.includes("dihapus")) {
        type = "success";
      }
      
      showToast(msg, type);
    };

    return () => {
      window.alert = originalAlert;
    };
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      
      {/* Toast Container */}
      <div className="fixed top-4 right-4 z-[9999] flex flex-col gap-2 max-w-md w-full sm:w-auto pointer-events-none">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

const ToastItem = ({ toast, onClose }: { toast: ToastMessage; onClose: (id: string) => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(toast.id);
    }, 2500); // 2.5 seconds timeout (as requested)
    return () => clearTimeout(timer);
  }, [toast.id, onClose]);

  const config = {
    success: {
      bg: "bg-emerald-50 border-emerald-200 text-emerald-800",
      icon: <CheckCircle2 className="text-emerald-500 flex-shrink-0" size={18} />,
    },
    error: {
      bg: "bg-rose-50 border-rose-200 text-rose-800",
      icon: <XCircle className="text-rose-500 flex-shrink-0" size={18} />,
    },
    warning: {
      bg: "bg-amber-50 border-amber-200 text-amber-800",
      icon: <AlertCircle className="text-amber-500 flex-shrink-0" size={18} />,
    },
    info: {
      bg: "bg-blue-50 border-blue-200 text-blue-800",
      icon: <Info className="text-blue-500 flex-shrink-0" size={18} />,
    },
  }[toast.type];

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl border shadow-lg pointer-events-auto transition-all duration-300 transform translate-y-0 opacity-100 animate-in slide-in-from-top-4 ${config.bg}`}
      role="alert"
    >
      {config.icon}
      <span className="text-[13px] font-semibold flex-1 leading-relaxed">{toast.message}</span>
      <button
        onClick={() => onClose(toast.id)}
        className="text-slate-400 hover:text-slate-650 p-0.5 rounded-lg transition-colors cursor-pointer"
      >
        <X size={14} />
      </button>
    </div>
  );
};
