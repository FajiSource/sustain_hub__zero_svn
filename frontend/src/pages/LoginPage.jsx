import LoginForm from "../components/LoginForm";

export default function LoginPage({ onSuccess }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <LoginForm onSuccess={onSuccess} />
    </div>
  );
}
