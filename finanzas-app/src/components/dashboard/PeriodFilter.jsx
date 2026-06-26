// src/components/dashboard/PeriodFilter.jsx
import { etiquetaPeriodo } from "../../utils/dateHelpers";

const PERIODOS = [
  { id: "semanal", label: "Semanal" },
  { id: "quincenal", label: "Quincenal" },
  { id: "mensual", label: "Mensual" },
  { id: "trimestral", label: "Trimestral" },
  { id: "semestral", label: "Semestral" },
  { id: "anual", label: "Anual" },
];

export function PeriodFilter({ periodo, fechaReferencia, onPeriodoChange, onNavegar }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
      <select
        value={periodo}
        onChange={(e) => onPeriodoChange(e.target.value)}
        className="px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 ring-primary bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-100 font-medium"
      >
        {PERIODOS.map((p) => (
          <option key={p.id} value={p.id}>
            {p.label}
          </option>
        ))}
      </select>

      <div className="flex items-center gap-2 bg-white dark:bg-slate-800 rounded-lg border border-gray-200 dark:border-slate-600 px-2 py-1">
        <button onClick={() => onNavegar(-1)} className="px-2 py-1 text-gray-500 dark:text-slate-400 hover:text-primary transition" aria-label="Periodo anterior">
          ←
        </button>
        <span className="text-sm font-medium text-gray-700 dark:text-slate-200 min-w-[140px] text-center capitalize">
          {etiquetaPeriodo(periodo, fechaReferencia)}
        </span>
        <button onClick={() => onNavegar(1)} className="px-2 py-1 text-gray-500 dark:text-slate-400 hover:text-primary transition" aria-label="Periodo siguiente">
          →
        </button>
      </div>
    </div>
  );
}