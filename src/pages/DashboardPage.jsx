import { useEffect, useState } from "react";
import api from "../api/axios";
import { BarChart3, Newspaper, TrendingUp,LayoutGrid, CheckCircle2, Clock, XCircle, MapPin } from "lucide-react";
import { 
  ThumbsUp, 
  MessageSquare, 
  Eye, 
  Calendar, 
  AlertCircle, 
} from "lucide-react";

function DashboardPage() {

  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [loadingConfirm, setLoadingConfirm] = useState(null);

const [loadingComment, setLoadingComment] = useState(false);
const [loading, setLoading] = useState(false);
const [toast, setToast] = useState(null);
const [statusFilter, setStatusFilter] = useState("all");
const [commentsModal, setCommentsModal] = useState(null);
const [comments, setComments] = useState([]);
const [loadingComments, setLoadingComments] = useState(false);
const [loadingStats, setLoadingStats] = useState(true);
const [stats, setStats] = useState({
  total_incidents: 0,
  valide: 0,
  en_attente: 0,
  rejete: 0,
  total_utilisateurs: 0,
});

  // ✅ Charger incidents
  useEffect(() => {

  const loadIncidents = async () => {
    setLoading(true);

    try {
      const res = await api.get("/incidents?all=true");
      setIncidents(res.data.data || res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  loadIncidents();

}, []);
  // ✅ Confirmer incident
 const confirmIncident = async (id) => {
    // On évite de relancer si c'est déjà en cours
    if (loadingConfirm === id) return;

    setLoadingConfirm(id);

    try {
      await api.post(`/incidents/${id}/confirm`);

      setIncidents((prev) =>
        prev.map((incident) =>
          incident.id === id
            ? {
                ...incident,
                nombre_confirmations: (incident.nombre_confirmations || 0) + 1,
              }
            : incident
        )
      );

      setToast({
        type: "success",
        message: "✅ Confirmation enregistrée",
      });

    } catch (error) {
      // Si statut 409 (déjà confirmé)
      const errorMsg = error.response?.status === 409
        ? "Vous avez déjà confirmé cet incident."
        : "Erreur lors de la confirmation.";

      setToast({
        type: "error",
        message: errorMsg,
      });

    } finally {
      // Réinitialisation de l'état de chargement
      setLoadingConfirm(null);

      // Auto-fermeture du toast après 3 secondes
      setTimeout(() => setToast(null), 3000);
    }
  };

//Charger MES incidents




  // ✅ Commenter incident
  const submitComment = async () => {
  if (!commentText.trim()) return;

  setLoadingComment(true);

  try {
    const res = await api.post(
      `/incidents/${selectedIncident.id}/comments`,
      { contenu: commentText }
    );

    // ✅ Mettre à jour l'incident localement
    setIncidents((prev) =>
      prev.map((i) =>
        i.id === selectedIncident.id
          ? {
              ...i,
              commentaires: [...(i.commentaires || []), res.data],
            }
          : i
      )
    );

    setToast({
      type: "success",
      message: "✅ Commentaire envoyé",
    });

    setCommentText("");
    setSelectedIncident(null);

    setTimeout(() => setToast(null), 3000);

  } catch (error) {
    setToast({
      type: "error",
      message:
        error.response?.data?.message ||
        "Erreur lors de l'envoi du commentaire",
    });

    setTimeout(() => setToast(null), 3000);
  } finally {
    setLoadingComment(false);
  }
};

//charger commentaires
const openCommentsModal = async (incident) => {
  setCommentsModal(incident);
  setLoadingComments(true);

  try {
    const response = await api.get(
      `/incidents/${incident.id}/comments`
    );

    setComments(response.data);
  } catch (error) {
    console.error(error);
    setToast({
      type: "error",
      message: "Erreur chargement commentaires",
    });

    setTimeout(() => setToast(null), 3000);
  } finally {
    setLoadingComments(false);
  }
};

//Charger les stats
useEffect(() => {
  const loadStats = async () => {
  try {
    setLoadingStats(true);

    const response = await api.get("/statistics/dashboard");

    setStats(response.data);

  } catch (error) {
    console.error("Erreur stats", error);
  } finally {
    setLoadingStats(false);
  }
};

  loadStats();
}, []);

//Charger les stats au montage
useEffect(() => {
  const loadDashboardStats = async () => {
  try {
    setLoadingStats(true);

    const response = await api.get("/statistics/dashboard");
    setStats(response.data);

  } catch (error) {
    console.error(error);
  } finally {
    setLoadingStats(false);
  }
};

  loadDashboardStats();
}, []);







  return (
    <div
      className="min-h-screen bg-gradient-to-b 
                    from-[#0E223A] to-[#091522] 
                    text-white pb-28 px-4"
    >
      {toast && (
        <div
          key={toast.message}
          className="fixed top-6 right-6 z-50 animate-slideIn"
        >
          <div
            className={`px-4 py-3 rounded-xl shadow-2xl text-white text-sm font-bold flex items-center gap-2 ${
              toast.type === "error" ? "bg-red-500" : "bg-green-500"
            }`}
          >
            {toast.message}
          </div>
        </div>
      )}
      {/* ========================================
    HEADER DASHBOARD PREMIUM - Ultra Léger
    - Ambiance lumineuse (Glow)
    - Icône interactive avec effet de relief
    - Typographie moderne et dégradés
    - 100% CSS pur (Performance max à 60 FPS)
======================================== */}
      <div className="relative pt-6 mb-8 overflow-hidden">
        {/* Halo lumineux d'ambiance en arrière-plan (Glow subtil) */}
        <div className="absolute top-0 left-0 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

        {/* Ligne principale */}
        <div className="flex items-center gap-4 group">
          {/* Icone SVG avec dégradé, ombre portée et effet hover */}
          <div
            className="
      relative
      w-14 h-14 flex items-center justify-center 
      rounded-2xl 
      bg-gradient-to-br from-indigo-500 via-indigo-600 to-blue-600 
      shadow-[0_8px_20px_rgba(79,70,229,0.35)]
      border border-white/20
      group-hover:scale-105 
      transition-transform duration-300
      shrink-0
    "
          >
            {/* Reflet lumineux interne */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/20 to-transparent rounded-2xl pointer-events-none" />

            <BarChart3
              size={26}
              className="text-white drop-shadow-md"
              strokeWidth={2.5}
            />
          </div>

          {/* Textes et Badges */}
          <div className="flex-1">
            <div className="flex items-center gap-2.5">
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white uppercase drop-shadow-sm">
                Mes Infos
              </h1>

              {/* Badge Tendance avec effet glassmorphism & pulsation */}
              <div className="px-2.5 py-1 bg-blue-500/15 border border-blue-500/30 rounded-lg backdrop-blur-md shadow-sm flex items-center gap-1">
                <TrendingUp size={12} className="text-blue-400 animate-pulse" />
                <span className="text-[10px] font-bold text-blue-300 uppercase tracking-wider">
                  Live
                </span>
              </div>
            </div>

            {/* Barre décorative dégradée qui s'allonge au survol du groupe */}
            <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-indigo-600 rounded-full mt-2 shadow-sm shadow-blue-500/30 group-hover:w-32 transition-all duration-300"></div>

            {/* Sous-titre structuré */}
            <p className="text-[11px] text-gray-400 font-semibold mt-1.5 tracking-wider uppercase opacity-80">
              Statistiques & Activités globales
            </p>
          </div>
        </div>
      </div>

      {/* ========================================
    SECTION ACTUALITÉ - Header Premium & Léger
    - Icône stylisée avec dégradé et relief
    - Titre moderne avec sous-titre
    - Badge "En Direct" avec halo lumineux pulsant
    - 100% CSS pur (Performance max à 60 FPS)
======================================== */}
      <div className="flex items-center justify-between mb-5 px-1 group">
        {/* Bloc Gauche : Icône + Titre + Sous-titre */}
        <div className="flex items-center gap-3.5">
          {/* Container Icône avec relief et effet de zoom au survol */}
          <div
            className="
      relative 
      p-2.5 
      bg-gradient-to-br from-blue-500/20 to-indigo-600/20 
      rounded-2xl 
      border border-blue-500/30 
      shadow-md shadow-blue-900/20 
      group-hover:scale-105 
      transition-transform duration-300
      shrink-0
    "
          >
            {/* Reflet lumineux interne */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent rounded-2xl pointer-events-none" />

            <Newspaper
              size={20}
              className="text-blue-400 drop-shadow-sm"
              strokeWidth={2.5}
            />
          </div>

          {/* Titres */}
          <div>
            <h2 className="text-lg font-black tracking-tight text-white uppercase drop-shadow-sm">
              Fil d’Actualité
            </h2>
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider mt-0.5">
              Informations & alertes officielles
            </p>
          </div>
        </div>

        {/* Bloc Droit : Badge "En Direct" Premium avec Glow */}
        <div className="relative flex items-center gap-2 px-3.5 py-1.5 bg-red-500/10 border border-red-500/30 rounded-full shadow-lg shadow-red-500/10 backdrop-blur-md">
          {/* Halo rouge en arrière-plan du badge (Glow pulsant) */}
          <div className="absolute inset-0 bg-red-500/20 rounded-full blur-md pointer-events-none animate-pulse" />

          {/* Point rouge avec animation ping */}
          <div className="relative flex items-center justify-center">
            <span className="absolute w-2 h-2 bg-red-500 rounded-full animate-ping opacity-75" />
            <span className="w-2 h-2 bg-red-500 rounded-full shadow-sm shadow-red-500" />
          </div>

          {/* Texte du badge */}
          <span className="text-[10px] font-black text-red-400 uppercase tracking-widest drop-shadow-sm">
            En Direct
          </span>
        </div>
      </div>

      {/* --- FILTRES DE STATUT PREMIUM --- */}
      {!loadingStats && stats && (
        <div className="flex gap-3 mb-8 overflow-x-auto py-2 no-scrollbar scroll-smooth">
          {[
            {
              key: "all",
              label: "Tous",
              value: stats.total_incidents,
              icon: LayoutGrid,
              color: "orange",
            },
            {
              key: "valide",
              label: "Validé",
              value: stats.valide,
              icon: CheckCircle2,
              color: "green",
            },
            {
              key: "en_attente",
              label: "Attente",
              value: stats.en_attente,
              icon: Clock,
              color: "yellow",
            },
            {
              key: "rejete",
              label: "Rejeté",
              value: stats.rejete,
              icon: XCircle,
              color: "red",
            },
          ].map((item) => {
            const isActive = statusFilter === item.key;
            const Icon = item.icon;

            // Classes dynamiques pour les couleurs
            const activeStyles = {
              orange: "bg-orange-500 border-orange-400 shadow-orange-900/40",
              green: "bg-green-600 border-green-400 shadow-green-900/40",
              yellow: "bg-yellow-500 border-yellow-300 shadow-yellow-900/40",
              red: "bg-red-600 border-red-400 shadow-red-900/40",
            };

            return (
              <button
                key={item.key}
                onClick={() => setStatusFilter(item.key)}
                className={`shrink-0 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border transition-all duration-300 active:scale-90
            ${
              isActive
                ? `${activeStyles[item.color]} text-white shadow-xl scale-105`
                : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
            }`}
              >
                <Icon
                  size={16}
                  strokeWidth={isActive ? 3 : 2}
                  className={isActive ? "animate-pulse" : "opacity-60"}
                />

                <span
                  className={`text-[11px] font-black uppercase tracking-tight ${isActive ? "opacity-100" : "opacity-80"}`}
                >
                  {item.label}
                </span>

                <span
                  className={`flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-lg text-[10px] font-black
            ${isActive ? "bg-white/20 text-white" : "bg-white/10 text-gray-500"}`}
                >
                  {item.value || 0}
                </span>
              </button>
            );
          })}
        </div>
      )}
      {/* ========================================
    SKELETON LOADING PREMIUM - Ultra Léger
    - Intégration parfaite avec le thème bleu nuit/glassmorphism
    - Remplacement des gris ternes par des reflets blancs subtils
    - 100% CSS pur (Performance max à 60 FPS)
======================================== */}
      {loading && (
        <div className="space-y-6 mt-4 px-1">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="
          relative overflow-hidden
          bg-gradient-to-br from-[#142E4C]/80 via-[#142E4C]/40 to-[#0E223A]/90 
          backdrop-blur-2xl 
          border border-white/10 
          rounded-[2.5rem] p-6 
          shadow-2xl
          animate-pulse
        "
            >
              {/* Reflet lumineux en arrière-plan (Glow subtil) */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl pointer-events-none" />

              {/* Header du skeleton */}
              <div className="flex justify-between items-start mb-4">
                <div className="space-y-2.5">
                  {/* Ligne catégorie/date */}
                  <div className="h-3.5 bg-white/10 rounded-full w-24"></div>
                  {/* Ligne titre */}
                  <div className="h-6 bg-white/15 rounded-xl w-52"></div>
                </div>
                {/* Badge de statut */}
                <div className="h-6 bg-white/10 rounded-full w-20"></div>
              </div>

              {/* Corps du skeleton (Localisation) */}
              <div className="flex items-center gap-2.5 mb-6">
                <div className="w-4 h-4 bg-white/10 rounded-full shrink-0"></div>
                <div className="h-4 bg-white/10 rounded-lg w-40"></div>
              </div>

              {/* Footer du skeleton (Boutons d'action) */}
              <div className="flex gap-3">
                <div className="h-12 bg-white/10 rounded-2xl flex-1"></div>
                <div className="h-12 bg-white/10 rounded-2xl w-12 shrink-0"></div>
                <div className="h-12 bg-white/10 rounded-2xl w-12 shrink-0"></div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- LISTE DES INCIDENTS --- */}
      {!loading &&
        incidents
          .filter((incident) =>
            statusFilter === "all" ? true : incident.statut === statusFilter,
          )
          .map((incident) => (
            <div
              key={incident.id}
              className="relative bg-gradient-to-b from-[#142E4C] to-[#112641] 
                 rounded-[2.5rem] p-5 mb-5 shadow-2xl border border-white/5 
                 animate-fadeUp active:scale-[0.98] transition-transform overflow-hidden"
            >
              {/* Barre latérale d'état dynamique */}
              <div
                className={`absolute left-0 top-0 bottom-0 w-1.5 ${
                  incident.statut === "valide"
                    ? "bg-green-500"
                    : incident.statut === "en_attente"
                      ? "bg-yellow-500"
                      : "bg-red-500"
                }`}
              />

              {/* Header de la carte */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-[0.15em] text-blue-400/80">
                    {incident.type?.titre || "Incident"}
                  </span>
                  <h3 className="text-lg font-extrabold text-white leading-tight mt-0.5">
                    {incident.titre}
                  </h3>
                </div>

                {/* Badge Statut Premium */}
                <div
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold uppercase border ${
                    incident.statut === "valide"
                      ? "bg-green-500/10 border-green-500/20 text-green-400"
                      : incident.statut === "en_attente"
                        ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400"
                        : "bg-red-500/10 border-red-500/20 text-red-400"
                  }`}
                >
                  {incident.statut === "valide" && <CheckCircle2 size={10} />}
                  {incident.statut === "en_attente" && <Clock size={10} />}
                  {incident.statut === "rejete" && <AlertCircle size={10} />}
                  {incident.statut}
                </div>
              </div>

              {/* Localisation et Date */}
              <div className="flex flex-col gap-1.5 mb-4">
                <div className="flex items-center gap-2 text-gray-400">
                  <MapPin size={14} className="text-blue-500" />
                  <span className="text-xs font-medium">
                    {incident.localisation?.commune?.nom}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-gray-500">
                  <Calendar size={14} />
                  <span className="text-[10px] uppercase font-bold">
                    {incident.date_creation}
                  </span>
                </div>
              </div>

              {/* Compteur de confirmations */}
              <div className="flex items-center justify-between bg-white/5 rounded-2xl px-4 py-2 mb-5">
                <div className="flex items-center gap-2">
                  <ThumbsUp size={14} className="text-blue-400" />
                  <span className="text-xs font-bold text-blue-100">
                    {incident.nombre_confirmations || 0} Confirmations
                  </span>
                </div>
                <div className="h-1.5 w-20 bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500 rounded-full"
                    style={{
                      width: `${Math.min((incident.nombre_confirmations || 0) * 10, 100)}%`,
                    }}
                  ></div>
                </div>
              </div>

              {/* ACTIONS BOUTONS PREMIUM */}
              <div className="flex gap-2 w-full">
                {/* CONFIRMER */}
                <button
                  onClick={() => confirmIncident(incident.id)}
                  disabled={loadingConfirm === incident.id}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 h-12 rounded-2xl flex items-center justify-center gap-2 text-[11px] font-black text-white shadow-lg active:scale-95 disabled:opacity-50 transition-all"
                >
                  {/* Structure DOM fixe pour éviter le bug removeChild */}
                  <div className="flex items-center gap-2">
                    {loadingConfirm === incident.id ? (
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <ThumbsUp size={14} strokeWidth={3} />
                    )}
                    <span>
                      {loadingConfirm === incident.id
                        ? "CHARGEMENT..."
                        : "CONFIRMER"}
                    </span>
                  </div>
                </button>

                {/* COMMENTER */}
                <button
                  onClick={() => setSelectedIncident(incident)}
                  className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl 
                     flex items-center justify-center text-white active:scale-95 transition-all"
                >
                  <MessageSquare size={18} />
                </button>

                {/* VOIR AVIS */}
                <button
                  onClick={() => openCommentsModal(incident)}
                  className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl 
                     flex items-center justify-center text-white active:scale-95 transition-all"
                >
                  <Eye size={18} />
                </button>
              </div>
            </div>
          ))}

      {/* ========================================
    MODAL COMMENTAIRE - Premium & Léger
    - Glassmorphism & Halo lumineux
    - En-tête avec icône et bouton X
    - Textarea moderne avec focus soigné
    - 100% CSS pur (Performance max à 60 FPS)
======================================== */}
      {selectedIncident && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          {/* Conteneur principal de la modale */}
          <div
            className="
      relative overflow-hidden
      bg-gradient-to-br from-[#142E4C] via-[#11253c] to-[#0E223A] 
      border border-white/15 
      p-6 md:p-8 
      rounded-[2rem] 
      w-full max-w-md 
      shadow-2xl shadow-black/50 
      text-white
    "
          >
            {/* Halo lumineux d'ambiance en arrière-plan */}
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* ===== HEADER DE LA MODALE ===== */}
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/10">
              {/* Titre et Icône */}
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 shadow-inner">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-extrabold text-lg tracking-tight">
                    Commenter
                  </h3>
                  <p className="text-[11px] text-gray-400 font-medium">
                    Partagez votre avis ou information
                  </p>
                </div>
              </div>

              {/* Bouton de fermeture "X" */}
              <button
                onClick={() => setSelectedIncident(null)}
                className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* ===== ZONE DE SAISIE (TEXTAREA) ===== */}
            <div className="mb-6">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Écrivez votre commentaire ici..."
                className="
            w-full p-4 
            rounded-2xl 
            bg-black/30 
            border border-white/10 
            text-white placeholder-gray-500 
            text-sm font-medium
            outline-none 
            focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 
            transition-all 
            resize-none 
            shadow-inner
          "
                rows={4}
              />
            </div>

            {/* ===== BOUTONS D'ACTION ===== */}
            <div className="flex items-center justify-end gap-3">
              {/* Bouton Annuler */}
              <button
                onClick={() => setSelectedIncident(null)}
                className="
            px-5 py-3 
            rounded-xl 
            bg-white/5 hover:bg-white/10 
            text-gray-300 font-bold text-xs uppercase tracking-wider 
            transition-all
          "
              >
                Annuler
              </button>

              {/* Bouton Envoyer */}
              <button
                onClick={submitComment}
                disabled={loadingComment || !commentText.trim()}
                className="
            px-6 py-3 
            rounded-xl 
            bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 
            text-white font-black text-xs uppercase tracking-widest 
            shadow-lg shadow-blue-500/30 
            hover:shadow-blue-500/50 hover:scale-[1.02] 
            active:scale-95 
            transition-all 
            disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100
            flex items-center gap-2
          "
              >
                {loadingComment ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Envoi...</span>
                  </>
                ) : (
                  <span>Envoyer</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================
    MODAL LISTE DES COMMENTAIRES - Premium & Léger
    - Glassmorphism & Halo lumineux d'ambiance
    - Cartes de commentaires individuelles avec avatar initiales
    - Skeleton loading amélioré & État vide design
    - 100% CSS pur (Performance max à 60 FPS)
======================================== */}
      {commentsModal && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md flex items-center justify-center z-50 p-4 animate-fade-in">
          {/* Conteneur principal de la modale */}
          <div
            className="
      relative overflow-hidden
      bg-gradient-to-br from-[#142E4C] via-[#11253c] to-[#0E223A] 
      border border-white/15 
      p-6 md:p-8 
      rounded-[2rem] 
      w-full max-w-md 
      max-h-[85vh] 
      flex flex-col 
      shadow-2xl shadow-black/50 
      text-white
    "
          >
            {/* Halo lumineux d'ambiance en arrière-plan */}
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

            {/* ===== HEADER DE LA MODALE ===== */}
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-white/10 shrink-0">
              {/* Titre et Icône */}
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-blue-500/10 border border-blue-500/20 rounded-xl text-blue-400 shadow-inner">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z"
                    />
                  </svg>
                </div>
                <div>
                  <h3 className="font-extrabold text-lg tracking-tight">
                    Commentaires
                  </h3>
                  <p className="text-[11px] text-gray-400 font-medium">
                    Échanges et retours sur l'incident
                  </p>
                </div>
              </div>

              {/* Bouton de fermeture "X" */}
              <button
                onClick={() => setCommentsModal(null)}
                className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-colors"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* ===== CORPS DE LA MODALE (SCROLLABLE) ===== */}
            <div className="flex-1 overflow-y-auto space-y-3.5 pr-1 no-scrollbar">
              {loadingComments ? (
                // --- SKELETON LOADING PREMIUM ---
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      className="p-4 bg-white/5 border border-white/5 rounded-2xl animate-pulse space-y-2"
                    >
                      <div className="h-3.5 bg-white/10 rounded-full w-24"></div>
                      <div className="h-4 bg-white/15 rounded-lg w-full"></div>
                    </div>
                  ))}
                </div>
              ) : comments.length > 0 ? (
                // --- LISTE DES COMMENTAIRES ---
                comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="
                p-4 
                bg-white/5 backdrop-blur-sm 
                border border-white/5 hover:border-white/10 
                rounded-2xl 
                transition-all 
                space-y-2
              "
                  >
                    {/* Auteur & Date */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {/* Avatar avec initiale */}
                        <div className="w-6 h-6 rounded-full bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-[10px] font-bold text-blue-300">
                          {comment.utilisateur?.nom
                            ? comment.utilisateur.nom.charAt(0).toUpperCase()
                            : "U"}
                        </div>
                        <span className="text-xs font-bold text-gray-200">
                          {comment.utilisateur?.nom || "Utilisateur anonyme"}
                        </span>
                      </div>

                      {comment.created_at && (
                        <span className="text-[10px] text-gray-500 font-medium">
                          {new Date(comment.created_at).toLocaleDateString()}
                        </span>
                      )}
                    </div>

                    {/* Contenu du commentaire */}
                    <p className="text-sm text-gray-300 font-medium pl-8 leading-relaxed">
                      {comment.contenu}
                    </p>
                  </div>
                ))
              ) : (
                // --- ÉTAT VIDE DESIGN ---
                <div className="py-12 text-center flex flex-col items-center justify-center text-gray-400">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-3 text-gray-500 shadow-inner">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                      />
                    </svg>
                  </div>
                  <p className="text-sm font-semibold text-gray-300">
                    Aucun commentaire
                  </p>
                  <p className="text-[11px] text-gray-500 mt-1">
                    Soyez le premier à réagir sur cet incident.
                  </p>
                </div>
              )}
            </div>

            {/* ===== FOOTER DE LA MODALE ===== */}
            <div className="pt-4 mt-4 border-t border-white/10 shrink-0 flex justify-end">
              <button
                onClick={() => setCommentsModal(null)}
                className="
            px-6 py-2.5 
            rounded-xl 
            bg-white/5 hover:bg-white/10 
            text-gray-300 font-bold text-xs uppercase tracking-wider 
            transition-all
          "
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      
    </div>
  );
}

export default DashboardPage;