import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import api from "../api/axios"
import {
  UserCircleIcon,
  ShieldCheckIcon
} from "@heroicons/react/24/solid"
import SkeletonCard from "../components/SkeletonCard"

function SettingsPage() {

  const navigate = useNavigate()

  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [logoutLoading, setLogoutLoading] = useState(false)

 useEffect(() => {
  const fetchUser = async () => {
    try {
      const response = await api.get("/me")
      setUser(response.data)
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  fetchUser()
}, [])

  const handleLogout = async () => {
  setLogoutLoading(true)

  try {
    await api.post("/logout")
  } catch (error) {
    console.error(error)
  } finally {
    sessionStorage.removeItem("token")
    setLogoutLoading(false)
    navigate("/")
  }
}

 if (loading) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0e1a25] via-[#132c3a] to-[#1c3b4d] p-6 space-y-6">
      <SkeletonCard />
      <SkeletonCard />
    </div>
  )
}

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0e1a25] via-[#132c3a] to-[#1c3b4d] text-white p-6 pb-32 overflow-y-auto">
      <div className="max-w-md mx-auto space-y-6">
        {/* ========================================
    HEADER PARAMÈTRES - Premium & Léger
    - Icône avec halo lumineux (Glow)
    - Titre en dégradé de couleur
    - Sous-titre contextuel
======================================== */}
        <div className="relative text-center py-6">
          {/* Halo lumineux en arrière-plan (Ambiance glow) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl pointer-events-none -z-10" />

          {/* Container de l'icône avec effet glassmorphism et zoom au survol */}
          <div className="relative inline-flex p-4 bg-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-xl mb-4 group hover:scale-105 transition-transform duration-300">
            {/* Glow interne subtil */}
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 to-yellow-500/0 rounded-3xl opacity-50 pointer-events-none" />

            <UserCircleIcon className="w-14 h-14 text-yellow-400 drop-shadow-[0_0_12px_rgba(250,204,21,0.4)] relative z-10" />
          </div>

          {/* Titre avec gradient jaune/or (plus élégant qu'un jaune plat) */}
          <h1 className="text-3xl font-black tracking-tight bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-300 bg-clip-text text-transparent drop-shadow-sm">
            Paramètres
          </h1>

          {/* Petit sous-titre pour structurer l'UI et guider l'utilisateur */}
          <p className="text-[11px] font-semibold text-gray-400 tracking-wider uppercase mt-1">
            Gérez vos préférences & compte
          </p>
        </div>

        {/* ========================================
    CARTE PROFIL UTILISATEUR - Premium & Léger
    - Design structuré avec icônes
    - Badge de rôle coloré
    - Glassmorphism & Glow subtil
======================================== */}
        <div className="relative group bg-gradient-to-br from-white/10 via-white/5 to-white/[0.02] backdrop-blur-2xl border border-yellow-400/30 rounded-3xl p-6 shadow-2xl overflow-hidden">
          {/* Halo lumineux d'ambiance en arrière-plan */}
          <div className="absolute top-0 right-0 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

          {/* Header de la carte */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-yellow-400/10 rounded-2xl border border-yellow-400/20 text-yellow-400 shadow-inner">
                {/* Icône Profil */}
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </div>
              <h2 className="font-extrabold text-lg text-white tracking-tight">
                Informations du Profil
              </h2>
            </div>

            {/* Petit badge d'état Actif */}
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">
                Actif
              </span>
            </div>
          </div>

          {/* Liste des informations structurées */}
          <div className="space-y-3.5">
            {/* Nom */}
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
              <div className="flex items-center gap-3 text-gray-400">
                <svg
                  className="w-4 h-4 text-yellow-400/80"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Nom
                </span>
              </div>
              <span className="text-sm font-bold text-white tracking-wide">
                {user?.nom || "Non renseigné"}
              </span>
            </div>

            {/* Email */}
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
              <div className="flex items-center gap-3 text-gray-400">
                <svg
                  className="w-4 h-4 text-yellow-400/80"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Email
                </span>
              </div>
              <span className="text-sm font-medium text-gray-200 tracking-wide truncate max-w-[200px]">
                {user?.email || "Non renseigné"}
              </span>
            </div>

            {/* Téléphone */}
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
              <div className="flex items-center gap-3 text-gray-400">
                <svg
                  className="w-4 h-4 text-yellow-400/80"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                  />
                </svg>
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Téléphone
                </span>
              </div>
              <span className="text-sm font-bold text-white tracking-wide">
                {user?.telephone || "Non renseigné"}
              </span>
            </div>

            {/* Rôle (Transformé en Badge stylisé) */}
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-2xl border border-white/5 hover:border-white/10 transition-colors">
              <div className="flex items-center gap-3 text-gray-400">
                <svg
                  className="w-4 h-4 text-yellow-400/80"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                  />
                </svg>
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Rôle
                </span>
              </div>

              {/* Badge du Rôle dynamique */}
              <span className="px-3 py-1 bg-yellow-400/20 border border-yellow-400/40 rounded-xl text-xs font-black text-yellow-300 uppercase tracking-wider shadow-sm">
                {user?.role || "Utilisateur"}
              </span>
            </div>
          </div>
        </div>

        {/* ========================================
    CARTE SÉCURITÉ - Premium & Léger
    - Glassmorphism & Halo lumineux
    - Bouton d'action dynamisé avec icône & shine
    - 100% CSS pur (Performance max)
======================================== */}
        <div className="relative group bg-gradient-to-br from-white/10 via-white/5 to-white/[0.02] backdrop-blur-2xl border border-yellow-400/30 rounded-3xl p-6 shadow-2xl overflow-hidden">
          {/* Halo lumineux d'ambiance en arrière-plan */}
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

          {/* Header de la carte */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-yellow-400/10 rounded-2xl border border-yellow-400/20 text-yellow-400 shadow-inner">
                <ShieldCheckIcon className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-extrabold text-lg text-white tracking-tight">
                  Sécurité & Accès
                </h2>
                <p className="text-[11px] text-gray-400 font-medium">
                  Gérez la protection de votre compte
                </p>
              </div>
            </div>

            {/* Badge de statut Sécurisé */}
            <span className="px-2.5 py-1 bg-amber-500/10 border border-amber-500/20 rounded-full text-[10px] font-bold text-amber-400 uppercase tracking-wider">
              Protégé
            </span>
          </div>

          {/* Action / Bouton de modification */}
          <div className="pt-2">
            <button
              onClick={() => navigate("/forgot-password")}
              className="
        relative w-full overflow-hidden
        py-3.5 px-5
        rounded-2xl
        bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-400
        text-slate-950 font-black text-xs uppercase tracking-widest
        shadow-lg shadow-yellow-500/20
        hover:shadow-yellow-500/40 hover:scale-[1.02]
        active:scale-95
        transition-all duration-300
        flex items-center justify-center gap-2.5
        group/btn
      "
            >
              {/* Effet de brillance (Shine) qui glisse au survol */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 pointer-events-none" />

              {/* Icône Clé stylisée avec petite rotation au survol */}
              <svg
                className="w-4 h-4 text-slate-950 group-hover/btn:rotate-12 transition-transform duration-300"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>

              <span className="relative z-10">Changer le mot de passe</span>
            </button>
          </div>
        </div>

        {/* ========================================
    CARTE DÉCONNEXION - Premium & Léger
    - Glassmorphism thématisé rouge alerte
    - Bouton d'action dynamisé avec shine & loader
    - 100% CSS pur (Performance max)
======================================== */}
        <div className="relative group bg-gradient-to-br from-red-500/10 via-white/5 to-white/[0.02] backdrop-blur-2xl border border-red-500/40 rounded-3xl p-6 shadow-2xl overflow-hidden">
          {/* Halo lumineux d'ambiance en arrière-plan */}
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-red-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

          {/* Header de la carte (Cohérent avec Profil et Sécurité) */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-5">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-red-500/10 rounded-2xl border border-red-500/20 text-red-400 shadow-inner">
                {/* Icône Sortie / Power */}
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                  />
                </svg>
              </div>
              <div>
                <h2 className="font-extrabold text-lg text-white tracking-tight">
                  Session
                </h2>
                <p className="text-[11px] text-gray-400 font-medium">
                  Quitter l'application en toute sécurité
                </p>
              </div>
            </div>
          </div>

          {/* Bouton de Déconnexion */}
          <div className="pt-1">
            <button
              onClick={handleLogout}
              disabled={logoutLoading}
              className={`
        relative w-full overflow-hidden
        py-4 px-6
        rounded-2xl
        bg-gradient-to-r from-red-600 via-rose-600 to-red-700
        text-white font-black text-xs uppercase tracking-widest
        shadow-lg shadow-red-500/30
        hover:shadow-red-500/50 hover:scale-[1.02]
        active:scale-95
        transition-all duration-300
        flex items-center justify-center gap-2.5
        group/btn
        ${logoutLoading ? "opacity-80 cursor-wait" : ""}
      `}
            >
              {/* Effet de brillance (Shine) qui glisse au survol (seulement si pas en loading) */}
              {!logoutLoading && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 pointer-events-none" />
              )}

              {logoutLoading ? (
                // ===== ÉTAT DE CHARGEMENT =====
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="relative z-10">Fermeture de session...</span>
                </>
              ) : (
                // ===== ÉTAT NORMAL =====
                <>
                  {/* Icône de déconnexion avec micro-mouvement vers la droite au survol */}
                  <svg
                    className="w-4 h-4 text-white group-hover/btn:translate-x-1 transition-transform duration-300"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span className="relative z-10">Se déconnecter</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SettingsPage