// src/pages/DashboardPage.jsx
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useDashboardData } from "../hooks/useDashboardData";
import { PeriodFilter } from "../components/dashboard/PeriodFilter";
import { SummaryCards } from "../components/dashboard/SummaryCards";
import { DonutChartCategories } from "../components/dashboard/DonutChartCategories";
import { BalanceLineChart } from "../components/dashboard/BalanceLineChart";
import { navegarPeriodo } from "../utils/dateHelpers";

export function DashboardPage() {
  const { user, logout } = useAuth();
  const [periodo, setPeriodo] = useState("mensual");
  const [fechaReferencia, setFechaReferencia] = useState(new Date());
  const [modoBalance, setModoBalance] = useState("periodo");

  const {
    loading,
    totalGastos,
    totalIngresos,
    balance,
    gastosPorCategoria,
    evolucionBalance,
  } = useDashboardData(periodo, fechaReferencia, modoBalance);

  function handleNavegar(direccion) {
    setFechaReferencia((prev) => navegarPeriodo(periodo, prev, direccion));
  }

  function handlePeriodoChange(nuevoPeriodo) {
    setPeriodo(nuevoPeriodo);
    setFechaReferencia(new Date()); // al cambiar de periodo, vuelve al actual
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">📊 Dashboard</h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 hidden sm:inline">{user?.email}</span>
          <button onClick={logout} className="text-sm text-red-500 hover:text-red-700 font-medium">
            Cerrar sesión
          </button>
        </div>
      </div>

      <PeriodFilter
        periodo={periodo}
        fechaReferencia={fechaReferencia}
        onPeriodoChange={handlePeriodoChange}
        onNavegar={handleNavegar}
      />

      {loading ? (
        <p className="text-center text-gray-400 py-10">Cargando datos...</p>
      ) : (
        <>
          <SummaryCards totalIngresos={totalIngresos} totalGastos={totalGastos} balance={balance} />

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <DonutChartCategories gastosPorCategoria={gastosPorCategoria} />
            <BalanceLineChart
              evolucionBalance={evolucionBalance}
              modoBalance={modoBalance}
              onModoChange={setModoBalance}
            />
          </div>
        </>
      )}
    </div>
  );
}