import { Check, Clock, Loader2, BellRing } from "lucide-react";
import { formatRelativeTime, formatTime } from "../../utils/date";

/**
 * ==========================================
 * 💬 CARTE NOTIFICATION
 * Gère l'état lu / non lu + action "marquer lu"
 * ==========================================
 */
function NotificationCard({
  notification,
  isUpdating,
  onMarkAsRead,
  index = 0,
}) {
  const isUnread = !notification.lu;

  /** Déclenche le marquage comme lu avec retour haptique */
  const handleMarkAsRead = () => {
    navigator.vibrate?.(12);
    onMarkAsRead(notification.id);
  };

  return (
    <article
      className={`
        group relative overflow-hidden
        rounded-2xl border
        transition-all duration-300 ease-out
        animate-fade-in-up
        ${
          isUnread
            ? "bg-[#0E223A] border-white/10 shadow-lg shadow-black/20"
            : "bg-[#0E223A]/50 border-white/5"
        }
      `}
      style={{ animationDelay: `${Math.min(index * 60, 480)}ms` }}
    >
      {/* Barre latérale d'accentuation (non lu uniquement) */}
      {isUnread && (
        <span className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500" />
      )}

      <div className="flex items-start gap-3 p-4 pl-5">
        {/* ══════════════════════════════════
            🔔 ICÔNE
            ══════════════════════════════════ */}
        <div
          className={`
            relative shrink-0
            flex items-center justify-center
            w-10 h-10 rounded-xl border
            transition-colors duration-300
            ${
              isUnread
                ? "bg-orange-500/15 border-orange-500/30"
                : "bg-white/5 border-white/10"
            }
          `}
        >
          <BellRing
            className={`w-4.5 h-4.5 ${
              isUnread ? "text-orange-400" : "text-gray-500"
            }`}
            strokeWidth={2}
          />

          {/* Pastille pulsante pour les non lues */}
          {isUnread && (
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-orange-500 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-orange-500" />
            </span>
          )}
        </div>

        {/* ══════════════════════════════════
            💬 CONTENU
            ══════════════════════════════════ */}
        <div className="flex-1 min-w-0 space-y-2">
          {/* Message */}
          <p
            className={`text-sm leading-relaxed break-words ${
              isUnread
                ? "text-gray-100 font-medium"
                : "text-gray-400 font-normal"
            }`}
          >
            {notification.message}
          </p>

          {/* Métadonnées */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 text-[11px] text-gray-500">
              <Clock className="w-3 h-3 shrink-0" />
              <time dateTime={notification.date_creation}>
                {formatRelativeTime(notification.date_creation)}
              </time>
            </span>

            <span className="text-gray-700" aria-hidden="true">
              •
            </span>

            <span className="text-[11px] text-gray-600 tabular-nums">
              {formatTime(notification.date_creation)}
            </span>

            {/* Badge "Nouveau" */}
            {isUnread && (
              <span className="px-2 py-0.5 rounded-full bg-orange-500/15 text-orange-400 ring-1 ring-orange-500/25 text-[10px] font-bold uppercase tracking-wide">
                Nouveau
              </span>
            )}
          </div>
        </div>

        {/* ══════════════════════════════════
            ✅ ACTION — Marquer comme lu
            ══════════════════════════════════ */}
        {isUnread && (
          <button
            onClick={handleMarkAsRead}
            disabled={isUpdating}
            title="Marquer comme lue"
            aria-label="Marquer cette notification comme lue"
            className="
              shrink-0
              flex items-center justify-center
              w-9 h-9 rounded-xl
              bg-orange-500/10 text-orange-400
              border border-orange-500/25
              hover:bg-orange-500 hover:text-white hover:border-orange-500
              disabled:opacity-60 disabled:cursor-not-allowed
              active:scale-90
              transition-all duration-200
            "
          >
            {isUpdating ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Check className="w-4 h-4" />
            )}
          </button>
        )}
      </div>
    </article>
  );
}

export default NotificationCard;
