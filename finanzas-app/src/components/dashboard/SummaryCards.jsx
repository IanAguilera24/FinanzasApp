// src/components/dashboard/SummaryCards.jsx
import { formatMoneda } from "../../utils/formatters";

export function SummaryCards({ totalIngresos, totalGastos, balance }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-5">
        <p className="text-sm text-gray-500 dark:text-slate-400 mb-1">Ingresos</p>
        <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">{formatMoneda(totalIngresos)}</p>
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-5">
        <p className="text-sm text-gray-500 dark:text-slate-400 mb-1">Gastos</p>
        <p className="text-2xl font-bold text-red-500 dark:text-red-400">{formatMoneda(totalGastos)}</p>
      </div>
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-5">
        <p className="text-sm text-gray-500 dark:text-slate-400 mb-1">Balance</p>
        <p className={`text-2xl font-bold ${balance >= 0 ? "text-gray-800 dark:text-slate-100" : "text-red-500 dark:text-red-400"}`}>
          {formatMoneda(balance)}
        </p>
      </div>
    </div>
  );
}