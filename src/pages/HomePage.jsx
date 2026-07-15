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
  <div className="flex flex-col min-h-screen bg-gray-100">

    <div className="p-4">
      <h2 className="text-xl font-semibold text-gray-800 mb-3">
        Accueil
      </h2>

      <button
        onClick={() =>
  navigate("/report", { state: { selectedPosition } })
}
        className="w-full bg-red-600 text-white py-4 rounded-xl text-lg font-bold shadow-lg hover:bg-red-700 transition mb-4"
      >
        🚨 Signaler un incident
      </button>
    </div>


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
        },
        (error) => {
          console.log("Erreur géolocalisation :", error);
        }
      );
    }
  }}
  className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold shadow mb-4"
>
  📍 Activer ma localisation
</button>



    {/* ✅ Carte plus grande */}
    <div className="px-4">
      <div className="bg-white rounded-xl shadow overflow-hidden">
       <MapContainer
  center={userPosition || [-4.3, 15.3]}
  zoom={13}
  style={{ height: "65vh", width: "100%" }}
>
  <TileLayer
    attribution='&copy; OpenStreetMap contributors'
    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  />

  {selectedPosition && (
    <Marker
  position={[selectedPosition.lat, selectedPosition.lng]}
  icon={blueIcon}
>
      <Popup>Ma position</Popup>
    </Marker>
  )}

  {incidents
    .filter(
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
          <div className="text-sm">
            <p className="font-semibold">{incident.titre}</p>
            <p>{incident.type?.titre}</p>
            <p className="text-gray-500">{incident.statut}</p>
          </div>
        </Popup>
      </Marker>
    ))}
</MapContainer>
      </div>
    </div>

    {/* ✅ Liste indépendante scrollable */}
    {selectedPosition && (
      <div className="bg-white mt-4 mx-4 rounded-xl shadow p-4 max-h-60 overflow-y-auto">
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
              className="border-b py-2"
            >
              <p className="font-medium">{incident.titre}</p>
              <p className="text-sm text-gray-500">
                {incident.type?.titre}
              </p>
            </div>
          ))
        )}
      </div>
    )}

  </div>
);
}

export default HomePage;