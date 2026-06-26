// src/components/common/AppLayout.jsx
import { TabBar } from "./TabBar";

export function AppLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <TabBar />
      <main className="pb-20 md:pb-0">{children}</main>
    </div>
  );
}