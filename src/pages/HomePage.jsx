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
const [selectedPosition, ] = useState(null);
const [incidents, setIncidents] = useState([]);
const [mapFilter, setMapFilter] = useState("all");
const [selectedIncident, setSelectedIncident] = useState(null);
const [showModal, setShowModal] = useState(false);
const [loadingConfirm, setLoadingConfirm] = useState(false);
const [loadingComment, setLoadingComment] = useState(false);
const [commentText, setCommentText] = useState("");
const [modalMessage, setModalMessage] = useState(null);


  
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
      // Laravel pagination probable
      const data = res.data.data || res.data;
      setIncidents(data);
    })
    .catch(() => console.log("Erreur chargement incidents"));
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






return (
  <div className="h-screen flex flex-col relative bg-[#0E223A] overflow-hidden">

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


    <div className="bg-[#0E223A] px-4 py-3">

  <div className="flex gap-3 overflow-x-auto">

    {["all", "valide", "en_attente", "rejete"].map((status) => {

  const count = incidents.filter(
    (i) => status === "all" ? true : i.statut === status
  ).length;

  return (
    <button
      key={status}
      onClick={() => setMapFilter(status)}
      className={`px-4 py-2 rounded-full text-sm font-medium ${
        mapFilter === status
          ? "bg-orange-500 text-white"
          : "bg-white/20 text-white border border-white/40"
      }`}
    >
      {status === "all"
        ? `Tous (${count})`
        : `${status} (${count})`}
    </button>
  );
})}

  </div>

</div>

    {/* ✅ ZONE BLEU FONCÉ */}
    <div className="flex-1 bg-[#0E223A] pt-4 relative">

      {/* ✅ CARTE */}
      <div className="mt-2">
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
          </MapContainer>

        </div>
      </div>

      {/* ✅ BOUTON CENTRAL */}
      <div className="absolute left-1/2 
                -translate-x-1/2 
                bottom-25">

        <button
          onClick={() =>
            navigate("/report", { state: { selectedPosition } })
          }
          className="w-36 h-36 rounded-full 
             bg-gradient-to-b 
             from-orange-400 to-orange-600 
             shadow-[0_15px_40px_rgba(255,140,0,0.5)]
             text-white font-bold text-base
             flex flex-col items-center justify-center
             leading-tight
             transition active:scale-95"
        >
          SIGNALER
          <br />
          UNE ALERTE
        </button>

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