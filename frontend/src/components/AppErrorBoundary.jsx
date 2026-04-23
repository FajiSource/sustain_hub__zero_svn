import React from "react";

export default class AppErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error) {
    window.dispatchEvent(
      new CustomEvent("app:toast", {
        detail: { type: "error", message: error?.message ?? "Unexpected UI error." },
      })
    );
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
          <div className="rounded-2xl bg-white p-6 text-center shadow-sm">
            <p className="text-lg font-semibold text-slate-900">Something went wrong</p>
            <p className="mt-1 text-sm text-slate-600">Please refresh the page or sign in again.</p>
            <button className="mt-4 rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white" onClick={() => window.location.reload()}>
              Reload
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
