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
import MarkerClusterGroup from "react-leaflet-cluster";


// ✅ Icônes personnalisées selon statut

const greenIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/green-dot.png",
  iconSize: [32, 32],
});

const yellowIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
  iconSize: [32, 32],
});

const redIcon = new L.Icon({
  iconUrl: "https://maps.google.com/mapfiles/ms/icons/red-dot.png",
  iconSize: [32, 32],
});

const blueIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.3/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
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
const [incidents, setIncidents] = useState([]);
const [statusFilter, setStatusFilter] = useState("all");
  


// Fonction de filtrage des incidents à proximité
  const getNearbyIncidents = () => {
  if (!selectedPosition) return [];

  return incidents
    .filter(
      (incident) =>
        incident.localisation &&
        typeof incident.localisation.latitude === "number" &&
        typeof incident.localisation.longitude === "number"
    )
    // Nouveau filtre par statut inséré ici
    .filter((incident) =>
      statusFilter === "all"
        ? true
        : incident.statut === statusFilter
    )
    .filter((incident) => {
      const distance =
        Math.abs(
          incident.localisation.latitude - selectedPosition.lat
        ) +
        Math.abs(
          incident.localisation.longitude - selectedPosition.lng
        );

      return distance < 0.05; // seuil simple
    });
};
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

 
return (
  <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 pb-28 animate-fadeIn">

    {/* ✅ Actions principales */}
    <div className="px-4 pt-6 space-y-4">

      {/* 🚨 Signalement */}
      <button
        onClick={() =>
          navigate("/report", { state: { selectedPosition } })
        }
        className="w-full backdrop-blur-md bg-white/70 
                   rounded-2xl shadow-lg py-4 
                   flex items-center justify-center gap-3
                   text-red-600 font-semibold text-lg
                   transition active:scale-95"
      >
        🚨 Signaler un incident
      </button>

      {/* 📍 Localisation */}
      <button
        onClick={() => {
          if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
              (position) => {
                const coords = [
                  position.coords.latitude,
                  position.coords.longitude,
                ];
                setUserPosition(coords);
                setSelectedPosition({
                  lat: position.coords.latitude,
                  lng: position.coords.longitude,
                });
              }
            );
          }
        }}
        className="w-full backdrop-blur-md bg-blue-500/90 
                   rounded-2xl shadow-lg py-4 
                   flex items-center justify-center gap-3
                   text-white font-semibold
                   transition active:scale-95"
      >
        📍 Activer ma localisation
      </button>

    </div>

    <div className="flex gap-3 px-4 mt-2 overflow-x-auto">

  {["all", "valide", "en_attente", "rejete"].map((status) => (
    <button
      key={status}
      onClick={() => setStatusFilter(status)}
      className={`px-4 py-2 rounded-full text-sm font-medium transition ${
        statusFilter === status
          ? "bg-black text-white"
          : "bg-white/70 backdrop-blur-md text-gray-700"
      }`}
    >
      {status === "all"
        ? "Tous"
        : status === "valide"
        ? "Validé"
        : status === "en_attente"
        ? "En attente"
        : "Rejeté"}
    </button>
  ))}

</div>

    {/* ✅ Carte premium */}
    <div className="mt-6 px-4">
      <div className="rounded-3xl overflow-hidden shadow-2xl">
        <MapContainer
          center={userPosition || [-4.3, 15.3]}
          zoom={13}
          style={{ height: "60vh", width: "100%" }}
        >
          <TileLayer
            attribution="© OpenStreetMap"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {selectedPosition && (
            <Marker
              position={[
                selectedPosition.lat,
                selectedPosition.lng,
              ]}
              icon={blueIcon}
            />
          )}

          <MarkerClusterGroup>
  {incidents
    ?.filter(
      (incident) =>
        incident.localisation &&
        typeof incident.localisation.latitude === "number" &&
        typeof incident.localisation.longitude === "number"
    )
    .map((incident) => (
      <Marker
        key={incident.id}
        position={[
          incident.localisation.latitude,
          incident.localisation.longitude,
        ]}
        icon={
          incident.statut === "valide"
            ? greenIcon
            : incident.statut === "en_attente"
            ? yellowIcon
            : redIcon
        }
      >
       <Popup>
  <div className="backdrop-blur-md bg-white/90 
                  rounded-2xl p-4 shadow-2xl 
                  animate-popupIn min-w-[180px]">
    <p className="font-semibold text-gray-800">
      {incident.titre}
    </p>

    <p className="text-xs text-gray-500 mt-1">
      {incident.type?.titre}
    </p>

    <p className={`text-xs mt-2 font-medium ${
      incident.statut === "valide"
        ? "text-green-600"
        : incident.statut === "en_attente"
        ? "text-yellow-600"
        : "text-red-600"
    }`}>
      {incident.statut}
    </p>
  </div>
</Popup>
      </Marker>
    ))}
</MarkerClusterGroup>
        </MapContainer>
      </div>
    </div>

    {/* ✅ Liste premium scroll indépendante */}
    {selectedPosition && (
      <div className="mt-6 mx-4 bg-white/70 backdrop-blur-md 
                      rounded-3xl shadow-lg p-4 max-h-60 overflow-y-auto">
        <h3 className="font-semibold text-gray-800 mb-3">
          Accidents proches
        </h3>

        {getNearbyIncidents().length === 0 ? (
          <p className="text-sm text-gray-500">
            Aucun incident proche.
          </p>
        ) : (
          getNearbyIncidents().map((incident) => (
            <div
              key={incident.id}
              className="flex justify-between items-center py-3 border-b last:border-none"
            >
              <div>
                <p className="font-medium text-gray-800">
                  {incident.titre}
                </p>
                <p className="text-xs text-gray-500">
                  {incident.type?.titre}
                </p>
              </div>

              <div
                className={`w-3 h-3 rounded-full ${
                  incident.statut === "valide"
                    ? "bg-green-500"
                    : incident.statut === "en_attente"
                    ? "bg-yellow-400"
                    : "bg-red-500"
                }`}
              />
            </div>
          ))
        )}
      </div>
    )}

  </div>
);
}

export default HomePage;