// src/components/expenses/ExpenseForm.jsx
import { useState } from "react";
import { useTransactions } from "../../hooks/useTransactions";
import { CategorySelector } from "./CategorySelector";
import { MSIFields } from "./MSIFields";
import { fechaLocalISO } from "../../utils/dateHelpers";

const METODOS_PAGO = [
  { id: "efectivo", label: "Efectivo" },
  { id: "tarjeta_credito", label: "Tarjeta de Crédito" },
  { id: "tarjeta_debito", label: "Tarjeta de Débito" },
  { id: "transferencia", label: "Transferencia" },
];

const ESTADO_INICIAL = {
  concepto: "",
  monto: "",
  metodoPago: "efectivo",
  lugar: "",
  fecha: fechaLocalISO(),
  categoria: "",
  recurrente: false,
  esMSI: false,
  msiMeses: "",
  msiFechaInicio: fechaLocalISO(),
};

const inputClass =
  "w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-400";

export function ExpenseForm() {
  const [form, setForm] = useState(ESTADO_INICIAL);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const { addExpense } = useTransactions();

  function handleChange(field, value) {
    setForm((prev) => {
      const next = { ...prev, [field]: value };
      // Si cambia método de pago y ya no es tarjeta crédito, limpia MSI
      if (field === "metodoPago" && value !== "tarjeta_credito") {
        next.esMSI = false;
        next.msiMeses = "";
        next.msiFechaInicio = fechaLocalISO();
      }
      return next;
    });
  }

  function validar() {
    if (!form.concepto.trim() || !form.monto || !form.categoria) {
      return "Completa todos los campos obligatorios.";
    }
    if (Number(form.monto) <= 0) {
      return "El monto debe ser mayor a cero.";
    }
    if (form.esMSI) {
      if (!form.msiMeses || Number(form.msiMeses) < 2) {
        return "Selecciona al menos 2 meses para MSI.";
      }
      if (!form.msiFechaInicio) {
        return "Selecciona la fecha del primer cargo.";
      }
    }
    return null;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFeedback(null);

    const error = validar();
    if (error) {
      setFeedback({ type: "error", text: error });
      return;
    }

    setSubmitting(true);
    try {
      await addExpense(form);
      setFeedback({ type: "success", text: "¡Gasto registrado correctamente!" });
      setForm((prev) => ({
        ...ESTADO_INICIAL,
        fecha: prev.fecha,
        metodoPago: prev.metodoPago,
      }));
    } catch (err) {
      console.error(err);
      setFeedback({ type: "error", text: "Ocurrió un error al guardar. Intenta de nuevo." });
    } finally {
      setSubmitting(false);
    }
  }

  const esTarjetaCredito = form.metodoPago === "tarjeta_credito";

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
        <input type="text" placeholder="Ej. Laptop" value={form.concepto}
          onChange={(e) => handleChange("concepto", e.target.value)} required className={inputClass} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 dark:text-slate-300 mb-1">Monto total</label>
        <input type="number" step="0.01" min="0" placeholder="0.00" value={form.monto}
          onChange={(e) => handleChange("monto", e.target.value)} required className={inputClass} />
        {form.esMSI && form.msiMeses && Number(form.msiMeses) >= 2 && Number(form.monto) > 0 && (
          <p className="text-xs text-gray-400 dark:text-slate-500 mt-1">
            ${(Number(form.monto) / Number(form.msiMeses)).toFixed(2)} / mes
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 dark:text-slate-300 mb-1">Método de pago</label>
        <select value={form.metodoPago} onChange={(e) => handleChange("metodoPago", e.target.value)} className={inputClass}>
          {METODOS_PAGO.map((m) => (
            <option key={m.id} value={m.id}>{m.label}</option>
          ))}
        </select>
      </div>

      {/* Toggle MSI — solo visible con tarjeta de crédito */}
      {esTarjetaCredito && (
        <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-300">
          <input
            type="checkbox"
            checked={form.esMSI}
            onChange={(e) => handleChange("esMSI", e.target.checked)}
            className="w-4 h-4 rounded border-gray-300 dark:border-slate-600 text-red-600 focus:ring-red-400"
          />
          Compra a meses sin intereses (MSI)
        </label>
      )}

      {/* Campos MSI */}
      {esTarjetaCredito && (
        <MSIFields
          esMSI={form.esMSI}
          msiMeses={form.msiMeses}
          msiFechaInicio={form.msiFechaInicio}
          onChange={handleChange}
        />
      )}

      <div>
        <label className="block text-sm font-medium text-gray-600 dark:text-slate-300 mb-1">Lugar de compra</label>
        <input type="text" placeholder="Ej. Liverpool" value={form.lugar}
          onChange={(e) => handleChange("lugar", e.target.value)} className={inputClass} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 dark:text-slate-300 mb-1">Fecha de compra</label>
        <input type="date" value={form.fecha}
          onChange={(e) => handleChange("fecha", e.target.value)} required className={inputClass} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 dark:text-slate-300 mb-1">Categoría</label>
        <CategorySelector value={form.categoria} onChange={(value) => handleChange("categoria", value)} />
      </div>

      <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-slate-300">
        <input type="checkbox" checked={form.recurrente}
          onChange={(e) => handleChange("recurrente", e.target.checked)}
          className="w-4 h-4 rounded border-gray-300 dark:border-slate-600 text-red-600 focus:ring-red-400"
        />
        Este es un gasto recurrente (suscripción, servicio mensual, etc.)
      </label>

      <button type="submit" disabled={submitting}
        className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition">
        {submitting ? "Guardando..." : "Registrar gasto"}
      </button>
    </form>
  );
}