<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AssignUserRequest;
use App\Http\Requests\ProjectStoreRequest;
use App\Http\Requests\ProjectUpdateRequest;
use App\Models\Activity;
use App\Models\Participation;
use App\Models\Project;
use App\Repositories\ProjectRepository;
use App\Services\ProjectService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class ProjectController extends Controller
{
    public function __construct(
        private readonly ProjectRepository $repository,
        private readonly ProjectService $service,
    ) {
    }

    public function index(): JsonResponse
    {
        $perPage = (int) request()->integer('per_page', 10);
        $search = request()->string('q')->value();
        $cacheKey = "projects:{$perPage}:{$search}:page:" . request()->integer('page', 1);

        $data = Cache::remember($cacheKey, 60, fn () => $this->repository->paginate($perPage, $search));
        return response()->json($data);
    }

    public function store(ProjectStoreRequest $request): JsonResponse
    {
        abort_unless(in_array($request->user()->role, ['admin', 'leader'], true), 403);
        $project = $this->service->create($request->validated());

        return response()->json($project, 201);
    }

    public function show(Project $project): JsonResponse
    {
        return response()->json($project->load(['initiative', 'participants']));
    }

    public function update(ProjectUpdateRequest $request, Project $project): JsonResponse
    {
        abort_unless(in_array($request->user()->role, ['admin', 'leader'], true), 403);
        $project->update($request->validated());

        return response()->json($project->refresh());
    }

    public function destroy(Project $project): JsonResponse
    {
        abort_unless(request()->user()->role === 'admin', 403);
        $project->delete();

        return response()->json([], 204);
    }

    public function join(Project $project): JsonResponse
    {
        $user = request()->user();
        Participation::query()->updateOrCreate(
            ['user_id' => $user->id, 'project_id' => $project->id],
            ['role' => 'volunteer', 'status' => 'active', 'hours' => 0],
        );

        Activity::query()->create([
            'project_id' => $project->id,
            'user_id' => $user->id,
            'action' => 'joined_project',
            'metadata' => ['project_name' => $project->name],
        ]);

        return response()->json(['message' => 'Joined project successfully.']);
    }

    public function leave(Project $project): JsonResponse
    {
        $user = request()->user();
        Participation::query()
            ->where('user_id', $user->id)
            ->where('project_id', $project->id)
            ->update(['status' => 'left']);

        Activity::query()->create([
            'project_id' => $project->id,
            'user_id' => $user->id,
            'action' => 'left_project',
            'metadata' => ['project_name' => $project->name],
        ]);

        return response()->json(['message' => 'Left project successfully.']);
    }

    public function assign(AssignUserRequest $request, Project $project): JsonResponse
    {
        abort_unless(in_array($request->user()->role, ['admin', 'leader'], true), 403);

        $payload = $request->validated();
        Participation::query()->updateOrCreate(
            ['user_id' => $payload['user_id'], 'project_id' => $project->id],
            ['role' => $payload['role'] ?? 'member', 'status' => 'active'],
        );

        Activity::query()->create([
            'project_id' => $project->id,
            'user_id' => $request->user()->id,
            'action' => 'assigned_user',
            'metadata' => ['assignee_id' => $payload['user_id']],
        ]);

        return response()->json(['message' => 'User assigned to project.']);
    }

    public function activityFeed(): JsonResponse
    {
        $items = Activity::query()
            ->with(['user:id,name', 'project:id,name'])
            ->latest()
            ->paginate((int) request()->integer('per_page', 10));

        return response()->json($items);
    }
}
