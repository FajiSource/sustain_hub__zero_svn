<?php

namespace Database\Seeders;

use App\Models\Badge;
use App\Models\Initiative;
use App\Models\Participation;
use App\Models\Point;
use App\Models\Post;
use App\Models\Project;
use App\Models\Score;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $admin = User::query()->create([
            'name' => 'Sustain Admin',
            'email' => 'admin@sustainhub.test',
            'password' => Hash::make('password'),
            'role' => 'admin',
            'department' => 'Operations',
        ]);

        $leaders = User::factory()->count(4)->create(['role' => 'leader']);
        $students = User::factory()->count(20)->create(['role' => 'student']);

        $initiative = Initiative::query()->create([
            'title' => 'Campus Zero Waste Sprint',
            'description' => 'Cross-department waste reduction and reporting initiative.',
            'category' => 'environment',
            'status' => 'active',
            'progress' => 42,
            'deadline' => now()->addMonths(3)->toDateString(),
            'created_by' => $admin->id,
        ]);

        $projects = collect([
            ['name' => 'Dorm Compost Program', 'committee_name' => 'Green Committee'],
            ['name' => 'Plastic-Free Cafeteria', 'committee_name' => 'Food Council'],
            ['name' => 'Bike-to-Campus Campaign', 'committee_name' => 'Mobility Team'],
        ])->map(function (array $row) use ($initiative) {
            return Project::query()->create([
                'initiative_id' => $initiative->id,
                'name' => $row['name'],
                'description' => 'Execution stream for initiative goals.',
                'status' => 'active',
                'progress' => fake()->numberBetween(15, 80),
                'deadline' => now()->addWeeks(fake()->numberBetween(4, 12))->toDateString(),
                'committee_name' => $row['committee_name'],
            ]);
        });

        foreach ($students->shuffle()->take(12) as $student) {
            $project = $projects->random();
            Participation::query()->updateOrCreate(
                ['user_id' => $student->id, 'project_id' => $project->id],
                ['role' => 'volunteer', 'hours' => fake()->numberBetween(2, 18), 'status' => 'active'],
            );
            Point::query()->create([
                'user_id' => $student->id,
                'amount' => fake()->numberBetween(10, 120),
                'reason' => 'Volunteer contribution',
            ]);
        }

        Badge::query()->insert([
            ['name' => 'Green Starter', 'description' => 'Reached 100 eco points', 'threshold' => 100, 'created_at' => now(), 'updated_at' => now()],
            ['name' => 'Impact Leader', 'description' => 'Reached 300 eco points', 'threshold' => 300, 'created_at' => now(), 'updated_at' => now()],
        ]);

        foreach ($students->take(6) as $student) {
            Post::query()->create([
                'user_id' => $student->id,
                'title' => fake()->sentence(5),
                'content' => fake()->paragraph(3),
                'category' => fake()->randomElement(['environment', 'leadership', 'community']),
                'upvotes' => fake()->numberBetween(0, 30),
            ]);
        }

        foreach (User::query()->get() as $user) {
            Score::query()->updateOrCreate(
                ['user_id' => $user->id],
                [
                    'department' => $user->department,
                    'participation_score' => fake()->numberBetween(0, 60),
                    'task_score' => fake()->numberBetween(0, 60),
                    'submission_score' => fake()->numberBetween(0, 80),
                    'total_score' => fake()->numberBetween(30, 200),
                ],
            );
        }
    }
}
