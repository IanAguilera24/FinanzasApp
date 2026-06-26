// src/components/common/TabBar.jsx
import { NavLink } from "react-router-dom";

const TABS = [
  { to: "/", label: "Dashboard", icon: "📊" },
  { to: "/gastos", label: "Gastos", icon: "💸" },
  { to: "/ingresos", label: "Ingresos", icon: "💰" },
  { to: "/historial", label: "Historial", icon: "📋" },
];

export function TabBar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-gray-100 shadow-lg md:static md:border-b md:border-t-0 md:shadow-sm md:order-first">
      <div className="flex justify-around md:justify-center md:gap-8 max-w-2xl mx-auto px-4 py-2 md:py-3">
        {TABS.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            end={tab.to === "/"}
            className={({ isActive }) =>
              `flex flex-col items-center md:flex-row md:gap-2 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition ${
                isActive
                  ? "text-violet-600 bg-violet-50"
                  : "text-gray-500 hover:text-violet-500"
              }`
            }
          >
            <span className="text-lg md:text-base">{tab.icon}</span>
            <span>{tab.label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}