import { NavLink } from "react-router-dom";
import { Bell, User, Settings } from "lucide-react";

function BottomNav() {
  return (
    <div className="fixed bottom-4 left-1/2 
                    -translate-x-1/2 
                    w-[92%] max-w-md 
                    bg-[#0E223A] 
                    rounded-3xl 
                    shadow-[0_10px_40px_rgba(0,0,0,0.4)] 
                    px-4 py-1">

      <div className="flex justify-between items-center">

        {/* ✅ ALERTES */}
        <NavLink
          to="/home"
          onClick={() => navigator.vibrate?.(10)}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center 
             px-3 py-1 rounded-2xl transition-all duration-200 
             active:scale-95 ${
               isActive
                 ? "bg-orange-500 text-white shadow-[0_0_20px_rgba(255,140,0,0.6)]"
                 : "text-gray-400"
             }`
          }
        >
          <Bell size={20} />
          <span className="text-xs mt-1">ALERTES</span>
        </NavLink>

        {/* ✅ MES INFOS */}
        <NavLink
          to="/dashboard"
          onClick={() => navigator.vibrate?.(10)}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center 
             px-3 py-1 rounded-2xl transition-all duration-200 
             active:scale-95 ${
               isActive
                 ? "bg-orange-500 text-white shadow-[0_0_20px_rgba(255,140,0,0.6)]"
                 : "text-gray-400"
             }`
          }
        >
          <User size={20} />
          <span className="text-xs mt-1">MES INFOS</span>
        </NavLink>

        {/* ✅ PARAMÈTRES */}
        <NavLink
          to="/settings"
          onClick={() => navigator.vibrate?.(10)}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center 
             px-3 py-1 rounded-2xl transition-all duration-200 
             active:scale-95 ${
               isActive
                 ? "bg-orange-500 text-white shadow-[0_0_20px_rgba(255,140,0,0.6)]"
                 : "text-gray-400"
             }`
          }
        >
          <Settings size={20} />
          <span className="text-xs mt-1">PARAMÈTRES</span>
        </NavLink>

      </div>

      {/* ✅ iPhone home indicator */}
      <div className="flex justify-center mt-3">
        <div className="w-24 h-1 bg-white/40 rounded-full" />
      </div>

    </div>
  );
}

export default BottomNav;