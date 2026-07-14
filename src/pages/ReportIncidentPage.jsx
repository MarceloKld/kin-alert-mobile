import { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

function ReportIncidentPage() {
  const navigate = useNavigate();

  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // ✅ Géolocalisation automatique
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      });
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!titre || !description) {
      setErrorMessage("Tous les champs sont obligatoires.");
      return;
    }

    setLoading(true);
    setErrorMessage("");

    try {
      await api.post("/incidents", {
        titre,
        description,
        latitude,
        longitude,
        type_incident_id: 1, // temporaire
        commune_id: 1,       // temporaire
      });

      navigate("/dashboard");

    } catch (error) {
      console.error(error);
      setErrorMessage("Erreur lors de la création.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">

      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Signaler un incident
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded-xl shadow">

        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Titre
          </label>
          <input
            type="text"
            value={titre}
            onChange={(e) => setTitre(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
            placeholder="Ex: Accident sur Avenue..."
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border px-3 py-2 rounded-lg focus:ring-2 focus:ring-blue-500"
            rows="3"
          />
        </div>

        {/* ✅ Capture Photo */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">
            Photo (optionnelle)
          </label>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="w-full"
          />
        </div>

        {/* ✅ Affichage localisation */}
        <div className="text-sm text-gray-500">
          {latitude && longitude
            ? `Localisation détectée : ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
            : "Détection de la localisation..."}
        </div>

        {errorMessage && (
          <div className="bg-red-100 text-red-600 p-2 rounded-lg text-sm">
            {errorMessage}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 text-white py-2 rounded-lg font-semibold hover:bg-red-700 transition disabled:opacity-50"
        >
          {loading ? "Envoi en cours..." : "Envoyer le signalement"}
        </button>

      </form>

    </div>
  );
}

export default ReportIncidentPage;