// src/pages/IncomesPage.jsx
import { IncomeForm } from "../components/incomes/IncomeForm";

export function IncomesPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        💰 Registrar Ingreso
      </h1>
      <IncomeForm />
    </div>
  );
}