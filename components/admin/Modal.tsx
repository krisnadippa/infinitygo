"use client";

import { ReactNode, useEffect } from "react";
import { X } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeStyles: Record<string, string> = {
  sm: "max-w-md",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

export default function Modal({ isOpen, onClose, title, children, size = "md" }: ModalProps) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      data-lenis-prevent
      className="fixed inset-0 z-50 flex items-center justify-center p-4 print:static print:block print:p-0 print:bg-white print:z-auto"
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm print:hidden" onClick={onClose} />
      <div className={`relative bg-white rounded-2xl shadow-xl w-full ${sizeStyles[size]} max-h-[90vh] flex flex-col print:shadow-none print:border-none print:max-h-none print:w-full print:max-w-none print:flex-none print:rounded-none`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-shrink-0 print:hidden">
          <h2 className="text-[15px] font-semibold text-slate-800">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 transition-colors"
          >
            <X size={18} />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 px-6 py-5 print:overflow-visible print:flex-none print:px-0 print:py-0">{children}</div>
      </div>
    </div>
  );
}
