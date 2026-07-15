import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
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

// ✅ Fix icônes Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

function LocationSelector({ setSelectedPosition }) {
  useMapEvents({
    click(e) {
      setSelectedPosition(e.latlng);
    },
  });
  return null;
}

function HomePage() {
  const navigate = useNavigate();

  const [userPosition, setUserPosition] = useState(null);
  const [selectedPosition, setSelectedPosition] = useState(null);
  const [incidents, setIncidents] = useState([]);


// Fonction de filtrage des incidents à proximité
  const getNearbyIncidents = () => {
    if (!selectedPosition) return [];

    return incidents.filter((incident) => {
      const distance =
        Math.abs(incident.position[0] - selectedPosition.lat) +
        Math.abs(incident.position[1] - selectedPosition.lng);

      return distance < 0.05; // seuil simple (démo)
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
    <div className="p-4 space-y-6">

      <h2 className="text-xl font-semibold text-gray-800">
        Accueil
      </h2>

      {/* ✅ Bouton principal */}
      <button
        onClick={() =>
          navigate("/report", { state: { selectedPosition } })
        }
        className="w-full bg-red-600 text-white py-4 rounded-xl text-lg font-bold shadow-lg hover:bg-red-700 transition"
      >
        🚨 Signaler un incident
      </button>

      {/* ✅ Carte */}
      <div className="bg-white rounded-xl shadow p-2">
        <MapContainer
          center={userPosition || [-4.3, 15.3]}
          zoom={13}
          style={{ height: "400px", width: "100%" }}
          className="rounded-xl"
        >
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* ✅ Détection clic */}
          <LocationSelector setSelectedPosition={setSelectedPosition} />

          {/* ✅ Marqueur position utilisateur */}
          {userPosition && (
            <Marker position={userPosition}>
              <Popup>Votre position</Popup>
            </Marker>
          )}

          {/* ✅ Marqueur position sélectionnée */}
          {selectedPosition && (
            <Marker position={selectedPosition}>
              <Popup>Position sélectionnée</Popup>
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

        {selectedPosition && (
  <div className="mt-4 bg-white rounded-xl shadow p-4">
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
          className="border-b py-2 text-sm"
        >
          <p className="font-medium">{incident.titre}</p>
          <p className="text-gray-500">
            {incident.description}
          </p>
        </div>
      ))
    )}
  </div>
)}
      </div>

    </div>
  );
}

export default HomePage;