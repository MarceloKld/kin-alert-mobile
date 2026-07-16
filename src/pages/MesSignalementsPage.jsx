import { useEffect, useState } from "react";
import api from "../api/axios";

function MesSignalementsPage() {

  const [myIncidents, setMyIncidents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIncident, setSelectedIncident] = useState(null);
const [showModal, setShowModal] = useState(false);
const [loadingDetail, setLoadingDetail] = useState(false);

  useEffect(() => {

  const loadMyIncidents = async () => {
    setLoading(true);

    try {
      const res = await api.get("/my-incidents");
      setMyIncidents(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  loadMyIncidents();

}, []);

const openIncident = async (id) => {
  setShowModal(true);
  setLoadingDetail(true);
  setSelectedIncident(null);

  try {
    const res = await api.get(`/incidents/${id}`);
    setSelectedIncident(res.data.data || res.data);
  } catch (error) {
    console.error(error);
  } finally {
    setLoadingDetail(false);
  }
};




  return (
    <div className="min-h-screen bg-gradient-to-b 
                    from-[#0E223A] to-[#091522] 
                    text-white px-4 pb-28">

      <h1 className="text-xl font-semibold pt-6 mb-6">
        Mes Signalements
      </h1>

      {loading && (
        <div className="space-y-4">
          {[1,2,3].map((i) => (
            <div key={i}
                 className="bg-[#142E4C] rounded-2xl p-4 animate-pulse">
              <div className="h-4 bg-gray-600 rounded w-1/2 mb-3"></div>
              <div className="h-3 bg-gray-700 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      )}

      {!loading && myIncidents.length === 0 && (
        <p className="text-gray-400 text-sm">
          Aucun signalement pour le moment.
        </p>
      )}

      {!loading && myIncidents.map((incident) => (

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

            <span className={`text-xs ${
              incident.statut === "valide"
                ? "text-green-400"
                : incident.statut === "en_attente"
                ? "text-yellow-400"
                : "text-red-400"
            }`}>
              {incident.statut}
            </span>

          </div>

          <div className="flex justify-between items-center mt-3 text-xs text-gray-400">
  <span>
    ✅ {incident.nombre_confirmations} confirmations
  </span>
  
  <div className="flex items-center gap-3">
    <span>{incident.date_creation}</span>
    <button
      onClick={() => openIncident(incident.id)}
      className="text-xs bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors"
    >
      Voir
    </button>
  </div>
</div>

{showModal && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm 
                  flex items-center justify-center z-50">

    <div className="bg-[#142E4C] text-white 
                    rounded-2xl p-6 w-[90%] max-w-md">

      {loadingDetail ? (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-4 border-blue-500 
                          border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          <h2 className="text-lg font-semibold">
            {selectedIncident?.titre}
          </h2>

          <p className="text-sm text-gray-300 mt-2">
            {selectedIncident?.description}
          </p>

          <p className="text-xs text-gray-400 mt-2">
            {selectedIncident?.type?.titre}
          </p>
        </>
      )}

      <button
        onClick={() => setShowModal(false)}
        className="mt-6 w-full bg-blue-500 py-2 rounded-lg"
      >
        Fermer
      </button>

    </div>
  </div>
)}
        </div>
        

      ))}

    </div>
    
  );

  
}

export default MesSignalementsPage;