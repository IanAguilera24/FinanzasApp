// src/components/common/AppLayout.jsx
import { AppHeader } from "./AppHeader";
import { TabBar } from "./TabBar";

export function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      {/* pt-16 deja espacio para el header fijo de arriba (h-16 aprox) */}
      {/* pb-24 deja espacio para el TabBar fijo de abajo en móvil */}
      <main className="pt-16 pb-24 md:pb-6">{children}</main>
      <TabBar />
    </div>
  );
}