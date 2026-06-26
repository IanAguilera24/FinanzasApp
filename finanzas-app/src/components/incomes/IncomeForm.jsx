// src/components/incomes/IncomeForm.jsx
import { useState } from "react";
import { useIncomes } from "../../hooks/useIncomes";
import { fechaLocalISO } from "../../utils/dateHelpers";

const FUENTES = [
  { id: "sueldo", label: "Sueldo" },
  { id: "inversiones", label: "Inversiones" },
  { id: "ventas", label: "Ventas" },
  { id: "freelance", label: "Freelance / Independiente" },
  { id: "regalo", label: "Regalo" },
  { id: "otros", label: "Otros" },
];

const ESTADO_INICIAL = {
  concepto: "",
  monto: "",
  fuente: "sueldo",
  fecha: fechaLocalISO(),
  recurrente: false,
};

const inputClass =
  "w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-400";

export function IncomeForm() {
  const [form, setForm] = useState(ESTADO_INICIAL);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const { addIncome } = useIncomes();

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFeedback(null);

    if (!form.concepto.trim() || !form.monto) {
      setFeedback({ type: "error", text: "Completa todos los campos obligatorios." });
      return;
    }
    if (Number(form.monto) <= 0) {
      setFeedback({ type: "error", text: "El monto debe ser mayor a cero." });
      return;
    }

    setSubmitting(true);
    try {
      await addIncome(form);
      setFeedback({ type: "success", text: "¡Ingreso registrado correctamente!" });
      setForm((prev) => ({
        ...ESTADO_INICIAL,
        fecha: prev.fecha,
        fuente: prev.fuente,
      }));
    } catch (err) {
      console.error(err);
      setFeedback({ type: "error", text: "Ocurrió un error al guardar. Intenta de nuevo." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6 max-w-md mx-auto space-y-4">
      {feedback && (
        <div
          className={`rounded-lg px-3 py-2 text-sm ${
            feedback.type === "success"
              ? "bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300"
              : "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-300"
          }`}
        >
          {feedback.text}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-600 dark:text-slate-300 mb-1">Concepto</label>
        <input
          type="text"
          placeholder="Ej. Sueldo junio"
          value={form.concepto}
          onChange={(e) => handleChange("concepto", e.target.value)}
          required
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 dark:text-slate-300 mb-1">Monto</label>
        <input
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={form.monto}
          onChange={(e) => handleChange("monto", e.target.value)}
          required
          className={inputClass}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 dark:text-slate-300 mb-1">Fuente de ingreso</label>
        <select
          value={form.fuente}
          onChange={(e) => handleChange("fuente", e.target.value)}
          className={inputClass}
        >
          {FUENTES.map((f) => (
            <option key={f.id} value={f.id}>
              {f.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 dark:text-slate-300 mb-1">Fecha</label>
        <input
          type="date"
          value={form.fecha}
          onChange={(e) => handleChange("fecha", e.target.value)}
          required
          className={inputClass}
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-300">
        <input
          type="checkbox"
          checked={form.recurrente}
          onChange={(e) => handleChange("recurrente", e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 dark:border-slate-600 text-emerald-600 focus:ring-emerald-400"
        />
        Este ingreso es recurrente (ej. sueldo mensual)
      </label>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition"
      >
        {submitting ? "Guardando..." : "Registrar ingreso"}
      </button>
    </form>
  );
}