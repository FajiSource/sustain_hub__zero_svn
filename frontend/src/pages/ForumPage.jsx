import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { api } from "../lib/api";
import PaginationControls from "../components/PaginationControls";

export default function ForumPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("environment");
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [commentText, setCommentText] = useState("");

  const forumQuery = useQuery({
    queryKey: ["forum", page],
    queryFn: async () => (await api.get(`/forum?per_page=10&page=${page}`)).data,
  });

  const createPost = useMutation({
    mutationFn: async (payload) => api.post("/forum/posts", payload),
    onSuccess: () => {
      setTitle("");
      setContent("");
      window.dispatchEvent(new CustomEvent("app:toast", { detail: { type: "success", message: "Post published." } }));
      queryClient.invalidateQueries({ queryKey: ["forum"] });
    },
  });

  const upvotePost = useMutation({
    mutationFn: async (postId) => api.post(`/forum/posts/${postId}/upvote`),
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: ["forum"] });
      const previous = queryClient.getQueryData(["forum", page]);
      queryClient.setQueryData(["forum", page], (oldData) => {
        if (!oldData?.data) return oldData;
        return {
          ...oldData,
          data: oldData.data.map((post) =>
            post.id === postId ? { ...post, upvotes: post.upvotes + 1 } : post
          ),
        };
      });
      return { previous };
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["forum", page], context.previous);
      }
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: ["forum"] }),
  });

  const addComment = useMutation({
    mutationFn: async ({ postId, payload }) => api.post(`/forum/posts/${postId}/comments`, payload),
    onMutate: async ({ postId, payload }) => {
      await queryClient.cancelQueries({ queryKey: ["forum"] });
      const previous = queryClient.getQueryData(["forum", page]);
      const optimisticComment = {
        id: `optimistic-${Date.now()}`,
        content: payload.content,
        user: { name: "You" },
      };
      queryClient.setQueryData(["forum", page], (oldData) => {
        if (!oldData?.data) return oldData;
        return {
          ...oldData,
          data: oldData.data.map((post) =>
            post.id === postId
              ? { ...post, comments: [...(post.comments ?? []), optimisticComment] }
              : post
          ),
        };
      });
      return { previous };
    },
    onSuccess: () => {
      setCommentText("");
      window.dispatchEvent(new CustomEvent("app:toast", { detail: { type: "success", message: "Comment added." } }));
      queryClient.invalidateQueries({ queryKey: ["forum"] });
    },
    onError: (_error, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(["forum", page], context.previous);
      }
    },
  });

  const posts = forumQuery.data?.data ?? [];
  const meta = forumQuery.data?.meta ?? {};
  const selectedPost = posts.find((post) => post.id === selectedPostId) ?? null;

  return (
    <div className="grid grid-cols-1 gap-4 xl:grid-cols-[1fr_1fr]">
      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <h2 className="text-xl font-semibold text-slate-900">Sustainability Forum</h2>
        <p className="mt-1 text-sm text-slate-500">Discuss initiatives, share updates, and collaborate.</p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            createPost.mutate({ title, content, category });
          }}
          className="mt-4 space-y-2"
        >
          <input className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Post title" value={title} onChange={(e) => setTitle(e.target.value)} />
          <textarea className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" rows={3} placeholder="What would you like to share?" value={content} onChange={(e) => setContent(e.target.value)} />
          <select className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm" value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="environment">Environment</option>
            <option value="leadership">Leadership</option>
            <option value="community">Community</option>
          </select>
          <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Create Post</button>
        </form>

        <ul className="mt-5 space-y-3">
          {posts.map((post) => (
            <li key={post.id} className="rounded-xl border border-slate-100 p-3">
              <button className="text-left" onClick={() => setSelectedPostId(post.id)}>
                <p className="font-semibold text-slate-900">{post.title}</p>
                <p className="mt-1 text-sm text-slate-600 line-clamp-2">{post.content}</p>
              </button>
              <div className="mt-2 flex items-center gap-2 text-xs text-slate-500">
                <span>{post.category}</span>
                <span>-</span>
                <span>{post.user?.name}</span>
                <button className="ml-auto rounded-lg bg-slate-100 px-2 py-1 text-slate-700" onClick={() => upvotePost.mutate(post.id)}>
                  Upvote ({post.upvotes})
                </button>
              </div>
            </li>
          ))}
        </ul>
        <PaginationControls
          page={meta.current_page ?? 1}
          totalPages={meta.last_page ?? 1}
          onPageChange={setPage}
        />
      </section>

      <section className="rounded-2xl bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Thread</h3>
        {!selectedPost ? (
          <p className="mt-3 text-sm text-slate-500">Select a forum post to open the discussion thread.</p>
        ) : (
          <>
            <p className="mt-3 font-semibold text-slate-900">{selectedPost.title}</p>
            <p className="mt-2 text-sm text-slate-700">{selectedPost.content}</p>
            <div className="mt-4 space-y-2">
              {selectedPost.comments?.map((comment) => (
                <div key={comment.id} className="rounded-lg bg-slate-50 px-3 py-2 text-sm">
                  <span className="font-semibold">{comment.user?.name}:</span> {comment.content}
                </div>
              ))}
            </div>
            <form
              className="mt-4 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                addComment.mutate({ postId: selectedPost.id, payload: { content: commentText } });
              }}
            >
              <input className="flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm" placeholder="Add a comment..." value={commentText} onChange={(e) => setCommentText(e.target.value)} />
              <button className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white">Send</button>
            </form>
          </>
        )}
      </section>
    </div>
  );
}
