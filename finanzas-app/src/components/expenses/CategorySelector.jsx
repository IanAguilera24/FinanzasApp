// src/components/expenses/CategorySelector.jsx
import { useUserProfile } from "../../hooks/useUserProfile";

export function CategorySelector({ value, onChange }) {
  const { profile, loading } = useUserProfile();

  if (loading) {
    return (
      <select disabled className="w-full px-4 py-2.5 rounded-lg border border-gray-200 text-gray-400">
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
      className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-violet-400 bg-white"
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