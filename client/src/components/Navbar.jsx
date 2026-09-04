import { Bell } from "lucide-react";

const Navbar = () => {
  return (
    <header className="h-16 border-b border-slate-200 bg-white px-6 flex items-center justify-between">
      <div>
        <h2 className="text-lg font-semibold text-slate-800">
          Lead Intelligence
        </h2>

        <p className="text-sm text-slate-500">
          Find and prioritize your best leads
        </p>
      </div>

      <button className="p-2 rounded-lg hover:bg-slate-100">
        <Bell size={20} className="text-slate-600" />
      </button>
    </header>
  );
};

export default Navbar;