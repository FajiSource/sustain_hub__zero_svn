import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";

export function useDashboardData(search = "", projectPage = 1, activityPage = 1) {
  const projects = useQuery({
    queryKey: ["projects", search, projectPage],
    queryFn: async () => (await api.get(`/projects?per_page=8&page=${projectPage}&q=${encodeURIComponent(search)}`)).data,
  });

  const leaderboard = useQuery({
    queryKey: ["leaderboard"],
    queryFn: async () => (await api.get("/leaderboard")).data,
  });

  const scorecard = useQuery({
    queryKey: ["scorecard"],
    queryFn: async () => (await api.get("/scorecard?per_page=8")).data,
  });

  const recommendations = useQuery({
    queryKey: ["recommendations"],
    queryFn: async () => (await api.get("/recommendations")).data,
  });

  const activityFeed = useQuery({
    queryKey: ["activity-feed", activityPage],
    queryFn: async () => (await api.get(`/activity-feed?per_page=6&page=${activityPage}`)).data,
  });

  return { projects, leaderboard, scorecard, recommendations, activityFeed };
}
