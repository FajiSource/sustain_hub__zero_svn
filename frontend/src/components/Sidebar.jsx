import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Dashboard", to: "/dashboard" },
  { label: "Forum", to: "/forum" },
];

export default function Sidebar({ user }) {
  return (
    <aside className="w-full lg:w-64 rounded-2xl bg-white p-5 shadow-sm">
      <h1 className="text-2xl font-bold text-slate-900">SustainHub</h1>
      <p className="mt-1 text-sm text-slate-500">Leadership and engagement hub</p>
      {user ? <p className="mt-2 text-xs text-slate-500">{user.name} ({user.role})</p> : null}
      <nav className="mt-6 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            className={({ isActive }) =>
              `block w-full rounded-xl px-4 py-2 text-left text-sm font-medium ${
                isActive ? "bg-slate-900 text-white" : "text-slate-700 hover:bg-slate-100"
              }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
