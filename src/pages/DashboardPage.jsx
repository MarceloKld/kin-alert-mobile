import { useEffect, useState } from "react";
import api from "../api/axios";

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

      <div className="flex gap-3 mb-6 overflow-x-auto">

  {["all", "valide", "en_attente", "rejete"].map((status) => (
    <button
      key={status}
      onClick={() => setStatusFilter(status)}
      className={`px-4 py-2 rounded-full text-sm ${
        statusFilter === status
          ? "bg-orange-500 text-white"
          : "bg-[#1A3A5A] text-gray-300"
      }`}
    >
      {status === "all"
        ? "Tous"
        : status === "valide"
        ? "Validé"
        : status === "en_attente"
        ? "En attente"
        : "Rejeté"}
    </button>
  ))}

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
              <p className="text-sm text-gray-300">
                {incident.type?.titre}
              </p>
              <h3 className="font-semibold">
                {incident.titre}
              </h3>
              <p className="text-xs text-gray-400">
                📍 {incident.localisation?.commune?.nom}
              </p>
            </div>
{/* ✅ BADGE STATUT */}
  <span
    className={`text-[11px] px-3 py-1 rounded-full font-medium 
                backdrop-blur-sm border transition ${
      incident.statut === "valide"
        ? "bg-green-500/10 text-green-400 border-green-400/30"
        : incident.statut === "en_attente"
        ? "bg-yellow-500/10 text-yellow-400 border-yellow-400/30"
        : "bg-red-500/10 text-red-400 border-red-400/30"
    }`}
  >
    {incident.statut === "valide"
      ? "Validé"
      : incident.statut === "en_attente"
      ? "En attente"
      : "Rejeté"}
  </span>
            

            <span className="text-xs text-gray-400">
              {incident.date_creation}
            </span>
            
            <p className="text-xs text-blue-300 mt-1">
  👍 {incident.nombre_confirmations || 0} confirmations
</p>
          </div>

          <div className="flex gap-3 mt-4">

            <button
              onClick={() => confirmIncident(incident.id)}
              className="bg-blue-500 px-4 py-2 rounded-lg text-sm"
            >
              {loadingConfirm === incident.id
                ? "..."
                : "Confirmer"}
            </button>

            <button
              onClick={() => setSelectedIncident(incident)}
              className="bg-gray-600 px-4 py-2 rounded-lg text-sm"
            >
              Commenter
            </button>
<button
  onClick={() => openCommentsModal(incident)}
  className="bg-purple-600 px-4 py-2 rounded-lg text-sm"
>
  Voir commentaires
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