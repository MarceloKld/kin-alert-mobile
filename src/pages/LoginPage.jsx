import { useState } from "react";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

function LoginPage() {
  const navigate = useNavigate();
  const [errorMessage, setErrorMessage] = useState("");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
  e.preventDefault();

  if (!email || !password) {
    setErrorMessage("Tous les champs sont obligatoires.");
    return;
  }

  setErrorMessage("");
  setLoading(true);

  try {
    const response = await api.post("/login", { email, password });

    localStorage.setItem("token", response.data.token);
    navigate("/home");
  } catch (error) {
    console.error(error);
    setErrorMessage("Email ou mot de passe incorrect.");
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 animate-fadeIn">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8 
                transform transition-all duration-500 
                animate-fadeIn">
                  <div className="flex justify-center mb-4">
 <img 
  src={logo} 
  alt="KIN ALERT" 
  className="w-18 h-17 mb-3 drop-shadow-lg animate-pulse" />
</div>

        <h1 className="text-2xl font-bold text-center text-gray-800 mb-6">
          KIN ALERT 🚨
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="admin@kinalert.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">
              Mot de passe
            </label>
            <input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {errorMessage && (
  <div className="bg-red-100 text-red-600 text-sm p-3 rounded-lg">
    {errorMessage}
  </div>
)}

          <button
  type="submit"
  disabled={loading}
  className="w-full bg-blue-600 text-white py-2 rounded-lg font-semibold 
             hover:bg-blue-700 transition duration-200 
             disabled:opacity-50 flex justify-center items-center"
>
  {loading ? (
    <div className="w-5 h-5 border-2 border-white border-t-transparent 
                    rounded-full animate-spin"></div>
  ) : (
    "Se connecter"
  )}
</button>

        </form>
      </div>
    </div>
  );
}

export default LoginPage;