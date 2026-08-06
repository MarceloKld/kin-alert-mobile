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

  // Ajoute cette fonction dans ReportIncidentPage.jsx avant le useEffect de géolocalisation

const reverseGeocode = async (lat, lon) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`
    );
    const data = await response.json();
    
    if (data.address) {
      // 1. Récupérer l'avenue (road dans Nominatim)
      const road = data.address.road || data.address.pedestrian || "Avenue non détectée";
      setAvenue(road);

      // 2. Récupérer la commune (suburb ou city_district)
      const detectedCommune = data.address.suburb || data.address.city_district || "";
      
      // 3. Matcher automatiquement avec ton array 'communes' venant de la BDD
      if (detectedCommune && communes.length > 0) {
        const match = communes.find(c => 
          detectedCommune.toLowerCase().includes(c.nom.toLowerCase()) || 
          c.nom.toLowerCase().includes(detectedCommune.toLowerCase())
        );
        if (match) setCommuneId(match.id);
      }
    }
  } catch (error) {
    console.error("Erreur reverse geocoding", error);
  }
};

// Modifie ton useEffect de géolocalisation pour appeler cette fonction
useEffect(() => {
  if (latitude === null && navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        setLatitude(lat);
        setLongitude(lng);
        // APPEL ICI
        if (communes.length > 0) reverseGeocode(lat, lng);
      },
      (error) => { console.error("Erreur lors de la géolocalisation :", error); }
    );
  }
}, [latitude, communes]); // Ajoute communes en dépendance





  return (
    <div className="min-h-screen 
                bg-gradient-to-br 
                from-[#0E223A] 
                via-[#122C4A] 
                to-[#0A1C30] 
                p-4
                pb-28">

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
  className="space-y-5
             bg-white/5
             backdrop-blur-xl
             border border-white/10
             p-6
             rounded-3xl
             shadow-[0_20px_50px_rgba(0,0,0,0.4)]
             transition-all duration-300"
>

        <input
  type="text"
  placeholder="Titre de l'incident"
  value={titre}
  onChange={(e) => setTitre(e.target.value)}
  className="w-full 
             bg-white/10 
             text-white 
             placeholder-gray-400
             px-4 py-3 
             rounded-xl 
             border border-white/10
             focus:outline-none 
             focus:ring-2 
             focus:ring-orange-500
             focus:border-orange-500
             transition-all duration-200"
/>

        <textarea
  placeholder="Description détaillée"
  value={description}
  onChange={(e) => setDescription(e.target.value)}
  rows="3"
  className="w-full 
             bg-white/10 
             text-white 
             placeholder-gray-400
             px-4 py-3 
             rounded-xl 
             border border-white/10
             focus:outline-none 
             focus:ring-2 
             focus:ring-orange-500
             focus:border-orange-500
             transition-all duration-200"
/>

        {/* ✅ Avenue */}
        <input
  type="text"
  placeholder="Nom de l’avenue"
  value={avenue}
  onChange={(e) => setAvenue(e.target.value)}
  className="w-full 
             bg-white/10 
             text-white 
             placeholder-gray-400
             px-4 py-3 
             rounded-xl 
             border border-white/10
             focus:outline-none 
             focus:ring-2 
             focus:ring-orange-500
             focus:border-orange-500
             transition-all duration-200"
/>

        {/* ✅ Type d'incident */}
        <div className="relative">
  <select
    value={typeIncidentId}
    onChange={(e) => setTypeIncidentId(e.target.value)}
    className="w-full
               bg-white/10
               text-white
               px-4 py-3
               pr-10
               rounded-xl
               border border-white/10
               focus:outline-none
               focus:ring-2
               focus:ring-orange-500
               focus:border-orange-500
               transition-all duration-200
               appearance-none"
  >
    <option value="" className="text-black">
      Choisir un type
    </option>

    {types.map((type) => (
      <option key={type.id} value={type.id} className="text-black">
        {type.titre}
      </option>
    ))}
  </select>

  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-300">
    ▼
  </div>
</div>


        {/* ✅ Commune */}
        <div className="relative">
  <select
    value={communeId}
    onChange={(e) => setCommuneId(e.target.value)}
    className="w-full
               bg-white/10
               text-white
               px-4 py-3
               pr-10
               rounded-xl
               border border-white/10
               focus:outline-none
               focus:ring-2
               focus:ring-orange-500
               focus:border-orange-500
               transition-all duration-200
               appearance-none"
  >
    <option value="" className="text-black">
      Choisir une commune
    </option>

    {communes.map((commune) => (
      <option key={commune.id} value={commune.id} className="text-black">
        {commune.nom}
      </option>
    ))}
  </select>

  <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-300">
    ▼
  </div>
</div>


        {/* ✅ Photos Premium */}
<div className="space-y-3">

  <label className="block text-sm text-gray-300 font-medium">
    📷 Ajouter des photos
    <span className="ml-2 text-xs bg-white/10 px-2 py-1 rounded-full">
      {photos.length}
    </span>
  </label>

  <div className="relative">

    <input
      type="file"
      accept="image/*"
      capture="environment"
      multiple
      onChange={(e) => setPhotos(Array.from(e.target.files))}
      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
    />

    <div className="w-full 
                    bg-white/10 
                    border border-white/10
                    rounded-xl 
                    py-4 
                    flex flex-col 
                    items-center 
                    justify-center 
                    text-gray-300 
                    transition 
                    hover:bg-white/20">

      <span className="text-lg">⬆</span>
      <span className="text-sm mt-1">
        Cliquez pour ajouter des photos
      </span>

    </div>

  </div>

</div>

       {/* ✅ Preview Premium */}
{photos.length > 0 && (
  <div className="grid grid-cols-3 gap-3 mt-2">

    {photos.map((file, index) => (
      <div
        key={index}
        className="relative group rounded-2xl overflow-hidden 
                   shadow-lg transition-transform duration-200 
                   hover:scale-[1.03]"
      >

        {/* Image */}
        <img
          src={URL.createObjectURL(file)}
          alt="preview"
          className="w-full h-28 object-cover"
        />

        {/* Overlay sombre au hover */}
        <div className="absolute inset-0 
                        bg-black/40 
                        opacity-0 
                        group-hover:opacity-100 
                        transition duration-200" />

        {/* Bouton suppression premium */}
        <button
          type="button"
          onClick={() => removePhoto(index)}
          className="absolute top-2 right-2
                     bg-red-500/90 
                     backdrop-blur-md
                     text-white
                     w-7 h-7
                     rounded-full
                     flex items-center justify-center
                     text-sm
                     shadow-md
                     transition
                     hover:bg-red-600"
        >
          ✕
        </button>

      </div>
    ))}

  </div>
)}

        {/* ✅ Position Premium */}
<div
  className={`flex items-center justify-between
              px-4 py-3
              rounded-xl
              text-sm
              border
              ${
                latitude && longitude
                  ? "bg-green-500/10 border-green-500/20 text-green-400"
                  : "bg-white/5 border-white/10 text-gray-400"
              }`}
>
  <span className="flex items-center gap-2">
    📍 Position
  </span>

  <span className="font-medium">
    {latitude && longitude
      ? `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`
      : "Non détectée"}
  </span>
</div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 text-white py-3 rounded-xl font-semibold 
                     hover:bg-red-700 transition transform active:scale-95 
                     disabled:opacity-50 animate-float"
        >
          {loading ? "Envoi..." : "Envoyer le signalement"}
        </button>

      </form>
    </div>
  );
}

export default ReportIncidentPage;