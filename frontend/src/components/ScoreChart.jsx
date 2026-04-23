import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export default function ScoreChart({ data = [] }) {
  const chartData = data.map((item) => ({
    name: item?.user?.name ?? "N/A",
    score: item.total_score,
  }));

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">Department Scorecard</h3>
      <div className="mt-4 h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <XAxis dataKey="name" hide />
            <YAxis />
            <Tooltip />
            <Bar dataKey="score" fill="#0f172a" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
