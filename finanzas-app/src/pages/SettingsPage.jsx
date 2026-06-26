// src/pages/SettingsPage.jsx
import { useState } from "react";
import { Check, Moon, Sun, AlertTriangle } from "lucide-react";
import { updateProfile } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { db } from "../firebase/config";
import { COLORES_DISPONIBLES, cumpleContrasteMinimo } from "../utils/colorUtils";

export function SettingsPage() {
  const { user } = useAuth();
  const { colorId, modoOscuro, cambiarColor, cambiarModoOscuro } = useTheme();
  const [nombre, setNombre] = useState(user?.displayName || "");
  const [guardando, setGuardando] = useState(false);
  const [feedback, setFeedback] = useState(null);

  async function handleGuardarNombre(e) {
    e.preventDefault();
    if (!nombre.trim()) return;

    setGuardando(true);
    setFeedback(null);
    try {
      await updateProfile(user, { displayName: nombre.trim() });
      await updateDoc(doc(db, "users", user.uid), { displayName: nombre.trim() });
      setFeedback({ type: "success", text: "Nombre actualizado." });
    } catch (err) {
      console.error(err);
      setFeedback({ type: "error", text: "No se pudo actualizar el nombre." });
    } finally {
      setGuardando(false);
    }
  }

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100">Configuración</h1>

      <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6">
        <h2 className="font-semibold text-gray-700 dark:text-slate-200 mb-1">Tu nombre</h2>
        <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">
          Inicias sesión con {user?.email}. Este nombre es solo para mostrarte un saludo personalizado.
        </p>
        <form onSubmit={handleGuardarNombre} className="flex gap-3">
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Tu nombre"
            className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-100 ring-primary"
          />
          <button
            type="submit"
            disabled={guardando}
            className="btn-primary px-5 py-2.5 rounded-lg font-medium transition disabled:opacity-50"
          >
            {guardando ? "Guardando..." : "Guardar"}
          </button>
        </form>
        {feedback && (
          <p className={`text-sm mt-3 ${feedback.type === "success" ? "text-emerald-600 dark:text-emerald-400" : "text-red-600 dark:text-red-400"}`}>
            {feedback.text}
          </p>
        )}
      </section>

      <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6">
        <h2 className="font-semibold text-gray-700 dark:text-slate-200 mb-4">Apariencia</h2>
        <div className="flex gap-3">
          <button
            onClick={() => cambiarModoOscuro(false)}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-medium transition"
            style={
              !modoOscuro
                ? { borderColor: "var(--color-primary)", color: "var(--color-primary)" }
                : { borderColor: "#e5e7eb", color: "#6b7280" }
            }
          >
            <Sun size={18} />
            Claro
          </button>
          <button
            onClick={() => cambiarModoOscuro(true)}
            className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border-2 font-medium transition"
            style={
              modoOscuro
                ? { borderColor: "var(--color-primary)", color: "var(--color-primary)" }
                : { borderColor: "#e5e7eb", color: "#6b7280" }
            }
          >
            <Moon size={18} />
            Oscuro
          </button>
        </div>
      </section>

      <section className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm p-6">
        <h2 className="font-semibold text-gray-700 dark:text-slate-200 mb-1">Color principal</h2>
        <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">
          Se usa en la navegación y botones generales. Los gastos siempre se muestran en rojo y los ingresos en verde.
        </p>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-3">
          {COLORES_DISPONIBLES.map((color) => {
            const advertencia = !cumpleContrasteMinimo(color.hex);
            return (
              <button key={color.id} onClick={() => cambiarColor(color.id)} className="flex flex-col items-center gap-1.5 group relative">
                <span
                  className="w-12 h-12 rounded-full flex items-center justify-center transition group-hover:scale-105"
                  style={{
                    backgroundColor: color.hex,
                    boxShadow: colorId === color.id ? `0 0 0 2px white, 0 0 0 4px ${color.hex}` : "none",
                  }}
                >
                  {colorId === color.id && <Check size={18} color="#fff" />}
                </span>
                {advertencia && (
                  <span className="absolute -top-1 -right-1 bg-white dark:bg-slate-800 rounded-full">
                    <AlertTriangle size={14} className="text-amber-500" />
                  </span>
                )}
                <span className="text-xs text-gray-500 dark:text-slate-400">{color.label}</span>
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}