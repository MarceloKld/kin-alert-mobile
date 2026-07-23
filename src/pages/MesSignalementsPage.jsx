import { useEffect, useState } from "react";
import api from "../api/axios";

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

      <div className="flex items-center gap-3 pt-6 mb-6">

  <div className="w-10 h-10 flex items-center justify-center 
                  rounded-2xl 
                  bg-gradient-to-br 
                  from-blue-500 to-indigo-600 
                  shadow-lg">
    🚨
  </div>

  <div>
    <h1 className="text-2xl font-bold tracking-tight">
      Mes Signalements
    </h1>
    <p className="text-xs text-gray-400">
      Historique de vos incidents déclarés
    </p>
  </div>

</div>


      {/* ==========================
    CARTE PREMIUM STATS USER
========================== */}

{stats && (
  <div className="bg-gradient-to-r 
                  from-[#1B3A5B] 
                  to-[#12283F] 
                  rounded-3xl 
                  p-5 
                  mb-6 
                  shadow-xl 
                  border border-blue-900/40">

    <div className="flex justify-between items-center">

      {/* Commentaires */}
      <div className="text-center flex-1">
        <p className="text-3xl font-bold text-blue-400">
          {stats.total_commentaires_sur_mes_incidents}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          💬 Commentaires
        </p>
      </div>

      {/* Séparateur */}
      <div className="w-px h-10 bg-blue-900/40 mx-3"></div>

      {/* Confirmations */}
      <div className="text-center flex-1">
        <p className="text-3xl font-bold text-green-400">
          {stats.total_confirmations_sur_mes_incidents}
        </p>
        <p className="text-xs text-gray-400 mt-1">
          ✅ Confirmations
        </p>
      </div>

    </div>
  </div>
)}

      {/* ==========================
    FILTRES + STATS
=========================== */}

{stats && (
  <div className="flex gap-1.5 sm:gap-2 mb-5 overflow-x-auto pb-1 no-scrollbar">

    <button
      onClick={() => setSelectedStatus("all")}
      className={`shrink-0 whitespace-nowrap px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-medium transition-all ${
        selectedStatus === "all"
          ? "bg-blue-500 text-white"
          : "bg-[#142E4C] text-gray-400"
      }`}
    >
      Tous <span className="text-[10px] opacity-80">({stats.total_mes_incidents})</span>
    </button>

    <button
      onClick={() => setSelectedStatus("valide")}
      className={`shrink-0 whitespace-nowrap px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-medium transition-all ${
        selectedStatus === "valide"
          ? "bg-green-500 text-white"
          : "bg-[#142E4C] text-gray-400"
      }`}
    >
      Validés <span className="text-[10px] opacity-80">({stats.mes_valides})</span>
    </button>

    <button
      onClick={() => setSelectedStatus("en_attente")}
      className={`shrink-0 whitespace-nowrap px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-medium transition-all ${
        selectedStatus === "en_attente"
          ? "bg-yellow-500 text-white"
          : "bg-[#142E4C] text-gray-400"
      }`}
    >
      En attente <span className="text-[10px] opacity-80">({stats.mes_en_attente})</span>
    </button>

    <button
      onClick={() => setSelectedStatus("rejete")}
      className={`shrink-0 whitespace-nowrap px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-medium transition-all ${
        selectedStatus === "rejete"
          ? "bg-red-500 text-white"
          : "bg-[#142E4C] text-gray-400"
      }`}
    >
      Rejetés <span className="text-[10px] opacity-80">({stats.mes_rejetes})</span>
    </button>

  </div>
)}


      {/* ==========================
          LISTE INCIDENTS
      =========================== */}

   {loading && (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className="bg-[#142E4C] rounded-2xl p-4 animate-pulse"
      >
        <div className="h-4 bg-gray-600 rounded w-1/2 mb-3"></div>
        <div className="h-3 bg-gray-700 rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-gray-700 rounded w-2/3"></div>
      </div>
    ))}
  </div>
)}

      {!loading && myIncidents.length === 0 && (
        <p className="text-gray-400 text-sm">
          Aucun signalement.
        </p>
      )}

      {!loading && Array.isArray(myIncidents) && Array.isArray(myIncidents) && myIncidents.map((incident) => (
        <div
          key={incident.id}
          className="bg-gradient-to-br 
           from-[#142E4C] 
           to-[#10283F] 
           rounded-3xl 
           p-5 
           mb-5 
           shadow-xl 
           border border-blue-900/30 
           transition-all duration-300 
           hover:scale-[1.01]"
        >

         <div className="flex items-start gap-3">
          {/* Icône accident */}
          <div className="w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/20">
            ⚠️
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-base tracking-tight">
                {incident.titre}
              </h3>

              {/* Statut amélioré */}
              <span
                className={`text-xs font-semibold ${
                  incident.statut === "valide"
                    ? "text-green-400"
                    : incident.statut === "en_attente"
                    ? "text-yellow-400"
                    : "text-red-400"
                }`}
              >
                {incident.statut === "valide" && "✓ Validé"}
                {incident.statut === "en_attente" && "⏳ En attente"}
                {incident.statut === "rejete" && "✕ Rejeté"}
              </span>
            </div>

            <p className="text-xs text-gray-400 mt-1">
              {incident.type?.titre}
            </p>
          </div>
        </div>
<div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-2 text-xs text-gray-300">
            <span className="text-green-400">✓</span>
            {incident.nombre_confirmations} confirmations
          </div>

          <button
            onClick={() => openComments(incident.id)}
            className="text-xs font-medium bg-gradient-to-r from-blue-500 to-indigo-600 px-4 py-2 rounded-xl shadow-md hover:opacity-90 transition-all text-white"
          >
            Voir commentaires
          </button>
        </div>
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