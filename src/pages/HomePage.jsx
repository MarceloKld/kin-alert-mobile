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
      <Popup>
        <div className="bg-white rounded-xl p-3 shadow-lg">
          <p className="font-semibold">
            {incident.titre}
          </p>
          <p className="text-xs text-gray-500">
            {incident.type?.titre}
          </p>
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