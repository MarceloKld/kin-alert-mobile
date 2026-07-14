import { NavLink } from "react-router-dom";

function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-inner flex justify-around py-2">

      <NavLink 
        to="/home"
        className={({ isActive }) =>
          isActive
            ? "text-blue-700 font-semibold"
            : "text-gray-500"
        }
      >
        Accueil
      </NavLink>

      <NavLink 
        to="/dashboard"
        className={({ isActive }) =>
          isActive
            ? "text-blue-700 font-semibold"
            : "text-gray-500"
        }
      >
        Dashboard
      </NavLink>

      <NavLink 
        to="/settings"
        className={({ isActive }) =>
          isActive
            ? "text-blue-700 font-semibold"
            : "text-gray-500"
        }
      >
        Paramètres
      </NavLink>

    </div>
  );
}

export default BottomNav;