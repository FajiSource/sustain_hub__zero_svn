<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\RecommendationService;
use Illuminate\Http\JsonResponse;

class RecommendationController extends Controller
{
    public function __construct(
        private readonly RecommendationService $recommendationService,
    ) {
    }

    public function index(): JsonResponse
    {
        return response()->json([
            'recommendations' => $this->recommendationService->generate(),
        ]);
    }
}
