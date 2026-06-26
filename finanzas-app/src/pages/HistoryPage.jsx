// src/pages/HistoryPage.jsx
import { HistoryTable } from "../components/history/HistoryTable";

export function HistoryPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-800 dark:text-slate-100 mb-6 text-center">
        Historial
      </h1>
      <HistoryTable />
    </div>
  );
}