// src/components/history/HistoryTable.jsx
import { useState, useMemo } from "react";
import { useHistory } from "../../hooks/useHistory";
import { useUserProfile } from "../../hooks/useUserProfile";
import { EditableCell } from "./EditableCell";
import { formatFecha, fechaParaInput } from "../../utils/formatters";
import { Trash2 } from "lucide-react";

const METODOS_PAGO = [
  { id: "efectivo", label: "Efectivo" },
  { id: "tarjeta_credito", label: "Tarjeta de Crédito" },
  { id: "tarjeta_debito", label: "Tarjeta de Débito" },
  { id: "transferencia", label: "Transferencia" },
];

const FUENTES = [
  { id: "sueldo", label: "Sueldo" },
  { id: "inversiones", label: "Inversiones" },
  { id: "ventas", label: "Ventas" },
  { id: "freelance", label: "Freelance" },
  { id: "regalo", label: "Regalo" },
  { id: "otros", label: "Otros" },
];

export function HistoryTable() {
  const { records, loading, updateRecord, deleteRecord } = useHistory();
  const { profile } = useUserProfile();
  const [busqueda, setBusqueda] = useState("");
  const [filtroTipo, setFiltroTipo] = useState("todos");

  const categoriaOptions = useMemo(
    () => (profile?.categories || []).map((c) => ({ id: c.id, label: c.nombre })),
    [profile]
  );

  const recordsFiltrados = useMemo(() => {
    return records.filter((r) => {
      if (filtroTipo !== "todos" && r.tipo !== filtroTipo) return false;
      if (busqueda.trim()) {
        const texto = `${r.concepto} ${r.detalle}`.toLowerCase();
        if (!texto.includes(busqueda.toLowerCase())) return false;
      }
      return true;
    });
  }, [records, busqueda, filtroTipo]);

  async function handleDelete(record) {
    const confirmado = window.confirm(
      `¿Eliminar "${record.concepto}" (${record.tipo === "gasto" ? "-" : "+"}$${record.monto})?`
    );
    if (confirmado) {
      await deleteRecord(record);
    }
  }

  if (loading) {
    return <p className="text-center text-gray-400 py-10">Cargando historial...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex flex-col sm:flex-row gap-3 mb-4">
        <input
          type="text"
          placeholder="Buscar por concepto o lugar..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="flex-1 px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-400"
        />
        <select
          value={filtroTipo}
          onChange={(e) => setFiltroTipo(e.target.value)}
          className="px-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
        >
          <option value="todos">Todos</option>
          <option value="gasto">Solo gastos</option>
          <option value="ingreso">Solo ingresos</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-left text-gray-500">
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
              <tr key={`${record.tipo}-${record.id}`} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="px-3 py-1">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      record.tipo === "gasto"
                        ? "bg-red-50 text-red-600"
                        : "bg-emerald-50 text-emerald-600"
                    }`}
                  >
                    {record.tipo === "gasto" ? "Gasto" : "Ingreso"}
                  </span>
                </td>
                <td className="px-1">
                  <EditableCell
                    value={record.concepto}
                    onSave={(val) => updateRecord(record, { concepto: val })}
                  />
                </td>
                <td className="px-1">
                  <EditableCell
                    value={record.monto}
                    type="currency"
                    onSave={(val) => updateRecord(record, { monto: val })}
                  />
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
                    <EditableCell
                      value={record.lugar}
                      onSave={(val) => updateRecord(record, { lugar: val })}
                    />
                  ) : (
                    <span className="px-2 py-1 text-gray-400">—</span>
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
                  <button onClick={() => handleDelete(record)} className="text-gray-400 hover:text-red-500 transition" title="Eliminar">
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {recordsFiltrados.length === 0 && (
          <p className="text-center text-gray-400 py-8">No hay registros que coincidan.</p>
        )}
      </div>
    </div>
  );
}