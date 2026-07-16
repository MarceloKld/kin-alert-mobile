
import api from "../api/axios";
import { useEffect, useState } from "react";

function DashboardPage() {

  const [incidents, setIncidents] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [loading, setLoading] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
const [showModal, setShowModal] = useState(false);
const [loadingDetail, setLoadingDetail] = useState(false);

  // ✅ Déclare la fonction AVANT useEffect
useEffect(() => {

  const loadIncidents = async () => {
    setLoading(true);

    try {
      let url;

      if (statusFilter === "all") {
        url = "/incidents?all=true";
      } else {
        url = `/incidents?statut=${statusFilter}`;
      }

      const res = await api.get(url);
      setIncidents(res.data.data || res.data);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  loadIncidents();

}, [statusFilter]);

const openIncident = async (id) => {

  setShowModal(true);
  setLoadingDetail(true);
  setSelectedIncident(null);

  try {
    const res = await api.get(`/incidents/${id}`);
    setSelectedIncident(res.data.data || res.data);
  } catch (error) {
    console.error(error);
    console.error("Erreur chargement détail");
  } finally {
    setLoadingDetail(false);
  }
};




  return (
    <div className="min-h-screen px-4 pb-28 
                    bg-gradient-to-b 
                    from-gray-100 to-gray-200 
                    dark:from-gray-900 dark:to-gray-800 
                    transition-colors duration-500">

      {/* ✅ Filtres */}
      <div className="flex gap-3 overflow-x-auto py-4">

        {["all", "valide", "en_attente", "rejete"].map((status) => (
          <button
            key={status}
            onClick={() => setStatusFilter(status)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              statusFilter === status
                ? "bg-black text-white dark:bg-white dark:text-black"
                : "bg-white/70 dark:bg-gray-800/70 text-gray-700 dark:text-gray-200"
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

      {/* ✅ Liste incidents */}
      {loading ? (
        <p className="text-center text-gray-500">Chargement...</p>
      ) : incidents.length === 0 ? (
        <p className="text-center text-gray-500">
          Aucun incident trouvé.
        </p>
      ) : (
        incidents.map((incident) => (
          <div
            key={incident.id}
            className="bg-white dark:bg-gray-800 
                       rounded-2xl shadow-lg 
                       p-4 mb-4 transition-colors">

            <div className="flex justify-between items-start">

              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">
                  {incident.titre}
                </h3>

                <p className="text-sm text-gray-500 dark:text-gray-300">
                  {incident.type?.titre} • {incident.localisation?.commune?.nom}
                </p>
              </div>

              <span
                className={`text-xs px-3 py-1 rounded-full ${
                  incident.statut === "valide"
                    ? "bg-green-100 text-green-700"
                    : incident.statut === "en_attente"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {incident.statut}
              </span>

            </div>

            <div className="flex justify-between items-center mt-4 text-sm text-gray-600 dark:text-gray-300">
              <span>
                ✅ {incident.nombre_confirmations} confirmations
              </span>
              <span>
                {incident.date_creation}
              </span>
            </div>

            <button
  onClick={() => openIncident(incident.id)}
  className="mt-4 w-full bg-gray-900 dark:bg-white 
             dark:text-black text-white 
             py-2 rounded-lg text-sm transition 
             active:scale-95 duration-150"
>
  Voir les détails
</button>
{showModal && selectedIncident && (
  <div className="fixed inset-0 z-50 flex items-center justify-center">

    {/* ✅ Overlay flou */}
    <div
      className="absolute inset-0 bg-black/40 backdrop-blur-sm"
      onClick={() => setShowModal(false)}
    />

    {/* ✅ Modal */}
    <div className="relative bg-white dark:bg-gray-800 
                rounded-3xl shadow-2xl p-6 
                w-[90%] max-w-md 
                animate-popupIn">

  {loadingDetail ? (
    <div className="flex justify-center items-center py-10">
      <div className="w-8 h-8 border-4 border-blue-500 
                      border-t-transparent rounded-full animate-spin" />
    </div>
  ) : (
    <>
      <h2 className="text-xl font-semibold 
                     text-gray-800 dark:text-white">
        {selectedIncident?.titre}
      </h2>

      <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
        {selectedIncident?.description}
      </p>

      <div className="mt-4 text-sm space-y-1">
        <p><strong>Type :</strong> {selectedIncident?.type?.titre}</p>
        <p><strong>Commune :</strong> {selectedIncident?.localisation?.commune?.nom}</p>
        <p><strong>Statut :</strong> {selectedIncident?.statut}</p>
        <p><strong>Confirmations :</strong> {selectedIncident?.nombre_confirmations}</p>
      </div>
    </>
  )}

  <button
    onClick={() => setShowModal(false)}
    className="mt-6 w-full bg-gray-900 dark:bg-white 
               dark:text-black text-white py-2 
               rounded-lg"
  >
    Fermer
  </button>

    </div>
  </div>
)}
          </div>
        ))
      )}

    </div>
  );
}

export default DashboardPage;