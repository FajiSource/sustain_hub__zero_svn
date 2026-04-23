import { useEffect, useState } from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import ProtectedRoute from "./components/ProtectedRoute";
import AppErrorBoundary from "./components/AppErrorBoundary";
import ToastViewport from "./components/ToastViewport";
import DashboardPage from "./pages/DashboardPage";
import ForumPage from "./pages/ForumPage";
import LoginPage from "./pages/LoginPage";
import { api } from "./lib/api";

function App() {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const hasToken = Boolean(localStorage.getItem("sustainhub_token"));

  useEffect(() => {
    if (!hasToken) {
      setAuthLoading(false);
      return;
    }

    api.get("/auth/me")
      .then((response) => setUser(response.data.user))
      .catch(() => {
        localStorage.removeItem("sustainhub_token");
        setUser(null);
      })
      .finally(() => setAuthLoading(false));
  }, [hasToken]);

  if (authLoading) {
    return <div className="flex min-h-screen items-center justify-center bg-slate-100 text-sm text-slate-600">Loading session...</div>;
  }

  return (
    <AppErrorBoundary>
      <BrowserRouter>
        <ToastViewport />
        <Routes>
          <Route path="/login" element={hasToken && user ? <Navigate to="/dashboard" replace /> : <LoginPage onSuccess={setUser} />} />
          <Route element={<ProtectedRoute user={user} />}>
            <Route element={<AppLayout user={user} />}>
              <Route path="/dashboard" element={<DashboardPage user={user} />} />
              <Route path="/forum" element={<ForumPage />} />
            </Route>
          </Route>
          <Route path="*" element={<Navigate to={hasToken && user ? "/dashboard" : "/login"} replace />} />
        </Routes>
      </BrowserRouter>
    </AppErrorBoundary>
  );
}

export default App;
