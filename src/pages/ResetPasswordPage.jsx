import { useState } from "react"
import { useSearchParams, useNavigate, Link } from "react-router-dom"
import api from "../api/axios"
import { ShieldCheckIcon } from "@heroicons/react/24/solid"

function ResetPasswordPage() {

  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  // ✅ Lire token et email depuis URL
  const token = searchParams.get("token")
  const emailFromUrl = searchParams.get("email")

  const [form, setForm] = useState({
    email: emailFromUrl || "",
    token: token || "",
    password: "",
    password_confirmation: ""
  })

  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setErrors({})
    setServerError("")
    setMessage("")
    setLoading(true)

    try {
      const response = await api.post("/reset-password", form)

      setMessage(response.data.message)

      // ✅ Redirection après 2 secondes
      setTimeout(() => {
        navigate("/")
      }, 2000)

    } catch (error) {

      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {})
      } 
      else if (error.response?.status === 400) {
        setServerError("Token invalide ou expiré.")
      }
      else {
        setServerError("Une erreur est survenue.")
      }

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center">

      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/map-bg.jpg')" }}
      ></div>

      <div className="absolute inset-0 bg-black/70"></div>

      <div className="relative z-10 w-full max-w-md px-6 text-white">

        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-[0_0_40px_rgba(255,165,0,0.6)] animate-pulse">
              <ShieldCheckIcon className="w-10 h-10 text-white" />
            </div>
          </div>

          <h1 className="text-2xl font-bold text-yellow-400">
            Réinitialiser le mot de passe
          </h1>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-yellow-400/30 rounded-3xl p-6 shadow-2xl">

          {message && (
            <div className="bg-green-500/20 text-green-400 p-3 rounded-lg text-sm mb-4">
              {message} — Redirection...
            </div>
          )}

          {serverError && (
            <div className="bg-red-500/20 text-red-400 p-3 rounded-lg text-sm mb-4">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email (readonly) */}
            <input
              type="email"
              name="email"
              value={form.email}
              readOnly
              className="w-full px-4 py-3 rounded-xl bg-white/20 border border-yellow-400/40"
            />

            {/* Password */}
            <div>
              <input
                type="password"
                name="password"
                placeholder="Nouveau mot de passe"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-transparent border border-yellow-400/40 focus:border-yellow-400 outline-none"
              />
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.password[0]}
                </p>
              )}
            </div>

            {/* Confirmation */}
            <div>
              <input
                type="password"
                name="password_confirmation"
                placeholder="Confirmer mot de passe"
                value={form.password_confirmation}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-transparent border border-yellow-400/40 focus:border-yellow-400 outline-none"
              />
              {errors.password_confirmation && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.password_confirmation[0]}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 font-semibold shadow-lg hover:shadow-orange-500/50 hover:scale-105 transition duration-300"
            >
              {loading ? "Réinitialisation..." : "Réinitialiser"}
            </button>

          </form>

          <p className="text-center text-sm mt-6 text-gray-300">
            Retour à{" "}
            <Link to="/" className="text-yellow-400 hover:underline">
              la connexion
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}

export default ResetPasswordPage