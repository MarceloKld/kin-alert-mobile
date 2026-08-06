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
    <div className="min-h-screen bg-gradient-to-b 
                    from-[#0E223A] to-[#091522] 
                    text-white pb-28 px-4">
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

   {/* ==========================
    HEADER DASHBOARD PREMIUM
========================== */}
<div className="pt-6 mb-8">
  {/* Ligne principale */}
  <div className="flex items-center gap-4">
    {/* Icone SVG avec dégradé et ombre portée */}
    <div className="w-12 h-12 flex items-center justify-center 
                    rounded-2xl 
                    bg-gradient-to-br from-indigo-500 to-blue-600 
                    shadow-[0_8px_20px_rgba(79,70,229,0.3)]
                    border border-white/10">
      <BarChart3 size={24} className="text-white" strokeWidth={2.5} />
    </div>

    <div className="flex-1">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-black tracking-tighter text-white uppercase">
          Mes Infos
        </h1>
        <div className="px-2 py-0.5 bg-blue-500/20 rounded-md">
           <TrendingUp size={12} className="text-blue-400" />
        </div>
      </div>
      
      {/* Barre décorative dégradée */}
      <div className="w-20 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mt-1.5 shadow-sm"></div>
      
      <p className="text-[11px] text-gray-400 font-medium mt-1 tracking-wide uppercase opacity-70">
        Statistiques & Activités globales
      </p>
    </div>
  </div>
</div>


{/* ==========================
    SECTION ACTUALITÉ
========================== */}
<div className="flex items-center justify-between mb-5 px-1">
  <div className="flex items-center gap-3">
    <div className="p-2 bg-blue-500/10 rounded-lg border border-blue-500/20">
      <Newspaper size={18} className="text-blue-400" strokeWidth={2.5} />
    </div>
    <h2 className="text-lg font-extrabold tracking-tight text-white uppercase">
      Fil d’Actualité
    </h2>
  </div>
  
  {/* Petit badge "Live" pour le côté Premium */}
  <div className="flex items-center gap-1.5 px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full">
    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping"></span>
    <span className="text-[10px] font-bold text-red-500 uppercase">En Direct</span>
  </div>
</div>

{/* --- FILTRES DE STATUT PREMIUM --- */}
{!loadingStats && stats && (
  <div className="flex gap-3 mb-8 overflow-x-auto py-2 no-scrollbar scroll-smooth">
    {[
      { key: "all", label: "Tous", value: stats.total_incidents, icon: LayoutGrid, color: "orange" },
      { key: "valide", label: "Validé", value: stats.valide, icon: CheckCircle2, color: "green" },
      { key: "en_attente", label: "Attente", value: stats.en_attente, icon: Clock, color: "yellow" },
      { key: "rejete", label: "Rejeté", value: stats.rejete, icon: XCircle, color: "red" },
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
            ${isActive 
              ? `${activeStyles[item.color]} text-white shadow-xl scale-105` 
              : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
            }`}
        >
          <Icon size={16} strokeWidth={isActive ? 3 : 2} className={isActive ? "animate-pulse" : "opacity-60"} />
          
          <span className={`text-[11px] font-black uppercase tracking-tight ${isActive ? "opacity-100" : "opacity-80"}`}>
            {item.label}
          </span>

          <span className={`flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-lg text-[10px] font-black
            ${isActive ? "bg-white/20 text-white" : "bg-white/10 text-gray-500"}`}>
            {item.value || 0}
          </span>
        </button>
      );
    })}
  </div>
)}

{/* --- SKELETON LOADING PREMIUM --- */}
{loading && (
  <div className="space-y-6 mt-4 px-1">
    {[1, 2, 3].map((i) => (
      <div key={i} className="bg-[#142E4C]/50 border border-white/5 rounded-[2.5rem] p-6 animate-pulse">
        {/* Header du skeleton */}
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-2">
            <div className="h-3 bg-gray-700 rounded-full w-20"></div>
            <div className="h-6 bg-gray-600 rounded-xl w-48"></div>
          </div>
          <div className="h-6 bg-gray-700 rounded-full w-20"></div>
        </div>

        {/* Corps du skeleton (Localisation) */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-4 h-4 bg-gray-700 rounded-full"></div>
          <div className="h-4 bg-gray-700 rounded-lg w-32"></div>
        </div>

        {/* Footer du skeleton (Actions) */}
        <div className="flex gap-3">
          <div className="h-12 bg-gray-700 rounded-2xl flex-1"></div>
          <div className="h-12 bg-gray-700 rounded-2xl w-12"></div>
          <div className="h-12 bg-gray-700 rounded-2xl w-12"></div>
        </div>
      </div>
    ))}
  </div>
)}

{/* --- LISTE DES INCIDENTS --- */}
{!loading && incidents
  .filter((incident) => statusFilter === "all" ? true : incident.statut === statusFilter)
  .map((incident) => (
    <div
      key={incident.id}
      className="relative bg-gradient-to-b from-[#142E4C] to-[#112641] 
                 rounded-[2.5rem] p-5 mb-5 shadow-2xl border border-white/5 
                 animate-fadeUp active:scale-[0.98] transition-transform overflow-hidden"
    >
      {/* Barre latérale d'état dynamique */}
      <div className={`absolute left-0 top-0 bottom-0 w-1.5 ${
        incident.statut === "valide" ? "bg-green-500" : 
        incident.statut === "en_attente" ? "bg-yellow-500" : "bg-red-500"
      }`} />

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
        <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-bold uppercase border ${
          incident.statut === "valide" ? "bg-green-500/10 border-green-500/20 text-green-400" : 
          incident.statut === "en_attente" ? "bg-yellow-500/10 border-yellow-500/20 text-yellow-400" : 
          "bg-red-500/10 border-red-500/20 text-red-400"
        }`}>
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
          <span className="text-xs font-medium">{incident.localisation?.commune?.nom}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-500">
          <Calendar size={14} />
          <span className="text-[10px] uppercase font-bold">{incident.date_creation}</span>
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
            style={{ width: `${Math.min((incident.nombre_confirmations || 0) * 10, 100)}%` }}
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
              <span>{loadingConfirm === incident.id ? "CHARGEMENT..." : "CONFIRMER"}</span>
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
      {/* ✅ Modal Commentaire */}
      {selectedIncident && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center">

          <div className="bg-[#142E4C] p-6 rounded-2xl w-[90%] max-w-sm">

            <h3 className="font-semibold mb-4">
              Commenter
            </h3>

            <textarea
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              className="w-full p-3 rounded-lg bg-[#0E223A] text-white"
              rows="3"
            />

            <div className="flex justify-end gap-3 mt-4">

              <button
                onClick={() => setSelectedIncident(null)}
                className="text-gray-400"
              >
                Annuler
              </button>

              <button
  onClick={submitComment}
  className="bg-blue-500 px-4 py-2 rounded-lg"
  disabled={loadingComment}
>
  {loadingComment ? "..." : "Envoyer"}
</button>

            </div>

          </div>

        </div>
      )}

      {commentsModal && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-[#142E4C] p-6 rounded-2xl w-[95%] max-w-md max-h-[80vh] overflow-y-auto">

      <h3 className="font-semibold mb-4">
        Commentaires
      </h3>

      {loadingComments ? (
        <div className="space-y-3">
          {[1,2,3].map((i) => (
            <div
              key={i}
              className="h-4 bg-gray-600 rounded animate-pulse"
            />
          ))}
        </div>
      ) : comments.length > 0 ? (
        comments.map((comment) => (
          <div
            key={comment.id}
            className="border-b border-gray-600 py-2 text-sm"
          >
            <p className="text-gray-300">
              {comment.contenu}
            </p>

            <p className="text-xs text-gray-400 mt-1">
              Par {comment.utilisateur?.nom}
            </p>
          </div>
        ))
      ) : (
        <p className="text-gray-400 text-sm">
          Aucun commentaire
        </p>
      )}

      <div className="flex justify-end mt-4">
        <button
          onClick={() => setCommentsModal(null)}
          className="text-gray-400"
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