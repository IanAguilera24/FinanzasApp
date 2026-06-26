// src/components/history/HistoryTable.jsx
import { useState, useMemo } from "react";
import { Trash2 } from "lucide-react";
import { useHistory } from "../../hooks/useHistory";
import { useUserProfile } from "../../hooks/useUserProfile";
import { EditableCell } from "./EditableCell";
import { fechaParaInput } from "../../utils/formatters";
import { parsearFechaLocal } from "../../utils/dateHelpers";
import { ConfirmModal } from "../common/ConfirmModal";

const FUENTES = [
  { id: "sueldo", label: "Sueldo" },
  { id: "inversiones", label: "Inversiones" },
  { id: "ventas", label: "Ventas" },
  { id: "freelance", label: "Freelance" },
  { id: "regalo", label: "Regalo" },
  { id: "otros", label: "Otros" },
];

function aFecha(timestamp) {
  return timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
}

export function HistoryTable() {
  const { records, loading, updateRecord, deleteRecord } = useHistory();
  const { profile } = useUserProfile();
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("todos");
  const [fechaDesde, setFechaDesde] = useState("");
  const [fechaHasta, setFechaHasta] = useState("");
  const [registroAEliminar, setRegistroAEliminar] = useState(null);

  const categoriaOptions = useMemo(
    () => (profile?.categories || []).map((c) => ({ id: c.id, label: c.nombre })),
    [profile]
  );

  const recordsFiltrados = useMemo(() => {
    const desde = fechaDesde ? parsearFechaLocal(fechaDesde) : null;
    const hasta = fechaHasta ? parsearFechaLocal(fechaHasta) : null;
    if (hasta) hasta.setHours(23, 59, 59, 999); // incluye todo el día "hasta"

    return records.filter((r) => {
      if (filtroTipo !== "todos" && r.tipo !== filtroTipo) return false;

      if (desde || hasta) {
        const fechaRecord = aFecha(r.fecha);
        if (desde && fechaRecord < desde) return false;
        if (hasta && fechaRecord > hasta) return false;
      }

      if (busqueda.trim()) {
        const texto = `${r.concepto} ${r.detalle}`.toLowerCase();
        if (!texto.includes(busqueda.toLowerCase())) return false;
      }
      return true;
    });
  }, [records, busqueda, filtroTipo, fechaDesde, fechaHasta]);

  function limpiarFiltrosFecha() {
    setFechaDesde("");
    setFechaHasta("");
  }

  function handleDeleteClick(record) {
    setRegistroAEliminar(record);
  }

  async function confirmarEliminar() {
    if (registroAEliminar) {
      await deleteRecord(registroAEliminar);
      setRegistroAEliminar(null);
    }
  }

  if (loading) {
    return <p className="text-center text-gray-400 dark:text-slate-500 py-10">Cargando historial...</p>;
  }

  const inputClass =
    "px-4 py-2 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-gray-800 dark:text-slate-100 ring-primary";

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-3 mb-3">
        <input
          type="text"
          placeholder="Buscar por concepto o lugar..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className={`flex-1 ${inputClass}`}
        />
        <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)} className={inputClass}>
          <option value="todos">Todos</option>
          <option value="gasto">Solo gastos</option>
          <option value="ingreso">Solo ingresos</option>
        </select>
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-500 dark:text-slate-400 whitespace-nowrap">Desde</label>
          <input
            type="date"
            value={fechaDesde}
            onChange={(e) => setFechaDesde(e.target.value)}
            max={fechaHasta || undefined}
            className={inputClass}
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-500 dark:text-slate-400 whitespace-nowrap">Hasta</label>
          <input
            type="date"
            value={fechaHasta}
            onChange={(e) => setFechaHasta(e.target.value)}
            min={fechaDesde || undefined}
            className={inputClass}
          />
        </div>
        {(fechaDesde || fechaHasta) && (
          <button
            onClick={limpiarFiltrosFecha}
            className="text-sm text-gray-500 dark:text-slate-400 hover:text-red-600 underline"
          >
            Limpiar fechas
          </button>
        )}
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 dark:border-slate-700 text-left text-gray-500 dark:text-slate-400">
              <th className="px-3 py-3 font-medium">Tipo</th>
              <th className="px-3 py-3 font-medium">Concepto</th>
              <th className="px-3 py-3 font-medium">Monto</th>
              <th className="px-3 py-3 font-medium">Categoría / Fuente</th>
              <th className="px-3 py-3 font-medium">Lugar / Detalle</th>
              <th className="px-3 py-3 font-medium">Fecha</th>
              <th className="px-3 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {recordsFiltrados.map((record) => (
              <tr key={`${record.tipo}-${record.id}`} className="border-b border-gray-50 dark:border-slate-700/50 hover:bg-gray-50/50 dark:hover:bg-slate-700/30">
                <td className="px-3 py-1">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      record.tipo === "gasto"
                        ? "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300"
                        : "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300"
                    }`}
                  >
                    {record.tipo === "gasto" ? "Gasto" : "Ingreso"}
                  </span>
                </td>
                <td className="px-1">
                  <EditableCell value={record.concepto} onSave={(val) => updateRecord(record, { concepto: val })} />
                </td>
                <td className="px-1">
                  <EditableCell value={record.monto} type="currency" onSave={(val) => updateRecord(record, { monto: val })} />
                </td>
                <td className="px-1">
                  {record.tipo === "gasto" ? (
                    <EditableCell
                      value={record.categoria}
                      type="select"
                      options={categoriaOptions}
                      onSave={(val) => updateRecord(record, { categoria: val })}
                    />
                  ) : (
                    <EditableCell
                      value={record.fuente}
                      type="select"
                      options={FUENTES}
                      onSave={(val) => updateRecord(record, { fuente: val })}
                    />
                  )}
                </td>
                <td className="px-1">
                  {record.tipo === "gasto" ? (
                    <EditableCell value={record.lugar} onSave={(val) => updateRecord(record, { lugar: val })} />
                  ) : (
                    <span className="px-2 py-1 text-gray-400 dark:text-slate-500">—</span>
                  )}
                </td>
                <td className="px-1">
                  <EditableCell
                    value={fechaParaInput(record.fecha)}
                    type="date"
                    onSave={(val) => updateRecord(record, { fecha: val })}
                  />
                </td>
                <td className="px-3">
                  <button
                    onClick={() => handleDeleteClick(record)}
                    className="text-gray-400 dark:text-slate-500 hover:text-red-500 transition"
                    title="Eliminar"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {recordsFiltrados.length === 0 && (
          <p className="text-center text-gray-400 dark:text-slate-500 py-8">No hay registros que coincidan.</p>
        )}
      </div>

      <ConfirmModal
        open={!!registroAEliminar}
        title="¿Eliminar este registro?"
        message={
          registroAEliminar
            ? `Vas a eliminar "${registroAEliminar.concepto}" por $${registroAEliminar.monto}. Esta acción no se puede deshacer.`
            : ""
        }
        confirmLabel="Eliminar"
        onConfirm={confirmarEliminar}
        onCancel={() => setRegistroAEliminar(null)}
      />
    </div>
  );
}