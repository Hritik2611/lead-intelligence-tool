const SummaryCard = ({ title, value, change, icon: Icon }) => {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">
          {title}
        </p>

        <div className="p-2 rounded-lg bg-blue-50">
          <Icon size={20} className="text-blue-600" />
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-2xl font-bold text-slate-900">
          {value}
        </h3>

        <p className="text-sm text-emerald-600 mt-1">
          {change}
        </p>
      </div>
    </div>
  );
};

export default SummaryCard;