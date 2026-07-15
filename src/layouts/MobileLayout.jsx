import BottomNav from "../components/BottomNav";
import { FaSun, FaMoon } from "react-icons/fa";

function MobileLayout({ children, theme, setTheme }) {
  return (
  <div className="relative min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-500">

    {/* ✅ Toggle flottant */}
    <div className="absolute top-4 right-4 z-50">
      <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        className="relative w-16 h-5 flex items-center 
                   bg-gray-300 dark:bg-gray-700 
                   rounded-full px-2 transition duration-300 shadow-lg"
      >
           {/* ✅ Icône gauche */}
    {theme === "dark" ? (
      <FaMoon className="text-white text-xs absolute left-2" />
    ) : (
      <FaSun className="text-yellow-500 text-xs absolute left-2" />
    )}
        <div
          className={`bg-white w-6 h-6 rounded-full shadow-md 
                      transform transition duration-300 ${
                        theme === "dark"
                          ? "translate-x-8"
                          : "translate-x-0"
                      }`}
        />
      </button>
    </div>

    {/* ✅ Contenu principal */}
    <div className="pb-28">
      {children}
    </div>

    <BottomNav />
  </div>
);
}

export default MobileLayout;