import { Inbox, MailOpen, Mail } from "lucide-react";

/**
 * ==========================================
 * 🎛️ FILTRES — Segmented control
 * Onglets : Toutes / Non lues / Lues
 * ==========================================
 */

const FILTERS = [
  { id: "toutes", label: "Toutes", icon: Inbox },
  { id: "non_lues", label: "Non lues", icon: Mail },
  { id: "lues", label: "Lues", icon: MailOpen },
];

function NotificationFilters({ value, onChange, counts }) {
  return (
    <div
      role="tablist"
      aria-label="Filtrer les notifications"
      className="flex items-center gap-1.5 p-1 rounded-2xl bg-[#0E223A] border border-white/5"
    >
      {FILTERS.map((filter) => {
        const isActive = value === filter.id;
        const count = counts?.[filter.id] ?? 0;

        return (
          <button
            key={filter.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => {
              onChange(filter.id);
              navigator.vibrate?.(8); // Retour haptique léger
            }}
            className={`
              group relative flex-1
              flex items-center justify-center gap-1.5
              h-10 px-2 rounded-xl
              text-xs font-semibold
              transition-all duration-200
              active:scale-[0.97]
              ${
                isActive
                  ? "bg-orange-500 text-white shadow-lg shadow-orange-500/25"
                  : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
              }
            `}
          >
            <filter.icon
              className={`w-3.5 h-3.5 shrink-0 transition-transform duration-200 ${
                isActive ? "scale-110" : "group-hover:scale-105"
              }`}
            />
            <span className="truncate">{filter.label}</span>

            {/* Badge compteur */}
            {count > 0 && (
              <span
                className={`
                  shrink-0 min-w-[18px] h-[18px] px-1
                  flex items-center justify-center rounded-full
                  text-[10px] font-bold tabular-nums
                  transition-colors duration-200
                  ${
                    isActive
                      ? "bg-white/25 text-white"
                      : "bg-white/10 text-gray-400"
                  }
                `}
              >
                {count > 99 ? "99+" : count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export default NotificationFilters;
