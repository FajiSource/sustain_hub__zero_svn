<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Score extends Model
{
    protected $fillable = [
        'user_id',
        'department',
        'participation_score',
        'task_score',
        'submission_score',
        'total_score',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
