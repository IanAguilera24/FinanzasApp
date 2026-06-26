// src/components/common/TabBar.jsx
import { NavLink } from "react-router-dom";
import { LayoutDashboard, Wallet, History } from "lucide-react";

const TABS = [
  { to: "/", label: "Dashboard", Icon: LayoutDashboard },
  { to: "/movimientos", label: "Movimientos", Icon: Wallet },
  { to: "/historial", label: "Historial", Icon: History },
];

export function TabBar() {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-20 bg-white border-t border-gray-100 shadow-lg md:static md:border-b md:border-t-0 md:shadow-sm">
      <div className="flex justify-around md:justify-center md:gap-8 max-w-2xl mx-auto px-4 py-2 md:py-3">
        {TABS.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `flex flex-col items-center md:flex-row md:gap-2 px-3 py-1.5 rounded-lg text-xs md:text-sm font-medium transition ${
                isActive
                  ? "text-violet-600 bg-violet-50"
                  : "text-gray-500 hover:text-violet-500"
              }`
            }
          >
            <Icon size={20} strokeWidth={2} />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}