function DashboardPage() {
  const incidents = [
    {
      id: 1,
      titre: "Accident sur Avenue Lumumba",
      type: "Accident",
      commune: "Gombe",
      statut: "valide",
      confirmations: 3,
      date: "14 Juillet 2026",
    },
    {
      id: 2,
      titre: "Incendie Marché Central",
      type: "Incendie",
      commune: "Kinshasa",
      statut: "en_attente",
      confirmations: 1,
      date: "13 Juillet 2026",
    },
  ];

  const getStatusStyle = (statut) => {
    switch (statut) {
      case "valide":
        return "bg-green-100 text-green-700";
      case "en_attente":
        return "bg-yellow-100 text-yellow-700";
      case "rejete":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-4 space-y-4">

      <h2 className="text-xl font-semibold text-gray-800">
        Alertes Communautaires
      </h2>

      {incidents.map((incident) => (
        <div
          key={incident.id}
          className="bg-white rounded-xl shadow-md p-4 border border-gray-100"
        >

          <div className="flex justify-between items-start">

            <div>
              <h3 className="font-semibold text-gray-800">
                {incident.titre}
              </h3>

              <p className="text-sm text-gray-500 mt-1">
                {incident.type} • {incident.commune}
              </p>
            </div>

            <span
              className={`text-xs px-2 py-1 rounded-full ${getStatusStyle(
                incident.statut
              )}`}
            >
              {incident.statut}
            </span>

          </div>

          <div className="flex justify-between items-center mt-4 text-sm text-gray-600">

            <span>
              ✅ {incident.confirmations} confirmations
            </span>

            <span>
              {incident.date}
            </span>

          </div>

          <button className="mt-4 w-full bg-gray-800 text-white py-2 rounded-lg text-sm hover:bg-gray-900 transition">
            Voir détails
          </button>

        </div>
      ))}

    </div>
  );
}

export default DashboardPage;