// src/components/dashboard/SummaryCards.jsx
import { formatMoneda } from "../../utils/formatters";

export function SummaryCards({ totalIngresos, totalGastos, balance }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <p className="text-sm text-gray-500 mb-1">Ingresos</p>
        <p className="text-2xl font-bold text-emerald-600">{formatMoneda(totalIngresos)}</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <p className="text-sm text-gray-500 mb-1">Gastos</p>
        <p className="text-2xl font-bold text-red-500">{formatMoneda(totalGastos)}</p>
      </div>
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <p className="text-sm text-gray-500 mb-1">Balance</p>
        <p className={`text-2xl font-bold ${balance >= 0 ? "text-violet-600" : "text-red-500"}`}>
          {formatMoneda(balance)}
        </p>
      </div>
    </div>
  );
}