import { NavLink } from "react-router-dom";
import { AlertTriangle, Bell, User, LayoutGrid, Settings } from "lucide-react";

/**
 * ==========================================
 * 🧭 CONFIGURATION DE LA NAVIGATION
 * ==========================================
 * Ordre, libellés et routes centralisés ici.
 * `withBadge` = affiche la pastille de compteur.
 */
const NAV_ITEMS = [
  { to: "/home", label: "Alertes", Icon: AlertTriangle },
  { to: "/notifications", label: "Notifs", Icon: Bell, withBadge: true },
  { to: "/dashboard", label: "Mes infos", Icon: User },
  { to: "/mes-signalements", label: "Signal.", Icon: LayoutGrid },
  { to: "/settings", label: "Réglages", Icon: Settings },
];

/**
 * ==========================================
 * 🔴 BADGE — Pastille de compteur
 * ==========================================
 * @param {number}  count    - Nombre à afficher (masqué si 0)
 * @param {boolean} isActive - Adapte l'anneau selon l'état de l'onglet
 */
function NavBadge({ count, isActive }) {
  if (!count || count <= 0) return null;

  return (
    <span className="absolute -right-2 -top-1.5 flex items-center justify-center">
      {/* Halo pulsant — désactivé sur l'onglet actif pour éviter la surcharge */}
      {!isActive && (
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-500 opacity-60" />
      )}

      <span
        className={`
          relative flex min-w-[17px] items-center justify-center
          h-[17px] px-1 rounded-full
          bg-red-500 text-white
          text-[9px] font-bold leading-none tabular-nums
          shadow-lg shadow-red-500/40
          ring-2 transition-colors duration-200
          ${isActive ? "ring-orange-500" : "ring-[#0E223A]"}
        `}
      >
        {count > 9 ? "9+" : count}
      </span>
    </span>
  );
}

/**
 * ==========================================
 * 🔗 ITEM DE NAVIGATION
 * ==========================================
 */
function NavItem({ to, label, Icon, badge = 0 }) {
  return (
    <NavLink
      to={to}
      // Retour haptique léger au tap (mobile) — logique d'origine conservée
      onClick={() => navigator.vibrate?.(10)}
      aria-label={badge > 0 ? `${label}, ${badge} non lues` : label}
      className="
        group relative flex-1 min-w-0 rounded-2xl outline-none
        focus-visible:ring-2 focus-visible:ring-orange-500/60
      "
    >
      {({ isActive }) => (
        <div
          className={`
            relative flex h-[54px] flex-col items-center justify-center gap-1
            rounded-2xl
            transition-[color,transform] duration-200
            active:scale-[0.93]
            ${isActive ? "text-white" : "text-slate-400 group-hover:text-slate-200"}
          `}
        >
          {/* ── Pilule active (animée en opacity + scale : perf GPU) ── */}
          <span
            aria-hidden="true"
            className={`
              absolute inset-0 rounded-2xl
              bg-gradient-to-b from-orange-400 to-orange-600
              transition-all duration-300 ease-out
              ${
                isActive
                  ? "opacity-100 scale-100 shadow-[0_8px_22px_-8px_rgba(249,115,22,0.95)]"
                  : "opacity-0 scale-90"
              }
            `}
          />

          {/* ── Icône + badge ── */}
          <span className="relative">
            <Icon
              size={20}
              strokeWidth={isActive ? 2.4 : 2}
              className={`
                transition-transform duration-300 ease-out
                ${isActive ? "scale-110 -translate-y-px" : "group-hover:scale-105"}
              `}
            />
            {badge > 0 && <NavBadge count={badge} isActive={isActive} />}
          </span>

          {/* ── Libellé ── */}
          <span
            className={`
              relative max-w-full truncate px-0.5
              text-[9px] font-bold uppercase leading-none tracking-tight
              transition-opacity duration-200
              ${isActive ? "opacity-100" : "opacity-75"}
            `}
          >
            {label}
          </span>
        </div>
      )}
    </NavLink>
  );
}

/**
 * ==========================================
 * 🧭 BOTTOM NAVIGATION
 * ==========================================
 * @param {number} unreadCount - Notifications non lues (optionnel)
 */
function BottomNav({ unreadCount = 0 }) {
  return (
    <nav
      aria-label="Navigation principale"
      className="
        fixed inset-x-0 bottom-0 z-50
        bg-[#0E223A]/90 backdrop-blur-xl
        border-t border-white/[0.07]
        shadow-[0_-8px_30px_-10px_rgba(0,0,0,0.8)]
        pb-[env(safe-area-inset-bottom)]
      "
    >
      {/* Liseré lumineux supérieur — touche premium */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent"
      />

      <div className="mx-auto flex max-w-md items-center gap-1 px-2 py-2">
        {NAV_ITEMS.map((item) => (
          <NavItem
            key={item.to}
            to={item.to}
            label={item.label}
            Icon={item.Icon}
            badge={item.withBadge ? unreadCount : 0}
          />
        ))}
      </div>
    </nav>
  );
}

export default BottomNav;
