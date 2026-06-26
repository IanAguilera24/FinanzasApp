// src/components/dashboard/DonutChartCategories.jsx
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { useUserProfile } from "../../hooks/useUserProfile";
import { formatMoneda } from "../../utils/formatters";

export function DonutChartCategories({ gastosPorCategoria }) {
  const { profile } = useUserProfile();
  const categorias = profile?.categories || [];

  const data = gastosPorCategoria.map((g) => {
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
      <h3 className="font-semibold text-gray-700 dark:text-slate-200 mb-3">Gastos por categoría</h3>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie data={data} dataKey="monto" nameKey="nombre" innerRadius={60} outerRadius={90} paddingAngle={2}>
            {data.map((entry, index) => (
              <Cell key={index} fill={entry.color} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => formatMoneda(value)} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}