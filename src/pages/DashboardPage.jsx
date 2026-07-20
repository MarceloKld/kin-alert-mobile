import { useEffect, useState } from "react";
import api from "../api/axios";
import CountUp from "../components/CountUp";

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
const [stats, setStats] = useState({
  total_incidents: 0,
  valide: 0,
  en_attente: 0,
  rejete: 0,
});
const [loadingStats, setLoadingStats] = useState(true);

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
  setLoadingConfirm(id);

  try {
    await api.post(`/incidents/${id}/confirm`);

    // ✅ Mise à jour complète depuis backend si possible
    setIncidents((prev) =>
      prev.map((incident) =>
        incident.id === id
          ? {
              ...incident,
              nombre_confirmations:
                (incident.nombre_confirmations || 0) + 1,
            }
          : incident
      )
    );

    setToast({
      type: "success",
      message: "✅ Confirmation enregistrée",
    });

    setTimeout(() => setToast(null), 3000);

  } catch (error) {
    setToast({
      type: "error",
      message:
        error.response?.data?.message ||
        "Erreur lors de la confirmation",
    });

    setTimeout(() => setToast(null), 3000);

  } finally {
    setLoadingConfirm(null);
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
      const response = await api.get("/incidents/stats");
      setStats(response.data);
    } catch (error) {
      console.error("Erreur stats", error);
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
  <div className="fixed top-6 right-6 z-50 
                  animate-slideIn">

    <div className={`px-4 py-3 rounded-xl shadow-2xl 
                    text-white text-sm 
                    ${
                      toast.type === "error"
                        ? "bg-red-500"
                        : "bg-green-500"
                    }`}>

      {toast.message}

    </div>

  </div>
)}

      <h1 className="text-xl font-semibold pt-6">
        Mes Infos
      </h1>

     
      <h2 className="text-lg mt-6 mb-4">
        Fil d'Actualité
      </h2>

      <div className="flex gap-2 mb-5 overflow-x-auto">
{loadingStats ? (
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="w-20 h-7 bg-gray-600 rounded-full animate-pulse"
            />
          ))}
        </div>
      ) : (
        [
          { key: "all", label: "Tous", value: stats.total_incidents },
          { key: "valide", label: "Validé", value: stats.valide },
          { key: "en_attente", label: "Attente", value: stats.en_attente },
          { key: "rejete", label: "Rejeté", value: stats.rejete },
        ].map((item) => (
          <button
            key={item.key}
            onClick={() => setStatusFilter(item.key)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
              statusFilter === item.key
                ? "bg-orange-500 text-white shadow-md"
                : "bg-[#1A3A5A] text-gray-300"
            }`}
          >
            <span>{item.label}</span>
            <span className="bg-black/20 px-1.5 rounded-full text-[10px]">
              <CountUp value={item.value} />
            </span>
          </button>
        ))
      )}

</div>


<div className="mt-4 bg-[#142E4C] p-4 rounded-xl">

  <p className="text-xs text-gray-400 mb-3">
    Répartition des incidents
  </p>

  <div className="space-y-2">

    {[
      { label: "Validé", value: stats.valide, color: "bg-green-500" },
      { label: "Attente", value: stats.en_attente, color: "bg-yellow-500" },
      { label: "Rejeté", value: stats.rejete, color: "bg-red-500" },
    ].map((item) => {
      const percent =
        stats.total_incidents > 0
          ? (item.value / stats.total_incidents) * 100
          : 0;

      return (
        <div key={item.label}>
          <div className="flex justify-between text-xs mb-1">
            <span>{item.label}</span>
            <span>{item.value}</span>
          </div>

          <div className="w-full bg-gray-700 h-2 rounded-full">
            <div
              className={`${item.color} h-2 rounded-full transition-all duration-700`}
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
      );
    })}

  </div>
</div>

{loading && (
  <div className="space-y-4 mt-6">
    {[1,2,3].map((i) => (
      <div
        key={i}
        className="bg-[#142E4C] rounded-2xl p-4 animate-pulse"
      >
        <div className="h-4 bg-gray-600 rounded w-1/2 mb-3"></div>
        <div className="h-3 bg-gray-700 rounded w-3/4"></div>
      </div>
    ))}
  </div>
)}

      {!loading && incidents
  .filter((incident) => {
  if (statusFilter === "all") return true;
  return incident.statut === statusFilter;
})
  .map((incident) => (
        <div
          key={incident.id}
         className="relative bg-[#142E4C] rounded-2xl p-4 mb-4 shadow-lg animate-fadeUp overflow-hidden">
{/* Petite barre latérale colorée selon le statut */}
    <div className={`absolute left-0 top-0 bottom-0 w-1 ${
      incident.statut === "valide"
        ? "bg-green-400"
        : incident.statut === "en_attente"
        ? "bg-yellow-400"
        : "bg-red-400"
    }`} />
          <div className="flex justify-between items-center">

            <div>
              <p className="text-xs uppercase tracking-widest text-blue-300 font-medium">
                {incident.type?.titre}
              </p>
              <h3 className="text-lg font-semibold tracking-wide">
                {incident.titre}
              </h3>
              <p className="text-sm text-gray-400 flex items-center gap-1 mt-1">
                📍 {incident.localisation?.commune?.nom}
              </p>
            </div>
{/* ✅ BADGE STATUT */}
<span
  className={`text-[10px] px-2 py-0.5 rounded-full font-medium
    ${
      incident.statut === "valide"
        ? "bg-green-500/20 text-green-400"
        : incident.statut === "en_attente"
        ? "bg-yellow-500/20 text-yellow-400"
        : "bg-red-500/20 text-red-400"
    }`}
>
  {incident.statut === "valide"
    ? "Validé"
    : incident.statut === "en_attente"
    ? "Attente"
    : "Rejeté"}
</span>
            

            <span className="text-[9px] text-gray-400 ">
              {incident.date_creation}
            </span>
            
           <p className="text-[11px] text-blue-400 mt-1 font-medium">
  👍 {incident.nombre_confirmations || 0} confirmations
</p>
          </div>

          <div className="flex gap-3 mt-4">

            <button
  onClick={() => confirmIncident(incident.id)}
  disabled={loadingConfirm === incident.id}
  className="bg-gradient-to-r from-blue-500 to-indigo-600 
             px-4 py-2 rounded-xl text-sm font-medium 
             shadow-md hover:scale-105 transition-all duration-200
             disabled:opacity-50"
>
  {loadingConfirm === incident.id ? "..." : "Confirmer"}
</button>

            <button
  onClick={() => setSelectedIncident(incident)}
  className="bg-gray-700 px-4 py-2 rounded-xl text-sm font-medium 
             hover:bg-gray-600 transition-all duration-200"
>
  Commenter
</button>

<button
  onClick={() => openCommentsModal(incident)}
  className="bg-gradient-to-r from-purple-600 to-pink-600 
             px-4 py-2 rounded-xl text-sm font-medium 
             shadow-md hover:scale-105 transition-all duration-200"
>
  Voir les commentaires
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