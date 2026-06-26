// src/components/dashboard/MonthlyBarChart.jsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { formatMoneda } from "../../utils/formatters";

export function MonthlyBarChart({ datos }) {
  const hayDatos = datos.some((d) => d.ingresos > 0 || d.gastos > 0);

  if (!hayDatos) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-5 flex items-center justify-center h-72">
        <p className="text-gray-400 dark:text-slate-500">Sin datos suficientes para comparar</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-5">
      <h3 className="font-semibold text-gray-700 dark:text-slate-200 mb-3">Ingresos vs gastos (últimos 12 meses)</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={datos}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-grid, #f0f0f0)" />
          <XAxis dataKey="etiqueta" tick={{ fontSize: 11, fill: "var(--color-axis, #6b7280)" }} />
          <YAxis tick={{ fontSize: 12, fill: "var(--color-axis, #6b7280)" }} />
          <Tooltip
            formatter={(value) => formatMoneda(value)}
            contentStyle={{
              backgroundColor: "var(--color-tooltip-bg, white)",
              border: "1px solid var(--color-tooltip-border, #e5e7eb)",
              borderRadius: "8px",
              color: "var(--color-tooltip-text, #1f2937)",
            }}
          />
          <Legend wrapperStyle={{ fontSize: 12 }} />
          <Bar dataKey="ingresos" name="Ingresos" fill="#10b981" radius={[3, 3, 0, 0]} />
          <Bar dataKey="gastos" name="Gastos" fill="#ef4444" radius={[3, 3, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}