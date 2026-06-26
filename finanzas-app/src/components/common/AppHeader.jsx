// src/components/common/AppHeader.jsx
import { useState } from "react";
import { Settings, LogOut } from "lucide-react";
import { Link } from "react-router-dom";
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
    <header className="sticky top-0 z-20 bg-white border-b border-gray-100 shadow-sm">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <span className="font-bold text-gray-800">FinanzasApp</span>

        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-600 hidden sm:inline">
            Hola, {nombreMostrar}
          </span>
          <button
            onClick={() => setConfirmando(true)}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 font-medium px-2 py-1.5 rounded-lg hover:bg-red-50 transition"
            title="Cerrar sesión"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </div>
      </div>

      <Link
        to="/configuracion"
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 font-medium px-2 py-1.5 rounded-lg hover:bg-gray-100 transition"
        title="Configuración"
      >
        <Settings size={16} />
      </Link>
      
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