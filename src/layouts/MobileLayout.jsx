import BottomNav from "../components/BottomNav";

function MobileLayout({ children }) {
  return (
  <div className="relative min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-500">

    

    {/* ✅ Contenu principal */}
    <div className="pb-8">
      {children}
    </div>

    <BottomNav />
  </div>
);
}

export default MobileLayout;