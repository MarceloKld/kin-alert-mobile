import { useState } from "react";
import axios from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { ShieldExclamationIcon } from "@heroicons/react/24/solid";
import { KeyIcon } from "@heroicons/react/24/outline";

function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});
    setServerError("");

    try {
      const response = await axios.post("/login", form);

      // ✅ Stocker le token
      localStorage.setItem("token", response.data.token);

      navigate("/Home");
    } catch (error) {
      if (error.response?.status === 422) {
        setErrors(error.response.data.errors || {});
      } else if (error.response?.status === 401) {
        setServerError("Email ou mot de passe incorrect.");
      } else {
        setServerError("Une erreur est survenue.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative flex items-center justify-center overflow-hidden py-10">
      {/* ===== STYLES CSS INLINE POUR LES ANIMATIONS UX-FLOW ===== */}
      <style>{`
        @keyframes fadeInDown {
          0% { opacity: 0; transform: translateY(-25px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(35px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes subtleZoom {
          0% { transform: scale(1); }
          100% { transform: scale(1.1); }
        }
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }
        .animate-zoom-bg {
          animation: subtleZoom 20s ease-in-out infinite alternate;
        }
        .animate-header-flow {
          animation: fadeInDown 3.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-card-flow {
          animation: fadeInUp 5.7s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          animation-delay: 1.2s;
          opacity: 0;
        }
        .animate-shake-error {
          animation: shake 3.5s ease-in-out;
        }
      `}</style>

      {/* Background image map avec zoom subtil */}
      <div
        className="absolute inset-0 bg-cover bg-center animate-zoom-bg"
        style={{
          backgroundImage: "url('/map-bg.jpg')",
        }}
      ></div>

      {/* Dark overlay avec effet de profondeur */}
      <div className="absolute inset-0 bg-black/75 backdrop-blur-[2px]"></div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-md px-6">
        {/* ========================================
            BLOC 1 : LOGO / HEADER (Arrivée en 1er)
        ======================================== */}
        <div className="relative text-center mb-8 animate-header-flow">
          {/* Halo lumineux d'arrière-plan (Ambiance Glow) */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-36 h-36 bg-yellow-500/15 rounded-full blur-3xl pointer-events-none -z-10" />

          {/* Container de l'icône avec glassmorphism et effet hover */}
          <div className="flex justify-center mb-4">
            <div className="relative group cursor-pointer">
              {/* Glow interne pulsant au survol */}
              <div className="absolute inset-0 bg-yellow-400 rounded-3xl blur-xl opacity-40 group-hover:opacity-75 transition-opacity duration-300" />

              {/* Boîte de l'icône */}
              <div
                className="
                  relative
                  w-20 h-20 
                  rounded-3xl 
                  bg-gradient-to-br from-yellow-400 via-amber-500 to-yellow-600 
                  flex items-center justify-center 
                  shadow-xl shadow-yellow-500/30 
                  border border-yellow-300/40
                  group-hover:scale-105
                  transition-transform duration-300
                "
              >
                <ShieldExclamationIcon className="w-14 h-14 text-slate-950 drop-shadow-md" />
              </div>
            </div>
          </div>

          {/* Titre avec gradient doré et espacement moderne */}
          <h1 className="text-3xl font-black tracking-widest bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-300 bg-clip-text text-transparent drop-shadow-sm">
            KIN ALERT
          </h1>

          {/* Sous-titre structuré */}
          <p className="text-gray-400 text-[11px] font-bold uppercase tracking-[0.2em] mt-2">
            Plateforme communautaire d'alerte
          </p>
        </div>

        {/* ========================================
            BLOC 2 : CARTE FORMULAIRE (Arrivée en 2e)
        ======================================== */}
        <div className="relative group bg-gradient-to-br from-white/10 via-white/5 to-white/[0.02] backdrop-blur-2xl border border-yellow-400/30 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden text-white animate-card-flow">
          {/* Halo lumineux d'arrière-plan */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none -z-10" />

          {/* Alerte Erreur Serveur (Stylisée avec animation secousse) */}
          {serverError && (
            <div className="bg-red-500/15 border border-red-500/30 text-red-300 p-4 rounded-2xl text-xs font-semibold mb-6 flex items-center gap-3 shadow-lg animate-shake-error">
              <svg
                className="w-5 h-5 text-red-400 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span>{serverError}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* ===== CHAMP EMAIL ===== */}
            <div>
              <div className="relative">
                {/* Icône Mail à gauche */}
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-yellow-400/70">
                  <svg
                    className="w-5 h-5"
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
                </div>

                <input
                  type="email"
                  name="email"
                  placeholder="Adresse Email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-black/20 border border-yellow-400/40 text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 outline-none transition-all text-sm font-medium"
                />
              </div>
              {errors.email && (
                <p className="text-red-400 text-xs font-semibold mt-1.5 ml-1 flex items-center gap-1">
                  <span>•</span> {errors.email[0]}
                </p>
              )}
            </div>

            {/* ===== CHAMP MOT DE PASSE ===== */}
            <div>
              <div className="relative">
                {/* Icône Lock à gauche */}
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-yellow-400/70">
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>

                <input
                  type="password"
                  name="password"
                  placeholder="Mot de passe"
                  value={form.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-black/20 border border-yellow-400/40 text-white placeholder-gray-400 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 outline-none transition-all text-sm font-medium"
                />
              </div>
              {errors.password && (
                <p className="text-red-400 text-xs font-semibold mt-1.5 ml-1 flex items-center gap-1">
                  <span>•</span> {errors.password[0]}
                </p>
              )}
            </div>

            {/* ===== LIEN MOT DE PASSE OUBLIÉ ===== */}
            <div className="flex justify-end pt-1">
              <Link
                to="/forgot-password"
                className="flex items-center gap-1.5 text-xs font-bold text-yellow-400 hover:text-yellow-300 transition-colors"
              >
                <KeyIcon className="w-4 h-4" />
                Mot de passe oublié ?
              </Link>
            </div>

            {/* ===== BOUTON DE CONNEXION ===== */}
            <button
              type="submit"
              disabled={loading}
              className="
                relative w-full overflow-hidden
                py-4 px-6 mt-2
                rounded-2xl
                bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600
                text-white font-black text-xs uppercase tracking-widest
                shadow-lg shadow-orange-500/30
                hover:shadow-orange-500/50 hover:scale-[1.02]
                active:scale-95
                transition-all duration-300
                flex items-center justify-center gap-2.5
                group/btn
                disabled:opacity-80 disabled:cursor-wait
              "
            >
              {/* Effet de brillance (Shine) au survol */}
              {!loading && (
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000 pointer-events-none" />
              )}

              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="relative z-10">Connexion en cours...</span>
                </>
              ) : (
                <>
                  <span className="relative z-10">Se connecter</span>
                  <svg
                    className="w-4 h-4 relative z-10 group-hover/btn:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2.5}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                    />
                  </svg>
                </>
              )}
            </button>
          </form>

          {/* ===== FOOTER CREATION DE COMPTE ===== */}
          <p className="text-center text-xs mt-6 text-gray-400 font-medium">
            Pas encore de compte ?{" "}
            <Link
              to="/register"
              className="text-yellow-400 font-bold hover:underline"
            >
              Créer un compte
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
