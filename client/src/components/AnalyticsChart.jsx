import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const AnalyticsChart = ({ leads = [] }) => {
  const hot = leads.filter(
    (lead) => lead.priority === "HOT"
  ).length;

  const warm = leads.filter(
    (lead) => lead.priority === "WARM"
  ).length;

  const cold = leads.filter(
    (lead) => lead.priority === "COLD"
  ).length;

  const chartData = [
    {
      name: "Hot",
      leads: hot,
    },
    {
      name: "Warm",
      leads: warm,
    },
    {
      name: "Cold",
      leads: cold,
    },
  ];

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6">
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-slate-900">
          Lead Priority Analytics
        </h2>

        <p className="text-sm text-slate-500 mt-1">
          Distribution of leads by priority.
        </p>
      </div>

      <div className="h-[300px]">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />

            <XAxis dataKey="name" />

            <YAxis allowDecimals={false} />

            <Tooltip />

            <Bar
              dataKey="leads"
              name="Leads"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default AnalyticsChart;