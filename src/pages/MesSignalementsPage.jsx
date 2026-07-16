import { useEffect, useState } from "react";
import api from "../api/axios";

function MesSignalementsPage() {

  const [myIncidents, setMyIncidents] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadMyIncidents = async () => {
      setLoading(true);

      try {
        const res = await api.get("/incidents?mine=true");
        setMyIncidents(res.data.data || res.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadMyIncidents();
  }, []);

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

          <div className="flex justify-between mt-3 text-xs text-gray-400">
            <span>
              ✅ {incident.nombre_confirmations} confirmations
            </span>
            <span>
              {incident.date_creation}
            </span>
          </div>

        </div>

      ))}

    </div>
  );
}

export default MesSignalementsPage;