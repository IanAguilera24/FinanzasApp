// src/hooks/useMonthlyComparison.js
import { useMemo } from "react";
import { useTransactions } from "./useTransactions";
import { useIncomes } from "./useIncomes";

function aFecha(timestamp) {
  return timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
}

const NOMBRES_MES = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];

export function useMonthlyComparison(mesesAtras = 12) {
  const { transactions, loading: loadingGastos } = useTransactions();
  const { incomes, loading: loadingIngresos } = useIncomes();

  const datos = useMemo(() => {
    const hoy = new Date();
    const meses = [];

    // Genera los últimos N meses, del más antiguo al más reciente
    for (let i = mesesAtras - 1; i >= 0; i--) {
      const fecha = new Date(hoy.getFullYear(), hoy.getMonth() - i, 1);
      meses.push({
        anio: fecha.getFullYear(),
        mes: fecha.getMonth() + 1,
        etiqueta: `${NOMBRES_MES[fecha.getMonth()]} ${fecha.getFullYear().toString().slice(-2)}`,
        ingresos: 0,
        gastos: 0,
      });
    }

    const buscarMes = (anio, mes) => meses.find((m) => m.anio === anio && m.mes === mes);

    transactions.forEach((t) => {
      const f = aFecha(t.fecha);
      const entrada = buscarMes(f.getFullYear(), f.getMonth() + 1);
      if (entrada) entrada.gastos += t.monto;
    });

    incomes.forEach((i) => {
      const f = aFecha(i.fecha);
      const entrada = buscarMes(f.getFullYear(), f.getMonth() + 1);
      if (entrada) entrada.ingresos += i.monto;
    });

    return meses;
  }, [transactions, incomes, mesesAtras]);

  return {
    loading: loadingGastos || loadingIngresos,
    datos,
  };
}