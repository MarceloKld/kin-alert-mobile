/**
 * ==========================================
 * 📅 UTILITAIRES DE DATE
 * Aucune dépendance externe (Intl natif)
 * ==========================================
 */

/**
 * Parse une date de manière sécurisée
 * Gère les formats ISO ("2024-01-15T14:30:00") et SQL ("2024-01-15 14:30:00")
 * @param {string} value
 * @returns {Date|null}
 */
export function parseDate(value) {
  if (!value) return null;

  // Normalisation du format SQL vers ISO pour compatibilité Safari/iOS
  const normalized =
    typeof value === "string" ? value.replace(" ", "T") : value;

  const date = new Date(normalized);
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * Retourne un temps relatif lisible ("il y a 5 min", "il y a 2 h"...)
 * @param {string} value
 * @returns {string}
 */
export function formatRelativeTime(value) {
  const date = parseDate(value);
  if (!date) return "Date inconnue";

  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.floor(diffMs / 1000);
  const diffMin = Math.floor(diffSec / 60);
  const diffHour = Math.floor(diffMin / 60);
  const diffDay = Math.floor(diffHour / 24);

  if (diffSec < 60) return "À l'instant";
  if (diffMin < 60) return `Il y a ${diffMin} min`;
  if (diffHour < 24) return `Il y a ${diffHour} h`;
  if (diffDay === 1) return "Hier";
  if (diffDay < 7) return `Il y a ${diffDay} jours`;

  // Au-delà d'une semaine : date complète
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit",
    month: "short",
    year: diffDay > 365 ? "numeric" : undefined,
  }).format(date);
}

/**
 * Retourne l'heure formatée (HH:mm)
 * @param {string} value
 * @returns {string}
 */
export function formatTime(value) {
  const date = parseDate(value);
  if (!date) return "--:--";

  return new Intl.DateTimeFormat("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

/**
 * Détermine le groupe temporel d'une notification
 * @param {string} value
 * @returns {"Aujourd'hui"|"Hier"|"Cette semaine"|"Plus ancien"}
 */
export function getDateGroupLabel(value) {
  const date = parseDate(value);
  if (!date) return "Plus ancien";

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const target = new Date(date);
  target.setHours(0, 0, 0, 0);

  const diffDays = Math.round((today - target) / 86_400_000);

  if (diffDays <= 0) return "Aujourd'hui";
  if (diffDays === 1) return "Hier";
  if (diffDays < 7) return "Cette semaine";
  return "Plus ancien";
}

/**
 * Groupe une liste de notifications par période
 * @param {Array} items
 * @returns {Array<{label: string, items: Array}>}
 */
export function groupNotificationsByDate(items) {
  const groups = new Map();

  items.forEach((item) => {
    const label = getDateGroupLabel(item.date_creation);
    if (!groups.has(label)) groups.set(label, []);
    groups.get(label).push(item);
  });

  // Map conserve l'ordre d'insertion (liste déjà triée par l'API)
  return Array.from(groups, ([label, groupItems]) => ({
    label,
    items: groupItems,
  }));
}
