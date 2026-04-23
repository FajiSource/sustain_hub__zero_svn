<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\InitiativeStoreRequest;
use App\Http\Requests\InitiativeUpdateRequest;
use App\Models\Initiative;
use App\Repositories\InitiativeRepository;
use App\Services\InitiativeService;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Cache;

class InitiativeController extends Controller
{
    public function __construct(
        private readonly InitiativeRepository $repository,
        private readonly InitiativeService $service,
    ) {
    }

    public function index(): JsonResponse
    {
        $perPage = (int) request()->integer('per_page', 10);
        $cacheKey = "initiatives:page:" . request()->integer('page', 1) . ":{$perPage}";
        $data = Cache::remember($cacheKey, 60, fn () => $this->repository->paginate($perPage));

        return response()->json($data);
    }

    public function store(InitiativeStoreRequest $request): JsonResponse
    {
        $this->authorizeRole(['admin', 'leader']);
        $initiative = $this->service->create($request->validated(), $request->user()->id);

        return response()->json($initiative, 201);
    }

    public function show(Initiative $initiative): JsonResponse
    {
        $initiative->load(['creator:id,name', 'projects']);
        return response()->json($initiative);
    }

    public function update(InitiativeUpdateRequest $request, Initiative $initiative): JsonResponse
    {
        $this->authorizeRole(['admin', 'leader']);
        $initiative->update($request->validated());

        return response()->json($initiative->refresh());
    }

    public function destroy(Initiative $initiative): JsonResponse
    {
        $this->authorizeRole(['admin']);
        $initiative->delete();

        return response()->json([], 204);
    }

    private function authorizeRole(array $roles): void
    {
        abort_unless(in_array(request()->user()?->role, $roles, true), 403);
    }
}
