<?php

namespace App\Repositories;

use App\Models\Initiative;
use Illuminate\Contracts\Pagination\LengthAwarePaginator;

class InitiativeRepository
{
    public function paginate(int $perPage = 10): LengthAwarePaginator
    {
        return Initiative::query()
            ->withCount('projects')
            ->with('creator:id,name,role')
            ->latest()
            ->paginate($perPage);
    }
}
