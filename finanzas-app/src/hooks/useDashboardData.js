// src/hooks/useDashboardData.js
import { useMemo } from "react";
import { useTransactions } from "./useTransactions";
import { useIncomes } from "./useIncomes";
import { getRangoPeriodo } from "../utils/dateHelpers";

function aFecha(timestamp) {
  return timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
}

export function useDashboardData(periodo, fechaReferencia, modoBalance = "periodo") {
  const { transactions, loading: loadingGastos } = useTransactions();
  const { incomes, loading: loadingIngresos } = useIncomes();

  const { inicio, fin } = useMemo(
    () => getRangoPeriodo(periodo, fechaReferencia),
    [periodo, fechaReferencia]
  );

  const gastosEnRango = useMemo(
    () => transactions.filter((t) => {
      const f = aFecha(t.fecha);
      return f >= inicio && f <= fin;
    }),
    [transactions, inicio, fin]
  );

  const ingresosEnRango = useMemo(
    () => incomes.filter((i) => {
      const f = aFecha(i.fecha);
      return f >= inicio && f <= fin;
    }),
    [incomes, inicio, fin]
  );

  const totalGastos = useMemo(
    () => gastosEnRango.reduce((sum, t) => sum + t.monto, 0),
    [gastosEnRango]
  );
  const totalIngresos = useMemo(
    () => ingresosEnRango.reduce((sum, i) => sum + i.monto, 0),
    [ingresosEnRango]
  );
  const balance = totalIngresos - totalGastos;

  // Agrupa gastos por categoría
  const gastosPorCategoria = useMemo(() => {
    const mapa = {};
    gastosEnRango.forEach((t) => {
      mapa[t.categoria] = (mapa[t.categoria] || 0) + t.monto;
    });
    return Object.entries(mapa).map(([categoria, monto]) => ({ categoria, monto }));
  }, [gastosEnRango]);

  // Agrupa gastos por método de pago
  const gastosPorMetodoPago = useMemo(() => {
    const mapa = {};
    gastosEnRango.forEach((t) => {
      mapa[t.metodoPago] = (mapa[t.metodoPago] || 0) + t.monto;
    });
    return Object.entries(mapa).map(([metodoPago, monto]) => ({ metodoPago, monto }));
  }, [gastosEnRango]);

  // Top 5 categorías con mayor gasto, ya ordenadas descendente
  const topCategorias = useMemo(() => {
    return [...gastosPorCategoria].sort((a, b) => b.monto - a.monto).slice(0, 5);
  }, [gastosPorCategoria]);

  // Para la línea de evolución: combina gastos e ingresos día por día
  const evolucionBalance = useMemo(() => {
    const porDia = {};

    gastosEnRango.forEach((t) => {
      const key = aFecha(t.fecha).toDateString();
      porDia[key] = porDia[key] || { fecha: aFecha(t.fecha), ingresos: 0, gastos: 0 };
      porDia[key].gastos += t.monto;
    });
    ingresosEnRango.forEach((i) => {
      const key = aFecha(i.fecha).toDateString();
      porDia[key] = porDia[key] || { fecha: aFecha(i.fecha), ingresos: 0, gastos: 0 };
      porDia[key].ingresos += i.monto;
    });

    const dias = Object.values(porDia).sort((a, b) => a.fecha - b.fecha);

    let acumulado = 0;
    return dias.map((d) => {
      const balanceDelDia = d.ingresos - d.gastos;
      if (modoBalance === "acumulado") {
        acumulado += balanceDelDia;
      }
      return {
        fecha: d.fecha.toLocaleDateString("es-MX", { day: "2-digit", month: "short" }),
        balance: modoBalance === "acumulado" ? acumulado : balanceDelDia,
        ingresos: d.ingresos,
        gastos: d.gastos,
      };
    });
  }, [gastosEnRango, ingresosEnRango, modoBalance]);

  return {
    loading: loadingGastos || loadingIngresos,
    totalGastos,
    totalIngresos,
    balance,
    gastosPorCategoria,
    gastosPorMetodoPago,    
    topCategorias,
    evolucionBalance,
    cantidadRegistros: gastosEnRango.length + ingresosEnRango.length,
  };
}