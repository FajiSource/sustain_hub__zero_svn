<?php

namespace App\Services;

use App\Models\Project;
use Illuminate\Support\Facades\DB;

class ProjectService
{
    public function create(array $payload): Project
    {
        return DB::transaction(fn (): Project => Project::query()->create($payload));
    }
}
