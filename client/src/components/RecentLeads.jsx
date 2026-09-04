import { ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const RecentLeads = ({ leads = [] }) => {
  const navigate = useNavigate();

  // Highest scoring leads first
  const recentLeads = [...leads]
    .sort((a, b) => b.score - a.score)
    .slice(0, 5);

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">
            Top Leads
          </h2>

          <p className="text-sm text-slate-500 mt-1">
            Highest scoring leads in your database.
          </p>
        </div>

        <button
          onClick={() => navigate("/leads")}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          View all
        </button>
      </div>

      {recentLeads.length === 0 ? (
        <div className="py-10 text-center">
          <p className="text-slate-500">
            No leads available.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {recentLeads.map((lead) => (
            <div
              key={lead._id}
              className="flex items-center justify-between gap-4 p-3 rounded-lg hover:bg-slate-50 border border-transparent hover:border-slate-100"
            >
              <div className="min-w-0">
                <p className="font-semibold text-slate-900 truncate">
                  {lead.company}
                </p>

                <p className="text-sm text-slate-500 truncate">
                  {lead.contact} · {lead.role}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <div className="text-right">
                  <p className="font-semibold text-slate-900">
                    {lead.score}/100
                  </p>

                  <span
                    className={`text-xs font-medium ${
                      lead.priority === "HOT"
                        ? "text-red-600"
                        : lead.priority === "WARM"
                        ? "text-amber-600"
                        : "text-slate-500"
                    }`}
                  >
                    {lead.priority}
                  </span>
                </div>

                <button
                  onClick={() =>
                    navigate(`/leads/${lead._id}`)
                  }
                  className="p-2 rounded-lg hover:bg-slate-100"
                  title="View lead"
                >
                  <ArrowUpRight
                    size={17}
                    className="text-slate-500"
                  />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RecentLeads;