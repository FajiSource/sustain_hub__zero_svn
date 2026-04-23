<?php

namespace App\Services;

use App\Models\Comment;
use App\Models\Post;

class ForumService
{
    public function createPost(array $payload, int $userId): Post
    {
        $payload['user_id'] = $userId;

        return Post::query()->create($payload);
    }

    public function createComment(Post $post, array $payload, int $userId): Comment
    {
        $payload['user_id'] = $userId;

        return $post->comments()->create($payload);
    }
}
