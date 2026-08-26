import api from "../api/axios";

/**
 * ==========================================
 * 🔗 ENDPOINT DE BASE
 * ==========================================
 * ⚠️ Si ton VITE_API_BASE_URL contient déjà "/api/v1",
 *    remplace simplement par : const ENDPOINT = "/notifications";
 */
const ENDPOINT = "/notifications";

export const NotificationService = {
  /**
   * Récupère la liste paginée des notifications de l'utilisateur connecté
   * @param {number} page - Numéro de page (défaut : 1)
   * @returns {Promise<{data: Array, links: Object, meta: Object}>}
   */
  getAll: async (page = 1) => {
    const response = await api.get(ENDPOINT, { params: { page } });
    return response.data;
  },

  /**
   * Marque une notification comme lue
   * @param {number} notificationId - Identifiant de la notification
   * @returns {Promise<{message: string}>}
   */
  markAsRead: async (notificationId) => {
    const response = await api.patch(`${ENDPOINT}/${notificationId}/read`);
    return response.data;
  },
};
