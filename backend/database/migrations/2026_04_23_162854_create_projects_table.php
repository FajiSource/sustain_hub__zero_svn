<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->foreignId('initiative_id')->constrained()->cascadeOnDelete()->index();
            $table->string('name')->index();
            $table->text('description');
            $table->enum('status', ['planned', 'active', 'completed', 'paused'])->default('planned')->index();
            $table->unsignedTinyInteger('progress')->default(0);
            $table->date('deadline')->nullable()->index();
            $table->string('committee_name')->nullable()->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('projects');
    }
};
