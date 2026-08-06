import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
} from "react-leaflet";
import L from "leaflet";
import api from "../api/axios";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { Bell, Siren } from "lucide-react";

// ✅ Icônes personnalisées selon statut


const redIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  iconSize: [32, 32],
});


// ✅ Fix icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});



function HomePage() {
const navigate = useNavigate();

const [userPosition, setUserPosition] = useState(null);
const [selectedPosition, setSelectedPosition] = useState(null);
const [toast, setToast] = useState(null);
const [incidents, setIncidents] = useState([]);
const [mapFilter, setMapFilter] = useState("all");
const [selectedIncident, setSelectedIncident] = useState(null);
const [showModal, setShowModal] = useState(false);
const [loadingConfirm, setLoadingConfirm] = useState(false);
const [loadingComment, setLoadingComment] = useState(false);
const [commentText, setCommentText] = useState("");
const [modalMessage, setModalMessage] = useState(null);
const blueTempIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/blue-dot.png",
  iconSize: [32, 32],
});
const [loadingFilters, setLoadingFilters] = useState(true);
const [sosLoading, setSosLoading] = useState(false);



  
  // ✅ Géolocalisation utilisateur
  useEffect(() => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserPosition([
          position.coords.latitude,
          position.coords.longitude,
        ]);
      },
      (error) => {
        console.log("Erreur géolocalisation :", error);
      }
    );
  }
}, []);

  //Charger incidents depuis API
  useEffect(() => {
    
  api.get("/incidents?all=true")
    .then((res) => {
      const data = res.data.data || res.data;
      setIncidents(data);
    })
    .catch(() => console.log("Erreur chargement incidents"))
    .finally(() => {
      setLoadingFilters(false);
    });

}, []);

const openIncidentModal = (incident) => {
  setSelectedIncident(incident);
  setShowModal(true);
};


const confirmIncident = async () => {
  if (!selectedIncident?.id) return;

  setLoadingConfirm(true);
  setModalMessage(null);
  setTimeout(() => {
  setModalMessage(null);
}, 5000);

  try {
    await api.post(`/incidents/${selectedIncident.id}/confirm`);

    setModalMessage({
      type: "success",
      text: "✅ Confirmation enregistrée",
    });

  } catch (error) {
    setModalMessage({
      type: "error",
      text:
        error.response?.data?.message ||
        "Erreur lors de la confirmation",
    });
  } finally {
    setLoadingConfirm(false);
  }
};

const submitComment = async () => {
  if (!selectedIncident?.id || !commentText) return;

  setLoadingComment(true);
  setModalMessage(null);

  try {
    await api.post(`/incidents/${selectedIncident.id}/comments`, {
      contenu: commentText,
    });

    setCommentText("");

    setModalMessage({
      type: "success",
      text: "✅ Commentaire envoyé",
    });

  } catch (error) {
    console.error(error);
    setModalMessage({
      type: "error",
      text: "Erreur lors de l'envoi du commentaire",
    });
  } finally {
    setLoadingComment(false);
  }
};

//Fonction sélectionner position
const selectMyPosition = () => {
  if (!navigator.geolocation) {
    setToast({
      type: "error",
      message: "La géolocalisation n'est pas supportée sur votre appareil."
    });
    return;
  }

  setToast({
    type: "loading",
    message: "Récupération de votre position..."
  });

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude;
      const lng = position.coords.longitude;

      setSelectedPosition({ lat, lng });

      setToast({
        type: "success",
        message: "✅ Position sélectionnée. Vous pouvez maintenant signaler."
      });
    },
    () => {
      setToast({
        type: "error",
        message: "Impossible de récupérer votre position. Activez le GPS."
      });
    }
  );
};

//Faire disparaître automatiquement le toast
useEffect(() => {
  if (toast) {
    const timer = setTimeout(() => {
      setToast(null);
    }, 3000);

    return () => clearTimeout(timer);
  }
}, [toast]);

const handleSOS = async () => {
  if (!userPosition) {
    setToast({ type: "error", message: "Position GPS non détectée !" });
    return;
  }
  setSosLoading(true);
  try {
    const formData = new FormData();
    formData.append("titre", "🚨 DANGER IMMÉDIAT");
    formData.append("description", "Alerte SOS lancée en un clic via le bouton d'urgence.");
    formData.append("type_incident_id", 1); // ID à vérifier dans ta table types_incidents
    formData.append("latitude", userPosition[0]);
    formData.append("longitude", userPosition[1]);
    formData.append("commune_id", 1); // Par défaut ou à détecter
    formData.append("avenue", "Position GPS Précise");
    formData.append("statut", "en_attente");

    await api.post("/incidents", formData);
    
    setToast({ type: "success", message: "SOS ENVOYÉ ! Restez en lieu sûr." });
    if (navigator.vibrate) navigator.vibrate([500, 200, 500]);
  } catch (error) {
    console.error(error);
    setToast({ type: "error", message: "Échec de l'envoi du SOS." });
  } finally {
    setSosLoading(false);
  }
};








return (
  <div className="h-screen flex flex-col relative bg-[#0E223A] overflow-y-auto no-scrollbar pb-32">
{toast && (
  <div
    className={`fixed top-4 right-4 
    px-4 py-2 
    rounded-lg 
    shadow-lg 
    text-sm 
    font-medium 
    text-white 
    z-[9999]
    ${
      toast.type === "success"
        ? "bg-green-600"
        : toast.type === "error"
        ? "bg-red-600"
        : "bg-blue-600"
    }`}
  >
    {toast.message}
  </div>
)}


{/* ==========================
    HEADER HOME PREMIUM SVG
========================== */}

<div className="bg-gradient-to-br 
                from-orange-500 
                via-orange-600 
                to-orange-700
                text-white 
                pt-3 pb-6 px-5
                shadow-lg">

  <div className="flex justify-between items-center">

    {/* Notifications */}
    <div className="relative flex items-center justify-center 
                    w-10 h-10 
                    rounded-xl 
                    bg-white/10 backdrop-blur-sm">

      <span className="absolute -top-1 -right-1 
                       bg-red-600 text-white 
                       text-[10px] font-semibold 
                       rounded-full 
                       min-w-[18px] h-[18px] 
                       flex items-center justify-center">
        3
      </span>

      <Bell size={20} strokeWidth={2} className="animate-pulse"/>
    </div>


    {/* Titre */}
    <div className="text-center">
      <h1 className="text-xl font-bold tracking-wide">
        Kin‑Alert
      </h1>
      <p className="text-[11px] text-orange-100">
        Sécurité communautaire
      </p>
    </div>


    {/* Alertes */}
    <div className="relative flex items-center justify-center 
                    w-10 h-10 
                    rounded-xl 
                    bg-white/10 backdrop-blur-sm">

      <span className="absolute -top-1 -right-1 
                       bg-red-600 text-white 
                       text-[10px] font-semibold 
                       rounded-full 
                       min-w-[18px] h-[18px] 
                       flex items-center justify-center">
        6
      </span>

      <Siren size={20} strokeWidth={2} className="text-red-200" />
    </div>

  </div>

</div>


    <div className="bg-[#0E223A] px-0.5 py-1">

 <div className="flex gap-1.5 sm:gap-2 overflow-x-auto px-2 pb-1 no-scrollbar">


  {loadingFilters ? (
    <>
      <div className="h-7 w-16 bg-white/10 rounded-full animate-pulse"></div>
      <div className="h-7 w-20 bg-white/10 rounded-full animate-pulse"></div>
      <div className="h-7 w-24 bg-white/10 rounded-full animate-pulse"></div>
      <div className="h-7 w-20 bg-white/10 rounded-full animate-pulse"></div>
    </>
  ) : (
    ["all", "valide", "en_attente", "rejete"].map((status) => {

      const count = incidents.filter(
        (i) => status === "all" ? true : i.statut === status
      ).length;

      const isActive = mapFilter === status;

      return (
        <button
          key={status}
          onClick={() => setMapFilter(status)}
          className={`
           shrink-0 whitespace-nowrap
  flex items-center gap-1
  px-2.5 py-1 sm:px-3 sm:py-1.5
  rounded-full
  text-[11px] sm:text-xs font-medium
  transition-all duration-200
            ${
              isActive
                ? "bg-orange-500 text-white shadow-md scale-105"
                : "bg-white/10 text-white border border-white/20 hover:bg-white/20"
            }
          `}
        >
          {status === "all"
            ? "Tous"
            : status.replace("_", " ")}

          <span
            className={`
              text-[10px] px-1.5 py-0.5 rounded-full
              ${
                isActive
                  ? "bg-white/20 text-white"
                  : "bg-white/10 text-gray-200"
              }
            `}
          >
            {count}
          </span>
        </button>
      );
    })
  )}

</div>

</div>

<div className="px-4 mb-3">
  <button
    onClick={selectMyPosition}
    disabled={!!selectedPosition}
    className={`w-full py-2 rounded-xl font-semibold shadow-md transition 
    active:scale-95
    ${
      selectedPosition
        ? "bg-green-600 text-white cursor-not-allowed"
        : "bg-blue-600 text-white"
    }`}
  >
    {selectedPosition ? "✅ Position sélectionnée" : "📍 Sélectionner ma position"}
  </button>
</div>

    {/* ✅ ZONE BLEU FONCÉ */}
    <div className="flex-1 bg-[#0E223A]  relative">

      {/* ✅ CARTE */}
      <div className="mt-0">
        <div className="rounded-t-3xl overflow-hidden shadow-2xl">

          <MapContainer
  center={userPosition || [-4.3, 15.3]}
  zoom={13}
  style={{ height: "50vh", width: "100%" }}
>
            <TileLayer
              attribution="© OpenStreetMap"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {incidents
  .filter(
    (incident) =>
      incident.localisation &&
      typeof incident.localisation.latitude === "number" &&
      typeof incident.localisation.longitude === "number"
  )
  .filter((incident) =>
    mapFilter === "all"
      ? true
      : incident.statut === mapFilter
  )
  .map((incident) => (
    <Marker
  key={incident.id}
  position={[
    incident.localisation.latitude,
    incident.localisation.longitude,
  ]}
  icon={redIcon}
>
<Popup>
  <div className="w-56 text-sm space-y-2">

    <h3 className="font-semibold text-base">
      {incident.titre}
    </h3>

    <p className="text-xs text-gray-500">
      {incident.type?.titre}
    </p>

    <p className="text-xs text-gray-400">
      📍 {incident.localisation?.commune?.nom}
    </p>

    <span
      className={`text-xs px-2 py-1 rounded-full ${
        incident.statut === "valide"
          ? "bg-green-500/20 text-green-600"
          : incident.statut === "en_attente"
          ? "bg-yellow-500/20 text-yellow-600"
          : "bg-red-500/20 text-red-600"
      }`}
    >
      {incident.statut}
    </span>
    {/* ✅ COMPTEUR CONFIRMATIONS */}
<div className="mt-3 flex items-center justify-between text-xs">
          <span className="text-gray-400">
            Confirmations
          </span>

          <span className={`font-medium ${
            incident.statut === "valide"
              ? "text-green-400"
              : "text-gray-300"
          }`}>
            ✓ {incident.nombre_confirmations}
          </span>
        </div>

    <button
      onClick={(e) => {
        e.stopPropagation();
        openIncidentModal(incident);
      }}
      className="mt-2 w-full bg-blue-500 text-white py-1 rounded-lg text-xs"
    >
      Voir détails
    </button>

  </div>
</Popup>
</Marker>
))}
{selectedPosition && (
          <Marker
            position={[selectedPosition.lat, selectedPosition.lng]}
            icon={blueTempIcon}
          >
            <Popup>📍 Votre position sélectionnée</Popup>
          </Marker>
        )}
          </MapContainer>

        </div>
      </div>

      {/* --- ZONE D'ACTION PREMIUM --- */}
<div className="flex flex-col items-center gap-8 mt-10 px-6 pb-20">
  
  {/* Bouton Signaler Central - Effet Glow */}
  <button
    onClick={() => selectedPosition ? navigate("/report", { state: { selectedPosition } }) : setToast({type:"error", message:"Sélectionnez votre position"})}
    className="w-40 h-40 rounded-full bg-gradient-to-tr from-orange-600 to-orange-400 
               shadow-[0_0_50px_rgba(234,88,12,0.3)] border-8 border-[#0E223A]
               flex flex-col items-center justify-center text-white font-black
               animate-pulseGlow active:scale-95 transition-all duration-300"
  >
    <span className="text-2xl">SIGNALER</span>
    <span className="text-[10px] font-light tracking-[0.2em] opacity-80">INCIDENT</span>
  </button>

  {/* BOUTON SOS PANIC - Version Améliorée */}
       <button
        onClick={handleSOS}
        disabled={sosLoading}
        className={`w-full py-5 rounded-[2rem] flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(220,38,38,0.4)] transition-all active:scale-95 z-40
          ${sosLoading ? 'bg-red-900' : 'bg-red-600 animate-pulse'}`}
      >
        {sosLoading ? (
          <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <>
             <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
               <Siren size={20} className="text-white" />
             </div>
             <span className="text-white font-black text-lg tracking-tighter">SOS DANGER IMMÉDIAT</span>
          </>
        )}
      </button>

  {/* DESCRIPTIONS PREMIUM */}
  <div className="w-full space-y-4">
    <div className="bg-white/5 backdrop-blur-md p-5 rounded-[2rem] border border-white/10 flex items-center gap-4 animate-fadeUp">
      <div className="w-12 h-12 bg-orange-500/20 rounded-2xl flex items-center justify-center text-orange-400">
        🛡️
      </div>
      <div>
        <h4 className="text-white text-sm font-bold">Protection Kuluna</h4>
        <p className="text-[10px] text-gray-400">Signalement instantané aux patrouilles d'intervention.</p>
      </div>
    </div>

    <div 
      className="bg-white/5 backdrop-blur-md p-5 rounded-[2rem] border border-white/10 flex items-center gap-4 animate-fadeUp" 
      style={{ animationDelay: '0.1s' }}
    >
      <div className="w-12 h-12 bg-blue-500/20 rounded-2xl flex items-center justify-center text-blue-400">
        📡
      </div>
      <div>
        <h4 className="text-white text-sm font-bold">Réseau d'Alerte</h4>
        <p className="text-[10px] text-gray-400">Votre communauté est prévenue en moins de 5 secondes.</p>
      </div>
    </div>
  </div>

  {/* ESPACE DE SÉCURITÉ FINAL (Pour ne pas être masqué par la barre de navigation) */}
  <div className="h-10"></div>
</div>

    </div>
{showModal && selectedIncident && (
 <div className="fixed inset-0 flex items-center justify-center z-[9999]">

   <div
  className="absolute inset-0 backdrop-blur-[3px] bg-black/5"
  onClick={() => setShowModal(false)}
/>


    <div className="relative bg-[#142E4C] text-white 
                    rounded-3xl p-6 w-[90%] max-w-md shadow-2xl">

      <h2 className="text-lg font-semibold">
        {selectedIncident.titre}
      </h2>
      {modalMessage && (
        <div
          className={`mt-3 px-3 py-2 rounded-lg text-xs ${
            modalMessage.type === "success"
              ? "bg-green-500/20 text-green-400"
              : "bg-red-500/20 text-red-400"
          }`}
        >
          {modalMessage.text}
        </div>
      )}

      <p className="text-sm text-gray-300 mt-2">
        {selectedIncident.description}
      </p>

      <p className="text-xs text-gray-400 mt-1">
        📍 {selectedIncident.localisation?.commune?.nom}
      </p>

      <div className="mt-3 flex justify-between items-center">

  <span
    className={`text-xs px-3 py-1 rounded-full ${
      selectedIncident.statut === "valide"
        ? "bg-green-500/20 text-green-400"
        : selectedIncident.statut === "en_attente"
        ? "bg-yellow-500/20 text-yellow-400"
        : "bg-red-500/20 text-red-400"
    }`}
  >
    {selectedIncident.statut}
  </span>

  <span className="text-xs text-gray-400">
    ✅ {selectedIncident.nombre_confirmations} confirmation
    {selectedIncident.nombre_confirmations > 1 && "s"}
  </span>

</div>
      <button
        onClick={confirmIncident}
        disabled={loadingConfirm}
        className="mt-4 w-full bg-blue-500 py-2 rounded-lg text-sm"
      >
        {loadingConfirm ? "..." : "Confirmer"}
      </button>

      <textarea
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Votre commentaire..."
        className="w-full mt-3 p-3 rounded-lg bg-[#0E223A] text-white text-sm"
        rows="3"
      />

      <button
        onClick={submitComment}
        disabled={loadingComment}
        className="mt-3 w-full bg-gray-700 py-2 rounded-lg text-sm"
      >
        {loadingComment ? "..." : "Envoyer"}
      </button>

      <button
        onClick={() => setShowModal(false)}
        className="mt-4 w-full text-gray-400 text-sm"
      >
        Fermer
      </button>

    </div>
  </div>
)}
  </div>
);
}

export default HomePage;