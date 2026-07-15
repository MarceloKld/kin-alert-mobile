import { NavLink } from "react-router-dom";
import { FaHome, FaChartBar, FaCog } from "react-icons/fa";

function BottomNav() {
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 
                w-[90%] max-w-md 
                backdrop-blur-xl bg-white/60 
                border border-white/30
                rounded-3xl shadow-2xl 
                px-6 py-3 flex justify-between">
      <NavLink
        to="/home"
        className={({ isActive }) =>
          `flex flex-col items-center text-xs transition-all duration-300 ${
            isActive
              ? "text-blue-400"
              : "text-gray-400"
          }`
        }
      >
        {({ isActive }) => (
          <>
            <div
              className={`p-3 rounded-full transition-all duration-300 active:animate-tap ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/40 scale-110"
                  : ""
              }`}
            >
              <FaHome size={18} />
            </div>
            <span className="mt-1">Accueil</span>
          </>
        )}
      </NavLink>

      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          `flex flex-col items-center text-xs transition-all duration-300 ${
            isActive
              ? "text-blue-400"
              : "text-gray-400"
          }`
        }
      >
        {({ isActive }) => (
          <>
            <div
              className={`p-3 rounded-full transition-all duration-300 active:animate-tap ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/40 scale-110"
                  : ""
              }`}
            >
              <FaChartBar size={18} />
            </div>
            <span className="mt-1">Dashboard</span>
          </>
        )}
      </NavLink>

      <NavLink
        to="/settings"
        className={({ isActive }) =>
          `flex flex-col items-center text-xs transition-all duration-300 ${
            isActive
              ? "text-blue-400"
              : "text-gray-400"
          }`
        }
      >
        {({ isActive }) => (
          <>
            <div
             className={`p-3 rounded-full transition-all duration-300 active:animate-tap ${
                isActive
                  ? "bg-blue-600 text-white shadow-lg shadow-blue-500/40 scale-110"
                  : ""
              }`}
            >
              <FaCog size={18} />
            </div>
            <span className="mt-1">Paramètres</span>
          </>
        )}
      </NavLink>

    </div>
  );
}

export default BottomNav;