import { useState, useEffect } from "react";
import api from "../api/axios";
import { useNavigate, useLocation } from "react-router-dom";

function ReportIncidentPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const initialPosition = location?.state?.selectedPosition || null;

  const [titre, setTitre] = useState("");
  const [description, setDescription] = useState("");
  const [typeIncidentId, setTypeIncidentId] = useState("");
  const [communeId, setCommuneId] = useState("");
  const [avenue, setAvenue] = useState("");
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

  // ✅ Nouveau système toast
  const [toast, setToast] = useState(null);

  const removePhoto = (indexToRemove) => {
    setPhotos((prevPhotos) =>
      prevPhotos.filter((_, index) => index !== indexToRemove)
    );
  };

  // ✅ Charger types
  useEffect(() => {
    api.get("/statistics/incidents-by-type")
      .then((res) => setTypes(res.data))
      .catch(() => console.log("Erreur chargement types"));
  }, []);

  // ✅ Charger communes
  useEffect(() => {
    api.get("/statistics/communes")
      .then((res) => setCommunes(res.data.data))
      .catch(() => console.log("Erreur chargement communes"));
  }, []);

  // ✅ Géolocalisation auto
  useEffect(() => {
  if (latitude === null && navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);
      },
      (error) => {
        console.error(error);
        setToast({
          type: "error",
          message: "Impossible de récupérer votre position."
        });
      }
    );
  }
}, [latitude]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!latitude || !longitude) {
      setToast({ type: "error", message: "Veuillez activer votre position." });
      return;
    }

    if (!titre || !description || !typeIncidentId || !communeId || !avenue) {
      setToast({ type: "error", message: "Tous les champs sont obligatoires." });
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("titre", titre);
      formData.append("description", description);
      formData.append("type_incident_id", typeIncidentId);
      formData.append("commune_id", communeId);
      formData.append("latitude", latitude);
      formData.append("longitude", longitude);
      formData.append("avenue", avenue);

      if (photos.length > 0) {
        photos.forEach((photo) => {
          formData.append("photo[]", photo);
        });
      }

      await api.post("/incidents", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setToast({ type: "success", message: "Incident envoyé avec succès ✅" });

      setTimeout(() => navigate("/dashboard"), 1500);

    } catch (error) {
      console.error(error);
      setToast({ type: "error", message: "Erreur lors de l'envoi ❌" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen 
                bg-gradient-to-br 
                from-[#0E223A] 
                via-[#122C4A] 
                to-[#0A1C30] 
                p-4">

      {/* ✅ Toast flottant */}
      {toast && (
        <div
          className={`fixed top-4 left-1/2 -translate-x-1/2 px-4 py-2 rounded-xl shadow-lg text-white z-50 animate-bounce
          ${toast.type === "error" ? "bg-red-500" : "bg-green-500"}`}
        >
          {toast.message}
        </div>
      )}

     <h2 className="text-3xl font-extrabold text-center mb-8">
  <span className="bg-gradient-to-r 
                   from-orange-400 
                   via-orange-500 
                   to-red-500 
                   bg-clip-text 
                   text-transparent">
    🚨 Signaler un incident
  </span>
</h2>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 bg-[#142E4C] border border-white/10 p-5 rounded-2xl shadow-lg"
      >

        <input
          type="text"
          placeholder="Titre de l'incident"
          value={titre}
          onChange={(e) => setTitre(e.target.value)}
          className="w-full border px-4 py-3 rounded-xl focus:ring-2 focus:ring-red-400"
        />

        <textarea
          placeholder="Description détaillée"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows="3"
          className="w-full border px-4 py-3 rounded-xl focus:ring-2 focus:ring-red-400"
        />

        {/* ✅ Avenue */}
        <input
          type="text"
          placeholder="Nom de l’avenue"
          value={avenue}
          onChange={(e) => setAvenue(e.target.value)}
          className="w-full border px-4 py-3 rounded-xl focus:ring-2 focus:ring-red-400"
        />

        <select
          value={typeIncidentId}
          onChange={(e) => setTypeIncidentId(e.target.value)}
          className="w-full border px-4 py-3 rounded-xl"
        >
          <option value="">Choisir un type</option>
          {types.map((type) => (
            <option key={type.id} value={type.id}>
              {type.titre}
            </option>
          ))}
        </select>

        <select
          value={communeId}
          onChange={(e) => setCommuneId(e.target.value)}
          className="w-full border px-4 py-3 rounded-xl"
        >
          <option value="">Choisir une commune</option>
          {communes.map((commune) => (
            <option key={commune.id} value={commune.id}>
              {commune.nom}
            </option>
          ))}
        </select>

        {/* ✅ Photos */}
        <div>
          <label className="block text-sm text-gray-600 mb-2">
            📷 Ajouter des photos ({photos.length})
          </label>
          <input
            type="file"
            accept="image/*"
            capture="environment"
            multiple
            onChange={(e) => setPhotos(Array.from(e.target.files))}
            className="w-full"
          />
        </div>

        {/* ✅ Preview */}
        {photos.length > 0 && (
          <div className="grid grid-cols-3 gap-2">
            {photos.map((file, index) => (
              <div key={index} className="relative">
                <img
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="w-full h-24 object-cover rounded-xl"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(index)}
                  className="absolute top-1 right-1 bg-red-600 text-white 
                             rounded-full w-6 h-6 text-xs flex items-center 
                             justify-center shadow"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* ✅ Position */}
        <div className="text-sm text-gray-500 bg-gray-100 p-2 rounded-lg">
          📍 {latitude && longitude
            ? `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
            : "Position non détectée"}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold 
                     hover:bg-red-700 transition transform active:scale-95 
                     disabled:opacity-50"
        >
          {loading ? "Envoi..." : "Envoyer le signalement"}
        </button>

      </form>
    </div>
  );
}

export default ReportIncidentPage;