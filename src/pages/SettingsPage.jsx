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
    <div className="min-h-screen bg-gradient-to-b from-[#0e1a25] via-[#132c3a] to-[#1c3b4d] text-white p-6">

      <div className="max-w-md mx-auto space-y-6">

        {/* Header */}
        <div className="text-center">
          <UserCircleIcon className="w-20 h-20 mx-auto text-yellow-400 mb-4" />
          <h1 className="text-2xl font-bold text-yellow-400">
            Paramètres
          </h1>
        </div>

        {/* Profil */}
        <div className="bg-white/10 backdrop-blur-xl border border-yellow-400/30 rounded-2xl p-6 space-y-3">

          <h2 className="font-semibold text-yellow-400">Profil</h2>

          <p><strong>Nom :</strong> {user?.nom}</p>
          <p><strong>Email :</strong> {user?.email}</p>
          <p><strong>Téléphone :</strong> {user?.telephone}</p>
          <p><strong>Rôle :</strong> {user?.role}</p>

        </div>

        {/* Sécurité */}
        <div className="bg-white/10 backdrop-blur-xl border border-yellow-400/30 rounded-2xl p-6 space-y-3">

          <h2 className="font-semibold text-yellow-400 flex items-center gap-2">
            <ShieldCheckIcon className="w-5 h-5" />
            Sécurité
          </h2>

          <button
            onClick={() => navigate("/forgot-password")}
            className="w-full py-3 rounded-xl bg-yellow-500 text-black font-semibold hover:bg-yellow-400 transition"
          >
            Changer mot de passe
          </button>

        </div>

        {/* Logout */}
        <div className="bg-white/10 backdrop-blur-xl border border-red-500/40 rounded-2xl p-6">

         <button
  onClick={handleLogout}
  disabled={logoutLoading}
  className="w-full py-4 rounded-full bg-gradient-to-r from-red-500 to-red-600 font-semibold shadow-lg hover:shadow-red-500/50 hover:scale-105 transition duration-300 flex items-center justify-center gap-2"
>
  {logoutLoading ? "Déconnexion..." : "Se déconnecter"}
</button>

        </div>

      </div>
    </div>
  )
}

export default SettingsPage