<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    public function index(): JsonResponse
    {
        abort_unless(in_array(request()->user()->role, ['admin', 'leader'], true), 403);

        $role = request()->string('role')->value();
        $users = User::query()
            ->select(['id', 'name', 'email', 'role', 'department'])
            ->when($role, fn ($query) => $query->where('role', $role))
            ->orderBy('name')
            ->paginate((int) request()->integer('per_page', 20));

        return response()->json($users);
    }
}
