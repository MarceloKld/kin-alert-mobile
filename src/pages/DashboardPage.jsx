import { useNavigate } from "react-router-dom";

function DashboardPage() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div>
      <h2>Tableau de bord</h2>
      <button onClick={handleLogout}>Se déconnecter</button>
    </div>
  );
}

export default DashboardPage;