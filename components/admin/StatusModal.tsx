"use client";

import { CheckCircle2, AlertCircle, XCircle, Trash2 } from "lucide-react";
import Button from "./Button";
import Modal from "./Modal";

interface StatusModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: "success" | "error" | "confirm" | "delete";
  title: string;
  message: string;
  onConfirm?: () => void;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
}

export default function StatusModal({
  isOpen,
  onClose,
  type,
  title,
  message,
  onConfirm,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  loading = false,
}: StatusModalProps) {
  const icons = {
    success: <CheckCircle2 className="w-12 h-12 text-green-500" />,
    error: <XCircle className="w-12 h-12 text-red-500" />,
    confirm: <AlertCircle className="w-12 h-12 text-blue-500" />,
    delete: <Trash2 className="w-12 h-12 text-red-500" />,
  };

  const buttonVariants = {
    success: "primary",
    error: "primary",
    confirm: "primary",
    delete: "danger",
  } as const;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="" size="sm">
      <div className="flex flex-col items-center text-center py-4">
        <div className="mb-4 bg-slate-50 p-4 rounded-full">
          {icons[type]}
        </div>
        
        <h3 className="text-[17px] font-bold text-slate-800 mb-2">{title}</h3>
        <p className="text-[13.5px] text-slate-500 leading-relaxed mb-8 px-4">
          {message}
        </p>

        <div className="flex items-center gap-3 w-full">
          {(type === "confirm" || type === "delete") && (
            <Button
              variant="outline"
              className="flex-1"
              onClick={onClose}
              disabled={loading}
            >
              {cancelLabel}
            </Button>
          )}
          
          <Button
            variant={type === "delete" ? "danger" : "primary"}
            className="flex-1"
            onClick={onConfirm || onClose}
            loading={loading}
          >
            {type === "confirm" || type === "delete" ? confirmLabel : "OK"}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
