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

      <h1 className="text-xl font-semibold pt-6 mb-6">
        Mes Signalements
      </h1>

      {/* ==========================
          FILTRES + STATS
      =========================== */}

     {stats && (
  <div className="flex gap-2 mb-6 overflow-x-auto">

    <button
      onClick={() => setSelectedStatus("all")}
      className={`px-4 py-2 rounded-xl text-xs ${
        selectedStatus === "all"
          ? "bg-blue-500"
          : "bg-[#142E4C]"
      }`}
    >
      Tous ({stats.total_mes_incidents})
    </button>

    <button
      onClick={() => setSelectedStatus("valide")}
      className={`px-4 py-2 rounded-xl text-xs ${
        selectedStatus === "valide"
          ? "bg-green-500"
          : "bg-[#142E4C]"
      }`}
    >
      Validés ({stats.mes_valides})
    </button>

    <button
      onClick={() => setSelectedStatus("en_attente")}
      className={`px-4 py-2 rounded-xl text-xs ${
        selectedStatus === "en_attente"
          ? "bg-yellow-500"
          : "bg-[#142E4C]"
      }`}
    >
      En attente ({stats.mes_en_attente})
    </button>

    <button
      onClick={() => setSelectedStatus("rejete")}
      className={`px-4 py-2 rounded-xl text-xs ${
        selectedStatus === "rejete"
          ? "bg-red-500"
          : "bg-[#142E4C]"
      }`}
    >
      Rejetés ({stats.mes_rejetes})
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
          className="bg-[#142E4C] rounded-2xl p-4 mb-4 shadow-lg"
        >

          <div className="flex justify-between">
            <div>
              <h3 className="font-semibold">
                {incident.titre}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                {incident.type?.titre}
              </p>
            </div>

            <span className="text-xs text-blue-300">
              {incident.statut}
            </span>
          </div>

          <div className="flex justify-between items-center mt-3 text-xs text-gray-400">
            <span>
              ✅ {incident.nombre_confirmations} confirmations
            </span>

            <button
              onClick={() => openComments(incident.id)}
              className="bg-blue-500 px-3 py-1 rounded-lg"
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