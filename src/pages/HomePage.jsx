import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { MapContainer,TileLayer,Marker,Popup,} from "react-leaflet";
import L from "leaflet";
import api from "../api/axios";
import "leaflet/dist/leaflet.css";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import { Bell, Siren, ShieldCheck, Radio } from "lucide-react";
import { ShieldAlert,LayoutGrid, CheckCircle2, Clock, XCircle } from "lucide-react";
import { MapPin, CheckCircle } from "lucide-react";



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
    {/* ========================================
    TOAST NOTIFICATION
    - Animations CSS pures
    - Auto-dismiss
    - Icons selon type
======================================== */}
    {toast && (
      <div
        className={`
      fixed top-4 right-4 
      px-5 py-4
      rounded-2xl 
      shadow-2xl
      text-sm font-semibold
      text-white 
      z-[9999]
      backdrop-blur-xl
      border-2
      flex items-center gap-3
      animate-slide-in-right
      ${
        toast.type === "success"
          ? "bg-gradient-to-r from-emerald-600 to-green-600 border-emerald-400/50 shadow-emerald-500/50"
          : toast.type === "error"
            ? "bg-gradient-to-r from-red-600 to-rose-600 border-red-400/50 shadow-red-500/50"
            : "bg-gradient-to-r from-blue-600 to-cyan-600 border-blue-400/50 shadow-blue-500/50"
      }
    `}
      >
        {/* Glow effect */}
        <div
          className={`
      absolute inset-0 rounded-2xl blur-xl opacity-50 -z-10
      ${toast.type === "success" ? "bg-emerald-600" : ""}
      ${toast.type === "error" ? "bg-red-600" : ""}
      ${toast.type === "info" ? "bg-blue-600" : ""}
    `}
        />

        {/* Icône selon type */}
        <div className="shrink-0">
          {toast.type === "success" && (
            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}

          {toast.type === "error" && (
            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}

          {toast.type === "info" && (
            <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Message */}
        <span className="flex-1 drop-shadow-lg">{toast.message}</span>

        {/* Bouton fermer */}
        <button
          onClick={() => setToast(null)}
          className="shrink-0 w-5 h-5 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-all hover:scale-110 active:scale-95"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        {/* Barre de progression auto-dismiss */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 rounded-b-2xl overflow-hidden">
          <div className="h-full bg-white/50 animate-progress-bar" />
        </div>
      </div>
    )}

    {/* ==========================
    HEADER HOME PREMIUM SVG
========================== */}

    <div
      className="bg-gradient-to-br 
                from-orange-500 
                via-orange-600 
                to-orange-700
                text-white 
                pt-3 pb-6 px-5
                shadow-lg"
    >
      <div className="flex justify-between items-center">
        {/* ========================================
    BOUTON NOTIFICATION
    - Badge numérique
    - Double ping animation
    - Hover effect
======================================== */}
        <button
          className="group relative 
             p-3 
             bg-white/10 backdrop-blur-md 
             rounded-2xl 
             border border-white/20 
             shadow-lg 
             hover:bg-white/20 
             transition-all duration-300 
             hover:scale-105 active:scale-95
             shrink-0"
        >
          {/* Glow au hover */}
          <div
            className="absolute inset-0 
                  bg-gradient-to-br from-red-500/20 to-orange-500/20 
                  rounded-2xl 
                  opacity-0 group-hover:opacity-100 
                  transition-opacity duration-300"
          />

          {/* Icône Bell */}
          <Bell size={22} className="relative text-white drop-shadow-lg" />

          {/* Badge notification avec nombre */}
          <span className="absolute -top-1 -right-1 flex h-5 w-5">
            {/* Animation ping (cercle externe) */}
            <span
              className="animate-ping 
                     absolute inline-flex 
                     h-full w-full 
                     rounded-full 
                     bg-red-500 
                     opacity-75"
            ></span>

            {/* Badge fixe avec nombre */}
            <span
              className="relative 
                     inline-flex items-center justify-center 
                     rounded-full 
                     h-5 w-5 
                     bg-gradient-to-br from-red-500 to-red-600 
                     border-2 border-white 
                     shadow-lg 
                     text-[10px] font-bold text-white"
            ></span>
          </span>
        </button>

        {/* ========================================
    TITRE CENTRAL KIN-ALERT
    - Glassmorphism
    - Gradient text
    - Point live
======================================== */}
        <div
          className="flex-1 
                text-center 
                px-4 py-2.5
                bg-white/10 backdrop-blur-xl 
                rounded-2xl 
                border border-white/20 
                shadow-2xl 
                relative
                max-w-xs mx-auto"
        >
          {/* Glow derrière */}
          <div
            className="absolute inset-0 
                  bg-white/20 
                  blur-2xl 
                  rounded-full 
                  -z-10"
          />

          {/* Titre principal */}
          <h1
            className="text-2xl 
                 font-black 
                 tracking-tighter 
                 leading-tight"
          >
            <span
              className="bg-gradient-to-r 
                     from-white via-orange-100 to-white 
                     bg-clip-text text-transparent 
                     drop-shadow-lg"
            >
              KIN-ALERT
            </span>
          </h1>

          {/* Sous-titre avec icône */}
          <div className="flex items-center justify-center gap-1.5 mt-1">
            <ShieldCheck size={14} className="text-orange-200 drop-shadow" />

            <span
              className="text-[10px] 
                     uppercase 
                     tracking-widest 
                     font-bold 
                     bg-gradient-to-r from-orange-100 to-white 
                     bg-clip-text text-transparent"
            >
              Protection Civile
            </span>

            {/* Point live */}
            <span className="flex h-2 w-2 ml-1">
              <span
                className="animate-ping 
                       absolute inline-flex 
                       h-2 w-2 
                       rounded-full 
                       bg-green-400 
                       opacity-75"
              ></span>
              <span
                className="relative 
                       inline-flex 
                       rounded-full 
                       h-2 w-2 
                       bg-green-400 
                       shadow-lg shadow-green-400/50"
              ></span>
            </span>
          </div>
        </div>

        {/* ========================================
    BOUTON ALERTE SOS
    - Badge LIVE
    - Glow rouge pulsant
    - Animation wiggle
======================================== */}
        <button
          className="group relative 
             p-3 
             bg-white/10 backdrop-blur-md 
             rounded-2xl 
             border border-white/20 
             shadow-lg 
             hover:bg-white/20 
             transition-all duration-300 
             hover:scale-110 active:scale-95
             shrink-0"
        >
          {/* Glow rouge pulsant */}
          <div
            className="absolute inset-0 
                  bg-red-500 
                  rounded-2xl 
                  blur-xl 
                  opacity-30 
                  animate-pulse"
          />

          {/* Icône Siren avec wiggle */}
          <Siren
            size={22}
            className="relative 
                    text-red-200 
                    drop-shadow-lg 
                    animate-wiggle"
          />
        </button>
      </div>
    </div>

    <div className="bg-[#0E223A] px-2 py-4">
      <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar scroll-smooth">
        {loadingFilters ? (
          // --- SKELETON LOADING PREMIUM ---
          <>
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-11 w-28 bg-white/5 border border-white/10 rounded-2xl animate-pulse shrink-0"
              ></div>
            ))}
          </>
        ) : (
          // --- FILTRES ACTIFS ---
          [
            { id: "all", label: "Tous", icon: LayoutGrid },
            { id: "valide", label: "Validés", icon: CheckCircle2 },
            { id: "en_attente", label: "Attente", icon: Clock },
            { id: "rejete", label: "Rejetés", icon: XCircle },
          ].map((statusObj) => {
            const count = incidents.filter((i) =>
              statusObj.id === "all" ? true : i.statut === statusObj.id,
            ).length;

            const isActive = mapFilter === statusObj.id;
            const Icon = statusObj.icon;

            return (
              <button
                key={statusObj.id}
                onClick={() => setMapFilter(statusObj.id)}
                className={`
              shrink-0 flex items-center gap-2.5 px-4 py-2.5 rounded-2xl border transition-all duration-300 active:scale-90
              ${
                isActive
                  ? "bg-orange-600 border-orange-400 text-white shadow-[0_8px_20px_rgba(234,88,12,0.3)] scale-105"
                  : "bg-white/5 border-white/10 text-gray-400 hover:bg-white/10"
              }
            `}
              >
                {/* Icône SVG avec animation si actif */}
                <Icon
                  size={16}
                  strokeWidth={isActive ? 3 : 2}
                  className={isActive ? "animate-pulse" : "opacity-60"}
                />

                <span
                  className={`text-[11px] font-black uppercase tracking-tight ${isActive ? "opacity-100" : "opacity-80"}`}
                >
                  {statusObj.label}
                </span>

                {/* Badge de compteur stylisé */}
                <span
                  className={`
                flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-lg text-[10px] font-black
                ${
                  isActive
                    ? "bg-white/20 text-white"
                    : "bg-white/10 text-gray-500"
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

    {/* ========================================
    BOUTON SÉLECTION POSITION
    - État actif/verrouillé
    - Animations CSS pures
    - Badge de confirmation
======================================== */}
    <div className="px-4 mb-4">
      <button
        onClick={selectMyPosition}
        disabled={!!selectedPosition}
        className={`
      relative w-full overflow-hidden
      flex items-center justify-center gap-3 
      py-4 px-6
      rounded-2xl 
      font-black text-sm uppercase tracking-widest
      shadow-2xl
      transition-all duration-300
      active:scale-95
      ${
        selectedPosition
          ? "bg-gradient-to-r from-emerald-600 to-green-600 text-white cursor-not-allowed"
          : "bg-gradient-to-r from-blue-600 to-cyan-600 text-white hover:shadow-blue-500/50 hover:scale-[1.02]"
      }
    `}
      >
        {/* Glow animé */}
        <div
          className={`
      absolute inset-0 
      ${
        selectedPosition
          ? "bg-gradient-to-r from-emerald-600 to-green-600"
          : "bg-gradient-to-r from-blue-600 to-cyan-600"
      }
      blur-xl 
      opacity-50
      -z-10
    `}
        />

        {/* Shine effect (état actif seulement) */}
        {!selectedPosition && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 animate-shimmer" />
        )}

        {selectedPosition ? (
          // ===== ÉTAT VERROUILLÉ =====
          <>
            {/* Icône succès */}
            <CheckCircle
              size={22}
              strokeWidth={2.5}
              className="drop-shadow-lg"
            />

            {/* Texte */}
            <span className="relative z-10">Position Verrouillée</span>

            {/* Badge OK */}
            <div className="px-2 py-1 bg-white/20 rounded-lg text-[10px] font-bold border border-white/30">
              ✓ OK
            </div>
          </>
        ) : (
          // ===== ÉTAT ACTIF =====
          <>
            {/* Icône localisation avec pulse */}
            <div className="relative">
              {/* Cercle pulsant derrière */}
              <span className="absolute inset-0 flex items-center justify-center">
                <span className="flex h-8 w-8">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-30"></span>
                </span>
              </span>

              {/* Icône */}
              <MapPin
                size={22}
                strokeWidth={2.5}
                className="relative drop-shadow-lg animate-bounce-slow"
              />
            </div>

            {/* Texte */}
            <span className="relative z-10">Sélectionner ma position</span>

            {/* Chevron animé */}
            <svg
              className="w-5 h-5 animate-pulse"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={3}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </>
        )}
      </button>

      {/* Message d'aide contextuel */}
      {!selectedPosition && (
        <p className="mt-3 text-center text-xs text-gray-400 flex items-center justify-center gap-2 animate-fade-in">
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
              clipRule="evenodd"
            />
          </svg>
          <span>Cliquez sur la carte pour définir votre position</span>
        </p>
      )}
    </div>

    {/* ✅ ZONE BLEU FONCÉ */}
    <div className="flex-1 bg-[#0E223A]  relative">
      {/* ✅ CARTE */}
      <div className="mt-0">
        <div className="rounded-t-3xl overflow-hidden shadow-2xl">
          <MapContainer
            center={userPosition || [-4.3, 15.3]}
            zoom={13}
            style={{ height: "30vh", width: "100%" }}
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
                  typeof incident.localisation.longitude === "number",
              )
              .filter((incident) =>
                mapFilter === "all" ? true : incident.statut === mapFilter,
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
                        <span className="text-gray-400">Confirmations</span>

                        <span
                          className={`font-medium ${
                            incident.statut === "valide"
                              ? "text-green-400"
                              : "text-gray-300"
                          }`}
                        >
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
          onClick={() =>
            selectedPosition
              ? navigate("/report", { state: { selectedPosition } })
              : setToast({
                  type: "error",
                  message: "Sélectionnez votre position",
                })
          }
          className="w-40 h-40 rounded-full bg-gradient-to-tr from-orange-600 to-orange-400 
               shadow-[0_0_50px_rgba(234,88,12,0.3)] border-8 border-[#0E223A]
               flex flex-col items-center justify-center text-white font-black
               animate-pulseGlow active:scale-95 transition-all duration-300"
        >
          <span className="text-2xl">SIGNALER</span>
          <span className="text-[10px] font-light tracking-[0.2em] opacity-80">
            INCIDENT
          </span>
        </button>

        {/* ========================================
    BOUTON SOS PANIC
    - Effet d'urgence maximal
    - Animations CSS pures
    - Feedback visuel intense
======================================== */}
        <button
          onClick={handleSOS}
          disabled={sosLoading}
          className={`
    relative w-full overflow-hidden
    py-6 px-6
    rounded-3xl
    shadow-2xl
    transition-all duration-300
    active:scale-95
    z-40
    ${
      sosLoading
        ? "bg-gradient-to-r from-red-900 to-red-950 cursor-wait"
        : "bg-gradient-to-r from-red-600 via-red-700 to-red-800 hover:shadow-red-500/60"
    }
  `}
        >
          {/* Glow externe pulsant (urgence) */}
          {!sosLoading && (
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 blur-2xl opacity-60 animate-pulse-urgent -z-10" />
          )}

          {/* Bordure pulsante */}
          {!sosLoading && (
            <div className="absolute inset-0 border-4 border-red-400 rounded-3xl animate-pulse-border" />
          )}

          {/* Rayons d'alerte rotatifs */}
          {!sosLoading && (
            <div className="absolute inset-0 opacity-10 animate-spin-slow">
              {[...Array(12)].map((_, i) => (
                <div
                  key={i}
                  className="absolute top-1/2 left-1/2 w-1 h-full bg-white origin-top"
                  style={{
                    transform: `rotate(${i * 30}deg) translateX(-50%)`,
                  }}
                />
              ))}
            </div>
          )}

          {/* Contenu du bouton */}
          <div className="relative z-10 flex items-center justify-center gap-3">
            {sosLoading ? (
              // ===== ÉTAT CHARGEMENT =====
              <>
                {/* Spinner avec point central */}
                <div className="relative">
                  <div className="w-8 h-8 border-4 border-white/20 border-t-white rounded-full animate-spin" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                  </div>
                </div>

                {/* Texte chargement */}
                <div className="flex flex-col items-start">
                  <span className="text-white font-black text-base tracking-tight">
                    Envoi en cours...
                  </span>
                  {/* Points animés */}
                  <div className="flex gap-1 mt-1">
                    {[...Array(3)].map((_, i) => (
                      <div
                        key={i}
                        className="w-1.5 h-1.5 bg-white/60 rounded-full animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }}
                      />
                    ))}
                  </div>
                </div>
              </>
            ) : (
              // ===== ÉTAT ACTIF =====
              <>
                {/* Icône Siren avec animations */}
                <div className="relative">
                  {/* Cercle pulsant */}
                  <div className="absolute inset-0 bg-white rounded-full opacity-50 animate-ping-slow -m-2" />

                  {/* Container icône */}
                  <div className="relative w-12 h-12 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/30">
                    <Siren
                      size={24}
                      className="text-white drop-shadow-lg animate-wiggle-urgent"
                    />

                    {/* Badge "!" */}
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-400 border-2 border-red-600 rounded-full flex items-center justify-center shadow-lg animate-bounce">
                      <span className="text-red-900 text-xs font-black">!</span>
                    </div>
                  </div>
                </div>

                {/* Texte principal */}
                <div className="flex flex-col items-start">
                  <div className="flex items-center gap-2">
                    <span className="text-white font-black text-xl tracking-tight drop-shadow-lg">
                      SOS
                    </span>
                    {/* Points clignotants */}
                    <div className="flex gap-1">
                      {[...Array(3)].map((_, i) => (
                        <div
                          key={i}
                          className="w-1.5 h-1.5 bg-yellow-400 rounded-full animate-blink"
                          style={{ animationDelay: `${i * 0.2}s` }}
                        />
                      ))}
                    </div>
                  </div>
                  <span className="text-red-100 font-bold text-sm uppercase tracking-wider">
                    Danger Immédiat
                  </span>
                </div>

                {/* Chevron animé */}
                <svg
                  className="ml-auto w-6 h-6 text-white animate-pulse"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={3}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </>
            )}
          </div>

          {/* Barre de progression (loading) */}
          {sosLoading && (
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white/50 animate-progress-bar" />
            </div>
          )}

          {/* Waves d'alerte (actif seulement) */}
          {!sosLoading && (
            <>
              {[...Array(3)].map((_, i) => (
                <div
                  key={i}
                  className="absolute inset-0 border-4 border-white rounded-3xl animate-wave-expand"
                  style={{ animationDelay: `${i * 0.6}s` }}
                />
              ))}
            </>
          )}

          {/* Particules de danger */}
          {!sosLoading && (
            <>
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="absolute bottom-4 w-2 h-2 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/50 animate-float-up"
                  style={{
                    left: `${20 + i * 12}%`,
                    animationDelay: `${i * 0.3}s`,
                  }}
                />
              ))}
            </>
          )}
        </button>

        {/* Message d'avertissement */}
        {!sosLoading && (
          <div className="mt-3 px-4 py-3 bg-red-500/10 backdrop-blur-sm border border-red-500/30 rounded-2xl animate-fade-in">
            <div className="flex items-start gap-3">
              <svg
                className="w-5 h-5 text-red-400 shrink-0 mt-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
              <div className="flex-1">
                <p className="text-red-400 font-bold text-xs">
                  À utiliser en cas d'urgence uniquement
                </p>
                <p className="text-red-300/70 text-[10px] mt-1">
                  Les autorités seront immédiatement alertées de votre position
                </p>
              </div>
            </div>
          </div>
        )}



        

        {/* DESCRIPTIONS PREMIUM AVEC SVGs */}
        <div className="w-full space-y-4 px-2">
          {/* Item 1: Protection Kuluna */}
          <div className="bg-white/5 backdrop-blur-md p-5 rounded-[2rem] border border-white/10 flex items-center gap-5 animate-fadeUp">
            <div className="w-14 h-14 flex-none bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-2xl flex items-center justify-center border border-orange-500/30 shadow-lg shadow-orange-900/20">
              <ShieldAlert
                size={28}
                className="text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.4)]"
                strokeWidth={2}
              />
            </div>
            <div>
              <h4 className="text-white text-base font-extrabold tracking-tight">
                Protection Kuluna
              </h4>
              <p className="text-[11px] text-gray-400 leading-tight mt-0.5 font-medium">
                Signalement prioritaire envoyé directement aux unités mobiles
                d'intervention.
              </p>
            </div>
          </div>

          {/* Item 2: Réseau d'Alerte */}
          <div
            className="bg-white/5 backdrop-blur-md p-5 rounded-[2rem] border border-white/10 flex items-center gap-5 animate-fadeUp"
            style={{ animationDelay: "0.15s" }}
          >
            <div className="w-14 h-14 flex-none bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-2xl flex items-center justify-center border border-blue-500/30 shadow-lg shadow-blue-900/20">
              <Radio
                size={28}
                className="text-blue-400 drop-shadow-[0_0_8px_rgba(59,130,246,0.4)] animate-pulse"
                strokeWidth={2}
              />
            </div>
            <div>
              <h4 className="text-white text-base font-extrabold tracking-tight">
                Réseau d'Alerte
              </h4>
              <p className="text-[11px] text-gray-400 leading-tight mt-0.5 font-medium">
                Diffusion instantanée aux citoyens dans un rayon de 2km pour une
                vigilance collective.
              </p>
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

        <div
          className="relative bg-[#142E4C] text-white 
                    rounded-3xl p-6 w-[90%] max-w-md shadow-2xl"
        >
          <h2 className="text-lg font-semibold">{selectedIncident.titre}</h2>
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