// src/components/expenses/MSIFields.jsx
import { fechaLocalISO } from "../../utils/dateHelpers";

const MESES_OPCIONES = [3, 6, 9, 12, 18, 24];

export function MSIFields({ esMSI, msiMeses, msiFechaInicio, onChange }) {
  if (!esMSI) return null;

  return (
    <div className="space-y-3 pl-4 border-l-2 border-red-200 dark:border-red-800">
      <div>
        <label className="block text-sm font-medium text-gray-600 dark:text-slate-300 mb-1">
          Número de meses
        </label>
        <div className="flex flex-wrap gap-2">
          {MESES_OPCIONES.map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => onChange("msiMeses", String(m))}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition ${
                msiMeses === String(m)
                  ? "bg-red-600 text-white border-red-600"
                  : "bg-white dark:bg-slate-700 border-gray-200 dark:border-slate-600 text-gray-700 dark:text-slate-200 hover:border-red-400"
              }`}
            >
              {m}
            </button>
          ))}
          <input
            type="number"
            min="2"
            max="60"
            placeholder="Otro"
            value={MESES_OPCIONES.includes(Number(msiMeses)) ? "" : msiMeses}
            onChange={(e) => onChange("msiMeses", e.target.value)}
            className="w-20 px-3 py-1.5 rounded-lg text-sm border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-700 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-red-400"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 dark:text-slate-300 mb-1">
          Fecha del primer cargo
        </label>
        <input
          type="date"
          value={msiFechaInicio}
          onChange={(e) => onChange("msiFechaInicio", e.target.value)}
          min={fechaLocalISO()}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-400"
        />
        {msiMeses && msiFechaInicio && (
          <ResumenMSI msiMeses={msiMeses} msiFechaInicio={msiFechaInicio} />
        )}
      </div>
    </div>
  );
}

function ResumenMSI({ msiMeses, msiFechaInicio }) {
  const [anio, mes, dia] = msiFechaInicio.split("-").map(Number);
  const fechaInicio = new Date(anio, mes - 1, dia);
  const fechaFin = new Date(anio, mes - 1 + Number(msiMeses), dia);

  return (
    <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
      Del {fechaInicio.toLocaleDateString("es-MX", { month: "short", year: "numeric" })} al{" "}
      {fechaFin.toLocaleDateString("es-MX", { month: "short", year: "numeric" })}
    </p>
  );
}