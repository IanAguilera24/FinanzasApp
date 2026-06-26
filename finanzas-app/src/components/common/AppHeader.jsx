// src/components/common/AppHeader.jsx
import { useAuth } from "../../context/AuthContext";

export function AppHeader() {
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-20 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <span className="font-bold text-gray-800">FinanzasApp</span>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 hidden sm:inline truncate max-w-[180px]">
            {user?.email}
          </span>
          <button
            onClick={logout}
            className="text-sm text-red-500 hover:text-red-700 font-medium px-2 py-1 rounded-lg hover:bg-red-50 transition"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </header>
  );
}