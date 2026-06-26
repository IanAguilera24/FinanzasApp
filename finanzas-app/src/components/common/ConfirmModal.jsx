// src/components/common/ConfirmModal.jsx
import { createPortal } from "react-dom";

export function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Confirmar",
  cancelLabel = "Cancelar",
  onConfirm,
  onCancel,
  variant = "danger",
}) {
  if (!open) return null;

  const confirmStyle =
    variant === "danger" ? { backgroundColor: "#dc2626" } : { backgroundColor: "var(--color-primary)" };

  return createPortal(
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-xl p-6 max-w-sm w-full">
        <h3 className="font-bold text-gray-800 dark:text-slate-100 mb-2">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-slate-400 mb-5">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-lg border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-300 font-medium hover:bg-gray-50 dark:hover:bg-slate-700 transition"
          >
            {cancelLabel}
          </button>
          <button
            onClick={onConfirm}
            style={confirmStyle}
            className="flex-1 py-2.5 rounded-lg text-white font-medium transition hover:opacity-90"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}