// src/hooks/useHistory.js
import { useMemo } from "react";
import { useTransactions } from "./useTransactions";
import { useIncomes } from "./useIncomes";

export function useHistory() {
  const {
    transactions,
    loading: loadingExpenses,
    updateExpense,
    deleteExpense,
  } = useTransactions();
  const {
    incomes,
    loading: loadingIncomes,
    updateIncome,
    deleteIncome,
  } = useIncomes();

  const records = useMemo(() => {
    const gastos = transactions.map((t) => ({
      ...t,
      tipo: "gasto",
      // Normalizamos el campo de "concepto secundario" para mostrar en la tabla
      detalle: t.lugar || "",
    }));
    const ingresosNormalizados = incomes.map((i) => ({
      ...i,
      tipo: "ingreso",
      detalle: i.fuente || "",
    }));

    return [...gastos, ...ingresosNormalizados].sort((a, b) => {
      const fechaA = a.fecha?.toDate ? a.fecha.toDate() : new Date(a.fecha);
      const fechaB = b.fecha?.toDate ? b.fecha.toDate() : new Date(b.fecha);
      return fechaB - fechaA; // más reciente primero
    });
  }, [transactions, incomes]);

  async function updateRecord(record, updates) {
    if (record.tipo === "gasto") {
      await updateExpense(record.id, updates);
    } else {
      await updateIncome(record.id, updates);
    }
  }

  async function deleteRecord(record) {
    if (record.tipo === "gasto") {
      await deleteExpense(record.id);
    } else {
      await deleteIncome(record.id);
    }
  }

  return {
    records,
    loading: loadingExpenses || loadingIncomes,
    updateRecord,
    deleteRecord,
  };
}