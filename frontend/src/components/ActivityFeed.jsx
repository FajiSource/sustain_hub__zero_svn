import PaginationControls from "./PaginationControls";

export default function ActivityFeed({ items = [], page = 1, totalPages = 1, onPageChange = () => {} }) {
  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">Activity Feed</h3>
      <ul className="mt-4 space-y-2">
        {items.map((item) => (
          <li key={item.id} className="rounded-xl bg-slate-50 px-3 py-2 text-sm text-slate-700">
            <span className="font-semibold">{item.user?.name ?? "User"}</span> {item.action.replaceAll("_", " ")} on{" "}
            <span className="font-semibold">{item.project?.name ?? "project"}</span>
          </li>
        ))}
      </ul>
      <PaginationControls page={page} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  );
}
