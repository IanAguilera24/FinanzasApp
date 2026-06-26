// src/pages/MovimientosPage.jsx
import { useState } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";
import { ExpenseForm } from "../components/expenses/ExpenseForm";
import { IncomeForm } from "../components/incomes/IncomeForm";

export function MovimientosPage() {
  const [tipo, setTipo] = useState("gasto");

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Movimientos</h1>

      <div className="flex max-w-md mx-auto mb-6 bg-gray-100 rounded-xl p-1">
        <button
          onClick={() => setTipo("gasto")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-sm transition ${
            tipo === "gasto" ? "bg-white shadow-sm text-red-600" : "text-gray-500"
          }`}
        >
          <TrendingDown size={18} />
          Gasto
        </button>
        <button
          onClick={() => setTipo("ingreso")}
          className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-medium text-sm transition ${
            tipo === "ingreso" ? "bg-white shadow-sm text-emerald-600" : "text-gray-500"
          }`}
        >
          <TrendingUp size={18} />
          Ingreso
        </button>
      </div>

      {tipo === "gasto" ? <ExpenseForm /> : <IncomeForm />}
    </div>
  );
}