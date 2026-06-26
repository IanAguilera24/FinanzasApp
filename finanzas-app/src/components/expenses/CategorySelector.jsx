// src/components/expenses/CategorySelector.jsx
import { useUserProfile } from "../../hooks/useUserProfile";

export function CategorySelector({ value, onChange }) {
  const { profile, loading } = useUserProfile();

  if (loading) {
    return (
      <select
        disabled
        className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-400 dark:text-slate-500"
      >
        <option>Cargando categorías...</option>
      </select>
    );
  }

  const categories = profile?.categories || [];

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required
      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-red-400"
    >
      <option value="" disabled>
        Selecciona una categoría
      </option>
      {categories.map((cat) => (
        <option key={cat.id} value={cat.id}>
          {cat.nombre}
        </option>
      ))}
    </select>
  );
}