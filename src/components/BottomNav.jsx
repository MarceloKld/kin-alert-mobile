import { NavLink } from "react-router-dom";
import { Bell, User, Settings, LayoutGrid } from "lucide-react";

function BottomNav() {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-[#0E223A] shadow-[0_-4px_20px_rgba(0,0,0,0.5)] px-2 py-1.5 z-50">

      <div className="flex justify-between items-center max-w-md mx-auto">

        {/* ✅ ALERTES */}
        <NavLink
          to="/home"
          onClick={() => navigator.vibrate?.(10)}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center 
             px-2 py-1 rounded-xl transition-all duration-200 
             active:scale-95 ${
               isActive
                 ? "bg-orange-500 text-white shadow-[0_0_15px_rgba(255,140,0,0.6)]"
                 : "text-gray-400"
             }`
          }
        >
          <Bell size={22} />
          <span className="text-[10px] mt-0.5 font-medium tracking-tight">ALERTES</span>
        </NavLink>

        {/* ✅ MES INFOS */}
        <NavLink
          to="/dashboard"
          onClick={() => navigator.vibrate?.(10)}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center 
             px-2 py-1 rounded-xl transition-all duration-200 
             active:scale-95 ${
               isActive
                 ? "bg-orange-500 text-white shadow-[0_0_15px_rgba(255,140,0,0.6)]"
                 : "text-gray-400"
             }`
          }
        >
          <User size={22} />
          <span className="text-[10px] mt-0.5 font-medium tracking-tight">MES INFOS</span>
        </NavLink>

        {/* ✅ MES SIGNALEMENTS */}
        <NavLink
          to="/mes-signalements"
          className={({ isActive }) =>
            `flex flex-col items-center justify-center 
             px-2 py-1 rounded-xl transition ${
               isActive
                 ? "bg-orange-500 text-white"
                 : "text-gray-400"
             }`
          }
        >
          <LayoutGrid size={22} />
          <span className="text-[9.5px] mt-0.5 font-medium tracking-tight">MES SIGNAL.</span>
        </NavLink>

        {/* ✅ PARAMÈTRES */}
        <NavLink
          to="/settings"
          onClick={() => navigator.vibrate?.(10)}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center 
             px-2 py-1 rounded-xl transition-all duration-200 
             active:scale-95 ${
               isActive
                 ? "bg-orange-500 text-white shadow-[0_0_15px_rgba(255,140,0,0.6)]"
                 : "text-gray-400"
             }`
          }
        >
          <Settings size={22} />
          <span className="text-[9.5px] mt-0.5 font-medium tracking-tight">PARAMÈTRES</span>
        </NavLink>

      </div>
    
    </div>
  );
}

export default BottomNav;
