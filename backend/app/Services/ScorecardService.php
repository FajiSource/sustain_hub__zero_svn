<?php

namespace App\Services;

use App\Models\Participation;
use App\Models\Point;
use App\Models\Score;
use App\Models\User;

class ScorecardService
{
    public function recomputeForUser(User $user): Score
    {
        $participationScore = Participation::query()->where('user_id', $user->id)->count() * 10;
        $taskScore = Participation::query()->where('user_id', $user->id)->sum('hours');
        $submissionScore = Point::query()->where('user_id', $user->id)->sum('amount');

        return Score::query()->updateOrCreate(
            ['user_id' => $user->id],
            [
                'department' => $user->department,
                'participation_score' => $participationScore,
                'task_score' => $taskScore,
                'submission_score' => $submissionScore,
                'total_score' => $participationScore + $taskScore + $submissionScore,
            ],
        );
    }
}
