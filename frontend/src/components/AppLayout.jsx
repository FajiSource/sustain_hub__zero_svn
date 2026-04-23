import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";

export default function AppLayout({ user }) {
  return (
    <div className="min-h-screen bg-slate-100 p-4 lg:p-8">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 lg:grid-cols-[16rem_1fr]">
        <Sidebar user={user} />
        <main className="space-y-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
