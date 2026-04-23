import { useState } from "react";
import { api } from "../lib/api";

export default function LoginForm({ onSuccess }) {
  const [email, setEmail] = useState("admin@sustainhub.test");
  const [password, setPassword] = useState("password");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/login", { email, password });
      localStorage.setItem("sustainhub_token", response.data.token);
      onSuccess(response.data.user);
    } catch (err) {
      setError(err?.response?.data?.message ?? "Unable to login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={submit} className="w-full max-w-md rounded-2xl bg-white p-6 shadow-sm">
      <h2 className="text-2xl font-bold text-slate-900">SustainHub Login</h2>
      <p className="mt-1 text-sm text-slate-500">Sign in to access admin and student tools</p>
      <div className="mt-4 space-y-3">
        <input className="w-full rounded-xl border border-slate-200 px-3 py-2" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
        <input className="w-full rounded-xl border border-slate-200 px-3 py-2" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" />
      </div>
      {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}
      <button disabled={loading} className="mt-5 w-full rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:opacity-70">
        {loading ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
