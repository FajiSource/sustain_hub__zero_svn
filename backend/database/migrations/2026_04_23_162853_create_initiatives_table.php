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
        Schema::create('initiatives', function (Blueprint $table) {
            $table->id();
            $table->foreignId('created_by')->constrained('users')->cascadeOnDelete()->index();
            $table->string('title')->index();
            $table->text('description');
            $table->string('category')->index();
            $table->enum('status', ['planned', 'active', 'completed', 'paused'])->default('planned')->index();
            $table->unsignedTinyInteger('progress')->default(0);
            $table->date('deadline')->nullable()->index();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('initiatives');
    }
};
