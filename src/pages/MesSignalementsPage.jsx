import { useEffect, useState } from "react";
import api from "../api/axios";
import { ShieldAlert, History, AlertTriangle, ThumbsUp, ChevronRight } from "lucide-react";
import { MessageSquare, CheckCircle2, TrendingUp,LayoutGrid, Clock, XCircle } from "lucide-react";



function MesSignalementsPage() {

  // ==============================
  // STATES
  // ==============================

  const [myIncidents, setMyIncidents] = useState([]);
  const [loading, setLoading] = useState(false);

  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [selectedStatus, setSelectedStatus] = useState("all");
  const [stats, setStats] = useState(null);


  // ==============================
// LOAD MES STATS (USER CONNECTÉ)
// ==============================

useEffect(() => {
  const loadMyStats = async () => {
    try {
      const res = await api.get("/statistics/my-dashboard");
      setStats(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  loadMyStats();
}, []);

  // ==============================
  // LOAD MY INCIDENTS
  // ==============================

  useEffect(() => {
    const loadMyIncidents = async () => {
      setLoading(true);

      try {
        let url = "/my-incidents";

        if (selectedStatus !== "all") {
          url += `?statut=${selectedStatus}`;
        }

        const res = await api.get(url);
        setMyIncidents(Array.isArray(res.data) ? res.data : res.data.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadMyIncidents();
  }, [selectedStatus]);

  // ==============================
  // OPEN COMMENTS MODAL
  // ==============================

  const openComments = async (incidentId) => {

    setShowModal(true);
    setLoadingComments(true);
    setComments([]);

    try {
      const res = await api.get(`/incidents/${incidentId}/comments`);
      setComments(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingComments(false);
    }
  };

  // ==============================
  // UI
  // ==============================

  return (
    <div className="min-h-screen bg-gradient-to-b 
                    from-[#0E223A] to-[#091522] 
                    text-white px-4 pb-28">

     {/* ==========================
    HEADER MES SIGNALEMENTS PREMIUM
========================== */}
<div className="pt-6 mb-8 px-1">
  <div className="flex items-center gap-4">
    
    {/* Conteneur d'icône avec double lueur et bordure interne */}
    <div className="w-12 h-12 flex items-center justify-center 
                    rounded-2xl 
                    bg-gradient-to-br from-blue-500 to-indigo-600 
                    shadow-[0_8px_20px_rgba(59,130,246,0.3)]
                    border border-white/10 relative">
      <ShieldAlert size={24} className="text-white" strokeWidth={2.5} />
      
      {/* Petit badge d'historique superposé */}
      <div className="absolute -bottom-1 -right-1 bg-[#0E223A] p-0.5 rounded-md">
        <History size={10} className="text-blue-400" />
      </div>
    </div>

    <div className="flex-1">
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-black tracking-tighter text-white uppercase italic">
          Mes Signalements
        </h1>
      </div>
      
      {/* Barre décorative dégradée */}
      <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mt-1.5 shadow-sm"></div>
      
      <p className="text-[11px] text-gray-400 font-bold mt-1 tracking-wider uppercase opacity-60">
        Historique de vos incidents déclarés
      </p>
    </div>
  </div>
</div>
{/* ==========================
    CARTE PREMIUM STATS USER
========================== */}
{stats && (
  <div className="relative overflow-hidden bg-gradient-to-br from-[#1B3A5B] to-[#0E223A] 
                  rounded-[2.5rem] p-6 mb-8 shadow-[0_20px_40px_rgba(0,0,0,0.3)] 
                  border border-white/10 animate-fadeIn">
    
    {/* Effet de lumière en arrière-plan (Design Premium) */}
    <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
    <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>

    <div className="flex justify-between items-center relative z-10">

      {/* SECTION COMMENTAIRES */}
      <div className="text-center flex-1 flex flex-col items-center">
        <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center mb-3 border border-blue-500/30">
          <MessageSquare size={22} className="text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]" />
        </div>
        <p className="text-4xl font-black text-white tracking-tighter">
          {stats.total_commentaires_sur_mes_incidents || 0}
        </p>
        <div className="flex items-center gap-1 mt-1">
          <span className="text-[10px] font-black text-blue-300 uppercase tracking-widest">Avis</span>
          <TrendingUp size={10} className="text-blue-400" />
        </div>
      </div>

      {/* SÉPARATEUR DESIGN */}
      <div className="flex flex-col items-center gap-1 mx-2">
        <div className="w-[1.5px] h-6 bg-gradient-to-t from-transparent via-blue-500/40 to-transparent"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-blue-500/40"></div>
        <div className="w-[1.5px] h-6 bg-gradient-to-b from-transparent via-blue-500/40 to-transparent"></div>
      </div>

      {/* SECTION CONFIRMATIONS */}
      <div className="text-center flex-1 flex flex-col items-center">
        <div className="w-12 h-12 bg-green-500/20 rounded-2xl flex items-center justify-center mb-3 border border-green-500/30">
          <CheckCircle2 size={22} className="text-green-400 drop-shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
        </div>
        <p className="text-4xl font-black text-white tracking-tighter">
          {stats.total_confirmations_sur_mes_incidents || 0}
        </p>
        <div className="flex items-center gap-1 mt-1">
          <span className="text-[10px] font-black text-green-300 uppercase tracking-widest">Votes</span>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        </div>
      </div>

    </div>

    {/* Footer de la carte (Optionnel pour le look Pro) */}
    <div className="mt-6 pt-4 border-t border-white/5 flex justify-center">
        <p className="text-[9px] text-gray-500 uppercase font-bold tracking-[0.2em]">Données synchronisées en temps réel</p>
    </div>
  </div>
)}
{/* ==========================
    FILTRES + STATS PREMIUM
=========================== */}
{stats && (
  <div className="flex gap-3 mb-8 overflow-x-auto py-2 no-scrollbar scroll-smooth">
    
    {[
      { 
        id: "all", 
        label: "Tous", 
        count: stats.total_mes_incidents, 
        icon: LayoutGrid, 
        color: "blue" 
      },
      { 
        id: "valide", 
        label: "Validés", 
        count: stats.mes_valides, 
        icon: CheckCircle2, 
        color: "green" 
      },
      { 
        id: "en_attente", 
        label: "Attente", 
        count: stats.mes_en_attente, 
        icon: Clock, 
        color: "yellow" 
      },
      { 
        id: "rejete", 
        label: "Rejetés", 
        count: stats.mes_rejetes, 
        icon: XCircle, 
        color: "red" 
      }
    ].map((filter) => {
      const isActive = selectedStatus === filter.id;
      const Icon = filter.icon;
      
      // Configuration dynamique des couleurs
      const colors = {
        blue: isActive ? "bg-blue-600 border-blue-400 shadow-blue-900/40" : "bg-white/5 border-white/10 text-gray-400",
        green: isActive ? "bg-green-600 border-green-400 shadow-green-900/40" : "bg-white/5 border-white/10 text-gray-400",
        yellow: isActive ? "bg-yellow-500 border-yellow-300 shadow-yellow-900/40" : "bg-white/5 border-white/10 text-gray-400",
        red: isActive ? "bg-red-600 border-red-400 shadow-red-900/40" : "bg-white/5 border-white/10 text-gray-400",
      };

      return (
        <button
          key={filter.id}
          onClick={() => setSelectedStatus(filter.id)}
          className={`shrink-0 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border transition-all duration-300 active:scale-90
            ${colors[filter.color]} ${isActive ? "text-white shadow-xl scale-105" : "hover:bg-white/10"}`}
        >
          {/* Icône avec effet de brillance si actif */}
          <Icon size={16} strokeWidth={isActive ? 3 : 2} className={isActive ? "animate-pulse" : "opacity-60"} />
          
          <span className={`text-[11px] font-black uppercase tracking-tight ${isActive ? "opacity-100" : "opacity-80"}`}>
            {filter.label}
          </span>

          {/* Badge du compteur */}
          <span className={`flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-lg text-[10px] font-black
            ${isActive ? "bg-white/20 text-white" : "bg-white/10 text-gray-500"}`}>
            {filter.count || 0}
          </span>
        </button>
      );
    })}

  </div>
)}

{/* ==========================
      LISTE INCIDENTS PREMIUM
=========================== */}

{/* SKELETON LOADING */}
{loading && (
  <div className="space-y-5">
    {[1, 2, 3].map((i) => (
      <div key={i} className="bg-[#142E4C]/40 border border-white/5 rounded-[2rem] p-5 animate-pulse">
        <div className="flex gap-4 items-center mb-4">
          <div className="w-12 h-12 bg-gray-700 rounded-2xl"></div>
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-600 rounded w-1/2"></div>
            <div className="h-3 bg-gray-700 rounded w-1/3"></div>
          </div>
        </div>
        <div className="h-10 bg-gray-700 rounded-xl w-full"></div>
      </div>
    ))}
  </div>
)}

{/* EMPTY STATE */}
{!loading && myIncidents.length === 0 && (
  <div className="flex flex-col items-center justify-center py-10 bg-white/5 rounded-[2.5rem] border border-dashed border-white/10">
    <ShieldAlert size={40} className="text-gray-600 mb-3" strokeWidth={1} />
    <p className="text-gray-400 text-sm font-medium">Aucun signalement déclaré.</p>
  </div>
)}

{/* LISTE DES SIGNALEMENTS */}
{!loading && Array.isArray(myIncidents) && myIncidents.map((incident) => (
  <div
    key={incident.id}
    className="group relative bg-gradient-to-br from-[#142E4C] to-[#0E223A] 
               rounded-[2.2rem] p-5 mb-5 shadow-2xl border border-white/5 
               transition-all duration-300 active:scale-[0.97]"
  >
    <div className="flex items-start gap-4">
      {/* Icône de type d'incident stylisée */}
      <div className="w-12 h-12 flex-none flex items-center justify-center rounded-2xl 
                      bg-orange-500/10 border border-orange-500/20 shadow-inner">
        <AlertTriangle size={22} className="text-orange-500" strokeWidth={2.5} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-start mb-1">
          <h3 className="font-extrabold text-base text-white tracking-tight truncate pr-2 uppercase">
            {incident.titre}
          </h3>
          
          {/* Badge de Statut Premium */}
          <div className={`flex items-center gap-1 font-black text-[10px] uppercase tracking-tighter ${
            incident.statut === "valide" ? "text-green-400" : 
            incident.statut === "en_attente" ? "text-yellow-400" : "text-red-400"
          }`}>
            {incident.statut === "valide" && <CheckCircle2 size={12} />}
            {incident.statut === "en_attente" && <Clock size={12} />}
            {incident.statut === "rejete" && <XCircle size={12} />}
            <span>{incident.statut}</span>
          </div>
        </div>

        <p className="text-[11px] text-blue-400/80 font-bold uppercase tracking-widest">
          {incident.type?.titre}
        </p>
      </div>
    </div>

    {/* Section Footer de la carte */}
    <div className="flex justify-between items-center mt-6 pt-4 border-t border-white/5">
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 rounded-full border border-green-500/10">
          <ThumbsUp size={12} className="text-green-400" strokeWidth={3} />
          <span className="text-[11px] font-black text-green-100">
            {incident.nombre_confirmations}
          </span>
        </div>
        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-tighter">Validations</p>
      </div>

      {/* Bouton Commentaires Premium */}
      <button
        onClick={() => openComments(incident.id)}
        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 
                   pl-4 pr-2 py-2 rounded-2xl shadow-lg shadow-blue-900/30 
                   hover:brightness-110 active:scale-95 transition-all text-white"
      >
        <span className="text-[10px] font-black uppercase tracking-wider">Avis</span>
        <div className="w-7 h-7 bg-white/20 rounded-xl flex items-center justify-center">
          <MessageSquare size={14} fill="currentColor" />
        </div>
      </button>
    </div>
    
    {/* Décoration subtile d'arrière-plan */}
    <ChevronRight className="absolute top-1/2 -right-1 -translate-y-1/2 text-white/5 w-12 h-12" />
  </div>
))}

      {/* ==========================
          MODAL COMMENTAIRES
      =========================== */}

      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50">

          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowModal(false)}
          />

          <div className="relative bg-[#142E4C] 
                          rounded-3xl p-6 
                          w-[90%] max-w-md 
                          max-h-[80vh] 
                          overflow-y-auto">

            <h2 className="text-lg font-semibold mb-4">
              Commentaires
            </h2>

            {loadingComments && (
              <p className="text-gray-400 text-sm">
                Chargement...
              </p>
            )}

            {!loadingComments && comments.length === 0 && (
              <p className="text-gray-400 text-sm">
                Aucun commentaire.
              </p>
            )}

            {!loadingComments && comments.map((comment) => (
              <div
                key={comment.id}
                className="bg-[#0E223A] p-3 rounded-xl mb-3"
              >
                <p className="text-xs text-blue-300">
                  {comment.utilisateur.nom} ({comment.utilisateur.role})
                </p>

                <p className="text-sm mt-1">
                  {comment.contenu}
                </p>

                <p className="text-xs text-gray-400 mt-1">
                  {comment.date_creation}
                </p>
              </div>
            ))}

            <button
              onClick={() => setShowModal(false)}
              className="mt-4 w-full bg-blue-500 py-2 rounded-lg"
            >
              Fermer
            </button>

          </div>

        </div>
      )}

    </div>
  );
}

export default MesSignalementsPage;