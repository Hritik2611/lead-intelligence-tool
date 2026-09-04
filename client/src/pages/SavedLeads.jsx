import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Bookmark,
  Trash2,
  ArrowRight,
  Loader2,
} from "lucide-react";
import { getLeadById } from "../services/api";

const SAVED_LEADS_KEY = "savedLeadIds";

const SavedLeads = () => {
  const navigate = useNavigate();

  const [savedLeads, setSavedLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedLeads = async () => {
    try {
      setLoading(true);

      const savedIds = JSON.parse(
        localStorage.getItem(SAVED_LEADS_KEY) || "[]"
      );

      if (!Array.isArray(savedIds) || savedIds.length === 0) {
        setSavedLeads([]);
        return;
      }

      const validLeads = [];
      const validIds = [];

      for (const id of savedIds) {
        try {
          // MongoDB ObjectId validation
          if (!/^[0-9a-fA-F]{24}$/.test(id)) {
            continue;
          }

          const lead = await getLeadById(id);

          if (lead) {
            validLeads.push(lead);
            validIds.push(id);
          }
        } catch (error) {
          console.warn(
            `Removing invalid saved lead ID: ${id}`
          );
        }
      }

      // Clean old / deleted IDs from localStorage
      localStorage.setItem(
        SAVED_LEADS_KEY,
        JSON.stringify(validIds)
      );

      setSavedLeads(validLeads);
    } catch (error) {
      console.error("Failed to fetch saved leads:", error);
      setSavedLeads([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSavedLeads();
  }, []);

  const removeSavedLead = (id) => {
    const savedIds = JSON.parse(
      localStorage.getItem(SAVED_LEADS_KEY) || "[]"
    );

    const updatedIds = savedIds.filter(
      (savedId) => savedId !== id
    );

    localStorage.setItem(
      SAVED_LEADS_KEY,
      JSON.stringify(updatedIds)
    );

    setSavedLeads((prev) =>
      prev.filter((lead) => lead._id !== id)
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2
          size={32}
          className="animate-spin text-blue-600"
        />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          Saved Leads
        </h1>

        <p className="text-slate-500 mt-1">
          Leads you saved for later follow-up.
        </p>
      </div>

      {/* Empty State */}
      {savedLeads.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-xl p-12 text-center">
          <Bookmark
            size={42}
            className="mx-auto text-slate-300 mb-4"
          />

          <h2 className="text-lg font-semibold text-slate-700">
            No saved leads
          </h2>

          <p className="text-sm text-slate-500 mt-2">
            Save leads from the lead details page to see them
            here.
          </p>

          <button
            onClick={() => navigate("/leads")}
            className="mt-6 px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Browse Leads
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {savedLeads.map((lead) => (
            <div
              key={lead._id}
              className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-sm transition"
            >
              <div className="flex items-start justify-between gap-4">
                {/* Lead Info */}
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">
                    {lead.company}
                  </h2>

                  <p className="text-sm text-slate-500 mt-1">
                    {lead.contact}
                  </p>

                  <p className="text-sm text-slate-500">
                    {lead.role}
                  </p>
                </div>

                {/* Score */}
                <div className="text-right">
                  <p className="text-xs text-slate-400">
                    SCORE
                  </p>

                  <p className="text-xl font-bold text-slate-800">
                    {lead.score}
                    <span className="text-sm font-normal text-slate-400">
                      /100
                    </span>
                  </p>
                </div>
              </div>

              {/* Details */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-5 pt-5 border-t border-slate-100">
                <div>
                  <p className="text-xs text-slate-400">
                    INDUSTRY
                  </p>

                  <p className="text-sm text-slate-700 mt-1">
                    {lead.industry || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    LOCATION
                  </p>

                  <p className="text-sm text-slate-700 mt-1">
                    {lead.location || "N/A"}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    EMPLOYEES
                  </p>

                  <p className="text-sm text-slate-700 mt-1">
                    {lead.employees || 0}
                  </p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">
                    PRIORITY
                  </p>

                  <p
                    className={`inline-block text-xs font-semibold px-3 py-1 rounded-full mt-1 ${
                      lead.priority === "HOT"
                        ? "bg-red-100 text-red-600"
                        : lead.priority === "WARM"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {lead.priority}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 mt-5">
                <button
                  onClick={() => removeSavedLead(lead._id)}
                  className="flex items-center gap-2 px-4 py-2 border border-slate-200 text-slate-600 rounded-lg hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition"
                >
                  <Trash2 size={16} />
                  Remove
                </button>

                <button
                  onClick={() =>
                    navigate(`/leads/${lead._id}`)
                  }
                  className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  View Details
                  <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedLeads;