import { useState } from "react"
import api from "../api/axios"
import { Link } from "react-router-dom"
import { ShieldExclamationIcon } from "@heroicons/react/24/solid"

function ForgotPasswordPage() {

  const [email, setEmail] = useState("")
  const [errors, setErrors] = useState({})
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErrors({})
    setMessage("")
    setLoading(true)

    try {
      const response = await api.post("/forgot-password", { email })

      setMessage(response.data.message)

    } catch (error) {

      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {})
      } else {
        setErrors({ email: ["Une erreur est survenue"] })
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

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-[0_0_40px_rgba(255,165,0,0.6)] animate-pulse">
    <ShieldExclamationIcon className="w-10 h-10 text-white" />
  </div>
</div>
          <h1 className="text-2xl font-bold text-yellow-400">
            Mot de passe oublié
          </h1>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-yellow-400/30 rounded-3xl p-6 shadow-2xl">

          {message && (
            <div className="bg-green-500/20 text-green-400 p-3 rounded-lg text-sm mb-4">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            <div>
              <input
                type="email"
                placeholder="Adresse Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-transparent border border-yellow-400/40 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none transition"
              />

              {errors.email && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.email[0]}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 font-semibold shadow-lg hover:shadow-orange-500/50 hover:scale-105 transition duration-300"
            >
              {loading ? "Envoi..." : "Envoyer le lien"}
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

export default ForgotPasswordPage