import { useEffect, useMemo, useRef, useState } from "react";
import {
  Bell,
  Search,
  X,
  RefreshCcw,
  CheckCheck,
  Loader2,
  ArrowUp,
} from "lucide-react";

import BottomNav from "../components/BottomNav";
import ToastStack from "../components/ui/ToastStack";
import NotificationCard from "../components/notifications/NotificationCard";
import NotificationSkeleton from "../components/notifications/NotificationSkeleton";
import NotificationFilters from "../components/notifications/NotificationFilters";
import NotificationEmptyState from "../components/notifications/NotificationEmptyState";

import { useNotifications } from "../hooks/useNotifications";
import { useToast } from "../hooks/useToast";
import { groupNotificationsByDate } from "../utils/date";

/**
 * ==========================================
 * 🔔 PAGE NOTIFICATIONS
 * Liste paginée + filtres + recherche
 * + marquage comme lu (unitaire & global)
 * ==========================================
 */
function Notification() {
  // --- Hook métier (API, pagination, état) ---
  const {
    notifications,
    meta,
    unreadCount,
    hasMore,
    loading,
    loadingMore,
    refreshing,
    error,
    updatingIds,
    refresh,
    loadMore,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  // --- Système de toasts ---
  const toast = useToast();

  // --- États UI locaux ---
  const [filter, setFilter] = useState("toutes"); // toutes | non_lues | lues
  const [search, setSearch] = useState("");
  const [markingAll, setMarkingAll] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Sentinelle pour le scroll infini
  const sentinelRef = useRef(null);

  /* ══════════════════════════════════════════
     🔍 FILTRAGE + RECHERCHE (côté client)
     ══════════════════════════════════════════ */
  const filteredNotifications = useMemo(() => {
    const query = search.trim().toLowerCase();

    return notifications.filter((item) => {
      // Filtre par statut de lecture
      if (filter === "non_lues" && item.lu) return false;
      if (filter === "lues" && !item.lu) return false;

      // Filtre par recherche textuelle
      if (query && !item.message?.toLowerCase().includes(query)) return false;

      return true;
    });
  }, [notifications, filter, search]);

  /** Notifications regroupées par période (Aujourd'hui, Hier...) */
  const groupedNotifications = useMemo(
    () => groupNotificationsByDate(filteredNotifications),
    [filteredNotifications],
  );

  /** Compteurs affichés dans les onglets de filtre */
  const filterCounts = useMemo(
    () => ({
      toutes: notifications.length,
      non_lues: unreadCount,
      lues: notifications.length - unreadCount,
    }),
    [notifications.length, unreadCount],
  );

  /* ══════════════════════════════════════════
     ♾️ SCROLL INFINI — IntersectionObserver
     ══════════════════════════════════════════ */
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore || loading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loadingMore) {
          loadMore();
        }
      },
      { rootMargin: "200px" }, // Déclenche 200px avant d'atteindre le bas
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [hasMore, loading, loadingMore, loadMore]);

  /* ══════════════════════════════════════════
     ⬆️ BOUTON RETOUR EN HAUT
     ══════════════════════════════════════════ */
  useEffect(() => {
    const handleScroll = () => setShowScrollTop(window.scrollY > 400);

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ══════════════════════════════════════════
     🎬 HANDLERS
     ══════════════════════════════════════════ */

  /** Marque une notification comme lue */
  const handleMarkAsRead = async (id) => {
    const success = await markAsRead(id);
    if (success) {
      toast.success("Notification marquée comme lue");
    } else {
      toast.error("Impossible de marquer comme lue");
    }
  };

  /** Marque toutes les notifications chargées comme lues */
  const handleMarkAllAsRead = async () => {
    if (unreadCount === 0 || markingAll) return;

    navigator.vibrate?.(20);
    setMarkingAll(true);

    const { success, failed } = await markAllAsRead();

    setMarkingAll(false);

    if (failed === 0) {
      toast.success(`${success} notification(s) marquée(s) comme lue(s)`);
    } else {
      toast.error(`${failed} notification(s) non mises à jour`);
    }
  };

  /** Rafraîchit la liste depuis la page 1 */
  const handleRefresh = async () => {
    navigator.vibrate?.(10);
    await refresh();
    toast.info("Liste actualisée");
  };

  /** Remonte en haut de page */
  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  /* ══════════════════════════════════════════
     🎨 RENDER
     ══════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-[#081627] text-gray-100">
      {/* Pile de toasts */}
      <ToastStack toasts={toast.toasts} onDismiss={toast.dismiss} />

      {/* ══════════════════════════════════════
          📌 HEADER STICKY
          ══════════════════════════════════════ */}
      <header className="sticky top-0 z-40 bg-[#081627]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-2xl mx-auto px-4 pt-5 pb-3 space-y-4">
          {/* Titre + actions */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              {/* Icône avec halo */}
              <div className="relative shrink-0">
                <div className="absolute inset-0 rounded-full bg-orange-500/25 blur-lg animate-pulse" />
                <span className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/25">
                  <Bell className="w-5 h-5 text-orange-500" />
                </span>
              </div>

              <div className="min-w-0">
                <h1 className="text-lg font-bold tracking-tight text-white truncate">
                  Notifications
                </h1>
                <p className="text-[11px] text-gray-500">
                  {unreadCount > 0
                    ? `${unreadCount} non lue${unreadCount > 1 ? "s" : ""}`
                    : "Tout est à jour"}
                </p>
              </div>
            </div>

            {/* Boutons d'action */}
            <div className="flex items-center gap-1.5 shrink-0">
              {/* Tout marquer comme lu */}
              <button
                onClick={handleMarkAllAsRead}
                disabled={unreadCount === 0 || markingAll}
                title="Tout marquer comme lu"
                aria-label="Marquer toutes les notifications comme lues"
                className="
                  flex items-center justify-center w-10 h-10 rounded-xl
                  bg-[#0E223A] border border-white/10 text-gray-400
                  hover:text-orange-400 hover:border-orange-500/40
                  disabled:opacity-30 disabled:cursor-not-allowed
                  disabled:hover:text-gray-400 disabled:hover:border-white/10
                  active:scale-90 transition-all duration-200
                "
              >
                {markingAll ? (
                  <Loader2 className="w-4.5 h-4.5 animate-spin" />
                ) : (
                  <CheckCheck className="w-4.5 h-4.5" />
                )}
              </button>

              {/* Rafraîchir */}
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                title="Actualiser"
                aria-label="Actualiser la liste"
                className="
                  group flex items-center justify-center w-10 h-10 rounded-xl
                  bg-[#0E223A] border border-white/10 text-gray-400
                  hover:text-orange-400 hover:border-orange-500/40
                  disabled:opacity-50 disabled:cursor-not-allowed
                  active:scale-90 transition-all duration-200
                "
              >
                <RefreshCcw
                  className={`w-4.5 h-4.5 transition-transform duration-300 ${
                    refreshing ? "animate-spin" : "group-hover:-rotate-90"
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Barre de recherche */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />

            <input
              type="text"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher une notification..."
              autoComplete="off"
              aria-label="Rechercher dans les notifications"
              className="
                w-full h-11 pl-10 pr-10 rounded-2xl
                bg-[#0E223A] border border-white/10
                text-sm text-white placeholder:text-gray-500
                hover:border-white/20
                focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20
                outline-none transition-all duration-200
              "
            />

            {/* Bouton effacer */}
            {search && (
              <button
                onClick={() => setSearch("")}
                aria-label="Effacer la recherche"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg text-gray-500 hover:text-white hover:bg-white/10 transition-colors duration-200"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Onglets de filtre */}
          <NotificationFilters
            value={filter}
            onChange={setFilter}
            counts={filterCounts}
          />
        </div>
      </header>

      {/* ══════════════════════════════════════
          📋 CONTENU PRINCIPAL
          ══════════════════════════════════════ */}
      <main className="max-w-2xl mx-auto px-4 pt-4 pb-28">
        {/* ⏳ Chargement initial */}
        {loading && <NotificationSkeleton count={6} />}

        {/* ❌ Erreur */}
        {!loading && error && (
          <NotificationEmptyState
            variant="error"
            message={error}
            onRetry={refresh}
          />
        )}

        {/* 📭 Aucune notification */}
        {!loading && !error && notifications.length === 0 && (
          <NotificationEmptyState variant="empty" />
        )}

        {/* 🔍 Aucun résultat après filtrage */}
        {!loading &&
          !error &&
          notifications.length > 0 &&
          filteredNotifications.length === 0 && (
            <NotificationEmptyState variant="search" />
          )}

        {/* ✅ Liste groupée par période */}
        {!loading && !error && filteredNotifications.length > 0 && (
          <div className="space-y-6">
            {groupedNotifications.map((group) => (
              <section key={group.label} className="space-y-3">
                {/* Titre du groupe (sticky sous le header) */}
                <div className="flex items-center gap-3">
                  <h2 className="text-[11px] font-bold uppercase tracking-wider text-gray-500">
                    {group.label}
                  </h2>
                  <span className="flex-1 h-px bg-white/5" />
                  <span className="text-[11px] text-gray-600 tabular-nums">
                    {group.items.length}
                  </span>
                </div>

                {/* Cartes du groupe */}
                <div className="space-y-3">
                  {group.items.map((item, index) => (
                    <NotificationCard
                      key={item.id}
                      notification={item}
                      index={index}
                      isUpdating={updatingIds.has(item.id)}
                      onMarkAsRead={handleMarkAsRead}
                    />
                  ))}
                </div>
              </section>
            ))}

            {/* ♾️ Sentinelle du scroll infini */}
            <div ref={sentinelRef} aria-hidden="true" className="h-1" />

            {/* Indicateur de chargement de page suivante */}
            {loadingMore && (
              <div className="flex items-center justify-center gap-2 py-4 text-gray-500">
                <Loader2 className="w-4 h-4 animate-spin text-orange-500" />
                <span className="text-xs font-medium">
                  Chargement des notifications...
                </span>
              </div>
            )}

            {/* Fin de liste atteinte */}
            {!hasMore && meta && meta.total > 0 && (
              <p className="py-4 text-center text-[11px] text-gray-600">
                {meta.total} notification{meta.total > 1 ? "s" : ""} au total
              </p>
            )}
          </div>
        )}
      </main>

      {/* ══════════════════════════════════════
          ⬆️ BOUTON RETOUR EN HAUT
          ══════════════════════════════════════ */}
      {showScrollTop && (
        <button
          onClick={handleScrollTop}
          aria-label="Remonter en haut de la page"
          className="
            fixed bottom-24 right-4 z-40
            flex items-center justify-center w-11 h-11 rounded-full
            bg-orange-500 text-white
            shadow-lg shadow-orange-500/30
            hover:bg-orange-600 active:scale-90
            transition-all duration-200
            animate-fade-in-up
          "
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Navigation basse */}
      <BottomNav />
    </div>
  );
}

export default Notification;
