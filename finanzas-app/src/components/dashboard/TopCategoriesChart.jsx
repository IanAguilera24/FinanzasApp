// src/components/dashboard/TopCategoriesChart.jsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { useUserProfile } from "../../hooks/useUserProfile";
import { formatMoneda } from "../../utils/formatters";

export function TopCategoriesChart({ topCategorias }) {
  const { profile } = useUserProfile();
  const categorias = profile?.categories || [];

  const data = topCategorias.map((g) => {
    const cat = categorias.find((c) => c.id === g.categoria);
    return {
      nombre: cat ? cat.nombre : g.categoria,
      monto: g.monto,
      color: cat?.color || "#95A5A6",
    };
  });

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-5 flex items-center justify-center h-72">
        <p className="text-gray-400 dark:text-slate-500">Sin gastos en este periodo</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-5">
      <h3 className="font-semibold text-gray-700 dark:text-slate-200 mb-3">Top categorías de gasto</h3>
      <ResponsiveContainer width="100%" height={Math.max(200, data.length * 50)}>
        <BarChart data={data} layout="vertical" margin={{ left: 10 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-grid, #f0f0f0)" horizontal={false} />
          <XAxis type="number" tick={{ fontSize: 12, fill: "var(--color-axis, #6b7280)" }} />
          <YAxis dataKey="nombre" type="category" tick={{ fontSize: 12, fill: "var(--color-axis, #6b7280)" }} width={90} />
          <Tooltip
            formatter={(value) => formatMoneda(value)}
            contentStyle={{
              backgroundColor: "var(--color-tooltip-bg, white)",
              border: "1px solid var(--color-tooltip-border, #e5e7eb)",
              borderRadius: "8px",
              color: "var(--color-tooltip-text, #1f2937)",
            }}
          />
          <Bar dataKey="monto" radius={[0, 4, 4, 0]}>
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}