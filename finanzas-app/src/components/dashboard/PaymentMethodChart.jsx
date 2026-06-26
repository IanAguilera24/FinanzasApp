// src/components/dashboard/PaymentMethodChart.jsx
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { formatMoneda } from "../../utils/formatters";

const ETIQUETAS = {
  efectivo: "Efectivo",
  tarjeta_credito: "Tarjeta de crédito",
  tarjeta_debito: "Tarjeta de débito",
  transferencia: "Transferencia",
};

const COLORES = ["#f59e0b", "#3b82f6", "#8b5cf6", "#06b6d4"];

export function PaymentMethodChart({ gastosPorMetodoPago }) {
  const data = gastosPorMetodoPago.map((g) => ({
    nombre: ETIQUETAS[g.metodoPago] || g.metodoPago,
    monto: g.monto,
  }));

  if (data.length === 0) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-5 flex items-center justify-center h-72">
        <p className="text-gray-400 dark:text-slate-500">Sin gastos en este periodo</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-5">
      <h3 className="font-semibold text-gray-700 dark:text-slate-200 mb-3">Gastos por método de pago</h3>
      <ResponsiveContainer width="100%" height={260}>
        <PieChart>
          <Pie data={data} dataKey="monto" nameKey="nombre" innerRadius={50} outerRadius={85} paddingAngle={2}>
            {data.map((_, index) => (
              <Cell key={index} fill={COLORES[index % COLORES.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value) => formatMoneda(value)} />
          <Legend wrapperStyle={{ fontSize: 12 }} />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}