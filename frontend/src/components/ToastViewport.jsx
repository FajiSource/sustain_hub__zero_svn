import { useEffect, useState } from "react";

export default function ToastViewport() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const handler = (event) => {
      const id = `${Date.now()}-${Math.random()}`;
      const toast = {
        id,
        type: event.detail?.type ?? "info",
        message: event.detail?.message ?? "Update received.",
      };
      setToasts((prev) => [...prev, toast]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((item) => item.id !== id));
      }, 2800);
    };

    window.addEventListener("app:toast", handler);
    return () => window.removeEventListener("app:toast", handler);
  }, []);

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`rounded-xl px-4 py-2 text-sm text-white shadow ${
            toast.type === "error" ? "bg-red-600" : "bg-slate-900"
          }`}
        >
          {toast.message}
        </div>
      ))}
    </div>
  );
}
