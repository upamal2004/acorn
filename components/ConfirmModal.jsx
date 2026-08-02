"use client";

/**
 * Reusable confirmation modal with warning styling.
 * Shows a message with Confirm/Cancel buttons.
 *
 * @param {boolean} show - Whether to show the modal
 * @param {string} title - Modal title
 * @param {string} message - Confirmation message
 * @param {string} [confirmText] - Confirm button text (default: "Confirm")
 * @param {string} [cancelText] - Cancel button text (default: "Cancel")
 * @param {"danger" | "warning" | "info"} [variant] - Visual variant
 * @param {boolean} [busy] - Loading state
 * @param {() => void} onConfirm - Called when confirmed
 * @param {() => void} onCancel - Called when cancelled
 */
export function ConfirmModal({
  show,
  title = "Are you sure?",
  message,
  confirmText = "Confirm",
  cancelText = "Cancel",
  variant = "danger",
  busy = false,
  onConfirm,
  onCancel,
}) {
  if (!show) return null;

  const variantStyles = {
    danger: {
      icon: "🗑️",
      iconBg: "bg-red-100",
      confirmBtn: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
      titleColor: "text-red-900",
    },
    warning: {
      icon: "⚠️",
      iconBg: "bg-amber-100",
      confirmBtn: "bg-amber-600 hover:bg-amber-700 focus:ring-amber-500",
      titleColor: "text-amber-900",
    },
    info: {
      icon: "ℹ️",
      iconBg: "bg-blue-100",
      confirmBtn: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
      titleColor: "text-blue-900",
    },
  };

  const styles = variantStyles[variant];

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
      onClick={onCancel}
    >
      <div
        className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Icon */}
        <div className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${styles.iconBg}`}>
          <span className="text-2xl">{styles.icon}</span>
        </div>

        {/* Title */}
        <h3 className={`mt-4 text-center text-lg font-bold ${styles.titleColor}`}>
          {title}
        </h3>

        {/* Message */}
        <p className="mt-2 text-center text-sm text-slate-600">
          {message}
        </p>

        {/* Buttons */}
        <div className="mt-6 flex gap-3">
          <button
            onClick={onCancel}
            disabled={busy}
            className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 active:scale-[0.98]"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            disabled={busy}
            className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition focus:ring-2 focus:ring-offset-2 active:scale-[0.98] ${styles.confirmBtn}`}
          >
            {busy ? (
              <span className="inline-flex items-center gap-2">
                <span className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Deleting...
              </span>
            ) : (
              confirmText
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
