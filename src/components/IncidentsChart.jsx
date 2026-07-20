import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

function IncidentsChart({ stats }) {
  if (!stats) return null;

  const data = [
    { name: "Validé", value: stats.valide, color: "#22c55e" },
    { name: "Attente", value: stats.en_attente, color: "#facc15" },
    { name: "Rejeté", value: stats.rejete, color: "#ef4444" },
  ];

  return (
    <div className="bg-[#142E4C] p-4 rounded-xl mt-5">
      <p className="text-xs text-gray-400 mb-3">
        Répartition des incidents
      </p>

      <ResponsiveContainer width="100%" height={220}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            outerRadius={80}
            label
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

export default IncidentsChart;