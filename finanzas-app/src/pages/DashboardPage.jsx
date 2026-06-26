// src/pages/DashboardPage.jsx
import { useState } from "react";
import { useDashboardData } from "../hooks/useDashboardData";
import { useMonthlyComparison } from "../hooks/useMonthlyComparison";
import { PeriodFilter } from "../components/dashboard/PeriodFilter";
import { SummaryCards } from "../components/dashboard/SummaryCards";
import { DonutChartCategories } from "../components/dashboard/DonutChartCategories";
import { BalanceLineChart } from "../components/dashboard/BalanceLineChart";
import { MonthlyBarChart } from "../components/dashboard/MonthlyBarChart";
import { PaymentMethodChart } from "../components/dashboard/PaymentMethodChart";
import { TopCategoriesChart } from "../components/dashboard/TopCategoriesChart";
import { navegarPeriodo } from "../utils/dateHelpers";

export function DashboardPage() {
  const [periodo, setPeriodo] = useState("mensual");
  const [fechaReferencia, setFechaReferencia] = useState(new Date());
  const [modoBalance, setModoBalance] = useState("periodo");

  const {
    loading,
    totalGastos,
    totalIngresos,
    balance,
    gastosPorCategoria,
    gastosPorMetodoPago,
    topCategorias,
    evolucionBalance,
  } = useDashboardData(periodo, fechaReferencia, modoBalance);

  const { loading: loadingMensual, datos: datosMensuales } = useMonthlyComparison(12);

  function handleNavegar(direccion) {
    setFechaReferencia((prev) => navegarPeriodo(periodo, prev, direccion));
  }

  function handlePeriodoChange(nuevoPeriodo) {
    setPeriodo(nuevoPeriodo);
    setFechaReferencia(new Date());
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100 mb-6">Dashboard</h1>

      <PeriodFilter
        periodo={periodo}
        fechaReferencia={fechaReferencia}
        onPeriodoChange={handlePeriodoChange}
        onNavegar={handleNavegar}
      />

      {loading ? (
        <p className="text-center text-gray-400 dark:text-slate-500 py-10">Cargando datos...</p>
      ) : (
        <>
          <SummaryCards totalIngresos={totalIngresos} totalGastos={totalGastos} balance={balance} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <DonutChartCategories gastosPorCategoria={gastosPorCategoria} />
            <BalanceLineChart
              evolucionBalance={evolucionBalance}
              modoBalance={modoBalance}
              onModoChange={setModoBalance}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
            <PaymentMethodChart gastosPorMetodoPago={gastosPorMetodoPago} />
            <TopCategoriesChart topCategorias={topCategorias} />
          </div>
        </>
      )}

      {!loadingMensual && (
        <div className="mt-4">
          <MonthlyBarChart datos={datosMensuales} />
        </div>
      )}
    </div>
  );
}