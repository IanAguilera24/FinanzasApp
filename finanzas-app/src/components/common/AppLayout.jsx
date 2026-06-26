// src/components/common/AppLayout.jsx
import { AppHeader } from "./AppHeader";
import { TabBar } from "./TabBar";

export function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 flex flex-col">
      <AppHeader />
      <TabBar />
      <main className="flex-1 pb-20 md:pb-6">{children}</main>
    </div>
  );
}