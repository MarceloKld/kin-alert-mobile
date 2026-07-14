import { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate, useLocation } from "react-router-dom";

function ReportIncidentPage() {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Position envoyée depuis la carte
  const initialPosition = location.state?.selectedPosition;

  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [typeIncidentId, setTypeIncidentId] = useState("");
  const [communeId, setCommuneId] = useState("");
  const [photos, setPhotos] = useState([]);
  const [latitude, setLatitude] = useState(
    initialPosition ? initialPosition.lat : null
  );
  const [longitude, setLongitude] = useState(
    initialPosition ? initialPosition.lng : null
  );

  const [types, setTypes] = useState([]);
  const [communes, setCommunes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // ✅ Charger types incidents
  useEffect(() => {
    api.get("/statistics/incidents-by-type")
      .then((res) => {
        setTypes(res.data);
      })
      .catch(() => console.log("Erreur chargement types"));
  }, []);

  // ✅ Charger communes
  useEffect(() => {
    api.get("/statistics/communes")
      .then((res) => {
        setCommunes(res.data.data);
      })
      .catch(() => console.log("Erreur chargement communes"));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!titre || !description || !typeIncidentId || !communeId) {
      setErrorMessage("Tous les champs obligatoires doivent être remplis.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      const formData = new FormData();

      formData.append("titre", titre);
      formData.append("description", description);
      formData.append("type_incident_id", typeIncidentId);
      formData.append("commune_id", communeId);
      formData.append("latitude", latitude);
      formData.append("longitude", longitude);

      // ✅ Upload multiple photos
      if (photos && photos.length > 0) {
        for (let i = 0; i < photos.length; i++) {
          formData.append("photo[]", photos[i]);
        }
      }

      await api.post("/incidents", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      navigate("/dashboard");

    } catch (error) {
      setErrorMessage("Erreur lors de la création de l'incident.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">

      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Signaler un incident
      </h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-white p-4 rounded-xl shadow"
      >

        {/* ✅ Titre */}
        <input
          type="text"
          placeholder="Titre de l'incident"
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
        />

        {/* ✅ Description */}
        <textarea
          placeholder="Description détaillée"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
          rows="3"
        />

        {/* ✅ Type Incident */}
        <select
          value={typeIncidentId}
          onChange={(e) => setTypeIncidentId(e.target.value)}
          className="w-full border px-3 py-2 rounded-lg"
        >
          <option value="">Choisir un type</option>
          {types.map((type) => (
            <option key={type.id} value={type.id}>
              {type.titre}
            </option>
          ))}
        </select>

        {/* ✅ Commune */}
        <select
          value={communeId}
          onChange={(e) => setCommuneId(e.target.value)}
          className="w-full border px-3 py-2 rounded-lg"
        >
          <option value="">Choisir une commune</option>
          {communes.map((commune) => (
            <option key={commune.id} value={commune.id}>
              {commune.nom}
            </option>
          ))}
        </select>

        {/* ✅ Capture Photo multiple */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Photo(s) (optionnelle)
          </label>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            multiple
            onChange={(e) => setPhotos(e.target.files)}
            className="w-full"
          />
        </div>

        {/* ✅ Position */}
        <div className="text-sm text-gray-500">
          {latitude && longitude
            ? `Position : ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
            : "Aucune position sélectionnée"}
        </div>

        {/* ✅ Erreur */}
        {errorMessage && (
          <div className="bg-red-100 text-red-600 p-2 rounded-lg text-sm">
            {errorMessage}
          </div>
        )}

        {/* ✅ Bouton */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50"
        >
          {loading ? "Envoi en cours..." : "Envoyer le signalement"}
        </button>

      </form>

    </div>
  );
}

export default ReportIncidentPage;