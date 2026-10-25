// src/hooks/useDashboardData.js
import { useMemo } from "react";
import { useTransactions } from "./useTransactions";
import { useIncomes } from "./useIncomes";
import { getRangoPeriodo } from "../utils/dateHelpers";
import { montoMSIEnRango, montoMSIEnMes } from "../utils/msiUtils";

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

  // Para gastos MSI: un gasto aparece en el rango si:
  // (a) no es MSI y su fecha está en el rango (comportamiento normal), o
  // (b) es MSI y alguno de sus meses intersecta con el rango
  const gastosEnRango = useMemo(() => {
    return transactions.filter((t) => {
      if (t.msi) {
        // Aparece si algún mes de la deuda cae dentro del rango
        const msiInicio = aFecha(t.msiFechaInicio);
        const msiFin = aFecha(t.msiFechaFin);
        return msiInicio <= fin && msiFin >= inicio;
      }
      const f = aFecha(t.fecha);
      return f >= inicio && f <= fin;
    });
  }, [transactions, inicio, fin]);

  const ingresosEnRango = useMemo(
    () => incomes.filter((i) => {
      const f = aFecha(i.fecha);
      return f >= inicio && f <= fin;
    }),
    [incomes, inicio, fin]
  );

  // totalGastos usa montoMSIEnRango para distribuir MSI correctamente
  const totalGastos = useMemo(
    () => gastosEnRango.reduce((sum, t) => sum + montoMSIEnRango(t, inicio, fin), 0),
    [gastosEnRango, inicio, fin]
  );

  const totalIngresos = useMemo(
    () => ingresosEnRango.reduce((sum, i) => sum + i.monto, 0),
    [ingresosEnRango]
  );

  const balance = totalIngresos - totalGastos;

  // gastosPorCategoria distribuye MSI
  const gastosPorCategoria = useMemo(() => {
    const mapa = {};
    gastosEnRango.forEach((t) => {
      const monto = montoMSIEnRango(t, inicio, fin);
      mapa[t.categoria] = (mapa[t.categoria] || 0) + monto;
    });
    return Object.entries(mapa).map(([categoria, monto]) => ({ categoria, monto }));
  }, [gastosEnRango, inicio, fin]);

  // gastosPorMetodoPago distribuye MSI
  const gastosPorMetodoPago = useMemo(() => {
    const mapa = {};
    gastosEnRango.forEach((t) => {
      const monto = montoMSIEnRango(t, inicio, fin);
      mapa[t.metodoPago] = (mapa[t.metodoPago] || 0) + monto;
    });
    return Object.entries(mapa).map(([metodoPago, monto]) => ({ metodoPago, monto }));
  }, [gastosEnRango, inicio, fin]);

  const topCategorias = useMemo(
    () => [...gastosPorCategoria].sort((a, b) => b.monto - a.monto).slice(0, 5),
    [gastosPorCategoria]
  );

  // evolucionBalance distribuye MSI por día (simplificado: el día de msiFechaInicio recibe msiMontoPorMes)
  const evolucionBalance = useMemo(() => {
    const porDia = {};

    gastosEnRango.forEach((t) => {
      let clave, monto;
      if (t.msi) {
        // Para la línea de evolución, mostramos el cargo mensual en el día de inicio de cada mes MSI
        const msiInicio = aFecha(t.msiFechaInicio);
        const msiFin = aFecha(t.msiFechaFin);
        const cursor = new Date(msiInicio);
        while (cursor <= msiFin && cursor <= fin) {
          if (cursor >= inicio) {
            clave = cursor.toDateString();
            porDia[clave] = porDia[clave] || { fecha: new Date(cursor), ingresos: 0, gastos: 0 };
            porDia[clave].gastos += t.msiMontoPorMes;
          }
          cursor.setMonth(cursor.getMonth() + 1);
        }
      } else {
        clave = aFecha(t.fecha).toDateString();
        porDia[clave] = porDia[clave] || { fecha: aFecha(t.fecha), ingresos: 0, gastos: 0 };
        porDia[clave].gastos += t.monto;
      }
    });

    ingresosEnRango.forEach((i) => {
      const clave = aFecha(i.fecha).toDateString();
      porDia[clave] = porDia[clave] || { fecha: aFecha(i.fecha), ingresos: 0, gastos: 0 };
      porDia[clave].ingresos += i.monto;
    });

    const dias = Object.values(porDia).sort((a, b) => a.fecha - b.fecha);
    let acumulado = 0;
    return dias.map((d) => {
      const balanceDelDia = d.ingresos - d.gastos;
      if (modoBalance === "acumulado") acumulado += balanceDelDia;
      return {
        fecha: d.fecha.toLocaleDateString("es-MX", { day: "2-digit", month: "short" }),
        balance: modoBalance === "acumulado" ? acumulado : balanceDelDia,
        ingresos: d.ingresos,
        gastos: d.gastos,
      };
    });
  }, [gastosEnRango, ingresosEnRango, modoBalance, inicio, fin]);

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