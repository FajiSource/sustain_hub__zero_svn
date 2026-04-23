<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Score;
use App\Models\User;
use App\Services\ScorecardService;
use Illuminate\Http\JsonResponse;

class ScorecardController extends Controller
{
    public function __construct(
        private readonly ScorecardService $scorecardService,
    ) {
    }

    public function index(): JsonResponse
    {
        User::query()->select('id', 'department')->chunkById(50, function ($users): void {
            foreach ($users as $user) {
                $this->scorecardService->recomputeForUser($user);
            }
        });

        $scores = Score::query()
            ->with('user:id,name,department')
            ->orderByDesc('total_score')
            ->paginate((int) request()->integer('per_page', 10));

        return response()->json($scores);
    }
}
