export default function RoleGate({ user, roles, children }) {
  if (!user || !roles.includes(user.role)) {
    return null;
  }

  return children;
}
