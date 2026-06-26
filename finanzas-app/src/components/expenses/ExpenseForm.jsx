// src/components/expenses/ExpenseForm.jsx
import { useState } from "react";
import { useTransactions } from "../../hooks/useTransactions";
import { CategorySelector } from "./CategorySelector";
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
};

export function ExpenseForm() {
  const [form, setForm] = useState(ESTADO_INICIAL);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState(null);

  const { addExpense } = useTransactions();

  function handleChange(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setFeedback(null);

    if (!form.concepto.trim() || !form.monto || !form.categoria) {
      setFeedback({ type: "error", text: "Completa todos los campos obligatorios." });
      return;
    }
    if (Number(form.monto) <= 0) {
      setFeedback({ type: "error", text: "El monto debe ser mayor a cero." });
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

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm p-6 max-w-md mx-auto space-y-4">
      {feedback && (
        <div
          className={`rounded-lg px-3 py-2 text-sm ${
            feedback.type === "success" ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"
          }`}
        >
          {feedback.text}
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Concepto</label>
        <input
          type="text"
          placeholder="Ej. Café con leche"
          value={form.concepto}
          onChange={(e) => handleChange("concepto", e.target.value)}
          required
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Monto</label>
        <input
          type="number"
          step="0.01"
          min="0"
          placeholder="0.00"
          value={form.monto}
          onChange={(e) => handleChange("monto", e.target.value)}
          required
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Método de pago</label>
        <select
          value={form.metodoPago}
          onChange={(e) => handleChange("metodoPago", e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-400 bg-white"
        >
          {METODOS_PAGO.map((m) => (
            <option key={m.id} value={m.id}>
              {m.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Lugar de compra</label>
        <input
          type="text"
          placeholder="Ej. Starbucks Plaza Central"
          value={form.lugar}
          onChange={(e) => handleChange("lugar", e.target.value)}
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Fecha</label>
        <input
          type="date"
          value={form.fecha}
          onChange={(e) => handleChange("fecha", e.target.value)}
          required
          className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-red-400"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-600 mb-1">Categoría</label>
        <CategorySelector value={form.categoria} onChange={(value) => handleChange("categoria", value)} />
      </div>

      <button
        type="submit"
        disabled={submitting}
        className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-semibold py-2.5 rounded-lg transition"
      >
        {submitting ? "Guardando..." : "Registrar gasto"}
      </button>
    </form>
  );
}