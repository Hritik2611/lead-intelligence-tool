import { useEffect, useMemo, useState } from "react";
import {
  Search,
  SlidersHorizontal,
  ArrowUpRight,
  Plus,
  Download,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getLeads } from "../services/api";

const Leads = () => {
  const navigate = useNavigate();

  const [leads, setLeads] = useState([]);
  const [search, setSearch] = useState("");
  const [industry, setIndustry] = useState("All");
  const [priority, setPriority] = useState("All");
  const [minScore, setMinScore] = useState(0);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);

  const leadsPerPage = 5;

  // ==========================================
  // FETCH LEADS
  // ==========================================
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        setLoading(true);
        setError("");

        const data = await getLeads();

        setLeads(data);
      } catch (error) {
        console.error(error);
        setError("Failed to load leads");
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  // ==========================================
  // FILTER LEADS
  // ==========================================
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        (lead.company || "")
          .toLowerCase()
          .includes(searchText) ||
        (lead.contact || "")
          .toLowerCase()
          .includes(searchText);

      const matchesIndustry =
        industry === "All" ||
        lead.industry === industry;

      const matchesPriority =
        priority === "All" ||
        lead.priority === priority;

      const matchesScore =
        lead.score >= Number(minScore);

      return (
        matchesSearch &&
        matchesIndustry &&
        matchesPriority &&
        matchesScore
      );
    });
  }, [
    leads,
    search,
    industry,
    priority,
    minScore,
  ]);

  // ==========================================
  // RESET PAGE WHEN FILTER CHANGES
  // ==========================================
  useEffect(() => {
    setCurrentPage(1);
  }, [
    search,
    industry,
    priority,
    minScore,
  ]);

  // ==========================================
  // PAGINATION
  // ==========================================
  const totalPages = Math.ceil(
    filteredLeads.length / leadsPerPage
  );

  const startIndex =
    (currentPage - 1) * leadsPerPage;

  const endIndex =
    startIndex + leadsPerPage;

  const currentLeads = filteredLeads.slice(
    startIndex,
    endIndex
  );

  // ==========================================
  // CSV EXPORT
  // ==========================================
  const exportToCSV = () => {
    if (filteredLeads.length === 0) {
      return;
    }

    const headers = [
      "Company",
      "Contact",
      "Role",
      "Industry",
      "Location",
      "Employees",
      "Revenue",
      "Score",
      "Priority",
      "Website",
      "Email",
      "Phone",
      "LinkedIn",
    ];

    const escapeCSV = (value) => {
      if (
        value === null ||
        value === undefined
      ) {
        return "";
      }

      const stringValue = String(value);

      return `"${stringValue.replace(
        /"/g,
        '""'
      )}"`;
    };

    const rows = filteredLeads.map((lead) => [
      lead.company,
      lead.contact,
      lead.role,
      lead.industry,
      lead.location,
      lead.employees,
      lead.revenue,
      lead.score,
      lead.priority,
      lead.website,
      lead.email,
      lead.phone,
      lead.linkedin,
    ]);

    const csvContent = [
      headers.map(escapeCSV).join(","),
      ...rows.map((row) =>
        row.map(escapeCSV).join(",")
      ),
    ].join("\n");

    const BOM = "\uFEFF";

    const blob = new Blob(
      [BOM + csvContent],
      {
        type: "text/csv;charset=utf-8;",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download = `lead-intelligence-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    URL.revokeObjectURL(url);
  };

  // ==========================================
  // LOADING
  // ==========================================
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-slate-500">
          Loading leads...
        </p>
      </div>
    );
  }

  // ==========================================
  // ERROR
  // ==========================================
  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-xl p-6">
        <p className="text-red-600">
          {error}
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* ==========================================
          HEADER
      ========================================== */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            Leads
          </h1>

          <p className="mt-1 text-slate-500">
            Search, filter and prioritize your leads.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          {/* Export CSV */}
          <button
            onClick={exportToCSV}
            disabled={
              filteredLeads.length === 0
            }
            className="flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 bg-white text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Download size={18} />
            Export CSV
          </button>

          {/* Add Lead */}
          <button
            onClick={() =>
              navigate("/leads/new")
            }
            className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
          >
            <Plus size={18} />
            Add Lead
          </button>
        </div>
      </div>

      {/* ==========================================
          FILTERS
      ========================================== */}
      <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm mb-6">
        <div className="flex items-center gap-2 mb-4">
          <SlidersHorizontal
            size={18}
            className="text-slate-600"
          />

          <h2 className="font-semibold text-slate-800">
            Lead Filters
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {/* Search */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Search
            </label>

            <div className="relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />

              <input
                type="text"
                placeholder="Company or contact..."
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Industry */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Industry
            </label>

            <select
              value={industry}
              onChange={(e) =>
                setIndustry(e.target.value)
              }
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">
                All Industries
              </option>
              <option value="SaaS">
                SaaS
              </option>
              <option value="Technology">
                Technology
              </option>
              <option value="Marketing">
                Marketing
              </option>
              <option value="Analytics">
                Analytics
              </option>
              <option value="FinTech">
                FinTech
              </option>
            </select>
          </div>

          {/* Priority */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Priority
            </label>

            <select
              value={priority}
              onChange={(e) =>
                setPriority(e.target.value)
              }
              className="w-full px-3 py-2.5 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="All">
                All Priorities
              </option>
              <option value="HOT">
                Hot
              </option>
              <option value="WARM">
                Warm
              </option>
              <option value="COLD">
                Cold
              </option>
            </select>
          </div>

          {/* Minimum Score */}
          <div>
            <label className="block text-sm font-medium text-slate-600 mb-2">
              Minimum Score: {minScore}
            </label>

            <input
              type="range"
              min="0"
              max="100"
              value={minScore}
              onChange={(e) =>
                setMinScore(e.target.value)
              }
              className="w-full mt-3"
            />
          </div>
        </div>
      </div>

      {/* ==========================================
          TABLE
      ========================================== */}
      <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="font-semibold text-slate-800">
            {filteredLeads.length} Leads Found
          </h2>

          {filteredLeads.length > 0 && (
            <button
              onClick={exportToCSV}
              className="text-sm text-blue-600 hover:text-blue-700 font-medium"
            >
              Export{" "}
              {filteredLeads.length} leads
            </button>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="text-left px-5 py-3 font-medium text-slate-500">
                  Company
                </th>

                <th className="text-left px-5 py-3 font-medium text-slate-500">
                  Contact
                </th>

                <th className="text-left px-5 py-3 font-medium text-slate-500">
                  Industry
                </th>

                <th className="text-left px-5 py-3 font-medium text-slate-500">
                  Location
                </th>

                <th className="text-left px-5 py-3 font-medium text-slate-500">
                  Employees
                </th>

                <th className="text-left px-5 py-3 font-medium text-slate-500">
                  Score
                </th>

                <th className="text-left px-5 py-3 font-medium text-slate-500">
                  Priority
                </th>

                <th></th>
              </tr>
            </thead>

            <tbody>
              {currentLeads.map((lead) => (
                <tr
                  key={lead._id}
                  className="border-t border-slate-100 hover:bg-slate-50"
                >
                  {/* Company */}
                  <td className="px-5 py-4">
                    <p className="font-semibold text-slate-900">
                      {lead.company}
                    </p>
                  </td>

                  {/* Contact */}
                  <td className="px-5 py-4">
                    <p className="text-slate-800">
                      {lead.contact}
                    </p>

                    <p className="text-xs text-slate-500">
                      {lead.role}
                    </p>
                  </td>

                  {/* Industry */}
                  <td className="px-5 py-4 text-slate-600">
                    {lead.industry}
                  </td>

                  {/* Location */}
                  <td className="px-5 py-4 text-slate-600">
                    {lead.location}
                  </td>

                  {/* Employees */}
                  <td className="px-5 py-4 text-slate-600">
                    {lead.employees}
                  </td>

                  {/* Score */}
                  <td className="px-5 py-4">
                    <span className="font-semibold text-slate-900">
                      {lead.score}
                    </span>

                    <span className="text-slate-400">
                      /100
                    </span>
                  </td>

                  {/* Priority */}
                  <td className="px-5 py-4">
                    <span
                      className={`px-2.5 py-1 rounded-full text-xs font-medium ${
                        lead.priority ===
                        "HOT"
                          ? "bg-red-50 text-red-600"
                          : lead.priority ===
                            "WARM"
                          ? "bg-amber-50 text-amber-600"
                          : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {lead.priority}
                    </span>
                  </td>

                  {/* View */}
                  <td className="px-5 py-4">
                    <button
                      onClick={() =>
                        navigate(
                          `/leads/${lead._id}`
                        )
                      }
                      className="p-2 rounded-lg hover:bg-slate-100"
                      title="View lead"
                    >
                      <ArrowUpRight
                        size={18}
                        className="text-slate-500"
                      />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {filteredLeads.length === 0 && (
          <div className="py-12 text-center">
            <p className="text-slate-500">
              No leads found matching your
              filters.
            </p>
          </div>
        )}

        {/* ==========================================
            PAGINATION
        ========================================== */}
        {filteredLeads.length > 0 &&
          totalPages > 1 && (
            <div className="px-5 py-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-sm text-slate-500">
                Showing{" "}
                <span className="font-medium text-slate-700">
                  {startIndex + 1}
                </span>{" "}
                to{" "}
                <span className="font-medium text-slate-700">
                  {Math.min(
                    endIndex,
                    filteredLeads.length
                  )}
                </span>{" "}
                of{" "}
                <span className="font-medium text-slate-700">
                  {filteredLeads.length}
                </span>{" "}
                leads
              </p>

              <div className="flex items-center gap-2">
                {/* Previous */}
                <button
                  onClick={() =>
                    setCurrentPage(
                      (page) =>
                        Math.max(
                          page - 1,
                          1
                        )
                    )
                  }
                  disabled={currentPage === 1}
                  className="flex items-center gap-1 px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft size={16} />
                  Previous
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-1">
                  {Array.from(
                    { length: totalPages },
                    (_, index) => index + 1
                  ).map((page) => (
                    <button
                      key={page}
                      onClick={() =>
                        setCurrentPage(page)
                      }
                      className={`w-9 h-9 rounded-lg text-sm font-medium transition ${
                        currentPage === page
                          ? "bg-blue-600 text-white"
                          : "text-slate-600 hover:bg-slate-100"
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </div>

                {/* Next */}
                <button
                  onClick={() =>
                    setCurrentPage(
                      (page) =>
                        Math.min(
                          page + 1,
                          totalPages
                        )
                    )
                  }
                  disabled={
                    currentPage === totalPages
                  }
                  className="flex items-center gap-1 px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Next
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default Leads;