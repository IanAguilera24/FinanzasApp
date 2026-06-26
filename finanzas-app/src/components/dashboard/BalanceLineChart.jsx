// src/components/dashboard/BalanceLineChart.jsx
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatMoneda } from "../../utils/formatters";

export function BalanceLineChart({ evolucionBalance, modoBalance, onModoChange }) {
  if (evolucionBalance.length === 0) {
    return (
      <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center justify-center h-72">
        <p className="text-gray-400">Sin movimientos en este periodo</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-semibold text-gray-700">Evolución del balance</h3>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => onModoChange("periodo")}
            className="text-xs px-3 py-1 rounded-md transition font-medium"
            style={
              modoBalance === "periodo"
                ? { backgroundColor: "white", boxShadow: "0 1px 2px rgba(0,0,0,0.05)", color: "var(--color-primary)" }
                : { color: "#6b7280" }
            }
          >
            Por día
          </button>
          <button
            onClick={() => onModoChange("acumulado")}
            className="text-xs px-3 py-1 rounded-md transition font-medium"
            style={
              modoBalance === "acumulado"
                ? { backgroundColor: "white", boxShadow: "0 1px 2px rgba(0,0,0,0.05)", color: "var(--color-primary)" }
                : { color: "#6b7280" }
            }
          >
            Acumulado
          </button>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={evolucionBalance}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
          <XAxis dataKey="fecha" tick={{ fontSize: 12 }} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip formatter={(value) => formatMoneda(value)} />
          <Line type="monotone" dataKey="balance" stroke="var(--color-primary)" strokeWidth={2} dot={{ r: 3 }} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}