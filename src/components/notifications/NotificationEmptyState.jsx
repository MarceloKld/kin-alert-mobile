import { BellOff, SearchX, WifiOff, RefreshCcw } from "lucide-react";

/**
 * ==========================================
 * 📭 EMPTY STATE — États vides & erreurs
 * variant : "empty" | "search" | "error"
 * ==========================================
 */

const VARIANTS = {
  empty: {
    icon: BellOff,
    title: "Aucune notification",
    description:
      "Vous serez alerté ici dès qu'une nouvelle information arrive.",
    accent: "text-gray-600",
  },
  search: {
    icon: SearchX,
    title: "Aucun résultat",
    description: "Essayez un autre mot-clé ou modifiez les filtres appliqués.",
    accent: "text-gray-600",
  },
  error: {
    icon: WifiOff,
    title: "Connexion impossible",
    description: "Vérifiez votre réseau puis réessayez.",
    accent: "text-red-500/70",
  },
};

function NotificationEmptyState({ variant = "empty", message, onRetry }) {
  const config = VARIANTS[variant] ?? VARIANTS.empty;
  const Icon = config.icon;

  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      {/* Icône avec halo lumineux */}
      <div className="relative mb-5">
        <div className="absolute inset-0 rounded-full bg-white/5 blur-2xl animate-pulse" />
        <Icon
          className={`relative w-14 h-14 ${config.accent}`}
          strokeWidth={1.5}
        />
      </div>

      {/* Titre */}
      <h3 className="text-base font-semibold text-gray-200">{config.title}</h3>

      {/* Description */}
      <p className="mt-2 max-w-xs text-sm text-gray-500 leading-relaxed">
        {message ?? config.description}
      </p>

      {/* Bouton réessayer (erreur uniquement) */}
      {variant === "error" && onRetry && (
        <button
          onClick={onRetry}
          className="
            mt-6 inline-flex items-center gap-2
            px-5 py-2.5 rounded-xl
            bg-orange-500 hover:bg-orange-600
            text-white text-sm font-semibold
            shadow-lg shadow-orange-500/25
            active:scale-95
            transition-all duration-200
          "
        >
          <RefreshCcw className="w-4 h-4" />
          Réessayer
        </button>
      )}
    </div>
  );
}

export default NotificationEmptyState;
