// src/pages/ExpensesPage.jsx
import { ExpenseForm } from "../components/expenses/ExpenseForm";

export function ExpensesPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        💸 Registrar Gasto
      </h1>
      <ExpenseForm />
    </div>
  );
}