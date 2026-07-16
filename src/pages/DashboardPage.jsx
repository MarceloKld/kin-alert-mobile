import { useEffect, useState } from "react";
import api from "../api/axios";

function DashboardPage() {

  const [incidents, setIncidents] = useState([]);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [loadingConfirm, setLoadingConfirm] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
const [successMessage, setSuccessMessage] = useState("");
const [loadingComment, setLoadingComment] = useState(false);
const [loading, setLoading] = useState(false);
const [myIncidents, setMyIncidents] = useState([]);
const [loadingMy, setLoadingMy] = useState(false);

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
  setErrorMessage("");
  setSuccessMessage("");

  try {
    await api.post(`/incidents/${id}/confirm`);

    setIncidents((prev) =>
      prev.map((i) =>
        i.id === id
          ? { ...i, nombre_confirmations: i.nombre_confirmations + 1 }
          : i
      )
    );

    setSuccessMessage("✅ Confirmation enregistrée");

  } catch (error) {
    if (error.response?.data?.message) {
      setErrorMessage(error.response.data.message);
    } else {
      setErrorMessage("Erreur lors de la confirmation.");
    }
  } finally {
    setLoadingConfirm(null);
  }
};

//Charger MES incidents
useEffect(() => {

  const loadMyIncidents = async () => {
    setLoadingMy(true);

    try {
      const res = await api.get("/incidents?mine=true");
      setMyIncidents(res.data.data || res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingMy(false);
    }
  };

  loadMyIncidents();

}, []);

  // ✅ Commenter incident
  const submitComment = async () => {
  if (!commentText) return;

  setLoadingComment(true);

  try {
    await api.post(`/incidents/${selectedIncident.id}/comments`, {
      contenu: commentText,
    });

    setCommentText("");
    setSelectedIncident(null);

  } catch (error) {
    console.error(error);
    setErrorMessage("Erreur lors de l'envoi du commentaire.");
  } finally {
    setLoadingComment(false);
  }
};







  return (
    <div className="min-h-screen bg-gradient-to-b 
                    from-[#0E223A] to-[#091522] 
                    text-white pb-28 px-4">

      <h1 className="text-xl font-semibold pt-6">
        Mes Infos
      </h1>

      {errorMessage && (
  <div className="bg-red-500 text-white p-3 rounded-lg mb-4 text-sm">
    {errorMessage}
  </div>
)}

{successMessage && (
  <div className="bg-green-500 text-white p-3 rounded-lg mb-4 text-sm">
    {successMessage}
  </div>
)}

      <h2 className="text-lg mt-6 mb-4">
        Fil d'Actualité
      </h2>

      <div className="bg-[#142E4C] rounded-2xl p-4 mb-6">

  <h3 className="text-lg font-semibold mb-3">
    Mes Signalements
  </h3>

  {loadingMy ? (
    <div className="space-y-2">
      <div className="h-3 bg-gray-600 rounded w-1/3 animate-pulse"></div>
      <div className="h-3 bg-gray-700 rounded w-1/4 animate-pulse"></div>
    </div>
  ) : (
    <div className="flex justify-between text-sm">

      <span className="text-green-400">
        ✅ {myIncidents.filter(i => i.statut === "valide").length} Validés
      </span>

      <span className="text-yellow-400">
        ⏳ {myIncidents.filter(i => i.statut === "en_attente").length} En attente
      </span>

    </div>
  )}

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

      {!loading && incidents.map((incident) => (
        <div
          key={incident.id}
          className="bg-[#142E4C] rounded-2xl p-4 mb-4 shadow-lg animate-fadeUp">

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

            <span className="text-xs text-gray-400">
              {incident.date_creation}
            </span>
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

          </div>
{incident.commentaires && incident.commentaires.length > 0 && (
  <div className="mt-4 bg-[#0E223A] rounded-xl p-3 text-sm">
    {incident.commentaires.map((comment) => (
      <div key={comment.id} className="border-b border-gray-600 py-1">
        <p className="text-gray-300">
          {comment.contenu}
        </p>
      </div>
    ))}
  </div>
)}
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

      

    </div>
  );
}

export default DashboardPage;