// src/components/common/AppHeader.jsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { LogOut, Settings } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { ConfirmModal } from "./ConfirmModal";

export function AppHeader() {
  const { user, logout } = useAuth();
  const [confirmando, setConfirmando] = useState(false);

  const nombreMostrar = user?.displayName?.split(" ")[0] || "Hola";

  async function handleLogout() {
    await logout();
    setConfirmando(false);
  }

  return (
    <header className="sticky top-0 z-20 bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <span className="font-bold text-gray-800 dark:text-slate-100">FinanzasApp</span>

        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600 dark:text-slate-300 hidden sm:inline mr-1">
            Hola, {nombreMostrar}
          </span>

          <Link
            to="/configuracion"
            className="flex items-center justify-center w-9 h-9 text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 transition"
            title="Configuración"
          >
            <Settings size={18} />
          </Link>

          <button
            onClick={() => setConfirmando(true)}
            className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-slate-400 hover:text-red-600 font-medium px-2 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition"
            title="Cerrar sesión"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </div>

      <ConfirmModal
        open={confirmando}
        title="¿Cerrar sesión?"
        message="Tendrás que volver a iniciar sesión para acceder a tus datos."
        confirmLabel="Cerrar sesión"
        onConfirm={handleLogout}
        onCancel={() => setConfirmando(false)}
      />
    </header>
  );
}