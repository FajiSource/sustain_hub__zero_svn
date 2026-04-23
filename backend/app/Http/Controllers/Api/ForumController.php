<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CommentStoreRequest;
use App\Http\Requests\PostStoreRequest;
use App\Models\Post;
use App\Repositories\ForumRepository;
use App\Services\ForumService;
use Illuminate\Http\JsonResponse;

class ForumController extends Controller
{
    public function __construct(
        private readonly ForumRepository $repository,
        private readonly ForumService $service,
    ) {
    }

    public function index(): JsonResponse
    {
        $perPage = (int) request()->integer('per_page', 10);
        $category = request()->string('category')->value();

        return response()->json($this->repository->paginatePosts($perPage, $category));
    }

    public function storePost(PostStoreRequest $request): JsonResponse
    {
        $post = $this->service->createPost($request->validated(), $request->user()->id);
        return response()->json($post, 201);
    }

    public function storeComment(CommentStoreRequest $request, Post $post): JsonResponse
    {
        $comment = $this->service->createComment($post, $request->validated(), $request->user()->id);
        return response()->json($comment, 201);
    }

    public function upvote(Post $post): JsonResponse
    {
        $post->increment('upvotes');
        return response()->json(['upvotes' => $post->fresh()->upvotes]);
    }
}
