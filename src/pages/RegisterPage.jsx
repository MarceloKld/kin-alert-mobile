import { useState } from "react"
import axios from "../api/axios"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import {
  UserIcon,
  EnvelopeIcon,
  PhoneIcon,
  LockClosedIcon
} from "@heroicons/react/24/outline"
import { ShieldCheckIcon } from "@heroicons/react/24/solid"

function RegisterPage() {

  const navigate = useNavigate()

  const [form, setForm] = useState({
    nom: "",
    email: "",
    telephone: "",
    password: "",
    password_confirmation: ""
  })

  const getPasswordStrength = () => {
  if (form.password.length > 8) return "strong"
  if (form.password.length > 4) return "medium"
  return "weak"
}

const strength = getPasswordStrength()

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [serverError, setServerError] = useState("")




  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})
    setServerError("")

    try {
      await axios.post("/register", form)
      navigate("/")
   } catch (error) {
  if (error.response?.status === 422) {
    setErrors(error.response.data.errors || {})
  } else {
    setServerError("Une erreur est survenue. Réessayez.")
  }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0e1a25] via-[#132c3a] to-[#1c3b4d] px-6 text-white">

{serverError && (
  <div className="bg-red-500/20 text-red-400 p-3 rounded-lg text-sm mb-4">
    {serverError}
  </div>
)}
      <div className="w-full max-w-md">

        {/* HEADER */}
        <div className="text-center mb-8 animate-float">

          <h1 className="text-xl tracking-widest text-yellow-400 font-semibold mb-4">
            CRÉATION DE COMPTE
          </h1>

          {/* Progress bar */}
          <div className="flex items-center justify-between mb-6 animate-float">

            <div className="h-1 w-1/3 bg-yellow-400 rounded-full"></div>

            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/40 animate-float">
  <ShieldCheckIcon className="w-8 h-8 text-white" />
</div>

            <div className="h-1 w-1/3 bg-yellow-400 rounded-ful"></div>

          </div>

        </div>

        {/* CARD */}
        <div className="bg-white/5 backdrop-blur-xl border border-yellow-400/30 rounded-3xl p-6 shadow-2xl">

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Nom */}
            <div className="relative">
  <UserIcon className="w-5 h-5 absolute left-3 top-3 text-yellow-400" />
  <input
    type="text"
    name="nom"
    placeholder="Nom complet"
    value={form.nom}
    onChange={handleChange}
    className="w-full pl-10 pr-4 py-3 rounded-xl bg-transparent border border-yellow-400/40 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none transition"
  />
</div>
           {errors.nom && errors.nom.length > 0 && (
  <p className="text-red-400 text-sm mt-1">
    {errors.nom[0]}
  </p>
)}


            {/* Email */}
               <div className="relative">
  <EnvelopeIcon className="w-5 h-5 absolute left-3 top-3 text-yellow-400" />
            <input
              type="email"
              name="email"
              placeholder="Adresse Email"
              value={form.email}
              onChange={handleChange}
            className="w-full pl-10 pr-4 py-3 rounded-xl bg-transparent border border-yellow-400/40 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none transition"
  />
            </div>
           {errors.email && (
  <p className="text-red-400 text-sm mt-1">
    {errors.email[0]}
  </p>
)}

            {/* Téléphone */}
            <div className="relative">
  <PhoneIcon className="w-5 h-5 absolute left-3 top-3 text-yellow-400" />
            <input
              type="text"
              name="telephone"
              placeholder="Numéro de Téléphone"
              value={form.telephone}
              onChange={handleChange}
             className="w-full pl-10 pr-4 py-3 rounded-xl bg-transparent border border-yellow-400/40 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none transition"
  />
</div>
           {errors.telephone && (
  <p className="text-red-400 text-sm mt-1">
    {errors.telephone[0]}
  </p>
)}

            {/* Password */}
            <div className="relative">
  <LockClosedIcon className="w-5 h-5 absolute left-3 top-3 text-yellow-400" />
            <div>
              <input
                type="password"
                name="password"
                placeholder="Mot de passe"
                value={form.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-transparent border border-yellow-400/40 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none transition"
  />
</div>
            {errors.password && (
  <p className="text-red-400 text-sm mt-1">
    {errors.password[0]}
  </p>
)}

              {/* Barre force */}
              <div className="h-1 bg-white/20 rounded mt-2">
                <div className={`h-1 rounded transition-all duration-300 ${
      strength === "weak"
        ? "w-1/4 bg-red-500"
        : strength === "medium"
        ? "w-2/4 bg-yellow-400"
        : "w-full bg-green-400"
    }`}></div>
              </div>

            </div>

            {/* Confirmation */}
              <div className="relative">
  <LockClosedIcon className="w-5 h-5 absolute left-3 top-3 text-yellow-400" />
            <input
              type="password"
              name="password_confirmation"
              placeholder="Confirmer Mot de Passe"
              value={form.password_confirmation}
              onChange={handleChange}
             className="w-full pl-10 pr-4 py-3 rounded-xl bg-transparent border border-yellow-400/40 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none transition"
  />
</div>
          {errors.password_confirmation && (
  <p className="text-red-400 text-sm mt-1">
    {errors.password_confirmation[0]}
  </p>
)}

            {/* Bouton circulaire */}
            <div className="flex justify-center mt-6 animate-float animate-pulseGlow">
              <button
                type="submit"
                disabled={loading}
                className="w-28 h-28 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-center text-sm font-semibold flex items-center justify-center shadow-[0_0_40px_rgba(255,140,0,0.6)] hover:scale-105 transition duration-300"
              >
                {loading ? "..." : "CRÉER\nMON COMPTE"}
              </button>
            </div>

          </form>

        </div>

        {/* Footer */}
<p className="text-center text-sm mt-6 text-gray-300">
  Avez-vous déjà un compte ?{" "}
  <Link
    to="http://localhost:5173"
    className="text-yellow-400 hover:underline"
  >
    Se connecter
  </Link>
        </p>

      </div>

    </div>
  )
}

export default RegisterPage