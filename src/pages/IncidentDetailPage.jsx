import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

function IncidentDetailPage() {

  const { id } = useParams();
  const [incident, setIncident] = useState(null);

  useEffect(() => {
    api.get(`/incidents/${id}`)
      .then((res) => {
        setIncident(res.data.data || res.data);
      })
      .catch(() => console.log("Erreur chargement détail"));
  }, [id]);

  if (!incident) {
    return (
      <div className="p-4 text-center text-gray-500">
        Chargement...
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 
                    bg-gradient-to-b 
                    from-gray-100 to-gray-200 
                    dark:from-gray-900 dark:to-gray-800">

      <div className="bg-white dark:bg-gray-800 
                      rounded-3xl shadow-lg p-6">

        <h2 className="text-xl font-semibold 
                       text-gray-800 dark:text-white">
          {incident.titre}
        </h2>

        <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">
          {incident.description}
        </p>

        <div className="mt-4 space-y-2 text-sm">

          <p>
            <strong>Type :</strong> {incident.type?.titre}
          </p>

          <p>
            <strong>Commune :</strong> {incident.localisation?.commune?.nom}
          </p>

          <p>
            <strong>Statut :</strong> {incident.statut}
          </p>

          <p>
            <strong>Confirmations :</strong> {incident.nombre_confirmations}
          </p>

          <p>
            <strong>Date :</strong> {incident.date_creation}
          </p>

        </div>

        {/* ✅ Photos */}
        {incident.preuves && incident.preuves.length > 0 && (
          <div className="grid grid-cols-2 gap-3 mt-4">
            {incident.preuves.map((preuve) => (
              <img
                key={preuve.id}
                src={preuve.url}
                alt="preuve"
                className="rounded-xl object-cover"
              />
            ))}
          </div>
        )}

      </div>

    </div>
  );
}

export default IncidentDetailPage;