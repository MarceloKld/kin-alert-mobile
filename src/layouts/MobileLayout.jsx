import BottomNav from "../components/BottomNav";

function MobileLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-100 pb-16">
      {children}
      <BottomNav />
    </div>
  );
}

export default MobileLayout;