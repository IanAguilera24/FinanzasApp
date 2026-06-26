// src/components/common/AppLayout.jsx
import { AppHeader } from "./AppHeader";
import { TabBar } from "./TabBar";

export function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <AppHeader />
      <TabBar />
      {/* pb-20 solo aplica en móvil, donde el TabBar es fixed abajo */}
      <main className="flex-1 pb-20 md:pb-6">{children}</main>
    </div>
  );
}