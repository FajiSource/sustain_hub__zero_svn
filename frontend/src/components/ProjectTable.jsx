import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import PaginationControls from "./PaginationControls";

export default function ProjectTable({ projects = [], user, page = 1, totalPages = 1, onPageChange = () => {} }) {
  const queryClient = useQueryClient();
  const joinMutation = useMutation({
    mutationFn: async (projectId) => api.post(`/projects/${projectId}/join`),
    onMutate: async (projectId) => {
      await queryClient.cancelQueries({ queryKey: ["projects"] });
      const previous = queryClient.getQueryData(["projects"]);
      queryClient.setQueriesData({ queryKey: ["projects"] }, (oldData) => oldData);
      window.dispatchEvent(new CustomEvent("app:toast", { detail: { type: "success", message: "Joined project." } }));
      return { previous, projectId };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["projects"], context.previous);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
  });
  const leaveMutation = useMutation({
    mutationFn: async (projectId) => api.post(`/projects/${projectId}/leave`),
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ["projects"] });
      const previous = queryClient.getQueryData(["projects"]);
      window.dispatchEvent(new CustomEvent("app:toast", { detail: { type: "success", message: "Left project." } }));
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["projects"], context.previous);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
  });
  const assignMutation = useMutation({
    mutationFn: async ({ projectId, userId }) =>
      api.post(`/projects/${projectId}/assign`, { user_id: Number(userId), role: "committee_member" }),
    onSuccess: () => {
      window.dispatchEvent(new CustomEvent("app:toast", { detail: { type: "success", message: "Student assigned." } }));
      queryClient.invalidateQueries({ queryKey: ["projects"] });
    },
  });
  const usersQuery = useQuery({
    queryKey: ["assignable-users"],
    queryFn: async () => (await api.get("/users?role=student&per_page=100")).data,
    enabled: ["admin", "leader"].includes(user?.role),
  });
  const assignableUsers = usersQuery.data?.data ?? [];

  return (
    <div className="rounded-2xl bg-white p-5 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900">Active Projects</h3>
      <div className="mt-4 overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="text-left text-slate-500">
            <tr>
              <th className="py-2">Project</th>
              <th className="py-2">Status</th>
              <th className="py-2">Progress</th>
              <th className="py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-t border-slate-100">
                <td className="py-3">{project.name}</td>
                <td className="py-3 capitalize">{project.status}</td>
                <td className="py-3">{project.progress}%</td>
                <td className="py-3">
                  <div className="flex gap-2">
                    <button className="rounded-lg bg-slate-900 px-3 py-1 text-xs text-white" onClick={() => joinMutation.mutate(project.id)}>Join</button>
                    <button className="rounded-lg border border-slate-200 px-3 py-1 text-xs" onClick={() => leaveMutation.mutate(project.id)}>Leave</button>
                    {["admin", "leader"].includes(user?.role) ? (
                      <select
                        className="rounded-lg border border-slate-200 px-2 py-1 text-xs"
                        defaultValue=""
                        onChange={(event) => {
                          if (!event.target.value) return;
                          assignMutation.mutate({ projectId: project.id, userId: event.target.value });
                          event.target.value = "";
                        }}
                      >
                        <option value="">Assign student...</option>
                        {assignableUsers.map((assignableUser) => (
                          <option key={assignableUser.id} value={assignableUser.id}>
                            {assignableUser.name}
                          </option>
                        ))}
                      </select>
                    ) : null}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <PaginationControls page={page} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  );
}
