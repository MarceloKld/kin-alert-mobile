/**
 * ==========================================
 * ⏳ SKELETON LOADER
 * Simule la structure d'une carte notification
 * ==========================================
 */
function NotificationSkeleton({ count = 5 }) {
  return (
    <div className="space-y-3" aria-hidden="true">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="relative overflow-hidden rounded-2xl bg-[#0E223A]/60 border border-white/5 p-4"
        >
          {/* Bande lumineuse animée */}
          <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/5 to-transparent" />

          <div className="flex items-start gap-3">
            {/* Placeholder avatar/icône */}
            <div className="shrink-0 w-10 h-10 rounded-xl bg-white/5 animate-pulse" />

            <div className="flex-1 space-y-2.5 py-0.5">
              {/* Lignes de texte */}
              <div className="h-3 w-4/5 rounded bg-white/5 animate-pulse" />
              <div className="h-3 w-3/5 rounded bg-white/5 animate-pulse" />
              <div className="h-2.5 w-24 rounded bg-white/5 animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default NotificationSkeleton;
