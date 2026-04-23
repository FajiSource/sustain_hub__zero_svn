<?php

namespace App\Services;

use App\Models\Initiative;

class InitiativeService
{
    public function create(array $payload, int $userId): Initiative
    {
        $payload['created_by'] = $userId;

        return Initiative::query()->create($payload);
    }
}
