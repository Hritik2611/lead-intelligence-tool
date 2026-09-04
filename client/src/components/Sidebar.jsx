import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Bookmark,
  Building2,
} from "lucide-react";

const Sidebar = () => {
  const menuItems = [
    {
      name: "Dashboard",
      path: "/",
      icon: LayoutDashboard,
    },
    {
      name: "Leads",
      path: "/leads",
      icon: Users,
    },
    {
      name: "Saved Leads",
      path: "/saved-leads",
      icon: Bookmark,
    },
    {
      name: "Real Companies",
      path: "/real-companies",
      icon: Building2,
    },
  ];

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white p-4">
      <div className="mb-8 px-3">
        <h1 className="text-xl font-bold">Lead Intelligence</h1>
        <p className="text-xs text-slate-400 mt-1">
          Lead Generation Platform
        </p>
      </div>

      <nav className="space-y-2">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-3 rounded-lg transition ${
                  isActive
                    ? "bg-blue-600 text-white"
                    : "text-slate-300 hover:bg-slate-800 hover:text-white"
                }`
              }
            >
              <Icon size={20} />
              <span>{item.name}</span>
            </NavLink>
          );
        })}
      </nav>
    </aside>
  );
};

export default Sidebar;