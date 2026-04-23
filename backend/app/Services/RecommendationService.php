<?php

namespace App\Services;

use App\Models\Participation;
use App\Models\Project;
use App\Models\User;

class RecommendationService
{
    public function generate(): array
    {
        $activeProjects = Project::query()->where('status', 'active')->count();
        $activeParticipations = Participation::query()->where('status', 'active')->count();
        $inactiveLeaders = User::query()->where('role', 'leader')->doesntHave('projects')->count();

        $items = [];

        if ($activeProjects > 0 && $activeParticipations < ($activeProjects * 3)) {
            $items[] = 'Participation is low. Launch a new campaign and schedule campus-wide volunteer drives.';
        }

        if ($inactiveLeaders > 0) {
            $items[] = 'Some leaders are inactive. Trigger weekly progress reports and assignment reminders.';
        }

        if ($items === []) {
            $items[] = 'Engagement is healthy. Focus on recognition and share top-performing initiative playbooks.';
        }

        return $items;
    }
}
