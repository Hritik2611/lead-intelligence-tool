import { useEffect, useMemo, useState } from "react";
import {
  Users,
  Flame,
  UserRoundCheck,
  Target,
  Snowflake,
  Building2,
  MapPin,
  TrendingUp,
} from "lucide-react";

import SummaryCard from "../components/SummaryCard";
import AnalyticsChart from "../components/AnalyticsChart";
import RecentLeads from "../components/RecentLeads";
import { getLeads } from "../services/api";

const Dashboard = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const data = await getLeads();
        setLeads(data);
      } catch (error) {
        console.error(
          "Failed to load dashboard data:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchLeads();
  }, []);

  // ==========================================
  // BASIC STATS
  // ==========================================

  const totalLeads = leads.length;

  const hotLeads = leads.filter(
    (lead) => lead.priority === "HOT"
  ).length;

  const warmLeads = leads.filter(
    (lead) => lead.priority === "WARM"
  ).length;

  const coldLeads = leads.filter(
    (lead) => lead.priority === "COLD"
  ).length;

  const averageScore =
    totalLeads > 0
      ? Math.round(
          leads.reduce(
            (sum, lead) =>
              sum + Number(lead.score || 0),
            0
          ) / totalLeads
        )
      : 0;

  // ==========================================
  // TOP INDUSTRY
  // ==========================================

  const topIndustry = useMemo(() => {
    if (leads.length === 0) {
      return "N/A";
    }

    const industryCount = {};

    leads.forEach((lead) => {
      const industry =
        lead.industry || "Unknown";

      industryCount[industry] =
        (industryCount[industry] || 0) + 1;
    });

    return Object.entries(industryCount).sort(
      (a, b) => b[1] - a[1]
    )[0][0];
  }, [leads]);

  // ==========================================
  // TOP LOCATION
  // ==========================================

  const topLocation = useMemo(() => {
    if (leads.length === 0) {
      return "N/A";
    }

    const locationCount = {};

    leads.forEach((lead) => {
      const location =
        lead.location || "Unknown";

      locationCount[location] =
        (locationCount[location] || 0) + 1;
    });

    return Object.entries(locationCount).sort(
      (a, b) => b[1] - a[1]
    )[0][0];
  }, [leads]);

  // ==========================================
  // HIGH PRIORITY PERCENTAGE
  // ==========================================

  const highPriorityPercentage =
    totalLeads > 0
      ? Math.round(
          ((hotLeads + warmLeads) /
            totalLeads) *
            100
        )
      : 0;

  // ==========================================
  // SUMMARY CARDS
  // ==========================================

  const stats = [
    {
      title: "Total Leads",
      value: totalLeads,
      change: "From MongoDB",
      icon: Users,
    },
    {
      title: "Hot Leads",
      value: hotLeads,
      change: "High priority",
      icon: Flame,
    },
    {
      title: "Warm Leads",
      value: warmLeads,
      change: "Medium priority",
      icon: UserRoundCheck,
    },
    {
      title: "Average Score",
      value: averageScore,
      change: "Out of 100",
      icon: Target,
    },
  ];

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-slate-500">
          Loading dashboard...
        </p>
      </div>
    );
  }

  return (
    <div>
      {/* ==========================================
          HEADER
      ========================================== */}

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">
          Dashboard
        </h1>

        <p className="mt-1 text-slate-500">
          Overview of your lead intelligence data.
        </p>
      </div>

      {/* ==========================================
          SUMMARY CARDS
      ========================================== */}

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <SummaryCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            change={stat.change}
            icon={stat.icon}
          />
        ))}
      </div>

      {/* ==========================================
          BUSINESS INSIGHTS
      ========================================== */}

      <div className="mt-6">
        <h2 className="text-lg font-semibold text-slate-800 mb-4">
          Lead Intelligence Insights
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
          {/* Cold Leads */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  Cold Leads
                </p>

                <p className="text-2xl font-bold text-slate-800 mt-1">
                  {coldLeads}
                </p>
              </div>

              <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center">
                <Snowflake
                  size={20}
                  className="text-slate-500"
                />
              </div>
            </div>

            <p className="text-xs text-slate-400 mt-3">
              Low priority leads
            </p>
          </div>

          {/* Top Industry */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-sm text-slate-500">
                  Top Industry
                </p>

                <p className="text-xl font-bold text-slate-800 mt-1 truncate">
                  {topIndustry}
                </p>
              </div>

              <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
                <Building2
                  size={20}
                  className="text-blue-600"
                />
              </div>
            </div>

            <p className="text-xs text-slate-400 mt-3">
              Most represented industry
            </p>
          </div>

          {/* Top Location */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-sm text-slate-500">
                  Top Location
                </p>

                <p className="text-xl font-bold text-slate-800 mt-1 truncate">
                  {topLocation}
                </p>
              </div>

              <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
                <MapPin
                  size={20}
                  className="text-green-600"
                />
              </div>
            </div>

            <p className="text-xs text-slate-400 mt-3">
              Most represented location
            </p>
          </div>

          {/* High Priority */}
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-500">
                  High Priority
                </p>

                <p className="text-2xl font-bold text-slate-800 mt-1">
                  {highPriorityPercentage}%
                </p>
              </div>

              <div className="w-10 h-10 rounded-lg bg-orange-50 flex items-center justify-center">
                <TrendingUp
                  size={20}
                  className="text-orange-600"
                />
              </div>
            </div>

            <p className="text-xs text-slate-400 mt-3">
              Hot + Warm leads
            </p>
          </div>
        </div>
      </div>

      {/* ==========================================
          ANALYTICS + RECENT LEADS
      ========================================== */}

      <div className="mt-6 grid grid-cols-1 xl:grid-cols-2 gap-6">
        <AnalyticsChart leads={leads} />

        <RecentLeads leads={leads} />
      </div>
    </div>
  );
};

export default Dashboard;