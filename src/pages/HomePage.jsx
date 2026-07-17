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
import { useToast } from "../context/ToastContext";

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
const [loadingConfirm, setLoadingConfirm] = useState(null);
const [loadingComment, setLoadingComment] = useState(false);
const [commentText, setCommentText] = useState("");
const { showToast } = useToast();
const [comments, setComments] = useState({});


  
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

 const confirmIncident = async (id) => {
  if (!id) return;

  setLoadingConfirm(id);

  try {
    await api.post(`/incidents/${id}/confirm`);

    // ✅ Mise à jour locale sans fermer popup
    setIncidents((prev) =>
  prev.map((i) =>
    i.id === id
      ? {
          ...i,
          nombre_confirmations: i.nombre_confirmations + 1,
          statut: "valide",
          isConfirmed: true,   // ✅ nouveau flag
        }
      : i
  )
);

    showToast("✅ Confirmation enregistrée", "success");

  } catch (error) {
    const message =
      error.response?.data?.message ||
      "Erreur lors de la confirmation.";
    showToast(message, "error");
  } finally {
    setLoadingConfirm(null);
  }
};

const submitComment = async (id) => {
  if (!commentText) return;

  setLoadingComment(true);

  try {
    await api.post(`/incidents/${id}/comments`, {
      contenu: commentText,
    });

    setCommentText("");
    showToast("✅ Commentaire envoyé", "success");

  } catch (error) {
    console.error(error);
    showToast("Erreur lors de l'envoi du commentaire", "error");
  } finally {
    setLoadingComment(false);
  }
};

const loadComments = async (incidentId) => {
  try {
    const res = await api.get(`/incidents/${incidentId}/comments`);

    setComments((prev) => ({
      ...prev,
      [incidentId]: res.data,
    }));

  } catch (error) {
    console.error(error);
  }
};




return (
  <div className="h-screen flex flex-col relative bg-[#0E223A] overflow-hidden">

    {/* ✅ HEADER ORANGE */}
    <div className="bg-gradient-to-b from-orange-500 to-orange-600 
                    text-white pt-6 pb-4 px-5">

      <div className="flex justify-between items-center">

        <div className="relative">
          <span className="absolute -top-2 -right-2 
                           bg-red-600 text-white 
                           text-xs rounded-full px-1">
            3
          </span>
          🔔
        </div>

        <h1 className="text-lg font-semibold">
          Kin -Alertes
        </h1>

        <div className="relative">
          <span className="absolute -top-2 -right-2 
                           bg-red-600 text-white 
                           text-xs rounded-full px-1">
            6
          </span>
          🚨
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
  <Popup autoClose={false} closeOnClick={false}>

    <div className="w-56 text-sm space-y-2">

      {/* ✅ TITRE */}
      <h3 className="font-semibold text-base">
        {incident.titre}
      </h3>

      {/* ✅ TYPE */}
      <p className="text-xs text-gray-500">
        {incident.type?.titre}
      </p>

      {/* ✅ LOCALISATION */}
      <p className="text-xs text-gray-400">
        📍 {incident.localisation?.commune?.nom}
      </p>

      {/* ✅ STATUT */}
      <span
  className={`text-xs px-2 py-1 rounded-full animate-statusChange ${
    incident.statut === "valide"
      ? "bg-green-500/20 text-green-600"
      : incident.statut === "en_attente"
      ? "bg-yellow-500/20 text-yellow-600"
      : "bg-red-500/20 text-red-600"
  }`}
>
  {incident.commentaires && incident.commentaires.length > 0 && (
  <div className="mt-4 space-y-2 max-h-24 overflow-y-auto">
    {incident.commentaires.map((comment) => (
      <div
        key={comment.id}
        className="bg-[#0E223A] p-2 rounded-lg text-xs text-gray-300"
      >
        {comment.contenu}
      </div>
    ))}
  </div>
)}

  {incident.statut}
</span>

{/* ✅ COMPTEUR CONFIRMATIONS */}
<p
  className={`text-xs mt-2 flex items-center gap-1 
    ${
      incident.statut === "valide"
        ? "text-green-400"
        : "text-gray-400"
    }`}
>
 <span className="animate-pulse text-green-400">✔</span>
  {incident.nombre_confirmations} confirmation
  {incident.nombre_confirmations > 1 && "s"}
</p>
      {/* ✅ CONFIRM BUTTON */}
      <button
  onClick={(e) => {
    e.stopPropagation();
    confirmIncident(incident.id);
  }}
  disabled={
    loadingConfirm === incident.id ||
    incident.isConfirmed ||
    incident.statut === "valide"
  }
  className={`w-full py-2 rounded-lg text-xs flex items-center justify-center gap-2
    ${
      incident.isConfirmed || incident.statut === "valide"
        ? "bg-gray-600 text-gray-300 cursor-not-allowed"
        : "bg-blue-500 text-white"
    }`}
>
  {loadingConfirm === incident.id ? (
    <>
      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      Confirmation...
    </>
  ) : incident.isConfirmed || incident.statut === "valide" ? (
    "Déjà confirmé"
  ) : (
    "Confirmer"
  )}
</button>

      {/* ✅ COMMENT AREA */}
      <textarea
        value={commentText}
        onChange={(e) => setCommentText(e.target.value)}
        placeholder="Votre commentaire..."
        className="w-full p-2 rounded bg-gray-100 text-xs"
        rows="2"
      />

      <button
  onClick={(e) => {
  e.stopPropagation();     // ✅ IMPORTANT
  submitComment(incident.id);
}}
  disabled={loadingComment}
  className="w-full bg-gray-700 text-white py-2 rounded-lg text-xs
             flex items-center justify-center gap-2
             disabled:opacity-60"
>
  {loadingComment ? (
    <>
      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      <span>Envoi...</span>
    </>
  ) : (
    <span>Envoyer</span>
  )}
</button>

<button
  onClick={(e) => {
    e.stopPropagation();
    loadComments(incident.id);
  }}
  className="w-full bg-gray-800 text-white py-1 rounded-lg text-xs"
>
  Voir les commentaires
</button>

{comments[incident.id] && (
  <div className="mt-3 max-h-24 overflow-y-auto space-y-2">

    {comments[incident.id].length === 0 ? (
      <p className="text-gray-400 text-xs">
        Aucun commentaire
      </p>
    ) : (
      comments[incident.id].map((comment) => (
        <div
          key={comment.id}
          className="bg-gray-100 p-2 rounded text-xs text-gray-700"
        >
          {comment.contenu}
        </div>
      ))
    )}

  </div>
)}

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

  </div>
);
}

export default HomePage;