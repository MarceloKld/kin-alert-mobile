import { useState } from "react"
import axios from "../api/axios"
import { Link, useNavigate } from "react-router-dom"
import { ShieldExclamationIcon } from "@heroicons/react/24/solid"
import logo from "../assets/logo.png"

function LoginPage() {

  const navigate = useNavigate()

  const [form, setForm] = useState({
    email: "",
    password: ""
  })

  const [errors, setErrors] = useState({})
  const [serverError, setServerError] = useState("")
  const [loading, setLoading] = useState(false)

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
      const response = await axios.post("/login", form)

      // ✅ Stocker le token
      localStorage.setItem("token", response.data.token)

      navigate("/Home")

    } catch (error) {

      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {})
      } else if (error.response?.status === 401) {
        setServerError("Email ou mot de passe incorrect.")
      } else {
        setServerError("Une erreur est survenue.")
      }

    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen relative flex items-center justify-center">

      {/* Background image map */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/map-bg.jpg')"
        }}
      ></div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/70"></div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-6">

        {/* Logo */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center shadow-lg shadow-yellow-500/40">
              <ShieldExclamationIcon className="w-8 h-8 text-white" />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-yellow-400 tracking-widest">
            KIN ALERT
          </h1>

          <p className="text-gray-300 text-sm mt-2">
            Plateforme communautaire d'alerte
          </p>
        </div>

        {/* Card */}
        <div className="bg-white/10 backdrop-blur-xl border border-yellow-400/30 rounded-3xl p-6 shadow-2xl text-white">

          {serverError && (
            <div className="bg-red-500/20 text-red-400 p-3 rounded-lg text-sm mb-4">
              {serverError}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email */}
            <div>
              <input
                type="email"
                name="email"
                placeholder="Adresse Email"
                value={form.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-transparent border border-yellow-400/40 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none transition"
              />
              {errors.email && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.email[0]}
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <input
                type="password"
                name="password"
                placeholder="Mot de passe"
                value={form.password}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-transparent border border-yellow-400/40 focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400 outline-none transition"
              />
              {errors.password && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.password[0]}
                </p>
              )}
            </div>

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 font-semibold shadow-lg hover:shadow-orange-500/50 hover:scale-105 transition duration-300"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>

          </form>

          <p className="text-center text-sm mt-6 text-gray-300">
            Pas encore de compte ?{" "}
            <Link to="/register" className="text-yellow-400 hover:underline">
              Créer un compte
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}

export default LoginPage