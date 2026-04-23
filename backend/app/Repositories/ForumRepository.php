<?php

namespace App\Repositories;

use App\Models\Post;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class ForumRepository
{
    public function paginatePosts(int $perPage = 10, ?string $category = null): LengthAwarePaginator
    {
        return Post::query()
            ->with(['user:id,name', 'comments.user:id,name'])
            ->when($category, fn ($query) => $query->where('category', $category))
            ->latest()
            ->paginate($perPage);
    }
}
