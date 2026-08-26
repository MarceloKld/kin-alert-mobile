import { useCallback, useEffect, useRef, useState } from "react";
import { NotificationService } from "../services/notification.service";

/**
 * ==========================================
 * 🔔 HOOK MÉTIER — Gestion des notifications
 * Centralise : chargement, pagination,
 * refresh, marquage comme lu (optimiste)
 * ==========================================
 */
export function useNotifications() {
  // --- États des données ---
  const [notifications, setNotifications] = useState([]);
  const [meta, setMeta] = useState(null);

  // --- États de contrôle ---
  const [loading, setLoading] = useState(true); // Chargement initial
  const [loadingMore, setLoadingMore] = useState(false); // Pagination
  const [refreshing, setRefreshing] = useState(false); // Rafraîchissement
  const [error, setError] = useState(null);
  const [updatingIds, setUpdatingIds] = useState(new Set()); // IDs en cours de PATCH

  // Garde-fou contre les setState après démontage
  const isMountedRef = useRef(true);

  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  /**
   * Récupère une page de notifications
   * @param {number} page
   * @param {{append?: boolean}} options - append = ajouter à la liste existante
   */
  const fetchPage = useCallback(async (page = 1, { append = false } = {}) => {
    try {
      setError(null);

      const response = await NotificationService.getAll(page);
      if (!isMountedRef.current) return;

      const list = Array.isArray(response?.data) ? response.data : [];

      setNotifications((prev) => {
        if (!append) return list;

        // Déduplication par id lors de l'ajout (sécurité)
        const existingIds = new Set(prev.map((item) => item.id));
        const newItems = list.filter((item) => !existingIds.has(item.id));
        return [...prev, ...newItems];
      });

      setMeta(response?.meta ?? null);
    } catch (err) {
      if (!isMountedRef.current) return;
      setError(
        err?.response?.status === 401
          ? "Session expirée. Veuillez vous reconnecter."
          : "Impossible de charger les notifications.",
      );
    }
  }, []);

  // --- Chargement initial au montage ---
  useEffect(() => {
    (async () => {
      setLoading(true);
      await fetchPage(1);
      if (isMountedRef.current) setLoading(false);
    })();
  }, [fetchPage]);

  /** Recharge complètement la liste depuis la page 1 */
  const refresh = useCallback(async () => {
    setRefreshing(true);
    await fetchPage(1);
    if (isMountedRef.current) setRefreshing(false);
  }, [fetchPage]);

  /** Charge la page suivante (pagination infinie) */
  const loadMore = useCallback(async () => {
    if (!meta || loadingMore) return;
    if (meta.current_page >= meta.last_page) return;

    setLoadingMore(true);
    await fetchPage(meta.current_page + 1, { append: true });
    if (isMountedRef.current) setLoadingMore(false);
  }, [meta, loadingMore, fetchPage]);

  /**
   * Marque une notification comme lue (mise à jour optimiste)
   * @param {number} id
   * @returns {Promise<boolean>} succès de l'opération
   */
  const markAsRead = useCallback(async (id) => {
    // Marque l'ID comme "en cours de traitement"
    setUpdatingIds((prev) => new Set(prev).add(id));

    // ⚡ Mise à jour optimiste immédiate
    setNotifications((prev) =>
      prev.map((item) => (item.id === id ? { ...item, lu: true } : item)),
    );

    try {
      await NotificationService.markAsRead(id);
      return true;
    } catch {
      // ↩️ Rollback en cas d'échec
      if (isMountedRef.current) {
        setNotifications((prev) =>
          prev.map((item) => (item.id === id ? { ...item, lu: false } : item)),
        );
      }
      return false;
    } finally {
      if (isMountedRef.current) {
        setUpdatingIds((prev) => {
          const next = new Set(prev);
          next.delete(id);
          return next;
        });
      }
    }
  }, []);

  /**
   * Marque toutes les notifications chargées comme lues
   * (aucun endpoint bulk disponible → appels parallèles)
   * @returns {Promise<{success: number, failed: number}>}
   */
  const markAllAsRead = useCallback(async () => {
    const unread = notifications.filter((item) => !item.lu);
    if (unread.length === 0) return { success: 0, failed: 0 };

    const results = await Promise.allSettled(
      unread.map((item) => markAsRead(item.id)),
    );

    const success = results.filter(
      (r) => r.status === "fulfilled" && r.value === true,
    ).length;

    return { success, failed: unread.length - success };
  }, [notifications, markAsRead]);

  // --- Valeurs dérivées ---
  const unreadCount = notifications.filter((item) => !item.lu).length;
  const hasMore = Boolean(meta && meta.current_page < meta.last_page);

  return {
    // Données
    notifications,
    meta,
    unreadCount,
    hasMore,
    // États
    loading,
    loadingMore,
    refreshing,
    error,
    updatingIds,
    // Actions
    refresh,
    loadMore,
    markAsRead,
    markAllAsRead,
  };
}
