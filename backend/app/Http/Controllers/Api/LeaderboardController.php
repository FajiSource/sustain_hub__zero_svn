<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Score;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class LeaderboardController extends Controller
{
    public function index(): JsonResponse
    {
        $data = Cache::remember('leaderboard:top20', 60, function () {
            return Score::query()
                ->with('user:id,name,department')
                ->orderByDesc('total_score')
                ->limit(20)
                ->get();
        });

        return response()->json($data);
    }
}
