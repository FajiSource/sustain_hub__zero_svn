import { Suspense, lazy, useState } from "react";
import ProjectTable from "../components/ProjectTable";
import StatCard from "../components/StatCard";
import ActivityFeed from "../components/ActivityFeed";
import RoleGate from "../components/RoleGate";
import { useDashboardData } from "../hooks/useDashboardData";
import { useDebouncedValue } from "../hooks/useDebouncedValue";

const ScoreChart = lazy(() => import("../components/ScoreChart"));

export default function DashboardPage({ user }) {
  const [search, setSearch] = useState("");
  const [projectPage, setProjectPage] = useState(1);
  const [activityPage, setActivityPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search);
  const { projects, leaderboard, scorecard, recommendations, activityFeed } = useDashboardData(
    debouncedSearch,
    projectPage,
    activityPage
  );
  const projectRows = projects.data?.data ?? [];
  const projectMeta = projects.data?.meta ?? {};
  const scores = scorecard.data?.data ?? [];
  const board = leaderboard.data ?? [];
  const recommendationItems = recommendations.data?.recommendations ?? [];
  const feed = activityFeed.data?.data ?? [];
  const feedMeta = activityFeed.data?.meta ?? {};

  return (
    <>
      <section className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-sm text-slate-600">
            Signed in as <span className="font-semibold">{user.name}</span> ({user.role})
          </p>
          <input
            className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm sm:max-w-sm"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setProjectPage(1);
            }}
            placeholder="Search projects..."
          />
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <StatCard label="Projects" value={projectRows.length} />
        <StatCard label="Top Leader Score" value={board[0]?.total_score ?? 0} />
        <StatCard label="Recommendations" value={recommendationItems.length} />
      </section>

      <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <ProjectTable
          projects={projectRows}
          user={user}
          page={projectMeta.current_page ?? 1}
          totalPages={projectMeta.last_page ?? 1}
          onPageChange={setProjectPage}
        />
        <Suspense fallback={<div className="rounded-2xl bg-white p-5 shadow-sm">Loading chart...</div>}>
          <ScoreChart data={scores} />
        </Suspense>
      </section>

      <RoleGate user={user} roles={["admin", "leader"]}>
        <section className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm font-semibold text-slate-900">Management Mode Enabled</p>
          <p className="mt-1 text-sm text-slate-600">You can assign students to project committees from the project table.</p>
        </section>
      </RoleGate>

      <ActivityFeed
        items={feed}
        page={feedMeta.current_page ?? 1}
        totalPages={feedMeta.last_page ?? 1}
        onPageChange={setActivityPage}
      />

      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">AI Recommendations</h3>
        <ul className="mt-3 space-y-2 text-sm text-slate-700">
          {recommendationItems.map((item) => (
            <li key={item} className="rounded-xl bg-slate-50 px-4 py-2">
              {item}
            </li>
          ))}
        </ul>
      </section>
    </>
  );
}
