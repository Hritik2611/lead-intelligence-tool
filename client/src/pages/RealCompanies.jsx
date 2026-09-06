import { useState } from "react";

import {
  Search,
  Building2,
  MapPin,
  ShieldCheck,
  Plus,
  Check,
} from "lucide-react";

import {
  createLead,
  searchCompanies,
} from "../services/api";

const RealCompanies = () => {
  const [query, setQuery] = useState("");

  const [companies, setCompanies] = useState([]);

  const [loading, setLoading] = useState(false);

  const [addingId, setAddingId] = useState(null);

  const [addedIds, setAddedIds] = useState([]);

  const [error, setError] = useState("");

  // SEARCH REAL COMPANIES
  const handleSearchCompanies = async (e) => {
    e.preventDefault();

    if (!query.trim()) {
      setError("Please enter a company name");
      return;
    }

    try {
      setLoading(true);

      setError("");

      setCompanies([]);

      const data = await searchCompanies(
        query.trim()
      );

      setCompanies(data || []);
    } catch (error) {
      console.error("SEARCH COMPANY ERROR:", error);

      setError(
        error.message || "Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  // ADD COMPANY TO LEADS
  const handleAddToLeads = async (company) => {
    try {
      setAddingId(company.lei);

      setError("");

      const leadData = {
        company: company.company,

        contact: "Not assigned",

        role: "Not assigned",

        industry: "Other",

        location: company.city
          ? `${company.city}, ${company.country}`
          : company.country || "Unknown",

        employees: 0,

        revenue: "Not available",

        website: "",

        email: "",

        phone: "",

        linkedin: "",
      };

      await createLead(leadData);

      setAddedIds((prev) => [
        ...prev,
        company.lei,
      ]);
    } catch (error) {
      console.error("ADD COMPANY ERROR:", error);

      setError(
        error.message ||
          "Failed to add company as lead"
      );
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div>
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">
          Real Company Search
        </h1>

        <p className="text-slate-500 mt-1">
          Discover real companies using public GLEIF data.
        </p>
      </div>

      {/* Search Form */}
      <form
        onSubmit={handleSearchCompanies}
        className="bg-white border border-slate-200 rounded-xl p-5 mb-6"
      >
        <div className="flex gap-3">
          <div className="relative flex-1">
            <Search
              size={20}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />

            <input
              type="text"
              placeholder="Search company e.g. Apple, Microsoft..."
              value={query}
              onChange={(e) =>
                setQuery(e.target.value)
              }
              className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading
              ? "Searching..."
              : "Search"}
          </button>
        </div>
      </form>

      {/* Error */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 mb-6">
          {error}
        </div>
      )}

      {/* Search Results */}
      {companies.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-800">
              Search Results
            </h2>

            <span className="text-sm text-slate-500">
              {companies.length} companies found
            </span>
          </div>

          {companies.map((company) => {
            const isAdded =
              addedIds.includes(company.lei);

            const isAdding =
              addingId === company.lei;

            return (
              <div
                key={company.lei}
                className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-sm transition"
              >
                {/* Company Header */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-lg bg-blue-50 flex items-center justify-center">
                      <Building2
                        className="text-blue-600"
                        size={24}
                      />
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold text-slate-800">
                        {company.company ||
                          "Unknown Company"}
                      </h3>

                      <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                        <MapPin size={15} />

                        <span>
                          {company.city ||
                            "Unknown City"}
                          ,{" "}
                          {company.country ||
                            "Unknown Country"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 text-sm text-green-600">
                    <ShieldCheck size={17} />

                    Verified LEI
                  </div>
                </div>

                {/* Company Information */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-5 pt-5 border-t border-slate-100">
                  <div>
                    <p className="text-xs text-slate-400 uppercase">
                      LEI
                    </p>

                    <p className="text-sm font-medium text-slate-700 mt-1 break-all">
                      {company.lei || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400 uppercase">
                      Entity Status
                    </p>

                    <p className="text-sm font-medium text-slate-700 mt-1">
                      {company.status || "N/A"}
                    </p>
                  </div>

                  <div>
                    <p className="text-xs text-slate-400 uppercase">
                      Registration
                    </p>

                    <p className="text-sm font-medium text-slate-700 mt-1">
                      {company.registrationStatus ||
                        "N/A"}
                    </p>
                  </div>
                </div>

                {/* Address */}
                {company.address && (
                  <div className="mt-4">
                    <p className="text-xs text-slate-400 uppercase">
                      Address
                    </p>

                    <p className="text-sm text-slate-600 mt-1">
                      {company.address}
                    </p>
                  </div>
                )}

                {/* Add To Leads Button */}
                <div className="mt-5 flex justify-end">
                  <button
                    onClick={() =>
                      handleAddToLeads(company)
                    }
                    disabled={isAdding || isAdded}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
                      isAdded
                        ? "bg-green-100 text-green-700 cursor-default"
                        : "bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
                    }`}
                  >
                    {isAdded ? (
                      <>
                        <Check size={17} />
                        Added to Leads
                      </>
                    ) : (
                      <>
                        <Plus size={17} />

                        {isAdding
                          ? "Adding..."
                          : "Add to Leads"}
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {!loading &&
        !error &&
        companies.length === 0 && (
          <div className="bg-white border border-dashed border-slate-300 rounded-xl p-12 text-center">
            <Building2
              size={40}
              className="mx-auto text-slate-300 mb-3"
            />

            <h3 className="text-lg font-semibold text-slate-700">
              Search for a real company
            </h3>

            <p className="text-sm text-slate-500 mt-1">
              Enter a company name above to discover
              public company data.
            </p>
          </div>
        )}
    </div>
  );
};

export default RealCompanies;
