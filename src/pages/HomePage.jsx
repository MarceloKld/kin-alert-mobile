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
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

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

  // ✅ Géolocalisation utilisateur
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserPosition([
          position.coords.latitude,
          position.coords.longitude,
        ]);
      });
    }
  }, []);

  // ✅ Mock incidents (temporaire)
  const incidents = [
    { id: 1, position: [-4.31, 15.31], titre: "Accident" },
    { id: 2, position: [-4.28, 15.29], titre: "Incendie" },
  ];

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

          {/* ✅ Marqueurs incidents */}
          {incidents.map((incident) => (
            <Marker key={incident.id} position={incident.position}>
              <Popup>{incident.titre}</Popup>
            </Marker>
          ))}

        </MapContainer>
      </div>

    </div>
  );
}

export default HomePage;