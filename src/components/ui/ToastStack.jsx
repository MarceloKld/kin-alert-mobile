import { CheckCircle2, XCircle, Info, X } from "lucide-react";

/**
 * ==========================================
 * 🔔 TOAST STACK — Pile de notifications UI
 * Positionnée en haut, au-dessus du contenu
 * ==========================================
 */

// Configuration visuelle par type de toast
const TOAST_CONFIG = {
  success: {
    icon: CheckCircle2,
    ring: "ring-emerald-500/30",
    bg: "bg-emerald-500/10",
    text: "text-emerald-300",
    iconColor: "text-emerald-400",
  },
  error: {
    icon: XCircle,
    ring: "ring-red-500/30",
    bg: "bg-red-500/10",
    text: "text-red-300",
    iconColor: "text-red-400",
  },
  info: {
    icon: Info,
    ring: "ring-sky-500/30",
    bg: "bg-sky-500/10",
    text: "text-sky-300",
    iconColor: "text-sky-400",
  },
};

function ToastStack({ toasts, onDismiss }) {
  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed top-3 left-1/2 -translate-x-1/2 z-[60] w-full max-w-sm px-3 space-y-2 pointer-events-none"
      role="status"
      aria-live="polite"
    >
      {toasts.map((toast) => {
        const config = TOAST_CONFIG[toast.type] ?? TOAST_CONFIG.info;
        const Icon = config.icon;

        return (
          <div
            key={toast.id}
            className={`
              pointer-events-auto
              flex items-center gap-3
              px-4 py-3 rounded-2xl
              bg-[#0E223A]/95 backdrop-blur-xl
              ring-1 ${config.ring}
              shadow-2xl
              animate-toast-in
            `}
          >
            {/* Icône du type */}
            <span
              className={`shrink-0 flex items-center justify-center w-8 h-8 rounded-xl ${config.bg}`}
            >
              <Icon className={`w-4 h-4 ${config.iconColor}`} />
            </span>

            {/* Message */}
            <p className={`flex-1 text-sm font-medium ${config.text}`}>
              {toast.message}
            </p>

            {/* Bouton fermer */}
            <button
              onClick={() => onDismiss(toast.id)}
              aria-label="Fermer la notification"
              className="shrink-0 p-1 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors duration-200"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default ToastStack;
