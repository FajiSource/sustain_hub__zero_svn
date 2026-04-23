<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\ForumController;
use App\Http\Controllers\Api\InitiativeController;
use App\Http\Controllers\Api\LeaderboardController;
use App\Http\Controllers\Api\ProjectController;
use App\Http\Controllers\Api\RecommendationController;
use App\Http\Controllers\Api\ScorecardController;
use App\Http\Controllers\Api\UserController;
use Illuminate\Support\Facades\Route;

Route::prefix('auth')->group(function (): void {
    Route::post('register', [AuthController::class, 'register']);
    Route::post('login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function (): void {
        Route::get('me', [AuthController::class, 'me']);
        Route::post('logout', [AuthController::class, 'logout']);
    });
});

Route::middleware('auth:sanctum')->group(function (): void {
    Route::apiResource('projects', ProjectController::class);
    Route::post('projects/{project}/join', [ProjectController::class, 'join']);
    Route::post('projects/{project}/leave', [ProjectController::class, 'leave']);
    Route::post('projects/{project}/assign', [ProjectController::class, 'assign']);
    Route::get('activity-feed', [ProjectController::class, 'activityFeed']);
    Route::apiResource('initiatives', InitiativeController::class);

    Route::prefix('forum')->group(function (): void {
        Route::get('/', [ForumController::class, 'index']);
        Route::post('posts', [ForumController::class, 'storePost']);
        Route::post('posts/{post}/comments', [ForumController::class, 'storeComment']);
        Route::post('posts/{post}/upvote', [ForumController::class, 'upvote']);
    });

    Route::get('leaderboard', [LeaderboardController::class, 'index']);
    Route::get('scorecard', [ScorecardController::class, 'index']);
    Route::get('recommendations', [RecommendationController::class, 'index']);
    Route::get('users', [UserController::class, 'index']);
});
